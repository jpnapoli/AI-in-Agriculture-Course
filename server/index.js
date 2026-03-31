const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
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

// Noor chat endpoint (stores conversation)
app.post('/api/noor/chat', (req, res) => {
  const { userId, lessonId, message } = req.body;
  
  // Store user message
  db.prepare('INSERT INTO noor_conversations (id, user_id, lesson_id, message, role) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || 'anonymous', lessonId, message, 'user');
  
  // Generate contextual response based on current lesson
  let context = '';
  if (lessonId) {
    const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(lessonId);
    if (lesson) context = `Current lesson: ${lesson.title}. `;
    const mod = db.prepare('SELECT * FROM modules WHERE id = ?').get(lesson?.module_id);
    if (mod) context += `Module: ${mod.title}. `;
  }

  // Contextual responses
  const responses = [
    `Great question! ${context}Based on what we're learning, AI in agriculture is about augmenting human expertise, not replacing it. Can you think of a specific scenario where you'd want an AI thought partner?`,
    `${context}That's a key insight! McKinsey estimates AI can create $250 billion in value for agriculture — $100B on-farm and $150B for enterprises. The biggest opportunities are in yield management, labor optimization, and input cost reduction.`,
    `${context}Excellent point! This connects to how IBM Watson Decision Platform combines weather data, soil sensors, and AI predictions to give farmers actionable insights. It's about making data-driven decisions while trusting farmer intuition.`,
    `${context}This is exactly what Microsoft FarmBeats addresses — using edge computing and TV White Spaces to bring AI to farms with limited connectivity. The key innovation is processing data locally rather than requiring constant cloud access.`,
    `${context}You're thinking like an AI-augmented agronomist! Remember, the most effective AI implementations combine multiple data sources — soil sensors, drone imagery, weather data, and satellite imagery — to give a comprehensive picture.`
  ];

  const reply = responses[Math.floor(Math.random() * responses.length)];
  db.prepare('INSERT INTO noor_conversations (id, user_id, lesson_id, message, role) VALUES (?, ?, ?, ?, ?)').run(uuidv4(), userId || 'anonymous', lessonId, reply, 'assistant');
  
  res.json({ reply, context });
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
