import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  SproutIcon, SatelliteIcon, CropGrowthIcon, CloudIcon, DeliveryIcon,
  PartnershipIcon, CheckmarkIcon, TrophyIcon, TimeIcon, CatalogIcon,
  ArrowRightIcon, WatsonIcon, GameControllerIcon, AiModelIcon,
  TerminalIcon, PlayFilledIcon, EcoIcon, SchoolIcon,
  ChevronLeftIcon, ChevronRightIcon, LocationIcon,
  InformationIcon, CheckmarkFilledIcon, SendIcon,
  BotIcon,
} from '../components/CarbonIcons';

const MODULE_ICONS = {
  1: SproutIcon, 2: SatelliteIcon, 3: CropGrowthIcon,
  4: CloudIcon, 5: DeliveryIcon, 6: PartnershipIcon,
};

const MODULE_IMAGES = {
  1: '/images/modules/mod1-revolution.jpg',
  2: '/images/modules/mod2-sensing.jpg',
  3: '/images/modules/mod3-crop.jpg',
  4: '/images/modules/mod4-climate.jpg',
  5: '/images/modules/mod5-supply.jpg',
  6: '/images/modules/mod6-future.jpg',
};

const MODULE_COLORS = {
  1: '#198038', 2: '#0043ce', 3: '#8a3ffc',
  4: '#007d79', 5: '#f1c21b', 6: '#ee5396',
};

const MODULE_DESCRIPTIONS = {
  1: 'Explore the Fourth Agricultural Revolution and how AI, machine learning, and data analytics are reshaping global food production.',
  2: 'Learn how IoT sensors, drone imaging, satellite data, and edge computing create the data foundation for smart farming decisions.',
  3: 'Apply computer vision, precision planting, variable-rate technology, and predictive models to optimize crop yields and reduce waste.',
  4: 'Build AI-powered systems for weather forecasting, drought prediction, flood management, and carbon footprint optimization.',
  5: 'Implement demand forecasting, cold-chain monitoring, food safety AI, and waste reduction across agricultural supply networks.',
  6: 'Navigate AI ethics, organizational readiness, the 7 pillars of AI adoption, and human-AI partnership in agriculture.',
};

const MODULE_TOPICS = {
  1: ['4th Agricultural Revolution', 'Global adoption patterns', 'AI value framework'],
  2: ['IoT sensors & edge computing', 'Drone & satellite imaging', 'Data pipelines'],
  3: ['Computer vision for crops', 'Precision planting', 'Yield prediction'],
  4: ['Weather forecasting AI', 'Drought & flood systems', 'Climate adaptation'],
  5: ['Demand forecasting', 'Cold chain monitoring', 'Waste reduction'],
  6: ['AI ethics in agriculture', 'Organizational readiness', 'Future workforce'],
};

const PERSONA_PHOTOS = {
  'Khalid Al-Rashidi': '/images/persona-khalid.png',
  'Amara Johnson': '/images/persona-amara.png',
  'Carlos Mendoza': '/images/persona-carlos.png',
  'Dr. Fatima Okafor': '/images/persona-fatima.png',
  'Rajan Patel': '/images/persona-rajan.png',
};

