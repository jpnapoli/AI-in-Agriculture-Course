import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  CheckmarkFilledIcon, FlagIcon, SchoolIcon, TimeIcon,
  CatalogIcon, PlayIcon, EcoIcon, ArrowRightIcon,
  PlayFilledIcon, CertificateIcon, GameControllerIcon,
  EditIcon, DocumentIcon, CheckmarkIcon, SproutIcon,
  SatelliteIcon, CropGrowthIcon, CloudIcon, DeliveryIcon,
  PartnershipIcon, LaunchIcon, LocationIcon, AiModelIcon,
  BotIcon,
} from '../components/CarbonIcons';

const MODULE_ICONS_MAP = {
  'mod-1-revolution': SproutIcon,
  'mod-2-sensing': SatelliteIcon,
  'mod-3-crop-mgmt': CropGrowthIcon,
  'mod-4-climate': CloudIcon,
  'mod-5-supply-chain': DeliveryIcon,
  'mod-6-future': PartnershipIcon,
};

const LESSON_TYPE_ICONS = {
  lecture: CatalogIcon,
  video: PlayFilledIcon,
  checkpoint: CertificateIcon,
  game: GameControllerIcon,
  activity: EditIcon,
};

// Skills taught per module
const MODULE_SKILLS = {
  'mod-1-revolution': [
    { skill: 'AI Needs Assessment', level: 85, category: 'Strategy' },
    { skill: 'Stakeholder Communication', level: 70, category: 'Leadership' },
    { skill: 'Organizational Readiness', level: 65, category: 'Strategy' },
  ],
  'mod-2-sensing': [
    { skill: 'IoT Deployment Planning', level: 88, category: 'Implementation' },
    { skill: 'Data Pipeline Design', level: 84, category: 'Technical' },
    { skill: 'Computer Vision Application', level: 60, category: 'Technical' },
  ],
  'mod-3-crop-mgmt': [
    { skill: 'Computer Vision Application', level: 80, category: 'Technical' },
    { skill: 'Predictive Modeling', level: 86, category: 'Technical' },
    { skill: 'Data Pipeline Design', level: 72, category: 'Technical' },
  ],
  'mod-4-climate': [
    { skill: 'Climate Risk Analysis', level: 76, category: 'Analysis' },
    { skill: 'Predictive Modeling', level: 78, category: 'Technical' },
    { skill: 'AI Ethics & Governance', level: 65, category: 'Leadership' },
  ],
  'mod-5-supply-chain': [
    { skill: 'Supply Chain Intelligence', level: 78, category: 'Operations' },
    { skill: 'Predictive Modeling', level: 74, category: 'Technical' },
    { skill: 'AI Needs Assessment', level: 70, category: 'Strategy' },
  ],
  'mod-6-future': [
    { skill: 'AI Ethics & Governance', level: 90, category: 'Leadership' },
    { skill: 'Stakeholder Communication', level: 82, category: 'Leadership' },
    { skill: 'Organizational Readiness', level: 72, category: 'Strategy' },
  ],
};

const SKILL_COLORS = {
  Strategy: '#0f62fe', Technical: '#8a3ffc', Implementation: '#198038',
  Analysis: '#007d79', Operations: '#f1c21b', Leadership: '#ee5396',
};

