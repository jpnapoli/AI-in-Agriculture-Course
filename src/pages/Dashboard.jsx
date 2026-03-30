import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const MODULE_ICONS = { 1: 'spa', 2: 'satellite_alt', 3: 'grass', 4: 'cloud', 5: 'local_shipping', 6: 'people' };
const MODULE_COLORS = { 1: '#198038', 2: '#0043ce', 3: '#8a3ffc', 4: '#007d79', 5: '#f1c21b', 6: '#ee5396' };

// Local persona images (served from public/images)
const PERSONA_IMAGES = {
  amara: '/images/persona-amara.png',
  carlos: '/images/persona-carlos.png',
  fatima: '/images/persona-fatima.png',
  rajan: '/images/persona-rajan.png',
};

function SafeImage({ src, alt, className, style, fallbackIcon }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="img-fallback" style={{ ...style, borderRadius: style?.borderRadius }}>
        <span className="material-icons-round" style={{ fontSize: 40, opacity: 0.4 }}>{fallbackIcon || 'image'}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className={className} style={style} loading="lazy" onError={() => setError(true)} />;
}

// ============================================================
// Interactive Journey Roadmap Component
// ============================================================
function JourneyRoadmap({ modules, getModProgress, navigate }) {
  const [hoveredNode, setHoveredNode] = useState(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (mod, i, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
    setHoveredNode({ mod, index: i, pct: getModProgress(mod.id) });
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  return (
    <div className="roadmap-container">
      <div className="roadmap-track">
        {modules.map((mod, i) => {
          const pct = getModProgress(mod.id);
          const isCompleted = pct === 100;
          const isActive = pct > 0 && pct < 100;
          const nodeColor = isCompleted ? '#198038' : isActive ? '#0f62fe' : MODULE_COLORS[i + 1] || '#0f62fe';

          return (
            <React.Fragment key={mod.id}>
              {i > 0 && (
                <div className={`roadmap-connector ${isCompleted ? 'done' : isActive ? 'active' : ''}`} />
              )}
              <div
                className={`roadmap-node ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}
                onClick={() => navigate(`/module/${mod.id}`)}
                onMouseEnter={(e) => handleMouseEnter(mod, i, e)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="roadmap-step-number">{i + 1}</div>
                <div className="roadmap-circle" style={{ background: nodeColor }}>
                  {isCompleted ? (
                    <span className="material-icons-round" style={{ fontSize: 24, color: '#fff' }}>check</span>
                  ) : (
                    <span className="material-icons-round" style={{ fontSize: 24, color: '#fff' }}>{MODULE_ICONS[i + 1]}</span>
                  )}
                  {isActive && (
                    <svg className="roadmap-progress-ring" viewBox="0 0 60 60">
                      <circle cx="30" cy="30" r="27" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                      <circle cx="30" cy="30" r="27" fill="none" stroke="#fff" strokeWidth="3"
                        strokeDasharray={`${2 * Math.PI * 27}`}
                        strokeDashoffset={`${2 * Math.PI * 27 * (1 - pct / 100)}`}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                      />
                    </svg>
                  )}
                </div>
                <div className="roadmap-label">{mod.title}</div>
                {pct > 0 && <div className="roadmap-pct">{pct}%</div>}
              </div>
            </React.Fragment>
          );
        })}

        {/* Final Exam node */}
        <div className="roadmap-connector" />
        <div
          className="roadmap-node exam"
          onClick={() => navigate('/exam')}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setPopupPos({ x: rect.left + rect.width / 2, y: rect.top });
            setHoveredNode({ mod: { title: 'Final Exam', description: 'Complete all 6 modules and pass the final exam with 70% or higher to earn your AI in Agriculture certification badge.', duration_minutes: 30, lesson_count: 10 }, index: 6, pct: 0, isExam: true });
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="roadmap-step-number">7</div>
          <div className="roadmap-circle exam-circle">
            <span className="material-icons-round" style={{ fontSize: 24, color: '#fff' }}>emoji_events</span>
          </div>
          <div className="roadmap-label">Final Exam</div>
        </div>
      </div>

      {/* Hover popup overlay */}
      {hoveredNode && (
        <div className="roadmap-popup" style={{ animationName: 'roadmapPopIn' }}>
          <div className="roadmap-popup-arrow" />
          <div className="roadmap-popup-header">
            <span className="roadmap-popup-num">{hoveredNode.isExam ? 'Final' : `Module ${hoveredNode.index + 1}`}</span>
            <h4 className="roadmap-popup-title">{hoveredNode.mod.title}</h4>
          </div>
          <p className="roadmap-popup-desc">{hoveredNode.mod.description?.substring(0, 120)}...</p>
          <div className="roadmap-popup-meta">
            <span><span className="material-icons-round" style={{ fontSize: 14 }}>schedule</span> {hoveredNode.mod.duration_minutes} min</span>
            <span><span className="material-icons-round" style={{ fontSize: 14 }}>menu_book</span> {hoveredNode.mod.lesson_count} lessons</span>
            {hoveredNode.pct > 0 && <span className="roadmap-popup-progress">{hoveredNode.pct}% done</span>}
          </div>
          <div className="roadmap-popup-cta">
            <span className="material-icons-round" style={{ fontSize: 14 }}>arrow_forward</span>
            {hoveredNode.pct === 100 ? 'Review' : hoveredNode.pct > 0 ? 'Continue' : 'Start'}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const { progress, user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/course').then(r => r.json()).then(data => {
      setCourse(data.course);
      setModules(data.modules);
    }).catch(console.error);
  }, []);

  const getModProgress = (modId) => {
    if (!progress?.moduleProgress) return 0;
    const mp = progress.moduleProgress.find(m => m.module_id === modId);
    return mp?.percentage || 0;
  };

  if (!course) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--interactive-primary)', animation: 'pulse 2s infinite' }}>eco</span>
        <p style={{ marginTop: 16, color: 'var(--text-tertiary)' }}>Loading course...</p>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      {/* Hero */}
      <div className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(/images/hero-landing.png)` }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="material-icons-round" style={{ fontSize: 12 }}>verified</span>
            Benchmarked Against Top Universities
          </div>
          <h1 className="hero-title">
            <strong>AI</strong> in Agriculture:<br />
            From Field to <strong>Future</strong>
          </h1>
          <p className="hero-subtitle">{course.description?.substring(0, 200)}...</p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-value">5h</div><div className="hero-stat-label">Total Content</div></div>
            <div className="hero-stat"><div className="hero-stat-value">6</div><div className="hero-stat-label">Modules</div></div>
            <div className="hero-stat"><div className="hero-stat-value">36</div><div className="hero-stat-label">Lessons</div></div>
            <div className="hero-stat"><div className="hero-stat-value">{progress?.overallPercentage || 0}%</div><div className="hero-stat-label">Complete</div></div>
          </div>
        </div>
      </div>

      {/* Journey Map - High Contrast Interactive Roadmap */}
      <div className="section-header">
        <div className="section-label">Your Learning Journey</div>
        <h2 className="section-title">Course Roadmap</h2>
        <p className="section-desc">Navigate through six comprehensive modules, each building on the last. Complete all modules and pass the final exam to earn your certification.</p>
      </div>

      <JourneyRoadmap modules={modules} getModProgress={getModProgress} navigate={navigate} />

      {/* Benchmarking Banner */}
      <div className="benchmark-banner">
        <div style={{ fontSize: '0.75rem', color: 'var(--interactive-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8, fontWeight: 400 }}>Benchmarked Against</div>
        <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{course.benchmarked_from}</p>
        <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          {['Wageningen University', 'Cornell University', 'UC Davis', 'McKinsey & Company', 'IBM Research', 'Microsoft Research', 'Google AI'].map(org => (
            <span key={org} className="benchmark-tag">{org}</span>
          ))}
        </div>
      </div>

      {/* Module Cards */}
      <div className="section-header">
        <div className="section-label">Modules</div>
        <h2 className="section-title">Course Modules</h2>
      </div>

      <div className="module-grid stagger-children">
        {modules.map((mod, i) => {
          const pct = getModProgress(mod.id);
          return (
            <div key={mod.id} className="card module-card" onClick={() => navigate(`/module/${mod.id}`)}>
              <SafeImage className="module-card-image" src={mod.image_url} alt={mod.title} fallbackIcon="school" />
              <div className="module-card-accent" style={{ background: mod.color }} />
              <div className="module-card-body">
                <div className="module-card-number">Module {mod.order_index}</div>
                <h3 className="module-card-title">{mod.title}</h3>
                <p className="module-card-desc">{mod.description}</p>
                <div style={{ marginBottom: 12 }}>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: mod.color }} />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 400 }}>{pct}% complete</div>
                </div>
                <div className="module-card-meta">
                  <span><span className="material-icons-round" style={{ fontSize: 14 }}>schedule</span> {mod.duration_minutes} min</span>
                  <span><span className="material-icons-round" style={{ fontSize: 14 }}>menu_book</span> {mod.lesson_count} lessons</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Personas Section - Realistic AI-Generated People */}
      <div className="section-header" style={{ marginTop: 'var(--spacing-09)' }}>
        <div className="section-label">Meet Your Guides</div>
        <h2 className="section-title">Learning Personas</h2>
        <p className="section-desc">Throughout this course, you'll follow four agricultural professionals as they discover how AI transforms their work.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--spacing-06)', marginBottom: 'var(--spacing-09)' }}>
        {[
          { name: 'Amara Johnson', role: 'Wheat Farmer, Kansas', image: PERSONA_IMAGES.amara, color: '#f1c21b', desc: '3rd-generation farmer managing 2,000 acres. Tech-curious but values decades of farming intuition.' },
          { name: 'Carlos Mendoza', role: 'Coffee Farmer, Colombia', image: PERSONA_IMAGES.carlos, color: '#198038', desc: 'Progressive mid-size farmer embracing IoT sensors and drone technology for specialty coffee.' },
          { name: 'Dr. Fatima Okafor', role: 'Agronomist, Nigeria', image: PERSONA_IMAGES.fatima, color: '#0f62fe', desc: 'Advises 50 smallholder farms on sustainable practices using AI platforms and satellite monitoring.' },
          { name: 'Rajan Patel', role: 'Food Distributor, India', image: PERSONA_IMAGES.rajan, color: '#8a3ffc', desc: 'Manages perishable goods distribution. Uses AI demand forecasting to slash food waste.' }
        ].map(p => (
          <div key={p.name} className="persona-dashboard-card">
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
              <img
                src={p.image}
                alt={p.name}
                className="persona-dashboard-avatar"
                style={{ borderColor: p.color }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: p.color, display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: 'white', flexShrink: 0, border: `3px solid ${p.color}` }}>
                {p.name[0]}
              </div>
              <div>
                <div className="persona-dashboard-name">{p.name}</div>
                <div className="persona-dashboard-role" style={{ color: p.color }}>{p.role}</div>
              </div>
            </div>
            <p className="persona-dashboard-desc">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="section-header">
        <div className="section-label">Course Tools</div>
        <h2 className="section-title">Interactive Learning Features</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 'var(--spacing-06)', marginBottom: 'var(--spacing-09)' }}>
        {[
          { icon: 'smart_toy', title: 'Noor AI Assistant', desc: 'Chat with Noor anytime to dive deeper into topics, ask questions, or generate complementary materials.', color: '#0f62fe' },
          { icon: 'sports_esports', title: 'Mini-Games', desc: 'Engage with interactive games — from piloting drones to diagnosing crop diseases.', color: '#a56eff' },
          { icon: 'psychology', title: 'Scenario Checkpoints', desc: 'Use-case-based assessments where you apply AI to real agricultural challenges.', color: '#007d79' },
          { icon: 'terminal', title: 'AI Prompts to Try', desc: 'Real prompts you can test on OpenAI, Perplexity, and other platforms right now.', color: '#ee5396' },
          { icon: 'play_circle', title: 'Curated Videos', desc: 'Expert interviews from IBM researchers, university professors, and industry leaders.', color: '#da1e28' },
          { icon: 'emoji_events', title: 'Graduation Badge', desc: 'Complete the course and pass the final exam to earn a shareable digital credential.', color: '#f1c21b' }
        ].map(f => (
          <div key={f.title} className="feature-card">
            <span className="material-icons-round" style={{ fontSize: 32, color: f.color, marginBottom: 12, display: 'block' }}>{f.icon}</span>
            <h4 style={{ fontSize: '0.875rem', marginBottom: 8, fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</h4>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