const PERSONA_CHAT_CONFIG = [
  {
    name: 'Khalid Al-Rashidi',
    role: 'AgriTech Director',
    location: 'Riyadh, Saudi Arabia',
    color: '#da1e28',
    expertise: 'Desert Agriculture, Controlled-Environment Farming, AI-Driven Water Management',
    accent: 'Saudi Arabian',
    personality: 'Visionary and direct, speaks with authority about sustainable desert farming and Vision 2030 initiatives.',
    greeting: 'As-salamu alaykum! I\'m Khalid. Let me share how we use AI to grow food in the desert. What would you like to know about controlled-environment agriculture?',
    sampleTopics: ['Hydroponic greenhouse AI', 'Water conservation tech', 'Vision 2030 agriculture'],
  },
  {
    name: 'Amara Johnson',
    role: 'Wheat Farmer',
    location: 'Kansas, USA',
    color: '#198038',
    expertise: 'Precision Agriculture, Variable-Rate Technology, Farm Data Analytics',
    accent: 'American Midwestern',
    personality: 'Practical and warm, bridges traditional farming wisdom with modern AI tools.',
    greeting: 'Hey there! I\'m Amara. I went from skeptic to AI advocate after seeing my yields jump 12%. Ask me anything about bringing AI to the field!',
    sampleTopics: ['GPS-guided farming', 'Soil analysis AI', 'Cooperative tech adoption'],
  },
  {
    name: 'Carlos Mendoza',
    role: 'Coffee Farmer',
    location: 'Huila, Colombia',
    color: '#0043ce',
    expertise: 'IoT Sensor Networks, Drone Imaging, Specialty Crop Monitoring',
    accent: 'Colombian Spanish',
    personality: 'Passionate and innovative, enthusiastic about how technology preserves artisanal quality.',
    greeting: 'Hola! I\'m Carlos. My drones and sensors help me grow world-class coffee sustainably. Want to learn about precision agriculture for specialty crops?',
    sampleTopics: ['Coffee leaf rust detection', 'Multispectral drone imaging', 'Soil moisture IoT'],
  },
  {
    name: 'Dr. Fatima Okafor',
    role: 'Agronomist',
    location: 'Lagos, Nigeria',
    color: '#8a3ffc',
    expertise: 'Satellite Monitoring, AI Advisory Platforms, Smallholder Farm Support',
    accent: 'Nigerian English',
    personality: 'Empathetic and analytical, passionate about scaling AI to serve millions of smallholder farmers.',
    greeting: 'Welcome! I\'m Dr. Okafor. I use satellite AI to help 50 farms make better decisions. Let me show you how AI advisory can scale across Africa!',
    sampleTopics: ['Satellite early warning', 'Low-connectivity AI', 'Cassava crop management'],
  },
  {
    name: 'Rajan Patel',
    role: 'Food Distributor',
    location: 'Mumbai, India',
    color: '#007d79',
    expertise: 'Supply Chain AI, Cold-Chain Monitoring, Demand Forecasting',
    accent: 'Indian English',
    personality: 'Energetic and data-driven, focused on reducing food waste through smart logistics.',
    greeting: 'Namaste! I\'m Rajan. My AI systems reduced food waste by 40% across 200 distribution points. Ask me about smart supply chains!',
    sampleTopics: ['Cold-chain IoT sensors', 'Demand prediction AI', 'Food waste reduction'],
  },
];

