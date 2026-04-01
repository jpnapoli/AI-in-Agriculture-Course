require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), override: true });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
// Serve generated images from public/images
app.use('/images', express.static(path.join(__dirname, '../public/images'), {
  maxAge: '1h',
  etag: true
}));
app.use(express.static(path.join(__dirname, '../dist')));

// ============================================================
// API ROUTES
// ============================================================

// Get course overview
app.get('/api/course', (req, res) => {
  const course = db.prepare('SELECT * FROM course LIMIT 1').get();
  const modules = db.prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY order_index').all(course.id);
  modules.forEach(m => {
    m.learning_objectives = JSON.parse(m.learning_objectives || '[]');
    m.lesson_count = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE module_id = ?').get(m.id).count;
  });
  res.json({ course, modules });
});

// Get module details with lessons
app.get('/api/modules/:id', (req, res) => {
  const mod = db.prepare('SELECT * FROM modules WHERE id = ?').get(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  mod.learning_objectives = JSON.parse(mod.learning_objectives || '[]');
  const lessons = db.prepare('SELECT id, module_id, order_index, title, type, duration_minutes, video_url, video_source FROM lessons WHERE module_id = ? ORDER BY order_index').all(mod.id);
  res.json({ module: mod, lessons });
});

// Get ALL lesson content for a module (used by unified slide deck)
app.get('/api/modules/:id/full', (req, res) => {
  const mod = db.prepare('SELECT * FROM modules WHERE id = ?').get(req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  mod.learning_objectives = JSON.parse(mod.learning_objectives || '[]');
  const lessons = db.prepare('SELECT * FROM lessons WHERE module_id = ? ORDER BY order_index').all(mod.id);
  const fullLessons = lessons.map(lesson => {
    lesson.content = JSON.parse(lesson.content || '{}');
    const activities = db.prepare('SELECT * FROM activities WHERE lesson_id = ?').all(lesson.id);
    activities.forEach(a => a.content = JSON.parse(a.content || '{}'));
    const games = db.prepare('SELECT * FROM mini_games WHERE lesson_id = ?').all(lesson.id);
    games.forEach(g => g.config = JSON.parse(g.config || '{}'));
    return { lesson, activities, games };
  });
  res.json({ module: mod, lessons: fullLessons });
});

// Get lesson content
app.get('/api/lessons/:id', (req, res) => {
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  lesson.content = JSON.parse(lesson.content || '{}');
  
  const activities = db.prepare('SELECT * FROM activities WHERE lesson_id = ?').all(lesson.id);
  activities.forEach(a => a.content = JSON.parse(a.content || '{}'));
  
  const games = db.prepare('SELECT * FROM mini_games WHERE lesson_id = ?').all(lesson.id);
  games.forEach(g => g.config = JSON.parse(g.config || '{}'));
  
  const videos = db.prepare('SELECT * FROM video_resources WHERE lesson_id = ?').all(lesson.id);
  const prompts = db.prepare('SELECT * FROM ai_prompts WHERE lesson_id = ?').all(lesson.id);
  const caseStudies = db.prepare('SELECT * FROM case_studies WHERE lesson_id = ?').all(lesson.id);
  
  res.json({ lesson, activities, games, videos, prompts, caseStudies });
});

// Get personas
app.get('/api/personas', (req, res) => {
  const personas = db.prepare('SELECT * FROM personas').all();
  personas.forEach(p => p.ai_tools_used = JSON.parse(p.ai_tools_used || '[]'));
  res.json(personas);
});

// Get final exam
app.get('/api/exam', (req, res) => {
  const questions = db.prepare('SELECT * FROM exam_questions ORDER BY order_index').all();
  questions.forEach(q => q.options = JSON.parse(q.options || '[]'));
  res.json(questions);
});

// ============================================================
// USER & PROGRESS ROUTES
// ============================================================

// Create or get user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    const id = uuidv4();
    db.prepare('INSERT INTO users (id, name, email) VALUES (?, ?, ?)').run(id, name, email);
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
  res.json(user);
});