// Personas featured per module
const MODULE_PERSONAS = {
  'mod-1-revolution': [
    { name: 'Amara Johnson', role: 'Wheat Farmer', location: 'Kansas, USA', color: '#198038', photo: '/images/persona-amara.png' },
  ],
  'mod-2-sensing': [
    { name: 'Khalid Al-Rashidi', role: 'AgriTech Director', location: 'Riyadh, Saudi Arabia', color: '#da1e28', photo: '/images/persona-khalid.png' },
    { name: 'Carlos Mendoza', role: 'Coffee Farmer', location: 'Huila, Colombia', color: '#0043ce', photo: '/images/persona-carlos.png' },
  ],
  'mod-3-crop-mgmt': [
    { name: 'Carlos Mendoza', role: 'Coffee Farmer', location: 'Huila, Colombia', color: '#0043ce', photo: '/images/persona-carlos.png' },
    { name: 'Dr. Fatima Okafor', role: 'Agronomist', location: 'Lagos, Nigeria', color: '#8a3ffc', photo: '/images/persona-fatima.png' },
  ],
  'mod-4-climate': [
    { name: 'Khalid Al-Rashidi', role: 'AgriTech Director', location: 'Riyadh, Saudi Arabia', color: '#da1e28', photo: '/images/persona-khalid.png' },
    { name: 'Dr. Fatima Okafor', role: 'Agronomist', location: 'Lagos, Nigeria', color: '#8a3ffc', photo: '/images/persona-fatima.png' },
  ],
  'mod-5-supply-chain': [
    { name: 'Rajan Patel', role: 'Food Distributor', location: 'Mumbai, India', color: '#007d79', photo: '/images/persona-rajan.png' },
  ],
  'mod-6-future': [
    { name: 'Rajan Patel', role: 'Food Distributor', location: 'Mumbai, India', color: '#007d79', photo: '/images/persona-rajan.png' },
  ],
};