// ── Expert Info Card (display-only — chat via bottom-right persona selector) ──
function ExpertInfoCard({ persona }) {
  const photoSrc = PERSONA_PHOTOS[persona.name];

  return (
    <div className="expert-chat-card">
      <div className="expert-chat-header" style={{ borderBottom: `3px solid ${persona.color}` }}>
        <div className="expert-chat-avatar">
          <img src={photoSrc} alt={persona.name} className="expert-chat-avatar-img"
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
          <div className="expert-chat-avatar-fallback" style={{ display: 'none', background: persona.color }}>
            {persona.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="expert-chat-status-dot" />
        </div>
        <div className="expert-chat-info">
          <h4 className="expert-chat-name">{persona.name}</h4>
          <div className="expert-chat-role" style={{ color: persona.color }}>{persona.role}</div>
          <div className="expert-chat-location">
            <LocationIcon size={11} /> {persona.location}
          </div>
        </div>
      </div>

      <div className="expert-chat-meta">
        <div className="expert-chat-expertise">
          <span className="expert-chat-meta-label">Expertise:</span> {persona.expertise}
        </div>
        <div className="expert-chat-personality">
          <span className="expert-chat-meta-label">Voice:</span> {persona.accent} accent &middot; {persona.personality.split(',')[0]}
        </div>
      </div>

      <div className="expert-chat-preview">
        <p className="expert-chat-greeting">"{persona.greeting}"</p>
        <div className="expert-chat-topics">
          {persona.sampleTopics.map((t, i) => (
            <span key={i} className="expert-chat-topic-tag" style={{ borderColor: persona.color, color: persona.color }}>{t}</span>
          ))}
        </div>
        <div className="expert-chat-cta-hint">
          <BotIcon size={14} />
          <span>Use the <strong>AI persona selector</strong> (bottom-right) to chat with {persona.name.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
}

// ── Full persona data with scenarios, linked to modules ──
const PERSONAS = [
  {
    name: 'Khalid Al-Rashidi', role: 'AgriTech Director', location: 'Riyadh, Saudi Arabia', initial: 'KR', color: '#da1e28',
    modules: [2, 4], industry: 'Desert Agriculture & Food Security',
    bio: 'Khalid leads digital transformation at a major Saudi agricultural company focused on desert farming using controlled-environment agriculture and AI-driven water management under Vision 2030.',
    scenario: 'Managing greenhouse operations in Riyadh\'s extreme heat, Khalid deployed AI-controlled climate systems and hydroponic sensors that reduced water consumption by 90% compared to traditional farming. His team now produces 15 tonnes of tomatoes per greenhouse cycle using only recycled water.',
    challenge: 'How can AI and controlled-environment agriculture help arid nations achieve food security while conserving scarce water resources?',
  },
  {
    name: 'Amara Johnson', role: 'Wheat Farmer', location: 'Kansas, USA', initial: 'AJ', color: '#198038',
    modules: [1], industry: 'Large-scale Grain Farming',
    bio: 'Amara is a 3rd-generation farmer managing 2,000 acres of wheat and sorghum. She values her family\'s farming intuition but is open to technology that can prove its worth in the field.',
    scenario: 'When her GPS-guided tractor suggested variable-rate seeding based on soil analysis, Amara was skeptical. But after one season of 12% yield improvement, she became the biggest advocate for AI adoption in her county\'s farming cooperative.',
    challenge: 'How can AI help experienced farmers make better decisions without replacing the intuition built over generations?',
  },
  {
    name: 'Carlos Mendoza', role: 'Coffee Farmer', location: 'Huila, Colombia', initial: 'CM', color: '#0043ce',
    modules: [2, 3], industry: 'Specialty Coffee Production',
    bio: 'Carlos runs a mid-size specialty coffee farm in the Colombian highlands. He\'s embraced IoT sensors and drone imaging to monitor his shade-grown Arabica plants and optimize harvest timing.',
    scenario: 'Using soil moisture sensors and a weather prediction model, Carlos reduced his water usage by 30% while maintaining his farm\'s SCA cupping score above 85. His drone-captured multispectral images now detect coffee leaf rust 2 weeks before visible symptoms appear.',
    challenge: 'Can precision sensing technology make specialty coffee farming both more sustainable and more profitable for smallholder farmers?',
  },
  {
    name: 'Dr. Fatima Okafor', role: 'Agronomist', location: 'Lagos, Nigeria', initial: 'FO', color: '#8a3ffc',
    modules: [3, 4], industry: 'Agricultural Advisory',
    bio: 'Dr. Okafor advises 50 smallholder farms across southwestern Nigeria. She combines satellite monitoring with AI platforms to deliver personalized crop management recommendations.',
    scenario: 'When flooding threatened her farmers\' cassava crops, Fatima used a satellite-based early warning system to issue 72-hour advance alerts. The farmers who followed her AI-guided drainage recommendations saved 85% of their harvest.',
    challenge: 'How can AI-powered advisory services scale to help millions of smallholder farmers who lack internet connectivity and technical literacy?',
  },
  {
    name: 'Rajan Patel', role: 'Food Distributor', location: 'Mumbai, India', initial: 'RP', color: '#007d79',
    modules: [5, 6], industry: 'Agricultural Supply Chain',
    bio: 'Rajan manages distribution of perishable goods across western India. He uses AI demand forecasting and IoT cold-chain monitoring to minimize food waste in a complex supply network.',
    scenario: 'By implementing AI-powered demand prediction across 200 distribution points, Rajan reduced food waste by 40% and improved delivery freshness scores by 25%. His cold-chain sensors now trigger automatic rerouting when temperature anomalies are detected.',
    challenge: 'Can AI transform agricultural supply chains in developing countries where infrastructure is fragmented and data is scarce?',
  },
];

// ── Journey Roadmap with Overview as first node ──
function JourneyRoadmap({ modules, getModProgress, navigate }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  return (
    <div className="roadmap-container">
      <div className="roadmap-track">
        {/* Overview node */}
        <div className="roadmap-node completed"
          onClick={() => navigate('/')}
          onMouseEnter={() => setHoveredNode({ mod: { title: 'Course Overview', description: 'Static course information: structure, outcomes, skills, and university benchmarks.', duration_minutes: 10, lesson_count: 0 }, index: -1, pct: 100, isOverview: true })}
          onMouseLeave={() => setHoveredNode(null)}>
          <div className="roadmap-step-number">Start</div>
          <div className="roadmap-circle" style={{ background: 'var(--interactive-primary)', borderColor: 'var(--interactive-primary)' }}>
            <InformationIcon size={18} color="#fff" />
          </div>
          <div className="roadmap-label">Overview</div>
        </div>
        <div className="roadmap-connector done" />

        {modules.map((mod, i) => {
          const pct = getModProgress(mod.id);
          const isCompleted = pct === 100;
          const isActive = pct > 0 && pct < 100;
          const IconComp = MODULE_ICONS[i + 1] || SproutIcon;
          return (
            <React.Fragment key={mod.id}>
              {i > 0 && <div className={`roadmap-connector ${isCompleted ? 'done' : isActive ? 'active' : ''}`} />}
              <div className={`roadmap-node ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}
                onClick={() => navigate(`/module/${mod.id}`)}
                onMouseEnter={() => setHoveredNode({ mod, index: i, pct })}
                onMouseLeave={() => setHoveredNode(null)}>
                <div className="roadmap-step-number">Module {i + 1}</div>
                <div className="roadmap-circle">
                  {isCompleted ? <CheckmarkIcon size={20} color="#fff" /> : <IconComp size={18} color={isActive ? '#fff' : 'var(--text-secondary)'} />}
                </div>
                <div className="roadmap-label">{mod.title}</div>
                {pct > 0 && <div className="roadmap-pct">{pct}%</div>}
              </div>
            </React.Fragment>
          );
        })}
        <div className="roadmap-connector" />
        <div className="roadmap-node exam" onClick={() => navigate('/exam')} onMouseEnter={() => setHoveredNode({ mod: { title: 'Final Exam', description: 'Pass with 70% to earn your certification badge.', duration_minutes: 30, lesson_count: 10 }, index: 6, pct: 0, isExam: true })} onMouseLeave={() => setHoveredNode(null)}>
          <div className="roadmap-step-number">Final</div>
          <div className="roadmap-circle exam-circle"><TrophyIcon size={20} color="#161616" /></div>
          <div className="roadmap-label">Final Exam</div>
        </div>
      </div>
      {hoveredNode && (
        <div className="roadmap-popup" style={{ animationName: 'roadmapPopIn' }}>
          <div className="roadmap-popup-arrow" />
          <div className="roadmap-popup-header">
            <span className="roadmap-popup-num">{hoveredNode.isExam ? 'Final' : hoveredNode.isOverview ? 'Start' : `Module ${hoveredNode.index + 1}`}</span>
            <h4 className="roadmap-popup-title">{hoveredNode.mod.title}</h4>
          </div>
          <p className="roadmap-popup-desc">{hoveredNode.mod.description?.substring(0, 120)}...</p>
          {!hoveredNode.isOverview && (
            <div className="roadmap-popup-meta">
              <span><TimeIcon size={14} /> {hoveredNode.mod.duration_minutes} min</span>
              <span><CatalogIcon size={14} /> {hoveredNode.mod.lesson_count} lessons</span>
            </div>
          )}
          <div className="roadmap-popup-cta"><ArrowRightIcon size={14} /> {hoveredNode.isOverview ? 'View' : hoveredNode.pct === 100 ? 'Review' : hoveredNode.pct > 0 ? 'Continue' : 'Start'}</div>
        </div>
      )}
    </div>
  );
}

// ── Full-Screen Persona Carousel ──
function PersonaShowcase() {
  const [current, setCurrent] = useState(0);
  const p = PERSONAS[current];
  return (
    <div className="persona-showcase">
      <div className="persona-card-full">
        <div className="persona-card-header" style={{ borderLeft: `4px solid ${p.color}` }}>
          <div className="persona-avatar-initial" style={{ background: p.color }}>{p.initial}</div>
          <div>
            <h3 className="persona-full-name">{p.name}</h3>
            <div className="persona-full-role">{p.role}</div>
            <div className="persona-full-location"><LocationIcon size={14} /> {p.location}</div>
          </div>
          <div className="persona-full-industry">{p.industry}</div>
        </div>

        <div className="persona-card-body">
          <p className="persona-full-bio">{p.bio}</p>

          <div className="persona-scenario-block">
            <div className="persona-scenario-label">Real-World Scenario</div>
            <p className="persona-scenario-text">{p.scenario}</p>
          </div>

          <div className="persona-challenge-block">
            <AiModelIcon size={18} color="var(--interactive-primary)" />
            <p className="persona-challenge-text">{p.challenge}</p>
          </div>

          <div className="persona-modules-tags">
            <span className="persona-tag-label">Featured in:</span>
            {p.modules.map(m => (
              <span key={m} className="persona-module-tag" style={{ borderColor: MODULE_COLORS[m], color: MODULE_COLORS[m] }}>
                Module {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="persona-nav">
        <button className="persona-nav-arrow" onClick={() => setCurrent(c => (c - 1 + PERSONAS.length) % PERSONAS.length)} aria-label="Previous persona"><ChevronLeftIcon size={20} /></button>
        <div className="persona-dots">
          {PERSONAS.map((per, i) => (
            <button key={i} className={`persona-dot ${i === current ? 'active' : ''}`} style={i === current ? { background: per.color } : {}}
              onClick={() => setCurrent(i)} title={per.name} />
          ))}
        </div>
        <button className="persona-nav-arrow" onClick={() => setCurrent(c => (c + 1) % PERSONAS.length)} aria-label="Next persona"><ChevronRightIcon size={20} /></button>
      </div>
    </div>
  );
}

// ── Continue Learning logic ──
function getContinueTarget(modules, progress) {
  if (!progress?.moduleProgress || !modules.length) return { url: '/module/' + modules[0]?.id, label: 'Start Learning', hasStarted: false, moduleName: modules[0]?.title || 'Module 1', moduleNum: 1 };

  const sorted = [...progress.moduleProgress].sort((a, b) => a.module_order - b.module_order);

  // Find first module that is in progress (> 0% and < 100%)
  const inProgress = sorted.find(m => m.percentage > 0 && m.percentage < 100);
  if (inProgress) {
    return { url: `/module/${inProgress.module_id}`, label: 'Continue Learning', hasStarted: true, moduleName: inProgress.module_title, moduleNum: inProgress.module_order, pct: inProgress.percentage };
  }

  // Find first module not yet started (0%)
  const notStarted = sorted.find(m => m.percentage === 0);
  if (notStarted) {
    // If ANY modules have been completed, this is "Continue" not "Start"
    const anyCompleted = sorted.some(m => m.percentage === 100);
    return { url: `/module/${notStarted.module_id}`, label: anyCompleted ? 'Continue Learning' : 'Start Learning', hasStarted: anyCompleted, moduleName: notStarted.module_title, moduleNum: notStarted.module_order, pct: 0 };
  }

  // All modules completed → go to exam
  return { url: '/exam', label: 'Take Final Exam', hasStarted: true, moduleName: 'Final Exam', moduleNum: null, pct: 100, allComplete: true };
}

// ── Main Dashboard — Dynamic Progress Only ──
export default function Dashboard() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const { progress } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/course').then(r => r.json()).then(data => { setCourse(data.course); setModules(data.modules); }).catch(console.error);
  }, []);

  const getModProgress = (modId) => {
    if (!progress?.moduleProgress) return 0;
    return progress.moduleProgress.find(m => m.module_id === modId)?.percentage || 0;
  };

  // Calculate overall stats
  const totalLessons = modules.reduce((sum, m) => sum + (m.lesson_count || 0), 0);
  const completedLessons = progress?.progress?.filter(p => p.status === 'completed')?.length || 0;
  const overallPct = progress?.overallPercentage || 0;
  const totalTimeSpent = progress?.progress?.reduce((sum, p) => sum + (p.time_spent || 0), 0) || 0;
  const timeMinutes = Math.round(totalTimeSpent / 60);
  const modulesCompleted = modules.filter(m => getModProgress(m.id) === 100).length;

  // Continue learning target
  const continueTarget = getContinueTarget(modules, progress);

  if (!course) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <EcoIcon size={48} color="var(--interactive-primary)" style={{ animation: 'pulse 2s infinite' }} />
        <p style={{ marginTop: 'var(--spacing-05)', color: 'var(--text-tertiary)' }}>Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      {/* Progress Overview Header */}
      <div className="dash-header">
        <div>
          <div className="section-label">Your Progress</div>
          <h2 className="section-title">Learning Dashboard</h2>
          <p className="section-desc">Track your progress, see what you've completed, and continue where you left off.</p>
        </div>
        <div className="dash-header-right">
          {course?.version && <span className="dash-version-badge">v{course.version}</span>}
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            <InformationIcon size={16} />
            Course Overview
          </button>
        </div>
      </div>

      {/* Continue Learning Hero CTA */}
      <div className="dash-continue-hero" onClick={() => navigate(continueTarget.url)}>
        <div className="dash-continue-left">
          <div className="dash-continue-icon">
            {continueTarget.allComplete ? <TrophyIcon size={32} color="#fff" /> :
             continueTarget.hasStarted ? <PlayFilledIcon size={32} color="#fff" /> :
             <ArrowRightIcon size={32} color="#fff" />}
          </div>
          <div className="dash-continue-text">
            <h3 className="dash-continue-label">{continueTarget.label}</h3>
            <p className="dash-continue-module">
              {continueTarget.allComplete ? 'All modules completed — earn your certificate!' :
               continueTarget.moduleNum ? `Module ${continueTarget.moduleNum}: ${continueTarget.moduleName}` :
               continueTarget.moduleName}
              {continueTarget.pct > 0 && continueTarget.pct < 100 && ` — ${continueTarget.pct}% done`}
            </p>
          </div>
        </div>
        <div className="dash-continue-arrow">
          <ArrowRightIcon size={28} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card">
          <div className="dash-stat-value" style={{ color: 'var(--interactive-primary)' }}>{overallPct}%</div>
          <div className="dash-stat-label">Overall Progress</div>
          <div className="progress-bar-container" style={{ marginTop: 'var(--spacing-03)' }}>
            <div className="progress-bar-fill" style={{ width: `${overallPct}%`, background: overallPct === 100 ? 'var(--support-success)' : 'var(--interactive-primary)' }} />
          </div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-value">{completedLessons}<span className="dash-stat-of">/{totalLessons}</span></div>
          <div className="dash-stat-label">Lessons Completed</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-value">{modulesCompleted}<span className="dash-stat-of">/6</span></div>
          <div className="dash-stat-label">Modules Completed</div>
        </div>
        <div className="dash-stat-card">
          <div className="dash-stat-value">{timeMinutes}<span className="dash-stat-of">min</span></div>
          <div className="dash-stat-label">Time Invested</div>
        </div>
      </div>

      {/* Journey Map */}
      <div className="section-header">
        <div className="section-label">Your Learning Journey</div>
        <h2 className="section-title">Course Roadmap</h2>
        <p className="section-desc">Navigate through six comprehensive modules. Complete all and pass the final exam to earn your certification.</p>
      </div>
      <JourneyRoadmap modules={modules} getModProgress={getModProgress} navigate={navigate} />

      {/* Module Progress Cards — Dynamic with images */}
      <div className="section-header">
        <div className="section-label">Module Progress</div>
        <h2 className="section-title">Your Modules</h2>
      </div>
      <div className="module-wide-grid stagger-children">
        {modules.map((mod, i) => {
          const pct = getModProgress(mod.id);
          const IconComp = MODULE_ICONS[i + 1] || SproutIcon;
          const imgSrc = MODULE_IMAGES[i + 1];
          const lessonsDone = progress?.moduleProgress?.find(m => m.module_id === mod.id)?.completed || 0;
          const desc = MODULE_DESCRIPTIONS[i + 1] || mod.description;
          const topics = MODULE_TOPICS[i + 1] || [];
          return (
            <div key={mod.id} className="card module-wide-card" onClick={() => navigate(`/module/${mod.id}`)}>
              <div className="module-wide-image">
                <img src={imgSrc} alt={mod.title} className="module-wide-img" loading="lazy"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                <div className="module-wide-img-fallback" style={{ display: 'none' }}>
                  <IconComp size={40} color="var(--interactive-primary)" />
                </div>
                <div className="module-wide-accent" style={{ background: MODULE_COLORS[i + 1] }} />
              </div>
              <div className="module-wide-body">
                <div className="module-wide-header">
                  <div>
                    <div className="module-card-number">Module {mod.order_index}</div>
                    <h3 className="module-card-title">{mod.title}</h3>
                  </div>
                  <div className="module-wide-status">
                    {pct === 100 ? <><CheckmarkFilledIcon size={16} color="var(--support-success)" /> <span style={{ color: 'var(--support-success)', fontWeight: 600 }}>Done</span></> :
                     pct > 0 ? <span style={{ color: 'var(--interactive-primary)', fontWeight: 600 }}>In Progress</span> : <span style={{ color: 'var(--text-tertiary)' }}>Not Started</span>}
                  </div>
                </div>
                <p className="module-wide-desc">{desc}</p>
                <div className="module-wide-topics">
                  {topics.map((t, ti) => (
                    <span key={ti} className="module-wide-topic-tag">{t}</span>
                  ))}
                </div>
                <div style={{ marginBottom: 'var(--spacing-04)' }}>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--support-success)' : 'var(--interactive-primary)' }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-01)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{pct}% complete</span>
                    <span>{lessonsDone}/{mod.lesson_count} lessons</span>
                  </div>
                </div>
                <div className="module-card-meta">
                  <span><TimeIcon size={14} /> {mod.duration_minutes} min</span>
                  <span><CatalogIcon size={14} /> {mod.lesson_count} lessons</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-1 Conversations with Digital Experts */}
      <div className="section-header">
        <div className="section-label">AI-Powered Expert Conversations</div>
        <h2 className="section-title">Meet Our Digital Experts</h2>
        <p className="section-desc">
          Our five Learning Personas are <strong>AI-generated agents</strong>, each with a unique voice, accent, personality,
          and deep expertise aligned to their country and course topics. These agents are powered by OpenAI
          and respond in character based on their professional background.
          To chat with any expert, use the <strong>AI persona selector</strong> button at the bottom-right of your screen.
        </p>
      </div>
      <div className="expert-chat-grid">
        {PERSONA_CHAT_CONFIG.map((p, i) => (
          <ExpertInfoCard key={i} persona={p} />
        ))}
      </div>
    </div>
  );
}
