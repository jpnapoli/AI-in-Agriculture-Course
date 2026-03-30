const Database = require('better-sqlite3');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const db = new Database(path.join(__dirname, 'agri_ai_course.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

// ============================================================
// SCHEMA: All course data stored in database
// ============================================================
db.exec(`
  -- Course metadata
  CREATE TABLE IF NOT EXISTS course (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    total_hours REAL DEFAULT 5.0,
    version TEXT DEFAULT '1.0',
    benchmarked_from TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Modules (6 modules for ~5 hours)
  CREATE TABLE IF NOT EXISTS modules (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES course(id),
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    duration_minutes INTEGER,
    image_url TEXT,
    icon TEXT,
    color TEXT,
    learning_objectives TEXT, -- JSON array
    benchmarked_university TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Lessons within modules
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES modules(id),
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    type TEXT DEFAULT 'lecture', -- lecture, video, activity, checkpoint, game, scenario
    duration_minutes INTEGER,
    content TEXT, -- JSON: rich content blocks
    image_url TEXT,
    video_url TEXT,
    video_source TEXT, -- youtube, uploaded, etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Personas used throughout the course
  CREATE TABLE IF NOT EXISTS personas (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    specialization TEXT,
    ai_tools_used TEXT, -- JSON array
    scenario_context TEXT
  );

  -- Interactive activities and checkpoints
  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id),
    type TEXT NOT NULL, -- quiz, scenario, drag_drop, matching, prompt_test, mini_game
    title TEXT NOT NULL,
    description TEXT,
    content TEXT, -- JSON: questions, options, correct answers, scenarios
    points INTEGER DEFAULT 10,
    time_limit_seconds INTEGER
  );

  -- Mini games
  CREATE TABLE IF NOT EXISTS mini_games (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id),
    type TEXT NOT NULL, -- crop_detector, drone_pilot, supply_chain, weather_predict, soil_analyzer
    title TEXT NOT NULL,
    description TEXT,
    config TEXT, -- JSON: game configuration
    max_score INTEGER DEFAULT 100
  );

  -- Real-world case studies
  CREATE TABLE IF NOT EXISTS case_studies (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id),
    company TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    details TEXT, -- JSON: rich content
    source_url TEXT,
    image_url TEXT
  );

  -- AI prompts for user testing
  CREATE TABLE IF NOT EXISTS ai_prompts (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id),
    prompt_text TEXT NOT NULL,
    platform TEXT DEFAULT 'OpenAI', -- OpenAI, Perplexity, Claude
    context TEXT,
    expected_insight TEXT,
    category TEXT -- crop_analysis, weather, soil, market, supply_chain
  );

  -- Final exam
  CREATE TABLE IF NOT EXISTS exam_questions (
    id TEXT PRIMARY KEY,
    course_id TEXT REFERENCES course(id),
    order_index INTEGER,
    type TEXT NOT NULL, -- scenario, matching, identification, case_analysis
    question TEXT NOT NULL,
    scenario_context TEXT,
    options TEXT, -- JSON array
    correct_answer TEXT,
    explanation TEXT,
    points INTEGER DEFAULT 10,
    module_id TEXT REFERENCES modules(id)
  );

  -- User progress tracking
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    avatar_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    lesson_id TEXT REFERENCES lessons(id),
    module_id TEXT REFERENCES modules(id),
    status TEXT DEFAULT 'not_started', -- not_started, in_progress, completed
    score INTEGER,
    time_spent_seconds INTEGER DEFAULT 0,
    completed_at DATETIME,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    type TEXT NOT NULL, -- module_complete, game_high_score, exam_passed, graduated
    title TEXT NOT NULL,
    description TEXT,
    badge_url TEXT,
    earned_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS user_exam_results (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    score INTEGER,
    total_points INTEGER,
    percentage REAL,
    passed INTEGER DEFAULT 0,
    answers TEXT, -- JSON
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Curated video resources
  CREATE TABLE IF NOT EXISTS video_resources (
    id TEXT PRIMARY KEY,
    lesson_id TEXT REFERENCES lessons(id),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    source TEXT, -- youtube, ibm, microsoft, ted
    speaker TEXT,
    speaker_role TEXT,
    duration_seconds INTEGER,
    thumbnail_url TEXT
  );

  -- Noor chat history
  CREATE TABLE IF NOT EXISTS noor_conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES users(id),
    lesson_id TEXT,
    message TEXT NOT NULL,
    role TEXT NOT NULL, -- user, assistant
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ============================================================
// SEED DATA: Complete course content
// ============================================================
function seedDatabase() {
  const courseExists = db.prepare('SELECT id FROM course LIMIT 1').get();
  if (courseExists) return;

  const courseId = 'course-ai-agriculture-v1';

  // Insert course
  db.prepare(`INSERT INTO course (id, title, subtitle, description, total_hours, version, benchmarked_from) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
    courseId,
    'AI in Agriculture: From Field to Future',
    'A Comprehensive Journey Through Intelligent Farming',
    'This 5-hour immersive course explores how Artificial Intelligence is transforming agriculture from the ground up. Benchmarked against programs from Wageningen University, Cornell University, UC Davis, and industry leaders like IBM Research, Microsoft, and Google, this course treats AI as a powerful tool that augments human capabilities in farming, food production, and supply chain management. Through interactive scenarios, persona-based learning, mini-games, and real-world case studies, you will discover how AI serves as a thought partner and optimizer across the entire agricultural value chain.',
    5.0,
    '1.0',
    'Wageningen University (Summer School Intelligent Agriculture), Cornell University (SYSEN 6840 - AI for Digital Agriculture), UC Davis (Digital Agriculture Lab), McKinsey Global Farmer Insights 2024'
  );

  // ============================================================
  // MODULE 1: The Agricultural Revolution Meets AI
  // ============================================================
  const mod1Id = 'mod-1-revolution';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod1Id, courseId, 1,
    'The Agricultural Revolution Meets AI',
    'Understanding the Convergence',
    'Explore the history of agricultural revolutions and understand why AI represents the 4th Agricultural Revolution. Learn how AI differs from traditional automation and why agriculture is uniquely suited for AI disruption. Discover the global food challenge and how AI can help feed 9.7 billion people by 2050.',
    50,
    '/images/mod1-revolution.png',
    'Sprout',
    '#198038',
    JSON.stringify([
      'Explain the four agricultural revolutions and AI\'s role in the latest one',
      'Articulate the global food security challenge and AI\'s potential contribution',
      'Distinguish between analytical AI, generative AI, and traditional automation in farming',
      'Identify AI applications already present in everyday agricultural operations',
      'Describe the $100B+ value AI can create on-farm and $150B+ for agricultural enterprises (McKinsey)'
    ]),
    'Wageningen University - Summer School Intelligent Agriculture; McKinsey "From Bytes to Bushels" 2024'
  );

  // Module 1 Lessons
  const lessons1 = [
    {
      id: 'les-1-1', module_id: mod1Id, order_index: 1,
      title: 'Welcome to the Future of Farming',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'The 4th Agricultural Revolution', subtitle: 'How AI is transforming the oldest industry on Earth', image: '/images/mod1-revolution.png' },
          { type: 'text', content: 'Almost half the world\'s population lives in households that rely on agrifood systems as their main source of employment. With the global population projected to reach 9.7 billion by 2050, the world needs to boost agricultural production by 60% over the next 25 years. Meanwhile, row crop yields are expected to drop by 11% due to more severe weather and pest pressure.' },
          { type: 'stat_cards', stats: [
            { value: '9.7B', label: 'Global population by 2050', icon: 'people' },
            { value: '60%', label: 'Production increase needed', icon: 'trending_up' },
            { value: '$4T', label: 'Global food production industry', icon: 'payments' },
            { value: '11%', label: 'Expected yield drop from climate', icon: 'warning' }
          ]},
          { type: 'text', content: 'The four agricultural revolutions mark humanity\'s greatest leaps in food production:' },
          { type: 'timeline', items: [
            { year: '~10,000 BC', title: '1st Revolution: Domestication', desc: 'Transition from hunting-gathering to settled farming. Domestication of wheat, rice, and livestock.' },
            { year: '1700s-1800s', title: '2nd Revolution: Mechanization', desc: 'Seed drills, threshing machines, and the steam engine transformed farm labor productivity.' },
            { year: '1960s-1970s', title: '3rd Revolution: Green Revolution', desc: 'High-yield varieties, synthetic fertilizers, and irrigation doubled cereal production worldwide.' },
            { year: 'NOW', title: '4th Revolution: AI & Digital Agriculture', desc: 'AI, IoT, drones, robotics, and data analytics create intelligent, adaptive farming systems.' }
          ]},
          { type: 'quote', text: 'AI could lead to more accurate and timely predictions, especially for spotting diseases early, and it could help cut down on carbon footprints and environmental impact by improving how we use energy and resources.', author: 'Dr. Abhisesh Silwal', role: 'Systems Scientist, Carnegie Mellon University' },
          { type: 'callout', style: 'info', title: 'Why Agriculture + AI?', content: 'Agriculture is particularly well suited for AI disruption because of its high volumes of unstructured data, significant reliance on labor, complex supply chain logistics, long R&D cycles, and the sheer number of farmers who value customized offers and low-cost services.' }
        ]
      })
    },
    {
      id: 'les-1-2', module_id: mod1Id, order_index: 2,
      title: 'AI is Already on Your Farm',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'AI: Your Invisible Thought Partner', subtitle: 'Recognizing AI in daily agricultural operations', image: '/images/mod1-revolution.png' },
          { type: 'text', content: 'Many farmers interact with AI every day without realizing it. From weather forecasting apps to commodity price platforms, AI is already embedded in agricultural decision-making. The key insight is understanding AI as a "thought partner" — not a replacement for human expertise, but an amplifier of it.' },
          { type: 'comparison', title: 'Analytical AI vs. Generative AI in Agriculture', items: [
            { category: 'Analytical AI', description: 'Solves specific tasks by making predictions based on well-structured data and predefined rules', examples: ['Yield forecasting from sensor data', 'Customer segmentation for seed sales', 'Pest detection from satellite imagery', 'Weather pattern prediction'] },
            { category: 'Generative AI', description: 'Processes large, varied sets of unstructured data and generates new insights by identifying patterns', examples: ['Virtual agronomy advisers (chatbots)', 'Molecular research for new crop traits', 'Personalized marketing content', 'Code generation for farm software'] }
          ]},
          { type: 'persona_intro', persona: 'amara', scenario: 'Meet Amara, a wheat farmer in Kansas. She checks her phone each morning — the weather app uses machine learning for hyper-local forecasts. Her seed supplier\'s website recommends varieties using AI. The commodity prices she checks are predicted by algorithms. Her crop insurance premium was calculated by an AI model. AI is everywhere in her daily routine, even when she can\'t see it.' },
          { type: 'interactive_reveal', title: 'Spot the AI', items: [
            { visible: 'Weather Forecast App', hidden: 'Machine learning models process satellite data, atmospheric sensors, and historical patterns to generate forecasts' },
            { visible: 'Commodity Price Display', hidden: 'AI algorithms analyze global trade data, weather impacts, geopolitical events, and market sentiment' },
            { visible: 'Seed Catalog Recommendations', hidden: 'Recommendation engines match soil type, climate zone, and historical yield data to suggest optimal varieties' },
            { visible: 'Crop Insurance Premium', hidden: 'Actuarial AI models assess field-level risk using satellite imagery, weather history, and claim patterns' },
            { visible: 'GPS Auto-Steer Tractor', hidden: 'Computer vision and GPS algorithms enable centimeter-level precision in field navigation' }
          ]}
        ]
      })
    },
    {
      id: 'les-1-3', module_id: mod1Id, order_index: 3,
      title: 'Checkpoint: The AI Agriculture Landscape',
      type: 'checkpoint', duration_minutes: 7,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'Let\'s verify your understanding of the agricultural AI landscape before moving forward.' }
        ]
      })
    },
    {
      id: 'les-1-4', module_id: mod1Id, order_index: 4,
      title: 'The $250 Billion Opportunity',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'The Value at Stake', subtitle: 'McKinsey\'s analysis of AI\'s potential in agriculture', image: '/images/mod1-revolution.png' },
          { type: 'text', content: 'According to McKinsey\'s 2024 analysis "From Bytes to Bushels," AI can create approximately $250 billion in value across agriculture — $100 billion on the acre (improving farm economics) and $150 billion for enterprises (through increased sales, productivity, and operational efficiencies).' },
          { type: 'value_chart', data: {
            onAcre: { total: 100, items: [
              { label: 'Yield Management', value: 50, desc: 'Virtual agronomy advisers, data-driven decision making' },
              { label: 'Labor Cost Reduction', value: 30, desc: 'Autonomous solutions enhancing existing workforce' },
              { label: 'Input Optimization', value: 20, desc: 'Precision agriculture reducing waste' }
            ]},
            enterprise: { total: 150, items: [
              { label: 'R&D and Products', value: 45, desc: 'Accelerated crop trait development, genomic screening' },
              { label: 'Marketing & Sales', value: 35, desc: 'Personalized offers, customer microsegmentation' },
              { label: 'Agronomy & Sustainability', value: 40, desc: 'Data-driven advisory, carbon footprint reduction' },
              { label: 'Operations', value: 30, desc: 'Supply chain optimization, predictive maintenance' }
            ]}
          }},
          { type: 'case_study_preview', company: 'McKinsey', title: 'Global Farmer Insights 2024', text: 'In a 2024 McKinsey survey of 4,400 farmers across nine countries, digital agronomy and precision agriculture led technology adoption globally, with North American farmers showing the highest adoption rates. Only about half of US farmers reported adopting precision agriculture hardware, with adoption even lower in other regions — indicating massive room for growth.' }
        ]
      })
    },
    {
      id: 'les-1-5', module_id: mod1Id, order_index: 5,
      title: 'Video: AI Meets Agriculture',
      type: 'video', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'video_intro', text: 'Watch this overview of how AI and data science are being applied in modern agriculture.' }
        ]
      }),
      video_url: 'https://www.youtube.com/watch?v=HmXohtc_K6M',
      video_source: 'youtube'
    },
    {
      id: 'les-1-6', module_id: mod1Id, order_index: 6,
      title: 'Mini-Game: Spot the AI on the Farm',
      type: 'game', duration_minutes: 7,
      content: JSON.stringify({
        blocks: [
          { type: 'game_intro', text: 'Explore an interactive farm scene and identify all the AI-powered systems hidden in plain sight. Click on objects to reveal how AI powers them!' }
        ]
      })
    }
  ];

  const insertLesson = db.prepare(`INSERT INTO lessons (id, module_id, order_index, title, type, duration_minutes, content, video_url, video_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  lessons1.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // MODULE 2: Sensing the Earth — Data Collection & IoT
  // ============================================================
  const mod2Id = 'mod-2-sensing';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod2Id, courseId, 2,
    'Sensing the Earth: Data Collection & IoT',
    'The Foundation of Intelligent Agriculture',
    'Dive into the world of agricultural data — from soil sensors and drones to satellites and weather stations. Understand how IoT creates the data foundation that makes AI possible, with real-world examples from Microsoft FarmBeats and IBM\'s Liquid Prep.',
    50,
    '/images/mod2-sensing.png',
    'Satellite',
    '#0043ce',
    JSON.stringify([
      'Explain the role of IoT sensors, drones, and satellites in agricultural data collection',
      'Describe Microsoft FarmBeats architecture and its approach to affordable digital agriculture',
      'Understand how soil moisture, weather, and crop imagery data feed AI models',
      'Distinguish between deterministic and probabilistic models in agriculture',
      'Evaluate IBM\'s Liquid Prep as a case study for IoT-enabled water management'
    ]),
    'Cornell SYSEN 6840; Wageningen GRS22303 Drones for Agriculture; Microsoft FarmBeats Research'
  );

  const lessons2 = [
    {
      id: 'les-2-1', module_id: mod2Id, order_index: 1,
      title: 'The Data Foundation: Sensors, Satellites & Drones',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'Sensing the Earth', subtitle: 'How data collection creates the foundation for agricultural AI', image: '/images/mod2-sensing.png' },
          { type: 'text', content: 'Every AI system is only as good as the data it receives. In agriculture, data comes from an increasingly diverse set of sources — each providing a unique lens into the health and productivity of crops, soil, and ecosystems.' },
          { type: 'data_layers', layers: [
            { name: 'Ground Level: Soil Sensors', icon: 'sensors', description: 'IoT sensors buried in the soil measure moisture levels, nutrient content (NPK), pH, temperature, and electrical conductivity. These provide real-time, field-level granularity.', example: 'IBM Liquid Prep uses IoT soil moisture sensors connected to a mobile app running on IBM Cloud' },
            { name: 'Field Level: Drones & UAVs', icon: 'flight', description: 'Drones equipped with multispectral, thermal, and RGB cameras capture detailed field imagery. They can cover hundreds of acres in hours, detecting crop stress, pest infestations, and irrigation issues.', example: 'Wageningen University\'s GRS22303 course teaches drone-based crop assessment using NDVI and thermal imaging' },
            { name: 'Regional Level: Satellites', icon: 'satellite_alt', description: 'Satellite imagery provides broad coverage for monitoring crop growth, land use change, and weather patterns. Sentinel-2 and Landsat provide free agricultural monitoring data.', example: 'Google Earth Engine processes petabytes of satellite data to track agricultural patterns globally' },
            { name: 'Atmospheric Level: Weather Stations', icon: 'cloud', description: 'Weather data — temperature, precipitation, humidity, wind — is critical for every farming decision. AI-enhanced forecasting extends useful predictions from 14 days to months.', example: 'IBM\'s The Weather Company provides hyper-local forecasts used by Watson Decision Platform for Agriculture' }
          ]},
          { type: 'callout', style: 'technical', title: 'Deterministic vs. Probabilistic Models', content: 'A deterministic model produces the same output given the same input (e.g., calculating water needs based on evapotranspiration formulas). A probabilistic model accounts for uncertainty and provides ranges or probabilities (e.g., "70% chance of pest outbreak in the next 14 days"). Modern AI agriculture combines both approaches.' }
        ]
      })
    },
    {
      id: 'les-2-2', module_id: mod2Id, order_index: 2,
      title: 'Case Study: Microsoft FarmBeats',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'Microsoft FarmBeats', subtitle: 'AI, Edge Computing & IoT for Affordable Agriculture', image: '/images/mod2-sensing.png' },
          { type: 'text', content: 'Microsoft FarmBeats is a research project that couples data-driven farming with the farmer\'s own knowledge and intuition to increase farm productivity and reduce costs. It represents one of the most comprehensive approaches to democratizing digital agriculture.' },
          { type: 'architecture_diagram', components: [
            { name: 'TV White Spaces', desc: 'Uses unused TV spectrum for long-range, low-cost internet connectivity on farms' },
            { name: 'Edge Computing', desc: 'Processes data locally on the farm, reducing cloud dependency and latency' },
            { name: 'Soil Sensors', desc: 'Low-cost IoT sensors measure soil moisture and temperature' },
            { name: 'Drone Imagery', desc: 'Captures aerial multispectral images for crop health assessment' },
            { name: 'AI Models', desc: 'Machine learning models generate soil moisture maps and crop health indicators' },
            { name: 'Azure Cloud', desc: 'Stores data and runs advanced analytics accessible via dashboard' }
          ]},
          { type: 'persona_scenario', persona: 'carlos', scenario: 'Meet Carlos, a mid-size farmer in Colombia with 200 hectares of coffee. Carlos partnered with a FarmBeats-inspired program. By placing 12 soil moisture sensors across his farm and using drone imagery monthly, he now receives AI-generated recommendations on which sections need water, which have nutrient deficiencies, and where to expect the best yield. His water usage dropped 30% while yield increased 18%.' },
          { type: 'prompt_test', title: 'Try This AI Prompt', platform: 'OpenAI', prompt: 'I am a coffee farmer in Colombia with 200 hectares. I have soil moisture data showing 15% moisture in Section A (normally 25%) and drone imagery showing yellowing leaves in Section B. What could be causing these issues and what actions should I take? Consider both irrigation and nutrient management strategies.', expected: 'The AI should identify potential water stress in Section A and possible nitrogen deficiency or disease in Section B, recommending targeted irrigation adjustments and leaf tissue analysis.' }
        ]
      })
    },
    {
      id: 'les-2-3', module_id: mod2Id, order_index: 3,
      title: 'Video: FarmBeats in Action',
      type: 'video', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'video_intro', text: 'Watch Microsoft\'s FarmBeats team explain how IoT and AI come together for precision agriculture.' }
        ]
      }),
      video_url: 'https://www.youtube.com/watch?v=zrYUzr6_P18',
      video_source: 'youtube'
    },
    {
      id: 'les-2-4', module_id: mod2Id, order_index: 4,
      title: 'Case Study: IBM Liquid Prep',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'IBM and Texas A&M AgriLife developed Liquid Prep — an IoT sensor combined with a mobile app running on IBM Cloud — to help small-scale farmers manage irrigation efficiently.' },
          { type: 'quote', text: 'Small farmers are usually not very technologically advanced... But people understand how to use a cell phone and some apps, and Liquid Prep is a pretty simple app to operate — that\'s where it will change the playing field.', author: 'David Chapin', role: 'Farmer & IBMer, Lampasas, Texas' },
          { type: 'text', content: 'Key innovation: Liquid Prep monitors soil moisture at the root level, not just the surface, and combines this with weather data and soil type information to provide when-to-water decision support. This addresses the critical challenge that 70% of global freshwater is used for agriculture.' },
          { type: 'callout', style: 'success', title: 'IBM Sustainability Accelerator Impact', content: 'Four out of five IBM Sustainability Accelerator agriculture projects have concluded with approximately 65,300 direct beneficiaries — farmers and their families using technology to help increase yields and make their operations more resilient.' }
        ]
      })
    },
    {
      id: 'les-2-5', module_id: mod2Id, order_index: 5,
      title: 'Checkpoint: Data & Sensors',
      type: 'checkpoint', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'text', content: 'Test your understanding of agricultural data collection and IoT systems.' }] })
    },
    {
      id: 'les-2-6', module_id: mod2Id, order_index: 6,
      title: 'Mini-Game: Drone Pilot Challenge',
      type: 'game', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'game_intro', text: 'Pilot a virtual drone over a farm field. Identify crop stress zones by analyzing multispectral imagery. Score points for accuracy and efficiency!' }] })
    }
  ];

  lessons2.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // MODULE 3: AI-Powered Crop Management
  // ============================================================
  const mod3Id = 'mod-3-crop-mgmt';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod3Id, courseId, 3,
    'AI-Powered Crop Management',
    'From Planting to Harvest',
    'Discover how AI optimizes every stage of crop management — from precision planting and variable-rate application to disease detection and yield prediction. Explore IBM Watson Decision Platform for Agriculture and Google\'s crop yield prediction models.',
    50,
    '/images/mod3-crop-mgmt.png',
    'Grain',
    '#a56eff',
    JSON.stringify([
      'Explain how AI optimizes planting decisions, fertilizer application, and irrigation scheduling',
      'Describe computer vision approaches for pest and disease detection',
      'Understand how IBM Watson Decision Platform for Agriculture works',
      'Evaluate the role of explainable AI (xAI) in crop genetic improvement',
      'Apply AI-driven yield prediction concepts to real farming scenarios'
    ]),
    'Cornell SYSEN 6840; IBM Watson Decision Platform; Wageningen Precision Agriculture Research'
  );

  const lessons3 = [
    {
      id: 'les-3-1', module_id: mod3Id, order_index: 1,
      title: 'Precision Planting & Variable Rate Technology',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'Right Seed, Right Place, Right Time', subtitle: 'How AI enables centimeter-level precision in crop management', image: '/images/mod3-crop-mgmt.png' },
          { type: 'text', content: 'Variable Rate Technology (VRT) uses AI to analyze field variability maps — created from soil samples, satellite imagery, and yield history — to prescribe different rates of seeds, fertilizers, and chemicals across different zones of the same field. Instead of treating a 500-acre field uniformly, AI recognizes that each zone has unique characteristics.' },
          { type: 'comparison', title: 'Traditional vs. AI-Powered Approach', items: [
            { category: 'Traditional Farming', description: 'Uniform application across entire fields', examples: ['Same seed rate everywhere', 'Blanket fertilizer application', 'Calendar-based spraying', 'Experience-based decisions'] },
            { category: 'AI-Powered Precision', description: 'Zone-specific, data-driven decisions', examples: ['Variable seed population by soil type', 'Sensor-guided nutrient management', 'AI-predicted pest pressure timing', 'Real-time data-driven decisions'] }
          ]},
          { type: 'persona_scenario', persona: 'amara', scenario: 'Amara uses AI-generated prescription maps on her Kansas wheat farm. The AI analyzed her 5-year yield data, soil electrical conductivity maps, and current soil test results. It created zones prescribing higher nitrogen in productive areas and lower rates in poor-draining spots — saving her $14,000 in fertilizer while increasing yield by 7 bushels per acre.' }
        ]
      })
    },
    {
      id: 'les-3-2', module_id: mod3Id, order_index: 2,
      title: 'Computer Vision: AI Eyes on the Crop',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'Computer vision is revolutionizing crop monitoring. From smartphone-based disease detection to drone-mounted multispectral cameras, AI can "see" problems invisible to the human eye.' },
          { type: 'text', content: 'The Artemis project in Tanzania, led by David Guerena at the International Center for Tropical Agriculture, uses AI and computer vision to speed up phenotyping — measuring plant traits like flower count, leaf area, and growth stage.' },
          { type: 'quote', text: 'People are not good at providing reliable quantitative estimates of things we see. It is not possible for a human to accurately count flowers on hundreds of plants across thousands of plots. A computer doesn\'t have these problems.', author: 'David Guerena', role: 'Agricultural Scientist, International Center for Tropical Agriculture' },
          { type: 'text', content: 'The evolution of computer vision in agriculture: Convolutional Neural Networks (CNNs) required thousands of labeled training images. Vision transformers and models like YOLO and Segment Anything reduced this to just a few hundred — making the technology accessible to more crops and regions.' },
          { type: 'case_study_preview', company: 'Avalo', title: 'Explainable AI for Crop Genetics', text: 'North Carolina-based Avalo uses explainable AI (xAI) to identify genes linked to complex crop traits, developing crops 5x faster and 50x cheaper. They created a broccoli variety harvestable in 37 days (vs. 120+ days normally) for vertical farms — so fast that pesticides weren\'t needed.' }
        ]
      })
    },
    {
      id: 'les-3-3', module_id: mod3Id, order_index: 3,
      title: 'IBM Watson Decision Platform for Agriculture',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'IBM\'s Watson Decision Platform for Agriculture combines predictive analytics, artificial intelligence, weather data from The Weather Company, and IoT sensors to help farmers and enterprises make better-informed decisions.' },
          { type: 'text', content: 'The platform provides a comprehensive farm snapshot including: weather forecasts at village/farm level, soil moisture monitoring, crop health assessment, pest and disease risk alerts, and optimal planting/harvesting windows. India\'s Agriculture Ministry signed a Statement of Intent with IBM to pilot the platform for water and crop management decisions.' },
          { type: 'callout', style: 'info', title: 'University of Sharjah + IBM watsonx', content: 'The University of Sharjah\'s "Welly" AI chatbot runs on IBM watsonx to provide multilingual, intelligent farmer support at scale — demonstrating how gen AI can serve as a virtual agronomist accessible via smartphone.' },
          { type: 'prompt_test', title: 'Try This AI Prompt', platform: 'OpenAI', prompt: 'Act as an agricultural AI decision support system. Given the following data for a wheat field in Punjab, India: Temperature: 35°C (above normal), Soil moisture: 18% (critical low), Growth stage: Heading, Weather forecast: No rain for 10 days. What are your recommendations for the farmer? Prioritize actions by urgency.', expected: 'The AI should recommend immediate irrigation scheduling, suggest mulching to retain moisture, advise monitoring for heat stress symptoms, and recommend adjusted fertilization timing.' }
        ]
      })
    },
    {
      id: 'les-3-4', module_id: mod3Id, order_index: 4,
      title: 'Video: IBM Sustainability Accelerator',
      type: 'video', duration_minutes: 6,
      content: JSON.stringify({ blocks: [{ type: 'video_intro', text: 'Learn how IBM\'s Sustainability Accelerator supports farmers worldwide with AI and cloud technology.' }] }),
      video_url: 'https://www.youtube.com/watch?v=PK4G0rDA5Vc',
      video_source: 'youtube'
    },
    {
      id: 'les-3-5', module_id: mod3Id, order_index: 5,
      title: 'Checkpoint: Crop Management AI',
      type: 'checkpoint', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'text', content: 'Assess your understanding of AI-powered crop management technologies.' }] })
    },
    {
      id: 'les-3-6', module_id: mod3Id, order_index: 6,
      title: 'Mini-Game: Crop Doctor AI',
      type: 'game', duration_minutes: 9,
      content: JSON.stringify({ blocks: [{ type: 'game_intro', text: 'You\'re an AI-powered crop doctor! Analyze leaf images, soil data, and weather conditions to diagnose crop problems and prescribe treatments. Beat the clock!' }] })
    }
  ];

  lessons3.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // MODULE 4: Climate Resilience & Sustainability
  // ============================================================
  const mod4Id = 'mod-4-climate';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod4Id, courseId, 4,
    'Climate Resilience & Sustainability',
    'AI as the Shield Against Climate Change',
    'Understand how AI helps agriculture adapt to and mitigate climate change. Explore weather forecasting innovations from Google and ClimateAi, carbon footprint reduction strategies, and sustainable farming practices enhanced by AI.',
    50,
    '/images/mod4-climate.png',
    'CloudSun',
    '#007d79',
    JSON.stringify([
      'Explain how AI-enhanced weather forecasting extends prediction horizons for farmers',
      'Describe Google\'s flood forecasting system and its agricultural implications',
      'Understand how ClimateAi provides ultra-localized climate predictions for agriculture',
      'Evaluate AI\'s role in reducing agriculture\'s carbon footprint',
      'Apply climate resilience concepts through persona-based scenarios'
    ]),
    'UC Davis Digital Agriculture Lab; Google AI for Flood Forecasting; ClimateAi Case Study'
  );

  const lessons4 = [
    {
      id: 'les-4-1', module_id: mod4Id, order_index: 1,
      title: 'AI-Powered Climate Forecasting for Farmers',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'Beyond the 14-Day Forecast', subtitle: 'How AI extends weather predictions from days to seasons', image: '/images/mod4-climate.png' },
          { type: 'text', content: 'Traditional weather forecasting provides useful predictions up to 14 days ahead. But farmers need to plan months in advance — what to plant, when to irrigate, when to harvest. AI is bridging this gap by analyzing decades of climate patterns alongside real-time data to provide actionable seasonal forecasts.' },
          { type: 'case_study_preview', company: 'ClimateAi', title: 'Patented Biophysics-Based AI Forecasting', text: 'ClimateAi ran simulations for farmers in Maharashtra, India, and found that extreme heat and drought would lead to a ~30% decrease in tomato output over the next two decades. A tomato seed company used these insights to accelerate trials for launching drought-tolerant seeds. In 300 villages, adaptation playbooks helped ~100,000 smallholder farmers increase productivity by up to 40%.' },
          { type: 'quote', text: 'While most technology companies aim to improve the traditional 14-day weather forecast, these time frames are not actionable for farmers and food companies. We innovated in weather forecasting beyond two weeks.', author: 'Himanshu Gupta', role: 'Co-founder, ClimateAi' },
          { type: 'case_study_preview', company: 'Google', title: 'AI for Global Flood Forecasting', text: 'Google Research\'s flood forecasting system predicts floods with 95% accuracy up to 7 days in advance, now covering 80 countries. For agriculture, this means farmers can protect crops, adjust planting schedules, and manage drainage systems before disasters strike.' }
        ]
      })
    },
    {
      id: 'les-4-2', module_id: mod4Id, order_index: 2,
      title: 'Carbon Farming & AI-Driven Sustainability',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'Agriculture accounts for approximately 10% of global greenhouse gas emissions. AI can help reduce this footprint through optimized input use, precision application, and carbon sequestration monitoring.' },
          { type: 'text', content: 'McKinsey\'s analysis identifies agronomy and sustainability as a key domain where generative AI adds significant value — enabling data-driven advisory services that help farmers reduce environmental impact while maintaining profitability.' },
          { type: 'persona_scenario', persona: 'dr_okafor', scenario: 'Dr. Fatima Okafor, an agronomist in Nigeria, uses AI tools to monitor carbon sequestration across 50 farms she advises. The AI platform analyzes satellite imagery, soil samples, and farming practices to calculate each farm\'s carbon footprint and identify opportunities for carbon credits — creating a new revenue stream for smallholder farmers.' },
          { type: 'prompt_test', title: 'Try This AI Prompt', platform: 'OpenAI', prompt: 'I manage a 1,000-acre corn farm in Iowa. I want to reduce my carbon footprint while maintaining profitability. Analyze these practices and suggest AI-enabled improvements: 1) I apply uniform nitrogen at 180 lbs/acre, 2) I till every field every year, 3) I leave fields bare in winter, 4) My irrigation is schedule-based, not sensor-based. Provide specific AI tools or approaches for each improvement.', expected: 'The AI should suggest variable-rate nitrogen using sensor data, no-till or reduced-till with AI-guided cover cropping, winter cover crop selection by AI, and IoT-sensor-based precision irrigation.' }
        ]
      })
    },
    {
      id: 'les-4-3', module_id: mod4Id, order_index: 3,
      title: 'Checkpoint: Climate & Sustainability',
      type: 'checkpoint', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'text', content: 'Test your knowledge on climate resilience and sustainability in AI-powered agriculture.' }] })
    },
    {
      id: 'les-4-4', module_id: mod4Id, order_index: 4,
      title: 'Video: Data Science in Agriculture',
      type: 'video', duration_minutes: 8,
      content: JSON.stringify({ blocks: [{ type: 'video_intro', text: 'Learn how data science concepts apply directly to farm-level decision making.' }] }),
      video_url: 'https://www.youtube.com/watch?v=UPuzkwLzyAI',
      video_source: 'youtube'
    },
    {
      id: 'les-4-5', module_id: mod4Id, order_index: 5,
      title: 'Mini-Game: Weather Prediction Challenge',
      type: 'game', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'game_intro', text: 'Use historical weather patterns and AI models to predict next week\'s conditions. Make farming decisions based on your predictions. Score points for correct forecasts and smart farming choices!' }] })
    },
    {
      id: 'les-4-6', module_id: mod4Id, order_index: 6,
      title: 'AI for Water Management',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'With 70% of global freshwater used for agriculture and water scarcity intensifying, AI-driven water management is becoming essential. Smart irrigation systems use soil moisture sensors, weather forecasts, and crop growth models to optimize water delivery.' },
          { type: 'text', content: 'IBM\'s Liquid Prep, developed with Texas A&M AgriLife, exemplifies this approach: farmers set up moisture sensors, link them to a mobile app, and receive data-driven when-to-water recommendations. Plans include expanding to incorporate weather data, soil types, and predictive decision support for deployment across arid US regions.' }
        ]
      })
    }
  ];

  lessons4.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // MODULE 5: The Intelligent Supply Chain
  // ============================================================
  const mod5Id = 'mod-5-supply-chain';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod5Id, courseId, 5,
    'The Intelligent Supply Chain',
    'From Farm Gate to Dinner Plate',
    'Follow the journey of agricultural products from harvest to consumer, understanding how AI optimizes logistics, reduces food waste, predicts demand, and ensures food safety. Explore how AI transforms agricultural trade, processing, and distribution.',
    50,
    '/images/mod5-supply-chain.png',
    'Delivery',
    '#f1c21b',
    JSON.stringify([
      'Map the agricultural supply chain and identify AI intervention points',
      'Explain how AI reduces food waste through demand forecasting and quality monitoring',
      'Describe AI applications in agricultural trade and commodity markets',
      'Understand predictive maintenance and manufacturing optimization in food processing',
      'Evaluate AI-driven traceability and food safety systems'
    ]),
    'McKinsey "From Bytes to Bushels" - Trade & Primary Processing; Wageningen Big Data for Agri-Food MOOC'
  );

  const lessons5 = [
    {
      id: 'les-5-1', module_id: mod5Id, order_index: 1,
      title: 'AI Across the Food Value Chain',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'The Intelligent Supply Chain', subtitle: 'Tracking food from field to fork with AI', image: '/images/mod5-supply-chain.png' },
          { type: 'text', content: 'One-third of all food produced globally is lost or wasted — approximately 1.3 billion tons annually. AI can dramatically reduce this waste by optimizing every link in the supply chain: better demand forecasting, real-time quality monitoring, optimized logistics, and smarter inventory management.' },
          { type: 'text', content: 'McKinsey identifies trade and primary processing as areas where AI has the largest impact on operational excellence:' },
          { type: 'stat_cards', stats: [
            { value: '1.3B', label: 'Tons of food wasted annually', icon: 'delete' },
            { value: '14%', label: 'Global food lost post-harvest', icon: 'trending_down' },
            { value: '$940B', label: 'Annual cost of food waste', icon: 'payments' },
            { value: '8-10%', label: 'GHG emissions from food waste', icon: 'eco' }
          ]},
          { type: 'text', content: 'Key AI applications: Procurement (gen AI drafts RFP documents, synthesizes contracts), Supply Chain (monitors disruptions from weather/trade flow changes), Manufacturing (virtual subject matter experts, predictive maintenance), and Logistics (route optimization, cold chain monitoring).' }
        ]
      })
    },
    {
      id: 'les-5-2', module_id: mod5Id, order_index: 2,
      title: 'Demand Forecasting & Market Intelligence',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'AI-powered demand forecasting combines historical sales data, weather forecasts, economic indicators, social media trends, and event calendars to predict how much food needs to be produced, processed, and distributed.' },
          { type: 'persona_scenario', persona: 'rajan', scenario: 'Meet Rajan, a food distributor in India managing perishable goods. Using AI-powered demand forecasting, he now predicts weekly demand for tomatoes within 5% accuracy (vs. 25% before). The AI considers monsoon patterns, festival calendars, commodity prices, and local consumption trends. His waste dropped from 20% to 6%, saving millions of rupees annually.' },
          { type: 'text', content: 'McKinsey notes that analytical AI can microsegment customers and generate price recommendations based on historical willingness to pay, while gen AI monitors real-time demand, supply, and regulatory shifts to adjust these recommendations dynamically.' },
          { type: 'prompt_test', title: 'Try This AI Prompt', platform: 'OpenAI', prompt: 'You are an agricultural supply chain AI. Analyze this scenario: A major cold snap is forecast for Florida\'s citrus region next week. Current orange juice futures are at $3.50/lb. Brazil, the world\'s largest producer, just reported a smaller-than-expected harvest. How should a juice manufacturer adjust their procurement strategy, inventory management, and pricing for the next 30 days?', expected: 'The AI should recommend accelerating procurement before price spikes, increasing safety stock, evaluating alternative sourcing, adjusting downstream pricing, and hedging strategies.' }
        ]
      })
    },
    {
      id: 'les-5-3', module_id: mod5Id, order_index: 3,
      title: 'Checkpoint: Supply Chain Intelligence',
      type: 'checkpoint', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'text', content: 'Evaluate your understanding of AI in the agricultural supply chain.' }] })
    },
    {
      id: 'les-5-4', module_id: mod5Id, order_index: 4,
      title: 'Mini-Game: Supply Chain Optimizer',
      type: 'game', duration_minutes: 8,
      content: JSON.stringify({ blocks: [{ type: 'game_intro', text: 'Manage an AI-powered agricultural supply chain! Route deliveries, manage cold storage, predict demand, and minimize waste. Make strategic decisions to keep your supply chain efficient!' }] })
    },
    {
      id: 'les-5-5', module_id: mod5Id, order_index: 5,
      title: 'AI for Food Safety & Traceability',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'AI-powered traceability systems can track food products from farm to consumer in seconds — compared to days with traditional methods. When contamination is detected, AI can pinpoint the source field, processing batch, and distribution path within minutes.' },
          { type: 'text', content: 'Computer vision inspects produce quality at processing plants, while IoT sensors monitor temperature and humidity in transit. Machine learning algorithms detect anomalies that indicate spoilage or contamination before they become safety issues.' }
        ]
      })
    },
    {
      id: 'les-5-6', module_id: mod5Id, order_index: 6,
      title: 'Video: Generative AI for Agriculture',
      type: 'video', duration_minutes: 7,
      content: JSON.stringify({ blocks: [{ type: 'video_intro', text: 'Explore how generative AI is being applied across the agricultural value chain.' }] }),
      video_url: 'https://www.youtube.com/watch?v=Si5rhjifbZs',
      video_source: 'youtube'
    }
  ];

  lessons5.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // MODULE 6: The Human-AI Future of Agriculture
  // ============================================================
  const mod6Id = 'mod-6-future';
  db.prepare(`INSERT INTO modules (id, course_id, order_index, title, subtitle, description, duration_minutes, image_url, icon, color, learning_objectives, benchmarked_university) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    mod6Id, courseId, 6,
    'The Human-AI Future of Agriculture',
    'Augmentation, Ethics & Your Next Steps',
    'Conclude the course by examining the human-centric future of AI in agriculture. Understand that AI augments — not replaces — human expertise. Explore ethical considerations, adoption challenges, and build your personal AI-in-agriculture action plan.',
    50,
    '/images/mod6-future.png',
    'Partnership',
    '#ee5396',
    JSON.stringify([
      'Articulate why AI is an augmentation tool, not a replacement for human farming expertise',
      'Identify the 7 key pillars for organizational AI readiness (McKinsey framework)',
      'Evaluate ethical considerations in agricultural AI deployment',
      'Understand adoption barriers and strategies for different farm sizes',
      'Create a personal action plan for implementing AI on your farm or organization'
    ]),
    'McKinsey "Rewiring to Capture Value" Framework; Wageningen Interdisciplinary AI in Agriculture Research'
  );

  const lessons6 = [
    {
      id: 'les-6-1', module_id: mod6Id, order_index: 1,
      title: 'AI Augments, Not Replaces',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'hero', title: 'The Human-AI Partnership', subtitle: 'Why the best farming AI amplifies human expertise', image: '/images/mod6-future.png' },
          { type: 'text', content: 'Throughout this course, we\'ve seen one consistent theme: the most successful AI implementations in agriculture combine data-driven insights with human knowledge and intuition. Microsoft FarmBeats explicitly "couples data-driven farming with the farmer\'s own knowledge and intuition." IBM\'s Liquid Prep makes technology accessible to small farmers through simple interfaces. ClimateAi works alongside farmers to develop adaptation playbooks.' },
          { type: 'text', content: 'AI is your thought partner — an optimizer that handles what computers do best (processing millions of data points, detecting patterns in images, running complex simulations) while humans do what they do best (understanding local context, making ethical judgments, building community relationships, adapting creatively to unexpected situations).' },
          { type: 'comparison', title: 'What AI Does Best vs. What Humans Do Best', items: [
            { category: 'AI Strengths', description: 'Processing, pattern recognition, optimization', examples: ['Analyzing millions of weather data points', 'Detecting disease in thousands of leaf images', 'Optimizing fertilizer rates across 10,000 zones', 'Running 24/7 sensor monitoring'] },
            { category: 'Human Strengths', description: 'Context, judgment, creativity, relationships', examples: ['Understanding local soil quirks from decades of experience', 'Building trust with farming communities', 'Making ethical decisions about land use', 'Adapting to unprecedented situations creatively'] }
          ]}
        ]
      })
    },
    {
      id: 'les-6-2', module_id: mod6Id, order_index: 2,
      title: 'McKinsey\'s 7 Pillars of AI Readiness',
      type: 'lecture', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'McKinsey identifies seven key areas organizations must address to capture value from AI in agriculture:' },
          { type: 'pillars', items: [
            { number: 1, title: 'Business-Led Strategy', desc: 'Align AI investments with business value. Take a top-down view to transform domains, not just use cases.' },
            { number: 2, title: 'Modern Tech Infrastructure', desc: 'Avoid fragmentation with careful technology choices — infrastructure, models, build-vs-buy, and key partnerships.' },
            { number: 3, title: 'Data Foundation', desc: 'Gen AI opens new avenues for unstructured data. Build enterprise data architecture with proper APIs and cloud infrastructure.' },
            { number: 4, title: 'Talent Upskilling', desc: 'Build internal capabilities with clear career paths: data stewards, engineers, software architects, MLOps engineers.' },
            { number: 5, title: 'Risk Management', desc: 'Address ethical, legal, and regulatory risks early. Embed legal and risk teams in agile delivery.' },
            { number: 6, title: 'Agile Operating Model', desc: 'Use innovation funding mechanisms. Rally behind high-value domains with integrated squads and clear business ownership.' },
            { number: 7, title: 'Adoption & Change', desc: 'Reimagine ways of working, upskill the workforce, and carefully manage change — this is where most implementations fail.' }
          ]}
        ]
      })
    },
    {
      id: 'les-6-3', module_id: mod6Id, order_index: 3,
      title: 'Ethics & Responsible AI in Agriculture',
      type: 'lecture', duration_minutes: 8,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'As AI becomes more embedded in agriculture, critical ethical questions arise: Who owns farm data? How do we prevent AI from widening the digital divide between large and small farmers? What happens when AI recommendations conflict with traditional farming knowledge?' },
          { type: 'text', content: 'Wageningen University\'s research proposes an interdisciplinary approach to AI in agriculture — bringing together technologists, ethicists, social scientists, and farmers to ensure AI serves everyone equitably.' },
          { type: 'persona_scenario', persona: 'amara', scenario: 'Amara realizes her AI precision agriculture platform sends her field data to a cloud server owned by a large agribusiness company. She wonders: Are they using her data to advise her competitors? Could they predict her yield and use it in commodity trading? These questions highlight the critical importance of data ownership, privacy, and transparency in agricultural AI.' },
          { type: 'prompt_test', title: 'Try This AI Prompt', platform: 'OpenAI', prompt: 'What are the top 5 ethical concerns about using AI in smallholder farming in developing countries? For each concern, suggest a practical solution that balances innovation with farmer protection. Consider data ownership, digital divide, cultural sensitivity, algorithmic bias, and environmental impact.', expected: 'The AI should address data sovereignty, affordability, local knowledge integration, bias in training data, and environmental externalities with practical solutions.' }
        ]
      })
    },
    {
      id: 'les-6-4', module_id: mod6Id, order_index: 4,
      title: 'Checkpoint: Future & Ethics',
      type: 'checkpoint', duration_minutes: 5,
      content: JSON.stringify({ blocks: [{ type: 'text', content: 'Final module checkpoint on AI ethics, human augmentation, and organizational readiness.' }] })
    },
    {
      id: 'les-6-5', module_id: mod6Id, order_index: 5,
      title: 'Your AI Agriculture Action Plan',
      type: 'activity', duration_minutes: 10,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'Now it\'s your turn. Based on everything you\'ve learned, create your personalized action plan for implementing AI in your agricultural context.' },
          { type: 'prompt_test', title: 'Build Your Action Plan with AI', platform: 'OpenAI', prompt: 'Help me create a 90-day AI implementation plan for my [type of farm/organization]. I have [describe current technology level]. My biggest challenges are [list 3 challenges]. My budget for technology is [amount]. I want to start with the highest-impact, lowest-risk AI applications first. Create a phased plan with specific tools, expected costs, and projected ROI.', expected: 'Personalized action plan based on user input.' }
        ]
      })
    },
    {
      id: 'les-6-6', module_id: mod6Id, order_index: 6,
      title: 'Course Wrap-Up & Final Exam Preparation',
      type: 'lecture', duration_minutes: 7,
      content: JSON.stringify({
        blocks: [
          { type: 'text', content: 'Congratulations on completing all six modules! You\'ve journeyed through the agricultural AI landscape — from the global food challenge and data collection to precision crop management, climate resilience, supply chain intelligence, and the human-AI future.' },
          { type: 'text', content: 'Before taking the Final Exam, review the key concepts from each module. The exam consists of scenario-based questions where you\'ll apply your knowledge to real-world agricultural situations. You\'ll need to identify the right AI approach, tool, or strategy for each scenario.' },
          { type: 'callout', style: 'success', title: 'Graduation Badge', content: 'Pass the final exam with 70% or higher to earn your AI in Agriculture Certified badge — a digital credential you can share on LinkedIn and professional networks.' }
        ]
      })
    }
  ];

  lessons6.forEach(l => {
    insertLesson.run(l.id, l.module_id, l.order_index, l.title, l.type, l.duration_minutes, l.content, l.video_url || null, l.video_source || null);
  });

  // ============================================================
  // PERSONAS
  // ============================================================
  const insertPersona = db.prepare(`INSERT INTO personas (id, name, role, description, avatar_url, specialization, ai_tools_used, scenario_context) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  
  insertPersona.run('persona-amara', 'Amara Johnson', 'Wheat Farmer', 'A 3rd-generation wheat farmer in Kansas managing 2,000 acres. She\'s tech-curious but skeptical about AI replacing her decades of farming intuition. Amara represents farmers who want to see AI as a tool that complements their expertise.', null, 'Row Crops, Precision Agriculture',
    JSON.stringify(['Weather forecasting apps', 'GPS auto-steer', 'Variable rate prescriptions', 'Yield monitoring']),
    'Midwest US large-scale grain farming with increasing climate variability');

  insertPersona.run('persona-carlos', 'Carlos Mendoza', 'Coffee Farmer', 'A mid-size coffee farmer in Colombia with 200 hectares. Carlos adopted IoT sensors and drone technology to optimize his specialty coffee production. He represents progressive farmers in developing countries embracing digital agriculture.', null, 'Specialty Crops, IoT Integration',
    JSON.stringify(['Soil moisture sensors', 'Drone multispectral imaging', 'Mobile farm management apps', 'AI-powered pest alerts']),
    'Latin American specialty crop farming with limited infrastructure');

  insertPersona.run('persona-dr-okafor', 'Dr. Fatima Okafor', 'Agronomist', 'An agronomist in Nigeria advising 50 smallholder farms on sustainable practices. She uses AI platforms to monitor crop health and carbon sequestration. Dr. Okafor represents the scientific advisory role in agriculture.', null, 'Sustainable Agriculture, Carbon Farming',
    JSON.stringify(['Satellite crop monitoring', 'AI carbon calculators', 'Virtual agronomy chatbots', 'Climate modeling tools']),
    'Sub-Saharan African advisory services for smallholder farmers');

  insertPersona.run('persona-rajan', 'Rajan Patel', 'Food Distributor', 'A food distribution company manager in India dealing with perishable goods. Rajan uses AI demand forecasting to reduce waste. He represents the supply chain perspective.', null, 'Supply Chain, Demand Forecasting',
    JSON.stringify(['AI demand forecasting', 'Route optimization', 'Cold chain IoT monitoring', 'Market price prediction']),
    'Indian perishable food distribution with high waste rates');

  // ============================================================
  // ACTIVITIES (Checkpoints - Scenario-based assessments)
  // ============================================================
  const insertActivity = db.prepare(`INSERT INTO activities (id, lesson_id, type, title, description, content, points) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  // Module 1 Checkpoint
  insertActivity.run('act-1-1', 'les-1-3', 'scenario', 'The AI Agriculture Landscape', 'Identify the correct AI application for each farming scenario.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'A farmer needs to decide when to plant corn. The traditional planting window is April 15-May 15, but recent years have been unpredictable. What type of AI would be most helpful?',
          options: [
            { id: 'a', text: 'Generative AI chatbot to discuss planting philosophy', correct: false },
            { id: 'b', text: 'Analytical AI model that predicts soil temperature and frost risk based on weather patterns', correct: true },
            { id: 'c', text: 'Robotic planting system that plants automatically', correct: false },
            { id: 'd', text: 'Blockchain-based seed tracking system', correct: false }
          ],
          explanation: 'This is a prediction task based on structured weather data — perfect for analytical AI. The model processes historical weather patterns, current conditions, and forecast data to recommend optimal planting dates.'
        },
        {
          id: 'q2', scenario: 'A seed company wants to scan thousands of research papers and patent documents to identify promising genetic traits for drought resistance. Which AI approach is best suited?',
          options: [
            { id: 'a', text: 'Computer vision for leaf analysis', correct: false },
            { id: 'b', text: 'IoT sensor network deployment', correct: false },
            { id: 'c', text: 'Generative AI for natural language scanning of patents and scientific research', correct: true },
            { id: 'd', text: 'GPS-guided variable rate application', correct: false }
          ],
          explanation: 'This requires processing large amounts of unstructured text data — exactly where generative AI excels. As McKinsey notes, gen AI can help generate initial hypotheses by conducting natural language scans of patents and scientific research.'
        },
        {
          id: 'q3', scenario: 'McKinsey estimates that AI can create $250 billion in total value for agriculture. What is the split between on-farm and enterprise value?',
          options: [
            { id: 'a', text: '$200B on-farm, $50B enterprise', correct: false },
            { id: 'b', text: '$100B on-farm, $150B enterprise', correct: true },
            { id: 'c', text: '$125B each', correct: false },
            { id: 'd', text: '$50B on-farm, $200B enterprise', correct: false }
          ],
          explanation: '$100 billion on the acre (improving yields, reducing labor and input costs) and $150 billion for enterprises (R&D, marketing, agronomy & sustainability, operations).'
        }
      ]
    }), 30);

  // Module 2 Checkpoint
  insertActivity.run('act-2-1', 'les-2-5', 'scenario', 'Data & Sensors Assessment', 'Match the right sensor technology to each agricultural challenge.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'Carlos\'s coffee farm in Colombia has areas where plants are yellowing, but he can\'t tell if it\'s a water issue, nutrient deficiency, or disease. He needs to assess 200 hectares quickly. What\'s the best technology combination?',
          options: [
            { id: 'a', text: 'Walk each row and visually inspect every plant', correct: false },
            { id: 'b', text: 'Deploy drone with multispectral camera for crop health mapping + soil sensors for moisture data', correct: true },
            { id: 'c', text: 'Install satellite dish for better internet', correct: false },
            { id: 'd', text: 'Use ChatGPT to diagnose the problem from a description', correct: false }
          ],
          explanation: 'Multispectral drone imagery reveals different plant stress types (NDVI for health, thermal for water stress) while soil sensors confirm moisture levels. This combination of aerial and ground data gives Carlos the comprehensive picture he needs.'
        },
        {
          id: 'q2', scenario: 'A Texas farmer needs to decide when to irrigate his orchard but wants to monitor moisture at the root level, not just the surface. Which tool would IBM recommend?',
          options: [
            { id: 'a', text: 'Satellite imagery from Google Earth', correct: false },
            { id: 'b', text: 'IBM Liquid Prep — IoT soil moisture sensor + mobile app on IBM Cloud', correct: true },
            { id: 'c', text: 'Weather forecast from The Weather Company', correct: false },
            { id: 'd', text: 'Perplexity AI search for irrigation schedules', correct: false }
          ],
          explanation: 'IBM Liquid Prep uses subsurface IoT sensors linked to a mobile app running on IBM Cloud, specifically designed to monitor root-level moisture and provide when-to-water decision support.'
        },
        {
          id: 'q3', scenario: 'What is the key innovation of Microsoft FarmBeats that makes it suitable for farms with limited internet connectivity?',
          options: [
            { id: 'a', text: 'It works entirely offline', correct: false },
            { id: 'b', text: 'It uses TV White Spaces for long-range connectivity + edge computing for local data processing', correct: true },
            { id: 'c', text: 'It requires 5G installation', correct: false },
            { id: 'd', text: 'It only uses satellite internet', correct: false }
          ],
          explanation: 'FarmBeats uses unused TV spectrum (TV White Spaces) for long-range, low-cost internet and edge computing to process data locally — reducing cloud dependency and making digital agriculture accessible in rural areas.'
        }
      ]
    }), 30);

  // Module 3 Checkpoint
  insertActivity.run('act-3-1', 'les-3-5', 'scenario', 'Crop Management AI Assessment', 'Apply AI crop management concepts to real scenarios.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'A researcher needs to count flowers on hundreds of bean plants across thousands of plots in Tanzania. CNNs required thousands of labeled images. What technological advancement made this feasible with only hundreds of images?',
          options: [
            { id: 'a', text: 'Bigger computers with more RAM', correct: false },
            { id: 'b', text: 'Vision transformers and foundation models like YOLO and Segment Anything', correct: true },
            { id: 'c', text: 'Higher resolution cameras', correct: false },
            { id: 'd', text: 'More manual labeling workers', correct: false }
          ],
          explanation: 'Vision transformers and open-source models like YOLO and Segment Anything drastically reduced labeled data requirements from thousands to hundreds of examples, fast-tracking model development for diverse crops.'
        },
        {
          id: 'q2', scenario: 'Avalo created a broccoli variety harvestable in 37 days for vertical farms. What AI technology did they use to identify the genes responsible?',
          options: [
            { id: 'a', text: 'ChatGPT for recipe generation', correct: false },
            { id: 'b', text: 'Drone imagery analysis', correct: false },
            { id: 'c', text: 'Explainable AI (xAI) to precisely identify genes linked to complex crop traits', correct: true },
            { id: 'd', text: 'Weather prediction models', correct: false }
          ],
          explanation: 'Avalo uses explainable AI to understand which genes influence complex traits. xAI makes the AI\'s reasoning transparent, showing precisely which genetic markers matter — enabling crops to be developed 5x faster and 50x cheaper.'
        }
      ]
    }), 20);

  // Module 4 Checkpoint
  insertActivity.run('act-4-1', 'les-4-3', 'scenario', 'Climate & Sustainability Assessment', 'Apply climate resilience and sustainability concepts.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'Tomato farmers in Maharashtra, India face a projected 30% yield decrease from extreme heat and drought. ClimateAi provided this forecast. What was the resulting action?',
          options: [
            { id: 'a', text: 'Farmers abandoned tomato cultivation entirely', correct: false },
            { id: 'b', text: 'A seed company accelerated trials for drought-tolerant seeds, and adaptation playbooks were deployed in 300 villages', correct: true },
            { id: 'c', text: 'The government banned tomato farming', correct: false },
            { id: 'd', text: 'Farmers switched to indoor vertical farming', correct: false }
          ],
          explanation: 'Climate AI predictions enabled proactive adaptation — not abandonment. The insights were used to develop drought-tolerant seed varieties and create adaptation playbooks that helped ~100,000 smallholder farmers increase productivity by up to 40%.'
        },
        {
          id: 'q2', scenario: 'Google\'s AI flood forecasting system achieves what level of accuracy and at what lead time?',
          options: [
            { id: 'a', text: '50% accuracy, 24 hours ahead', correct: false },
            { id: 'b', text: '95% accuracy, 7 days ahead', correct: true },
            { id: 'c', text: '80% accuracy, 3 days ahead', correct: false },
            { id: 'd', text: '99% accuracy, 1 day ahead', correct: false }
          ],
          explanation: 'Google Research\'s flood forecasting system predicts floods with 95% accuracy up to 7 days in advance, now covering 80 countries.'
        }
      ]
    }), 20);

  // Module 5 Checkpoint
  insertActivity.run('act-5-1', 'les-5-3', 'scenario', 'Supply Chain Intelligence Assessment', 'Optimize an agricultural supply chain with AI.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'Rajan\'s AI demand forecasting improved his prediction accuracy from 75% to 95%. His food waste dropped from 20% to 6%. If his annual revenue is $10 million, approximately how much did AI save him?',
          options: [
            { id: 'a', text: '$140,000', correct: false },
            { id: 'b', text: '$1.4 million', correct: true },
            { id: 'c', text: '$14 million', correct: false },
            { id: 'd', text: '$400,000', correct: false }
          ],
          explanation: 'Waste reduction from 20% to 6% = 14 percentage points saved. On $10M revenue: 14% × $10M = $1.4 million in savings from reduced waste alone — plus additional savings from better inventory management and fewer stockouts.'
        },
        {
          id: 'q2', scenario: 'A food processing company needs to monitor quality of incoming produce, predict machine maintenance needs, and optimize production schedules. Which combination of AI tools should they use?',
          options: [
            { id: 'a', text: 'Social media monitoring + email marketing AI', correct: false },
            { id: 'b', text: 'Computer vision for quality inspection + predictive maintenance ML + production scheduling AI', correct: true },
            { id: 'c', text: 'Blockchain only', correct: false },
            { id: 'd', text: 'Manual inspection + spreadsheet scheduling', correct: false }
          ],
          explanation: 'A comprehensive approach: computer vision for automated quality inspection, machine learning for predicting equipment failures before they occur, and AI optimization for production scheduling — all working together.'
        }
      ]
    }), 20);

  // Module 6 Checkpoint
  insertActivity.run('act-6-1', 'les-6-4', 'scenario', 'Future & Ethics Assessment', 'Apply human-AI principles and ethical reasoning.',
    JSON.stringify({
      questions: [
        {
          id: 'q1', scenario: 'A large agribusiness offers free AI-powered crop monitoring to smallholder farmers in exchange for their farm data. What is the primary ethical concern?',
          options: [
            { id: 'a', text: 'The AI might make mistakes', correct: false },
            { id: 'b', text: 'Data ownership and potential exploitation — the company could use farmer data for commodity trading or advising competitors', correct: true },
            { id: 'c', text: 'The technology is too complex for farmers', correct: false },
            { id: 'd', text: 'It might rain more', correct: false }
          ],
          explanation: 'Data sovereignty is a critical issue. Farmers must understand how their data is used, stored, and potentially monetized. Transparent data ownership agreements are essential for ethical AI deployment in agriculture.'
        }
      ]
    }), 10);

  // ============================================================
  // MINI-GAMES
  // ============================================================
  const insertGame = db.prepare(`INSERT INTO mini_games (id, lesson_id, type, title, description, config, max_score) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  insertGame.run('game-1', 'les-1-6', 'spot_ai', 'Spot the AI on the Farm',
    'Explore an interactive farm scene and click on objects powered by AI. Find all 8 AI systems hidden in plain sight!',
    JSON.stringify({
      scene: 'farm_overview',
      items: [
        { id: 'tractor', x: 15, y: 60, label: 'GPS Auto-Steer Tractor', desc: 'Uses RTK GPS and computer vision for centimeter-level field navigation. AI optimizes driving patterns to minimize fuel use and soil compaction.', found: false },
        { id: 'drone', x: 45, y: 15, label: 'Crop Monitoring Drone', desc: 'Multispectral cameras capture NDVI data. AI algorithms detect crop stress, pest damage, and nutrient deficiency from aerial imagery.', found: false },
        { id: 'weather', x: 80, y: 10, label: 'Smart Weather Station', desc: 'Hyper-local weather monitoring feeds AI forecast models that predict conditions hours to months ahead for farming decisions.', found: false },
        { id: 'sensor', x: 30, y: 75, label: 'Soil Moisture Sensor', desc: 'IoT sensor measures moisture, temperature, and nutrients. AI determines optimal irrigation timing and amount.', found: false },
        { id: 'phone', x: 55, y: 45, label: 'Farmer\'s AI Assistant App', desc: 'Virtual agronomy chatbot provides personalized crop management advice by analyzing field data, weather, and historical patterns.', found: false },
        { id: 'silo', x: 70, y: 55, label: 'Smart Grain Storage', desc: 'IoT sensors monitor temperature and humidity. AI predicts spoilage risk and recommends optimal selling timing based on market predictions.', found: false },
        { id: 'satellite', x: 90, y: 5, label: 'Satellite Monitoring', desc: 'Earth observation satellites provide broad field coverage. AI processes petabytes of imagery for crop classification, growth tracking, and yield estimation.', found: false },
        { id: 'pivot', x: 40, y: 50, label: 'Smart Irrigation Pivot', desc: 'Variable rate irrigation controlled by AI. Each nozzle adjusts independently based on soil moisture maps and crop water demand models.', found: false }
      ]
    }), 100);

  insertGame.run('game-2', 'les-2-6', 'drone_pilot', 'Drone Pilot Challenge',
    'Navigate a virtual drone over farm fields. Identify crop stress zones from color-coded imagery. Score points for finding all problem areas!',
    JSON.stringify({
      grid_size: 8,
      zones: [
        { x: 1, y: 2, type: 'water_stress', color: '#ff6b6b', desc: 'Low NDVI + High thermal = Water stress' },
        { x: 3, y: 4, type: 'nutrient_deficiency', color: '#ffd93d', desc: 'Medium NDVI + Normal thermal = Nutrient deficiency' },
        { x: 5, y: 1, type: 'pest_damage', color: '#ff9f43', desc: 'Irregular NDVI pattern = Pest damage' },
        { x: 6, y: 6, type: 'healthy', color: '#26de81', desc: 'High NDVI + Normal thermal = Healthy crop' },
        { x: 2, y: 5, type: 'disease', color: '#a55eea', desc: 'Declining NDVI + Cluster pattern = Disease' },
        { x: 7, y: 3, type: 'healthy', color: '#26de81', desc: 'High NDVI = Healthy crop' }
      ],
      time_limit: 60
    }), 100);

  insertGame.run('game-3', 'les-3-6', 'crop_doctor', 'Crop Doctor AI',
    'Diagnose crop problems from symptoms, data, and images. Match the right treatment to each condition. Beat the clock!',
    JSON.stringify({
      cases: [
        { id: 1, symptoms: 'Yellowing lower leaves, stunted growth, pale green color', data: 'Soil pH: 6.5, N: Low, P: Medium, K: High', diagnosis: 'Nitrogen deficiency', treatment: 'Apply 40 lbs/acre side-dress nitrogen' },
        { id: 2, symptoms: 'Brown spots on leaves, rapid spread, humid conditions', data: 'Humidity: 90%, Temp: 25°C, Recent rainfall: 5 days', diagnosis: 'Fungal leaf blight', treatment: 'Apply fungicide, improve air circulation, reduce irrigation' },
        { id: 3, symptoms: 'Wilting despite adequate water, root discoloration', data: 'Soil moisture: 30%, Drainage: Poor, pH: 7.5', diagnosis: 'Root rot from waterlogging', treatment: 'Improve drainage, reduce irrigation, apply biological fungicide' },
        { id: 4, symptoms: 'Irregular holes in leaves, visible caterpillars', data: 'Season: Late summer, Previous crop: Corn, No cover crop', diagnosis: 'Armyworm infestation', treatment: 'Apply targeted Bt insecticide, scout regularly, consider cover crop rotation' }
      ],
      time_per_case: 45
    }), 100);

  insertGame.run('game-4', 'les-4-5', 'weather_predict', 'Weather Prediction Challenge',
    'Analyze weather patterns and make farming decisions. Score points for accurate predictions and smart choices!',
    JSON.stringify({
      rounds: [
        { day: 1, data: { temp: 28, humidity: 65, wind: 12, pressure: 1013, trend: 'falling' }, question: 'Based on falling pressure and rising humidity, what should you prepare for?', options: ['Drought conditions', 'Incoming rain system', 'Frost warning', 'Heat wave'], correct: 1, farming_decision: 'Postpone fertilizer application to avoid runoff' },
        { day: 2, data: { temp: 15, humidity: 40, wind: 5, pressure: 1025, trend: 'stable' }, question: 'Clear conditions with stable pressure. Good opportunity for:', options: ['Emergency irrigation', 'Pesticide application (calm wind, dry conditions)', 'Indoor equipment maintenance', 'Harvest delay'], correct: 1, farming_decision: 'Apply pest treatment during calm, dry window' },
        { day: 3, data: { temp: 2, humidity: 85, wind: 3, pressure: 1020, trend: 'falling' }, question: 'Temperature near freezing with high humidity. What\'s the risk?', options: ['Drought', 'Flood', 'Frost damage to crops', 'Wind damage'], correct: 2, farming_decision: 'Activate frost protection measures — wind machines, sprinkler systems' }
      ]
    }), 100);

  insertGame.run('game-5', 'les-5-4', 'supply_chain', 'Supply Chain Optimizer',
    'Manage an agricultural supply chain. Route deliveries, manage inventory, and minimize waste!',
    JSON.stringify({
      scenario: 'tomato_distribution',
      facilities: ['Farm A', 'Farm B', 'Processing Plant', 'Warehouse North', 'Warehouse South', 'Retail Hub'],
      decisions: [
        { round: 1, context: 'You have 10,000 kg of tomatoes at Farm A and 8,000 kg at Farm B. Processing plant capacity is 12,000 kg/day. Demand forecast: 15,000 kg this week.', options: ['Send all to processing immediately', 'Stagger deliveries over 2 days for quality', 'Store 6,000 kg, process 12,000 kg', 'Sell excess at farm gate discount'], optimal: 1, points: 25 },
        { round: 2, context: 'AI detects temperature spike in Warehouse North. 3,000 kg of processed tomatoes at risk. Cold repair team is 4 hours away.', options: ['Wait for repairs', 'Transfer to Warehouse South (2 hour drive)', 'Sell at discount to nearest retailer', 'Apply additional ice packs'], optimal: 1, points: 25 },
        { round: 3, context: 'New demand forecast: 20% increase next week due to festival. Current inventory: 8,000 kg. Production capacity: 12,000 kg/day.', options: ['Maintain current production', 'Increase to full capacity for 3 days', 'Source from alternate suppliers now', 'Increase production + source alternate supplier'], optimal: 3, points: 25 }
      ]
    }), 100);

  // ============================================================
  // FINAL EXAM
  // ============================================================
  const insertExamQ = db.prepare(`INSERT INTO exam_questions (id, course_id, order_index, type, question, scenario_context, options, correct_answer, explanation, points, module_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const examQuestions = [
    { order: 1, type: 'scenario', question: 'A coffee cooperative in Colombia wants to help its 500 member farmers improve yield and quality. Most farmers have smartphones but limited internet access. Which AI platform architecture would be most appropriate?', scenario: 'Resource-constrained precision agriculture', options: JSON.stringify(['Cloud-only AI requiring constant high-speed internet', 'Edge computing with intermittent cloud sync (FarmBeats-style architecture)', 'Blockchain-based supply chain system', 'Desktop-only analytics software']), correct: 'Edge computing with intermittent cloud sync (FarmBeats-style architecture)', explanation: 'Microsoft FarmBeats\' architecture specifically addresses this challenge: edge computing processes data locally on the farm, TV White Spaces provide long-range connectivity, and the system syncs with the cloud when connectivity is available.', points: 10, module: mod2Id },
    { order: 2, type: 'identification', question: 'A seed company wants to scan thousands of research papers and patent documents to identify promising genetic traits for drought resistance. They then want to simulate these traits in virtual field trials. Which combination of AI is needed?', scenario: 'AI-accelerated crop development', options: JSON.stringify(['Analytical AI only', 'Generative AI only', 'Generative AI for scanning and hypothesis generation + Analytical AI for simulation', 'Neither — this requires manual research']), correct: 'Generative AI for scanning and hypothesis generation + Analytical AI for simulation', explanation: 'McKinsey\'s framework shows gen AI excels at scanning unstructured data (papers, patents) and generating hypotheses, while analytical AI models simulate scenarios from structured data. The combination is more powerful than either alone.', points: 10, module: mod1Id },
    { order: 3, type: 'scenario', question: 'Amara notices her AI precision agriculture platform sends field data to a company\'s cloud servers. She wants to continue using the AI but protect her farming data. What approach best balances innovation with data sovereignty?', scenario: 'Ethical AI in agriculture', options: JSON.stringify(['Stop using AI entirely to protect data', 'Demand transparent data usage agreements with clear ownership terms and opt-out rights', 'Share data freely since AI helps everyone', 'Only use AI that works completely offline']), correct: 'Demand transparent data usage agreements with clear ownership terms and opt-out rights', explanation: 'The human-centric approach recognizes both the value of AI and the importance of data sovereignty. Transparent agreements that specify data ownership, usage rights, and opt-out provisions enable farmers to benefit from AI while protecting their interests.', points: 10, module: mod6Id },
    { order: 4, type: 'scenario', question: 'A food distributor in India serves perishable goods across 50 cities. Current waste rate is 20%. Which AI approach would most effectively reduce waste?', scenario: 'Supply chain optimization', options: JSON.stringify(['Install more cold storage (capital investment only)', 'AI demand forecasting combining historical data, weather, festivals, and market trends + IoT cold chain monitoring', 'Hire more delivery drivers for faster transport', 'Reduce product variety to simplify logistics']), correct: 'AI demand forecasting combining historical data, weather, festivals, and market trends + IoT cold chain monitoring', explanation: 'Rajan\'s case study showed that AI demand forecasting improved prediction accuracy from 75% to 95%, dropping waste from 20% to 6%. Combining demand forecasting with IoT cold chain monitoring creates a comprehensive solution.', points: 10, module: mod5Id },
    { order: 5, type: 'identification', question: 'Google\'s flood forecasting system helps farmers by:', scenario: 'Climate resilience', options: JSON.stringify(['Preventing floods from occurring', 'Predicting floods with 95% accuracy up to 7 days ahead, allowing farmers to protect crops and adjust plans', 'Only working in the United States', 'Replacing weather stations']), correct: 'Predicting floods with 95% accuracy up to 7 days ahead, allowing farmers to protect crops and adjust plans', explanation: 'Google Research\'s AI flood forecasting achieves 95% accuracy at 7-day lead time across 80 countries — giving farmers critical time to move equipment, protect crops, and adjust drainage systems.', points: 10, module: mod4Id },
    { order: 6, type: 'scenario', question: 'Dr. Okafor is advising a new vertical farm that wants to grow broccoli profitably. Traditional broccoli takes 120+ days and requires pesticides. What AI approach could help?', scenario: 'AI-accelerated crop genetics', options: JSON.stringify(['Use ChatGPT to write a farming manual', 'Apply explainable AI (xAI) to identify genes for rapid growth, enabling a 37-day harvest cycle that eliminates the need for pesticides', 'Use satellite imagery to monitor the indoor farm', 'Install more LED lights']), correct: 'Apply explainable AI (xAI) to identify genes for rapid growth, enabling a 37-day harvest cycle that eliminates the need for pesticides', explanation: 'Avalo\'s approach: xAI identified the genetic markers for rapid growth in broccoli, screening 500+ varieties to create one harvestable in 37 days. The short harvest cycle meant pests couldn\'t establish — eliminating pesticide costs.', points: 10, module: mod3Id },
    { order: 7, type: 'matching', question: 'Match each AI concept to its correct agricultural application:', scenario: 'Concept matching', options: JSON.stringify([
      { concept: 'Computer Vision', application: 'Counting flowers on crops for phenotyping (Artemis project)' },
      { concept: 'Edge Computing', application: 'Processing farm data locally to reduce cloud dependency (FarmBeats)' },
      { concept: 'Generative AI Chatbot', application: 'Virtual agronomist providing personalized farming advice (IBM watsonx Welly)' },
      { concept: 'IoT Sensors', application: 'Root-level soil moisture monitoring (IBM Liquid Prep)' }
    ]), correct: 'all_matched', explanation: 'Each AI technology has specific agricultural applications. Understanding which technology suits which use case is crucial for effective implementation.', points: 15, module: mod2Id },
    { order: 8, type: 'scenario', question: 'According to McKinsey\'s framework, which is the MOST common reason agricultural organizations fail to capture value from AI?', scenario: 'Organizational readiness', options: JSON.stringify(['The AI technology doesn\'t work', 'Insufficient investment in adoption and change management — organizations focus on technology development while overlooking how to change workflows and upskill people', 'Internet connectivity is too slow', 'There isn\'t enough data available']), correct: 'Insufficient investment in adoption and change management — organizations focus on technology development while overlooking how to change workflows and upskill people', explanation: 'McKinsey\'s Pillar 7 — Adoption & Change — is identified as the critical failure point. Organizations allocate the majority of investment to technology while overlooking that success requires reimagining workflows, upskilling workforces, and managing change carefully.', points: 10, module: mod6Id },
    { order: 9, type: 'scenario', question: 'Carlos uses drone multispectral imagery + soil sensors on his coffee farm. The drone shows yellowing in Section B. Soil sensors show 15% moisture in Section A (normally 25%). What should the AI system recommend?', scenario: 'Multi-source data interpretation', options: JSON.stringify(['Apply nitrogen everywhere', 'Section A: Immediate targeted irrigation; Section B: Conduct leaf tissue analysis to distinguish between nutrient deficiency, disease, or water stress', 'Replant both sections', 'Wait and see for two weeks']), correct: 'Section A: Immediate targeted irrigation; Section B: Conduct leaf tissue analysis to distinguish between nutrient deficiency, disease, or water stress', explanation: 'AI should synthesize data from multiple sources: soil moisture data clearly indicates water stress in Section A (requiring immediate irrigation), while leaf yellowing in Section B needs further diagnosis since it could have multiple causes. This reflects the human-AI partnership approach.', points: 15, module: mod3Id },
    { order: 10, type: 'identification', question: 'Which statement best captures the course\'s central message about AI in agriculture?', scenario: 'Course synthesis', options: JSON.stringify(['AI will replace farmers within 10 years', 'AI is a thought partner and optimizer that augments human capabilities — combining data-driven insights with human knowledge, intuition, and expertise', 'AI only works for large corporate farms', 'AI in agriculture is mostly about robotics']), correct: 'AI is a thought partner and optimizer that augments human capabilities — combining data-driven insights with human knowledge, intuition, and expertise', explanation: 'The course\'s central thesis: AI is a thought partner that amplifies human capabilities. Microsoft FarmBeats couples data with farmer intuition, IBM makes tools accessible to small farmers, and every case study shows AI working alongside — not instead of — human expertise.', points: 10, module: mod6Id }
  ];

  examQuestions.forEach((eq, i) => {
    insertExamQ.run(`exam-q-${i+1}`, courseId, eq.order, eq.type, eq.question, eq.scenario, eq.options, eq.correct, eq.explanation, eq.points, eq.module);
  });

  // ============================================================
  // VIDEO RESOURCES
  // ============================================================
  const insertVideo = db.prepare(`INSERT INTO video_resources (id, lesson_id, title, description, url, source, speaker, speaker_role, duration_seconds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  insertVideo.run('vid-1', 'les-1-5', 'AI Meets AG', 'Comprehensive overview of AI applications in modern agriculture', 'https://www.youtube.com/watch?v=HmXohtc_K6M', 'youtube', 'Industry Panel', 'Agricultural AI Experts', 480);
  insertVideo.run('vid-2', 'les-2-3', 'FarmBeats: AI & IoT for Agriculture', 'Microsoft Research presentation on FarmBeats architecture and field deployments', 'https://www.youtube.com/watch?v=zrYUzr6_P18', 'youtube', 'Deepak Vasisht', 'MIT / Microsoft Research', 480);
  insertVideo.run('vid-3', 'les-3-4', 'IBM Sustainability Accelerator', 'How IBM uses AI and cloud to help farmers adapt to climate change', 'https://www.youtube.com/watch?v=PK4G0rDA5Vc', 'youtube', 'IBM Team', 'IBM Sustainability', 360);
  insertVideo.run('vid-4', 'les-4-4', 'Data Science in Agriculture', 'Practical applications of data science for farm-level decision making', 'https://www.youtube.com/watch?v=UPuzkwLzyAI', 'youtube', 'Farm Experts', 'Farmer2Farmer', 480);
  insertVideo.run('vid-5', 'les-5-6', 'Generative AI: Rise and Potential', 'Understanding generative AI and its applications in industry', 'https://www.youtube.com/watch?v=Si5rhjifbZs', 'youtube', 'Industry Speaker', 'AI Researcher', 420);

  // ============================================================
  // AI PROMPTS for user testing
  // ============================================================
  const insertPrompt = db.prepare(`INSERT INTO ai_prompts (id, lesson_id, prompt_text, platform, context, expected_insight, category) VALUES (?, ?, ?, ?, ?, ?, ?)`);

  insertPrompt.run('prompt-1', 'les-1-2', 'I am a corn farmer in Iowa. List all the AI-powered technologies I might already be using without realizing it. For each, explain how AI works behind the scenes.', 'OpenAI', 'Daily farm operations', 'Identify weather apps, GPS guidance, yield monitors, commodity platforms as AI-powered', 'crop_analysis');
  insertPrompt.run('prompt-2', 'les-2-2', 'I am a coffee farmer in Colombia with 200 hectares. I have soil moisture data showing 15% moisture in Section A (normally 25%) and drone imagery showing yellowing leaves in Section B. What could be causing these issues?', 'OpenAI', 'Multi-source data diagnosis', 'Water stress in A, nutrient/disease differential diagnosis in B', 'soil');
  insertPrompt.run('prompt-3', 'les-3-3', 'Act as an agricultural AI decision support system. Wheat field in Punjab, India: 35°C, soil moisture 18%, heading stage, no rain for 10 days. What are your priority recommendations?', 'OpenAI', 'IBM Watson-style decision support', 'Irrigation scheduling, heat stress monitoring, fertilization timing', 'crop_analysis');
  insertPrompt.run('prompt-4', 'les-4-2', 'I manage 1,000 acres of corn in Iowa. Help me reduce my carbon footprint while maintaining profitability with AI-enabled improvements.', 'OpenAI', 'Carbon farming and sustainability', 'Variable rate nitrogen, no-till, cover crops, precision irrigation', 'weather');
  insertPrompt.run('prompt-5', 'les-5-2', 'Analyze: cold snap in Florida citrus, OJ futures at $3.50/lb, Brazil smaller harvest. How should a juice manufacturer adjust procurement, inventory, and pricing?', 'OpenAI', 'Supply chain disruption response', 'Accelerate procurement, increase safety stock, adjust pricing, hedging', 'market');

  console.log('Database seeded successfully!');
}

seedDatabase();

module.exports = db;