export default function ModulePage() {
  const { moduleId } = useParams();
  const [mod, setMod] = useState(null);
  const [lessons, setLessons] = useState([]);
  const { progress } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/modules/${moduleId}`).then(r => r.json()).then(data => {
      setMod(data.module);
      setLessons(data.lessons);
    });
  }, [moduleId]);

  const getLessonStatus = (lessonId) => {
    if (!progress?.progress) return 'not_started';
    const p = progress.progress.find(pr => pr.lesson_id === lessonId);
    return p?.status || 'not_started';
  };

  // Calculate module-level progress
  const completedCount = lessons.filter(l => getLessonStatus(l.id) === 'completed').length;
  const modulePct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const skills = MODULE_SKILLS[moduleId] || [];
  const personas = MODULE_PERSONAS[moduleId] || [];

  if (!mod) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EcoIcon size={48} color="var(--interactive-primary)" style={{ animation: 'pulse 2s infinite' }} />
    </div>
  );

  return (
    <div className="main-content">
      {/* Module Hero */}
      <div className="module-hero-header">
        <div className="module-hero-icon-area">
          {(() => {
            const HeroIcon = MODULE_ICONS_MAP[moduleId] || SchoolIcon;
            return <HeroIcon size={48} color="var(--interactive-primary)" />;
          })()}
        </div>
        <div className="module-hero-text">
          <div style={{ fontSize: '0.75rem', color: 'var(--interactive-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--spacing-01)', fontWeight: 400 }}>Module {mod.order_index}</div>
          <h2>{mod.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 'var(--spacing-02)' }}>{mod.subtitle}</p>
        </div>
      </div>

      {/* Module Progress Bar */}
      <div className="module-progress-section">
        <div className="module-progress-header">
          <span className="module-progress-label">{completedCount} of {lessons.length} lessons completed</span>
          <span className="module-progress-pct">{modulePct}%</span>
        </div>
        <div className="module-progress-bar">
          <div className="module-progress-fill" style={{ width: `${modulePct}%`, background: modulePct === 100 ? 'var(--support-success)' : 'var(--interactive-primary)' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-07)' }}>
        {/* Main content */}
        <div>
          <p className="text-block">{mod.description}</p>

          {/* Learning Objectives */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', padding: 'var(--spacing-06)', marginBottom: 'var(--spacing-07)' }}>
            <h4 style={{ marginBottom: 'var(--spacing-04)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-03)', fontWeight: 600 }}>
              <FlagIcon size={20} color="var(--interactive-primary)" />
              Learning Objectives
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-03)' }}>
              {(mod.learning_objectives || []).map((obj, i) => (
                <li key={i} style={{ display: 'flex', gap: 'var(--spacing-03)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.43 }}>
                  <CheckmarkFilledIcon size={16} color="var(--support-success)" style={{ marginTop: 3, flexShrink: 0 }} />
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Skills You'll Acquire */}
          {skills.length > 0 && (
            <div className="mod-highlight-section">
              <h4 className="mod-highlight-title">
                <AiModelIcon size={20} color="var(--interactive-primary)" />
                Key Skills You'll Acquire
              </h4>
              <div className="mod-skills-list">
                {skills.map((sk, i) => (
                  <div key={i} className="mod-skill-item">
                    <div className="mod-skill-header">
                      <span className="mod-skill-name">{sk.skill}</span>
                      <span className="mod-skill-category" style={{ borderColor: SKILL_COLORS[sk.category], color: SKILL_COLORS[sk.category] }}>{sk.category}</span>
                    </div>
                    <div className="mod-skill-bar">
                      <div className="mod-skill-bar-fill" style={{ width: `${sk.level}%`, background: SKILL_COLORS[sk.category] }} />
                    </div>
                    <div className="mod-skill-level">{sk.level}% proficiency target</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Personas You'll Meet */}
          {personas.length > 0 && (
            <div className="mod-highlight-section">
              <h4 className="mod-highlight-title">
                <BotIcon size={20} color="var(--interactive-primary)" />
                Personas You'll Meet
              </h4>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: 'var(--spacing-04)', lineHeight: 1.5 }}>
                These learning agents guide you through real-world scenarios in this module.
              </p>
              <div className="mod-personas-list">
                {personas.map((p, i) => (
                  <div key={i} className="mod-persona-chip" style={{ borderColor: p.color }}>
                    <div className="mod-persona-avatar">
                      <img src={p.photo} alt={p.name} className="mod-persona-avatar-img"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <div className="mod-persona-avatar-fallback" style={{ display: 'none', background: p.color }}>
                        {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    </div>
                    <div className="mod-persona-info">
                      <div className="mod-persona-name">{p.name}</div>
                      <div className="mod-persona-role" style={{ color: p.color }}>{p.role}</div>
                      <div className="mod-persona-location"><LocationIcon size={10} /> {p.location}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benchmarking */}
          {mod.benchmarked_university && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: 'var(--spacing-04) var(--spacing-05)', marginBottom: 'var(--spacing-07)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-03)' }}>
              <SchoolIcon size={14} />
              <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Benchmarked:</strong> {mod.benchmarked_university}
            </div>
          )}
        </div>

        {/* Lesson List Sidebar */}
        <div>
          <h4 style={{ marginBottom: 'var(--spacing-05)', fontWeight: 600 }}>Lessons</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-03)' }}>
            {lessons.map((les, i) => {
              const status = getLessonStatus(les.id);
              const IconComp = status === 'completed' ? CheckmarkFilledIcon : (LESSON_TYPE_ICONS[les.type] || DocumentIcon);
              const iconColor = status === 'completed' ? 'var(--support-success)' : 'var(--text-tertiary)';
              return (
                <div key={les.id} onClick={() => navigate(`/lesson/${les.id}`)}
                  className="card" style={{ padding: 'var(--spacing-04) var(--spacing-05)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 'var(--spacing-04)', borderLeft: `3px solid ${status === 'completed' ? 'var(--support-success)' : status === 'in_progress' ? 'var(--interactive-primary)' : 'transparent'}` }}>
                  <IconComp size={20} color={iconColor} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{les.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', gap: 'var(--spacing-03)', fontWeight: 400 }}>
                      <span style={{ textTransform: 'capitalize' }}>{les.type}</span>
                      <span>·</span>
                      <span>{les.duration_minutes} min</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 'var(--spacing-06)', justifyContent: 'center' }}
            onClick={() => {
              const first = lessons.find(l => getLessonStatus(l.id) !== 'completed') || lessons[0];
              if (first) navigate(`/lesson/${first.id}`);
            }}>
            <PlayIcon size={18} />
            {lessons.some(l => getLessonStatus(l.id) === 'in_progress') ? 'Continue Learning' : 'Start Module'}
          </button>
        </div>
      </div>
    </div>
  );
}