// Get user progress
app.get('/api/users/:userId/progress', (req, res) => {
  const progress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').all(req.params.userId);
  const achievements = db.prepare('SELECT * FROM user_achievements WHERE user_id = ?').all(req.params.userId);
  const examResults = db.prepare('SELECT * FROM user_exam_results WHERE user_id = ? ORDER BY completed_at DESC LIMIT 1').get(req.params.userId);
  
  // Calculate module completion
  const modules = db.prepare('SELECT * FROM modules ORDER BY order_index').all();
  const moduleProgress = modules.map(m => {
    const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE module_id = ?').get(m.id).count;
    const completedLessons = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND module_id = ? AND status = 'completed'").get(req.params.userId, m.id).count;
    return {
      module_id: m.id,
      module_title: m.title,
      module_order: m.order_index,
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      percentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
    };
  });

  const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons').get().count;
  const completedLessons = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND status = 'completed'").get(req.params.userId).count;
  
  res.json({
    progress,
    achievements,
    examResults,
    moduleProgress,
    overallPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
    totalTimeSpent: progress.reduce((sum, p) => sum + (p.time_spent_seconds || 0), 0)
  });
});

// Update lesson progress
app.post('/api/users/:userId/progress', (req, res) => {
  const { lessonId, moduleId, status, score, timeSpent } = req.body;
  
  // Validate required fields
  if (!lessonId || !moduleId || !status) {
    return res.status(400).json({ error: 'Missing required fields: lessonId, moduleId, status' });
  }
  if (!req.params.userId || req.params.userId === 'undefined' || req.params.userId === 'null') {
    return res.status(400).json({ error: 'Invalid userId' });
  }
  
  const existing = db.prepare('SELECT * FROM user_progress WHERE user_id = ? AND lesson_id = ?').get(req.params.userId, lessonId);
  
  if (existing) {
    db.prepare(`UPDATE user_progress SET status = ?, score = COALESCE(?, score), time_spent_seconds = time_spent_seconds + COALESCE(?, 0), completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(status, score, timeSpent, status, existing.id);
  } else {
    const id = uuidv4();
    db.prepare('INSERT INTO user_progress (id, user_id, lesson_id, module_id, status, score, time_spent_seconds) VALUES (?, ?, ?, ?, ?, ?, ?)').run(id, req.params.userId, lessonId, moduleId, status, score || null, timeSpent || 0);
  }

  // Check if module is complete
  if (status === 'completed') {
    const totalLessons = db.prepare('SELECT COUNT(*) as count FROM lessons WHERE module_id = ?').get(moduleId).count;
    const completedLessons = db.prepare("SELECT COUNT(*) as count FROM user_progress WHERE user_id = ? AND module_id = ? AND status = 'completed'").get(req.params.userId, moduleId).count;
    
    if (completedLessons >= totalLessons) {
      const existingAch = db.prepare("SELECT id FROM user_achievements WHERE user_id = ? AND type = 'module_complete' AND title LIKE ?").get(req.params.userId, `%${moduleId}%`);
      if (!existingAch) {
        db.prepare('INSERT INTO user_achievements (id, user_id, type, title, description) VALUES (?, ?, ?, ?, ?)').run(
          uuidv4(), req.params.userId, 'module_complete',
          `Module Complete: ${moduleId}`,
          `Completed all lessons in module`
        );
      }
    }
  }

  res.json({ success: true });
});

// Submit exam
app.post('/api/users/:userId/exam', (req, res) => {
  const { answers } = req.body;
  const questions = db.prepare('SELECT * FROM exam_questions ORDER BY order_index').all();
  
  let totalScore = 0;
  let totalPoints = 0;
  const results = questions.map(q => {
    q.options = JSON.parse(q.options || '[]');
    totalPoints += q.points;
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correct_answer;
    if (isCorrect) totalScore += q.points;
    return { questionId: q.id, correct: isCorrect, explanation: q.explanation };
  });

  const percentage = Math.round((totalScore / totalPoints) * 100);
  const passed = percentage >= 70;

  const examId = uuidv4();
  db.prepare('INSERT INTO user_exam_results (id, user_id, score, total_points, percentage, passed, answers) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    examId, req.params.userId, totalScore, totalPoints, percentage, passed ? 1 : 0, JSON.stringify(answers)
  );

  if (passed) {
    const existingBadge = db.prepare("SELECT id FROM user_achievements WHERE user_id = ? AND type = 'graduated'").get(req.params.userId);
    if (!existingBadge) {
      db.prepare('INSERT INTO user_achievements (id, user_id, type, title, description, badge_url) VALUES (?, ?, ?, ?, ?, ?)').run(
        uuidv4(), req.params.userId, 'graduated',
        'AI in Agriculture — Certified',
        `Passed the final exam with ${percentage}%`,
        '/images/graduation-badge.png'
      );
    }
  }

  res.json({ examId, score: totalScore, totalPoints, percentage, passed, results });
});

// ============================================================
// LLM CONFIGURATION (GenSpark proxy / OpenAI-compatible)
// ============================================================
const LLM_API_KEY = process.env.OPENAI_API_KEY || '';
const LLM_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
// Use gpt-4o-mini for direct OpenAI, gpt-5-mini for GenSpark proxy
const LLM_MODEL = LLM_BASE_URL.includes('genspark') ? 'gpt-5-mini' : 'gpt-4o-mini';

// Initialize OpenAI client (works with GenSpark proxy)
let openaiClient = null;
if (LLM_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: LLM_API_KEY,
    baseURL: LLM_BASE_URL,
    timeout: 15000,   // 15 second timeout
    maxRetries: 1,    // Only 1 retry on failure
  });
  console.log(`LLM configured: model=${LLM_MODEL}, baseURL=${LLM_BASE_URL}`);
} else {
  console.warn('No OPENAI_API_KEY found — Noor will use fallback responses');
}

// ============================================================
// PERSONA SKIN SYSTEM — each module has a distinct AI persona
// ============================================================
const NOOR_PERSONAS = {
  noor: {
    id: 'noor',
    name: 'Noor',
    role: 'AI Agriculture Companion',
    avatar: '/images/persona-noor.png',
    color: '#0f62fe',
    accent: 'Neutral international',
    voice: 'nova',
    modules: [],
    greeting: "Hey! I'm Noor, your AI agriculture companion. Ask me anything about the course — I'll keep it quick and useful.",
    expertise: 'General AI in Agriculture, course navigation, cross-module concepts',
  },
  khalid: {
    id: 'khalid',
    name: 'Khalid Al-Rashidi',
    role: 'AgriTech Director',
    avatar: '/images/persona-khalid.png',
    color: '#da1e28',
    accent: 'Saudi Arabian',
    voice: 'onyx',
    modules: [2],
    greeting: "As-salamu alaykum! I'm Khalid, AgriTech Director from Riyadh. In Module 2 we explore sensors, drones, and IoT — the sensing layer of smart agriculture. What would you like to know?",
    expertise: 'Desert Agriculture, Controlled-Environment Farming, IoT Sensor Networks, Drone Imaging',
  },
  amara: {
    id: 'amara',
    name: 'Amara Johnson',
    role: 'Wheat Farmer',
    avatar: '/images/persona-amara.png',
    color: '#198038',
    accent: 'American Midwestern',
    voice: 'shimmer',
    modules: [1],
    greeting: "Hey there! I'm Amara from Kansas. Module 1 is all about the AI revolution in agriculture — my 12% yield boost proved it works. What's on your mind?",
    expertise: 'Precision Agriculture, Variable-Rate Technology, Farm Data Analytics, AI Adoption',
  },
  carlos: {
    id: 'carlos',
    name: 'Carlos Mendoza',
    role: 'Coffee Farmer',
    avatar: '/images/persona-carlos.png',
    color: '#0043ce',
    accent: 'Colombian Spanish',
    voice: 'echo',
    modules: [3],
    greeting: "Hola! I'm Carlos from Huila, Colombia. Module 3 dives into AI-powered crop management — from computer vision to precision planting. Ask me anything!",
    expertise: 'Computer Vision, Crop Disease Detection, Precision Planting, Yield Prediction',
  },
  fatima: {
    id: 'fatima',
    name: 'Dr. Fatima Okafor',
    role: 'Agronomist',
    avatar: '/images/persona-fatima.png',
    color: '#8a3ffc',
    accent: 'Nigerian English',
    voice: 'nova',
    modules: [4],
    greeting: "Welcome! I'm Dr. Okafor from Lagos. Module 4 explores how AI helps us build climate resilience — from weather forecasting to drought prediction. What interests you?",
    expertise: 'Climate Modeling, Weather Forecasting AI, Satellite Monitoring, Climate Adaptation',
  },
  rajan: {
    id: 'rajan',
    name: 'Rajan Patel',
    role: 'Food Distributor',
    avatar: '/images/persona-rajan.png',
    color: '#007d79',
    accent: 'Indian English',
    voice: 'fable',
    modules: [5, 6],
    greeting: "Namaste! I'm Rajan from Mumbai. Modules 5 and 6 cover supply chain intelligence and the human-AI future. My AI systems cut food waste by 40%. How can I help?",
    expertise: 'Supply Chain AI, Cold-Chain Monitoring, Demand Forecasting, AI Ethics, Workforce Development',
  },
};

// Map module numbers to persona IDs
const MODULE_PERSONA_MAP = {
  1: 'amara',
  2: 'khalid',
  3: 'carlos',
  4: 'fatima',
  5: 'rajan',
  6: 'rajan',
};

function getPersonaForModule(moduleNum) {
  return NOOR_PERSONAS[MODULE_PERSONA_MAP[moduleNum]] || NOOR_PERSONAS.noor;
}

function buildPersonaSystemPrompt(persona) {
  const isNoor = persona.id === 'noor';
  const name = persona.name;
  const role = persona.role;
  const accent = persona.accent;
  const expertise = persona.expertise;

  return `You are ${name}, ${isNoor ? 'a friendly AI companion' : `a ${role}`} for the "AI in Agriculture" course.${isNoor ? '' : ` You speak with a ${accent} accent and draw from real-world experience in ${expertise}.`}

STYLE RULES (critical):
- Keep answers SHORT: 1-3 sentences for simple questions. Only go longer if the user asks for detail.
- Sound human. Use contractions ("it's", "you'll"), casual connectors ("basically", "so", "think of it like").
${isNoor ? '' : `- Stay in character as ${name}. Reference your background as a ${role} from ${persona.modules.length ? 'your region' : 'your field'}.
- Occasionally use expressions or references natural to your ${accent} background.`}
- No bullet lists unless the user asks to list things. Prefer flowing sentences.
- If a topic is complex, give a quick answer first, then offer: "Want me to go deeper?"
- Match the user's energy. Short question = short answer. Detailed question = more detail.
- Never say you can't browse — answer from what you know.
- Reference course personas and modules naturally when relevant.

COURSE KNOWLEDGE:
- 6 modules: AI Revolution, Sensing, Crop Management, Climate Resilience, Supply Chain, Human-AI Future
- Personas: Khalid Al-Rashidi (Saudi, desert AgriTech), Amara Johnson (Kansas wheat), Carlos Mendoza (Colombia coffee), Dr. Fatima Okafor (Nigeria agronomist), Rajan Patel (India supply chain)
- Key themes: 4th Agricultural Revolution, IoT/drones, computer vision, climate AI, supply chain intelligence, AI ethics
- McKinsey: AI can create $250B in agricultural value ($100B on-farm, $150B enterprise)
- Microsoft FarmBeats: edge computing + TV White Spaces for affordable farm IoT
- IBM Watson Decision Platform: weather + soil + AI for farm decisions
- IBM Liquid Prep: IoT soil moisture sensor + mobile app for irrigation
${isNoor ? '' : `
YOUR EXPERTISE AREA: ${expertise}
Focus your answers on topics you know best, but be helpful with any course question.`}

Keep it conversational. Think chat, not lecture.`;
}

// Default Noor system prompt for backward compatibility
const NOOR_SYSTEM_PROMPT = buildPersonaSystemPrompt(NOOR_PERSONAS.noor);

// Fallback responses when LLM is unavailable
const FALLBACK_RESPONSES = [
  `Great question! AI in agriculture is about augmenting human expertise, not replacing it. McKinsey estimates it can create $250 billion in value. Can you think of a specific scenario where you'd want an AI thought partner?`,
  `That's a key insight! The biggest AI opportunities in agriculture are in yield management, labor optimization, and input cost reduction — $100B on-farm and $150B for enterprises according to McKinsey.`,
  `Excellent point! IBM Watson Decision Platform combines weather data, soil sensors, and AI predictions to give farmers actionable insights. It's about making data-driven decisions while trusting farmer intuition.`,
  `This is exactly what Microsoft FarmBeats addresses — using edge computing and TV White Spaces to bring AI to farms with limited connectivity. The key innovation is processing data locally rather than requiring constant cloud access.`,
  `You're thinking like an AI-augmented agronomist! The most effective AI implementations combine multiple data sources — soil sensors, drone imagery, weather data, and satellite imagery — to give a comprehensive picture.`,
  `That connects well to our course themes! The 4th Agricultural Revolution is about AI working alongside farmers. Module 1 covers the historical context, while Modules 2-5 dive into specific applications like sensing, crop management, climate resilience, and supply chains.`,
  `Good question! Amara Johnson from Kansas found that AI boosted her wheat yields by 12%. Carlos Mendoza in Colombia uses AI for coffee quality prediction. Each persona shows a different real-world AI application.`,
  `Interesting thought! Precision agriculture uses IoT sensors, drones, and satellites to collect data, then AI turns that data into actionable recommendations. Module 2 covers the sensing layer, and Module 3 covers the AI-powered decisions.`
];

// Helper: safely store a chat message (handles FK constraint gracefully)
function safeStoreChat(userId, lessonId, message, role) {
  try {
    // Only store if userId exists in the users table
    if (userId) {
      const userExists = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
      if (userExists) {
        db.prepare('INSERT INTO noor_conversations (id, user_id, lesson_id, message, role) VALUES (?, ?, ?, ?, ?)')
          .run(uuidv4(), userId, lessonId || null, message, role);
        return;
      }
    }
    // If no valid user, skip DB storage (no crash)
  } catch (err) {
    console.warn('Could not store chat message:', err.message);
  }
}

// Noor persona config endpoint
app.get('/api/noor/personas', (req, res) => {
  const personas = Object.values(NOOR_PERSONAS).map(p => ({
    id: p.id, name: p.name, role: p.role, avatar: p.avatar, color: p.color,
    accent: p.accent, modules: p.modules, greeting: p.greeting, expertise: p.expertise,
  }));
  res.json({ personas, moduleMap: MODULE_PERSONA_MAP });
});

// Noor chat endpoint — real LLM via server-side proxy with persona support
app.post('/api/noor/chat', async (req, res) => {
  console.log('[Noor] Chat endpoint hit');
  try {
    const { userId, lessonId, message, history, personaId } = req.body;
    console.log(`[Noor] message="${message?.substring(0,50)}", persona=${personaId || 'noor'}, openaiClient=${!!openaiClient}`);

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Resolve persona
    const persona = NOOR_PERSONAS[personaId] || NOOR_PERSONAS.noor;
    const systemPrompt = buildPersonaSystemPrompt(persona);

    // Store user message (safe — won't crash on FK issues)
    safeStoreChat(userId, lessonId, message, 'user');

    // Build lesson context
    let contextNote = '';
    if (lessonId) {
      try {
        const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
        if (lesson) {
          contextNote = `\n\n[Context: The user is currently on lesson "${lesson.title}".`;
          const mod = db.prepare('SELECT * FROM modules WHERE id = ?').get(lesson.module_id);
          if (mod) contextNote += ` Module: "${mod.title}".`;
          contextNote += ' Provide relevant answers related to the lesson content if applicable.]';
        }
      } catch (e) {
        // Non-critical: continue without context
      }
    }

    // Build conversation messages for LLM
    const conversationHistory = (history || []).slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.text || m.content || ''
    }));

    const llmMessages = [
      { role: 'system', content: systemPrompt + contextNote },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    let reply;
    try {
      if (!openaiClient) {
        throw new Error('No API key configured');
      }

      console.log(`[Noor] Calling LLM: model=${LLM_MODEL}, baseURL=${LLM_BASE_URL}, keyPrefix=${LLM_API_KEY.substring(0,15)}...`);

      const completion = await openaiClient.chat.completions.create({
        model: LLM_MODEL,
        messages: llmMessages,
        temperature: 0.7,
        max_tokens: 300,
      });

      reply = completion.choices?.[0]?.message?.content || "I couldn't generate a response. Let me try again!";
    } catch (err) {
      console.error('Noor LLM error:', err.message);
      // Smart fallback: pick a response that loosely matches the user's message
      const msgLower = message.toLowerCase();
      if (msgLower.includes('amara') || msgLower.includes('carlos') || msgLower.includes('persona') || msgLower.includes('fatima') || msgLower.includes('rajan') || msgLower.includes('khalid')) {
        reply = FALLBACK_RESPONSES[6]; // persona-related
      } else if (msgLower.includes('module') || msgLower.includes('course') || msgLower.includes('lesson')) {
        reply = FALLBACK_RESPONSES[5]; // course structure
      } else if (msgLower.includes('sensor') || msgLower.includes('drone') || msgLower.includes('iot') || msgLower.includes('data')) {
        reply = FALLBACK_RESPONSES[7]; // sensing/data
      } else if (msgLower.includes('watson') || msgLower.includes('ibm') || msgLower.includes('decision')) {
        reply = FALLBACK_RESPONSES[2]; // IBM Watson
      } else if (msgLower.includes('farmbeats') || msgLower.includes('microsoft') || msgLower.includes('edge')) {
        reply = FALLBACK_RESPONSES[3]; // FarmBeats
      } else if (msgLower.includes('mckinsey') || msgLower.includes('value') || msgLower.includes('billion') || msgLower.includes('money')) {
        reply = FALLBACK_RESPONSES[1]; // McKinsey
      } else {
        reply = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
      }
    }

    // Store assistant reply (safe)
    safeStoreChat(userId, lessonId, reply, 'assistant');

    res.json({ reply, context: contextNote, persona: { id: persona.id, name: persona.name, color: persona.color } });
  } catch (err) {
    console.error('Noor chat endpoint error:', err);
    res.status(500).json({
      reply: "Sorry, I hit a snag! Try asking me again in a moment.",
      context: ''
    });
  }
});

// TTS endpoint — generates speech with persona-specific voice
app.post('/api/noor/tts', async (req, res) => {
  try {
    const { text, personaId } = req.body;
    if (!text || !openaiClient) {
      return res.status(400).json({ error: 'TTS not available' });
    }

    const persona = NOOR_PERSONAS[personaId] || NOOR_PERSONAS.noor;

    const mp3 = await openaiClient.audio.speech.create({
      model: 'tts-1',
      voice: persona.voice || 'nova',
      input: text.slice(0, 4096),
      speed: 1.05,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.set({ 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length });
    res.send(buffer);
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(500).json({ error: 'TTS generation failed' });
  }
});

// Get Noor chat history
app.get('/api/noor/history/:userId', (req, res) => {
  const history = db.prepare('SELECT * FROM noor_conversations WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.params.userId);
  res.json(history.reverse());
});

// Serve React app for all other routes
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AI in Agriculture Course Server running on port ${PORT}`);
});
