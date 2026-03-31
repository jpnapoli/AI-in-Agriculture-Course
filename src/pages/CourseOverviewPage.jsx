import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  SchoolIcon, CatalogIcon, TimeIcon, TrophyIcon,
  ArrowRightIcon, CheckmarkOutlineIcon, SproutIcon, SatelliteIcon, CropGrowthIcon,
  CloudIcon, DeliveryIcon, PartnershipIcon,
  ChevronDownIcon, ChevronUpIcon, LaunchIcon,
  CheckmarkFilledIcon, CertificateIcon,
  ChevronLeftIcon, ChevronRightIcon, LocationIcon,
  AiModelIcon, WatsonIcon, GameControllerIcon,
  TerminalIcon, PlayFilledIcon,
} from '../components/CarbonIcons';

const BENCHMARK_UNIVERSITIES = [
  {
    name: 'Wageningen University & Research', country: 'Netherlands', flag: '🇳🇱',
    focus: 'Digital Agriculture & Precision Farming', match: 92,
    url: 'https://www.wur.nl/en/education/master',
    courses: [
      { name: 'Digital Agriculture', maps: [1, 2] },
      { name: 'Precision Farming & Sensor Technology', maps: [2, 3] },
      { name: 'Remote Sensing for Agriculture', maps: [2] },
      { name: 'Climate-Smart Agriculture', maps: [4] },
    ],
    explanation: 'Wageningen scores 92% because our curriculum covers all four of their core digital agriculture themes — AI foundations, sensor-based monitoring, crop analytics, and climate resilience — and adds supply-chain and future-of-work modules they offer as electives.',
  },
  {
    name: 'Cornell University', country: 'USA', flag: '🇺🇸',
    focus: 'Agricultural Data Science & IoT', match: 88,
    url: 'https://cals.cornell.edu/education/degrees/agricultural-sciences-ms-phd',
    courses: [
      { name: 'Intro to Agricultural Data Science', maps: [1] },
      { name: 'IoT for Agriculture', maps: [2] },
      { name: 'Machine Learning for Crop Prediction', maps: [3] },
      { name: 'Food Supply Chain Management', maps: [5] },
    ],
    explanation: 'Cornell scores 88% as we align with their data-science, IoT and supply-chain coursework. The gap is in advanced statistical modeling labs which they deliver in semester-long practicum format.',
  },
  {
    name: 'UC Davis', country: 'USA', flag: '🇺🇸',
    focus: 'Plant Sciences & AI Applications', match: 85,
    url: 'https://www.ucdavis.edu/majors/agricultural-and-environmental-technology',
    courses: [
      { name: 'AI in Plant Pathology', maps: [3] },
      { name: 'Environmental Sensing', maps: [2, 4] },
      { name: 'Sustainable Food Systems', maps: [4, 5] },
    ],
    explanation: 'UC Davis scores 85% based on overlap in plant-science AI, environmental sensing, and sustainability content. Their curriculum has deeper wet-lab biology components that our course does not replicate.',
  },
  {
    name: 'ETH Zurich', country: 'Switzerland', flag: '🇨🇭',
    focus: 'Agricultural Engineering & Robotics', match: 82,
    url: 'https://ethz.ch/en/studies/master/degree-programmes/system-oriented-natural-sciences/agricultural-sciences.html',
    courses: [
      { name: 'Autonomous Systems in Agriculture', maps: [2, 6] },
      { name: 'Data-Driven Crop Management', maps: [3] },
      { name: 'Climate Modeling for Agriculture', maps: [4] },
    ],
    explanation: 'ETH scores 82% with strong alignment in autonomy, data-driven crop management, and climate modeling. Their emphasis on mechanical robotics and hardware engineering goes beyond our AI-software focus.',
  },
  {
    name: 'University of Reading', country: 'UK', flag: '🇬🇧',
    focus: 'Climate-Smart Agriculture', match: 80,
    url: 'https://www.reading.ac.uk/modules/documents?acyear=2026%2f7&modcode=AD3ATC&schoolcode=APD',
    courses: [
      { name: 'Climate and Food Security', maps: [4] },
      { name: 'Agricultural Technology & Innovation', maps: [1, 6] },
      { name: 'Precision Agriculture', maps: [2, 3] },
    ],
    explanation: 'Reading scores 80% reflecting strong alignment in climate-smart agriculture and precision farming. Their broader policy and development economics modules are outside our scope.',
  },
];

const MODULE_LABELS = [
  'The AI Agriculture Revolution',
  'Sensing the Field',
  'AI-Powered Crop Management',
  'Climate Resilience',
  'Supply Chain Intelligence',
  'The Human-AI Future',
];

const LEARNING_OUTCOMES = [
  { title: 'Understand the AI Agriculture Landscape', desc: 'Map the current state of AI adoption across global agriculture, from precision farming to supply chain intelligence.', Icon: SproutIcon },
  { title: 'Evaluate IoT & Sensing Technologies', desc: 'Assess and recommend IoT sensor deployments, drone imaging systems, and satellite data pipelines for diverse farming contexts.', Icon: SatelliteIcon },
  { title: 'Apply AI to Crop Management', desc: 'Deploy computer vision, predictive analytics, and precision planting models to optimize yield and reduce waste.', Icon: CropGrowthIcon },
  { title: 'Build Climate-Resilient Systems', desc: 'Design AI-powered climate adaptation strategies including flood forecasting, drought management, and weather modeling.', Icon: CloudIcon },
  { title: 'Optimize Agricultural Supply Chains', desc: 'Implement demand forecasting, food safety AI, and cold chain intelligence for reduced waste and better distribution.', Icon: DeliveryIcon },
  { title: 'Lead Human-AI Partnership', desc: 'Navigate ethical considerations, organizational readiness, and the future of human-AI augmentation in agriculture.', Icon: PartnershipIcon },
];

const KEY_SKILLS = [
  { skill: 'AI Needs Assessment', category: 'Strategy', desc: 'Evaluate where AI adds the most value in agricultural operations' },
  { skill: 'Data Pipeline Design', category: 'Technical', desc: 'Architect sensor-to-insight data flows for farm environments' },
  { skill: 'Computer Vision Application', category: 'Technical', desc: 'Apply image recognition to crop disease, weed, and yield estimation' },
  { skill: 'Predictive Modeling', category: 'Technical', desc: 'Build and interpret weather, yield, and demand prediction models' },
  { skill: 'IoT Deployment Planning', category: 'Implementation', desc: 'Select, deploy, and manage agricultural IoT sensor networks' },
  { skill: 'Climate Risk Analysis', category: 'Analysis', desc: 'Assess and mitigate climate-related agricultural risks using AI' },
  { skill: 'Supply Chain Intelligence', category: 'Operations', desc: 'Optimize food logistics and reduce post-harvest losses' },
  { skill: 'AI Ethics & Governance', category: 'Leadership', desc: 'Navigate bias, privacy, and fairness in agricultural AI systems' },
  { skill: 'Stakeholder Communication', category: 'Leadership', desc: 'Translate AI insights for farmers, agronomists, and executives' },
  { skill: 'Organizational Readiness', category: 'Strategy', desc: "Assess and improve an organization's AI adoption maturity" },
];

const COURSE_MODULES = [
  { num: 1, title: 'The AI Agriculture Revolution', lessons: 6, duration: '45 min', color: '#198038', topics: ['4th Agricultural Revolution', 'Global adoption patterns', 'Value chain analysis'] },
  { num: 2, title: 'Sensing the Field', lessons: 6, duration: '55 min', color: '#0043ce', topics: ['IoT sensors & edge computing', 'Drone & satellite imaging', 'Data quality & preprocessing'] },
  { num: 3, title: 'AI-Powered Crop Management', lessons: 6, duration: '50 min', color: '#8a3ffc', topics: ['Computer vision for crops', 'Precision planting & irrigation', 'Yield prediction'] },
  { num: 4, title: 'Climate Resilience', lessons: 6, duration: '50 min', color: '#007d79', topics: ['Weather forecasting AI', 'Drought & flood systems', 'Climate adaptation strategies'] },
  { num: 5, title: 'Supply Chain Intelligence', lessons: 6, duration: '50 min', color: '#f1c21b', topics: ['Demand forecasting', 'Cold chain monitoring', 'Waste reduction systems'] },
  { num: 6, title: 'The Human-AI Future', lessons: 6, duration: '50 min', color: '#ee5396', topics: ['AI ethics in agriculture', 'Organizational readiness', 'Future workforce models'] },
];

const SKILL_CATEGORIES = {
  'Strategy': '#0f62fe', 'Technical': '#8a3ffc', 'Implementation': '#198038',
  'Analysis': '#007d79', 'Operations': '#f1c21b', 'Leadership': '#ee5396',
};

// ── Spider / Diamond Skill Profile Data ──
const SKILL_AXES = [
  {
    axis: 'Corporations',
    angle: 270, // top
    skills: [
      { skill: 'AI Needs Assessment', level: 85, module: 1, topics: ['4th Agricultural Revolution', 'Value chain analysis', 'AI readiness evaluation'] },
      { skill: 'Supply Chain Intelligence', level: 78, module: 5, topics: ['Demand forecasting', 'Cold chain monitoring', 'Logistics optimization'] },
      { skill: 'Organizational Readiness', level: 72, module: 6, topics: ['AI adoption maturity', 'Change management', 'ROI frameworks'] },
    ],
  },
  {
    axis: 'Leadership',
    angle: 0, // right
    skills: [
      { skill: 'AI Ethics & Governance', level: 90, module: 6, topics: ['Bias mitigation', 'Privacy in agriculture', 'Fairness frameworks'] },
      { skill: 'Stakeholder Communication', level: 82, module: 6, topics: ['Translating AI insights', 'Farmer engagement', 'Executive reporting'] },
      { skill: 'Climate Risk Analysis', level: 76, module: 4, topics: ['Climate modeling', 'Adaptation planning', 'Risk communication'] },
    ],
  },
  {
    axis: 'Implementation',
    angle: 90, // bottom
    skills: [
      { skill: 'IoT Deployment Planning', level: 88, module: 2, topics: ['Sensor selection', 'Network architecture', 'Edge computing'] },
      { skill: 'Data Pipeline Design', level: 84, module: 2, topics: ['Sensor-to-insight flows', 'Data preprocessing', 'Real-time pipelines'] },
      { skill: 'Computer Vision Application', level: 80, module: 3, topics: ['Crop disease detection', 'Weed identification', 'Yield estimation'] },
    ],
  },
  {
    axis: 'Strategy',
    angle: 180, // left
    skills: [
      { skill: 'Predictive Modeling', level: 86, module: 3, topics: ['Weather prediction', 'Yield forecasting', 'Demand modeling'] },
      { skill: 'AI Needs Assessment', level: 85, module: 1, topics: ['Value chain mapping', 'Opportunity scoring', 'Technology selection'] },
      { skill: 'Climate Risk Analysis', level: 76, module: 4, topics: ['Drought prediction', 'Flood management', 'Carbon optimization'] },
    ],
  },
];

const AXIS_COLORS = {
  'Corporations': '#f1c21b',
  'Leadership': '#ee5396',
  'Implementation': '#198038',
  'Strategy': '#0f62fe',
};

const MODULE_COLORS = {
  1: '#198038', 2: '#0043ce', 3: '#8a3ffc',
  4: '#007d79', 5: '#f1c21b', 6: '#ee5396',
};

const PERSONA_PHOTOS = {
  'Amara Johnson': '/images/persona-amara.png',
  'Carlos Mendoza': '/images/persona-carlos.png',
  'Dr. Fatima Okafor': '/images/persona-fatima.png',
  'Khalid Al-Rashidi': '/images/persona-khalid.png',
  'Rajan Patel': '/images/persona-rajan.png',
};

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

// ── Interactive Spider / Diamond Skill Profile ──
function SkillSpiderChart() {
  const [activeAxis, setActiveAxis] = useState(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const svgRef = useRef(null);

  const cx = 200, cy = 200, maxR = 140;
  const axes = SKILL_AXES;

  // Calculate average level per axis for the spider shape
  const axisLevels = axes.map(a => {
    const avg = a.skills.reduce((s, sk) => s + sk.level, 0) / a.skills.length;
    return avg / 100; // normalize 0-1
  });

  // Generate polygon points for the spider shape
  const getPoint = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  // Background grid rings
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Spider polygon points
  const spiderPoints = axes.map((a, i) => {
    const pt = getPoint(a.angle, maxR * axisLevels[i]);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  // Background diamond
  const bgPoints = axes.map(a => {
    const pt = getPoint(a.angle, maxR);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const handleAxisClick = (axisName) => {
    if (activeAxis === axisName) {
      setActiveAxis(null);
      setActiveSkill(null);
    } else {
      setActiveAxis(axisName);
      setActiveSkill(null);
    }
  };

  const handleSkillClick = (skill) => {
    setActiveSkill(activeSkill?.skill === skill.skill ? null : skill);
  };

  const activeAxisData = axes.find(a => a.axis === activeAxis);

  return (
    <div className="spider-chart-container">
      <div className="spider-chart-visual">
        {/* Persona avatar in center */}
        <div className="spider-center-avatar">
          <img src="/images/persona-khalid.png" alt="AI Agriculture Practitioner" className="spider-center-img" />
        </div>
        <svg ref={svgRef} viewBox="0 0 400 400" className="spider-svg">
          {/* Background grid */}
          {rings.map((r, i) => (
            <polygon key={i}
              points={axes.map(a => { const pt = getPoint(a.angle, maxR * r); return `${pt.x},${pt.y}`; }).join(' ')}
              fill="none" stroke="var(--border-subtle)" strokeWidth={i === rings.length - 1 ? 1.5 : 0.5}
              strokeDasharray={i < rings.length - 1 ? '4 4' : 'none'}
              opacity={0.6}
            />
          ))}

          {/* Axis lines */}
          {axes.map((a, i) => {
            const end = getPoint(a.angle, maxR + 10);
            return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
              stroke={activeAxis === a.axis ? AXIS_COLORS[a.axis] : 'var(--border-strong)'}
              strokeWidth={activeAxis === a.axis ? 2 : 1} opacity={0.7} />;
          })}

          {/* Spider shape (filled area) */}
          <polygon points={spiderPoints}
            fill="var(--interactive-primary)" fillOpacity={0.12}
            stroke="var(--interactive-primary)" strokeWidth={2}
          />

          {/* Data points on spider */}
          {axes.map((a, i) => {
            const pt = getPoint(a.angle, maxR * axisLevels[i]);
            const isActive = activeAxis === a.axis;
            return (
              <circle key={i} cx={pt.x} cy={pt.y} r={isActive ? 7 : 5}
                fill={isActive ? AXIS_COLORS[a.axis] : 'var(--interactive-primary)'}
                stroke="var(--bg-primary)" strokeWidth={2}
                style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                onClick={() => handleAxisClick(a.axis)}
              />
            );
          })}

          {/* Axis labels */}
          {axes.map((a, i) => {
            const labelPt = getPoint(a.angle, maxR + 30);
            const isActive = activeAxis === a.axis;
            return (
              <g key={`label-${i}`} style={{ cursor: 'pointer' }} onClick={() => handleAxisClick(a.axis)}>
                <text x={labelPt.x} y={labelPt.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? AXIS_COLORS[a.axis] : 'var(--text-primary)'}
                  fontSize={isActive ? 13 : 12}
                  fontWeight={isActive ? 700 : 600}
                  fontFamily="var(--font-sans)"
                >
                  {a.axis}
                </text>
                <text x={labelPt.x} y={labelPt.y + 16}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="var(--text-tertiary)" fontSize={10}
                  fontFamily="var(--font-mono)"
                >
                  {Math.round(axisLevels[i] * 100)}%
                </text>
              </g>
            );
          })}

          {/* Ring labels */}
          {rings.map((r, i) => (
            <text key={`ring-${i}`} x={cx + 4} y={cy - maxR * r - 4}
              fill="var(--text-tertiary)" fontSize={9} fontFamily="var(--font-mono)">
              {Math.round(r * 100)}%
            </text>
          ))}
        </svg>
      </div>

      {/* Skill detail panel */}
      <div className="spider-chart-detail">
        {!activeAxis && (
          <div className="spider-detail-prompt">
            <AiModelIcon size={32} color="var(--interactive-primary)" />
            <h4>Explore Your Skill Profile</h4>
            <p>Click any axis on the diamond chart to explore the skills you will develop in that dimension.</p>
            <div className="spider-axis-pills">
              {axes.map(a => (
                <button key={a.axis} className="spider-axis-pill"
                  style={{ borderColor: AXIS_COLORS[a.axis], color: AXIS_COLORS[a.axis] }}
                  onClick={() => handleAxisClick(a.axis)}>
                  {a.axis}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeAxisData && (
          <div className="spider-detail-panel" key={activeAxis}>
            <div className="spider-detail-header">
              <div className="spider-detail-axis-badge" style={{ borderColor: AXIS_COLORS[activeAxis], color: AXIS_COLORS[activeAxis] }}>
                {activeAxis}
              </div>
              <div className="spider-detail-avg">
                {Math.round(axisLevels[axes.indexOf(activeAxisData)] * 100)}% proficiency
              </div>
            </div>

            <div className="spider-skills-list">
              {activeAxisData.skills.map((sk, i) => (
                <div key={i} className={`spider-skill-item ${activeSkill?.skill === sk.skill ? 'active' : ''}`}
                  onClick={() => handleSkillClick(sk)}>
                  <div className="spider-skill-row">
                    <span className="spider-skill-name">{sk.skill}</span>
                    <span className="spider-skill-level" style={{ color: AXIS_COLORS[activeAxis] }}>{sk.level}%</span>
                  </div>
                  <div className="spider-skill-bar">
                    <div className="spider-skill-bar-fill" style={{ width: `${sk.level}%`, background: AXIS_COLORS[activeAxis] }} />
                  </div>

                  {activeSkill?.skill === sk.skill && (
                    <div className="spider-skill-expanded">
                      <div className="spider-skill-module">
                        <span className="spider-skill-module-tag" style={{ borderColor: MODULE_COLORS[sk.module], color: MODULE_COLORS[sk.module] }}>
                          Module {sk.module}: {MODULE_LABELS[sk.module - 1]}
                        </span>
                      </div>
                      <div className="spider-skill-topics">
                        <span className="spider-skill-topics-label">Topics covered:</span>
                        {sk.topics.map((t, ti) => (
                          <span key={ti} className="spider-skill-topic-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Persona Showcase with photo-based horizontal cards ──
function PersonaShowcase() {
  const [current, setCurrent] = useState(0);
  const p = PERSONAS[current];
  const photoSrc = PERSONA_PHOTOS[p.name];
  return (
    <div className="persona-showcase">
      <div className="persona-hz-card">
        {/* Left: Photo segment */}
        <div className="persona-hz-photo" style={{ borderRight: `4px solid ${p.color}` }}>
          <img
            src={photoSrc}
            alt={p.name}
            className="persona-hz-photo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="persona-hz-photo-fallback" style={{ display: 'none', background: p.color }}>
            {p.initial}
          </div>
          <div className="persona-hz-photo-overlay">
            <h3 className="persona-hz-name">{p.name}</h3>
            <div className="persona-hz-role" style={{ color: p.color }}>{p.role}</div>
            <div className="persona-hz-location"><LocationIcon size={12} /> {p.location}</div>
          </div>
        </div>

        {/* Right: Details segment */}
        <div className="persona-hz-details">
          <div className="persona-hz-industry">{p.industry}</div>
          <p className="persona-hz-bio">{p.bio}</p>

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

export default function CourseOverviewPage() {
  const navigate = useNavigate();
  const { progress } = useContext(AppContext);
  const [expandedUni, setExpandedUni] = useState(null);

  const toggleUni = (i) => setExpandedUni(expandedUni === i ? null : i);

  return (
    <div className="main-content">
      {/* Hero with background image */}
      <div className="co-hero-image">
        <img src="/images/hero-agriculture-ai.jpg" alt="Drone technology in agriculture" className="co-hero-image-bg" />
        <div className="co-hero-image-overlay" />
        <div className="co-hero-image-content">
          <div className="co-hero-badge">
            <CheckmarkOutlineIcon size={14} />
            University-Benchmarked Curriculum
          </div>
          <h1 className="co-hero-image-title">
            <strong>AI</strong> in Agriculture:<br />From Field to <strong>Future</strong>
          </h1>
          <p className="co-hero-image-subtitle">
            A comprehensive, practitioner-focused curriculum designed to transform agricultural professionals
            into AI-augmented decision makers. Benchmarked against leading university programs worldwide.
          </p>
          <div className="co-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              <ArrowRightIcon size={18} />
              Start Learning
            </button>
          </div>
        </div>
      </div>

      {/* Course Structure */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Curriculum</div>
          <h2 className="section-title">Course Structure</h2>
          <p className="section-desc">
            Six carefully sequenced modules take you from foundational concepts to advanced AI applications,
            culminating in a comprehensive final examination.
          </p>
        </div>
        <div className="co-modules-list">
          {COURSE_MODULES.map((mod) => (
            <div key={mod.num} className="co-module-row"
              onClick={() => navigate(`/module/mod-${mod.num}-${['revolution','sensing','crop-mgmt','climate','supply-chain','future'][mod.num - 1]}`)}
            >
              <div className="co-module-num" style={{ background: '#393939' }}>{mod.num}</div>
              <div className="co-module-info">
                <h4 className="co-module-title">{mod.title}</h4>
                <div className="co-module-meta">
                  <span><CatalogIcon size={14} /> {mod.lessons} lessons</span>
                  <span><TimeIcon size={14} /> {mod.duration}</span>
                </div>
                <div className="co-module-topics">
                  {mod.topics.map((t, ti) => (
                    <span key={ti} className="co-module-topic-tag">{t}</span>
                  ))}
                </div>
              </div>
              <ArrowRightIcon size={20} color="var(--text-tertiary)" className="co-module-arrow" />
            </div>
          ))}
          {/* Final Exam */}
          <div className="co-module-row co-module-exam" onClick={() => navigate('/exam')}>
            <div className="co-module-num" style={{ background: '#393939' }}>
              <TrophyIcon size={18} color="#fff" />
            </div>
            <div className="co-module-info">
              <h4 className="co-module-title">Final Examination</h4>
              <div className="co-module-meta">
                <span><CertificateIcon size={14} /> 10 questions</span>
                <span><TimeIcon size={14} /> 30 min</span>
                <span><CheckmarkOutlineIcon size={14} /> 70% to pass</span>
              </div>
            </div>
            <ArrowRightIcon size={20} color="var(--text-tertiary)" className="co-module-arrow" />
          </div>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Outcomes</div>
          <h2 className="section-title">Learning Outcomes</h2>
          <p className="section-desc">
            By the end of this course, you will be able to confidently apply AI thinking to real agricultural challenges.
          </p>
        </div>
        <div className="co-outcomes-grid">
          {LEARNING_OUTCOMES.map((lo, i) => (
            <div key={i} className="co-outcome-card">
              <div className="co-outcome-icon">
                <lo.Icon size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{lo.title}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{lo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Skills — Interactive Spider / Diamond Chart */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Competencies</div>
          <h2 className="section-title">Key Skills You Will Gain</h2>
          <p className="section-desc">
            Explore the four dimensions of your AI Agriculture Practitioner skill profile.
            Click any axis to dive into detailed skill breakdowns.
          </p>
        </div>
        <SkillSpiderChart />
      </div>

      {/* University Benchmark */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Credibility</div>
          <h2 className="section-title">University Benchmark Review</h2>
          <p className="section-desc">
            Our curriculum has been comprehensively benchmarked against leading university courses in agricultural AI
            and precision farming to ensure world-class quality and relevance.
          </p>
        </div>

        {/* Explanation of percentages */}
        <div className="co-benchmark-explainer">
          <CheckmarkOutlineIcon size={16} color="var(--interactive-primary)" />
          <p>
            <strong>How we calculate match percentages:</strong> Each university's relevant courses are mapped
            topic-by-topic to our six modules. The percentage reflects how many of their core learning objectives
            are covered by our curriculum. Click any university to see the detailed mapping.
          </p>
        </div>

        <div className="co-benchmark-list">
          {BENCHMARK_UNIVERSITIES.map((u, i) => (
            <div key={i} className="co-benchmark-item">
              <div className="co-benchmark-row-v2" onClick={() => toggleUni(i)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleUni(i)}>
                <div className="co-benchmark-left">
                  <SchoolIcon size={20} color="var(--interactive-primary)" />
                  <div>
                    <div className="co-benchmark-name">
                      {u.flag} {u.name}
                    </div>
                    <div className="co-benchmark-focus">{u.focus} &middot; {u.country}</div>
                  </div>
                </div>
                <div className="co-benchmark-right">
                  <div className="co-benchmark-bar-v2">
                    <div className="co-benchmark-bar-fill-v2" style={{ width: `${u.match}%` }} />
                  </div>
                  <span className="co-benchmark-pct-v2">{u.match}%</span>
                  {expandedUni === i ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                </div>
              </div>

              {expandedUni === i && (
                <div className="co-benchmark-detail">
                  <p className="co-benchmark-explanation">{u.explanation}</p>
                  <div className="co-benchmark-courses">
                    <h5 className="co-benchmark-courses-title">Course Mapping</h5>
                    {u.courses.map((c, ci) => (
                      <div key={ci} className="co-benchmark-course-row">
                        <span className="co-benchmark-course-name">{c.name}</span>
                        <span className="co-benchmark-course-arrow"><ArrowRightIcon size={14} /></span>
                        <span className="co-benchmark-course-maps">
                          {c.maps.map(m => (
                            <span key={m} className="co-benchmark-module-tag"
                              style={{ borderColor: COURSE_MODULES[m-1].color, color: COURSE_MODULES[m-1].color }}>
                              M{m}: {MODULE_LABELS[m-1]}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a href={u.url} target="_blank" rel="noopener noreferrer" className="co-benchmark-link">
                    <LaunchIcon size={14} />
                    View {u.name} program details
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Personas — Photo-based horizontal cards */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Meet Your Guides</div>
          <h2 className="section-title">Learning Personas</h2>
          <p className="section-desc">Follow five agricultural professionals from different countries and industries as they discover how AI transforms their work.</p>
        </div>
        <PersonaShowcase />
      </div>

      {/* Course Tools — Interactive Learning Features (moved from Dashboard) */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Course Tools</div>
          <h2 className="section-title">Interactive Learning Features</h2>
          <p className="section-desc">
            Engage with cutting-edge tools designed to deepen your understanding and make learning practical.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 'var(--spacing-06)', marginBottom: 'var(--spacing-09)' }}>
          {[
            { Icon: WatsonIcon, title: 'Noor AI Assistant', desc: 'Chat with Noor to dive deeper into topics, ask questions, or generate study materials.' },
            { Icon: GameControllerIcon, title: 'Mini-Games', desc: 'Gamified activities \u2014 from piloting drones to diagnosing crop diseases.' },
            { Icon: AiModelIcon, title: 'Scenario Checkpoints', desc: 'Apply AI to real agricultural challenges in use-case-based assessments.' },
            { Icon: TerminalIcon, title: 'AI Prompts to Try', desc: 'Real prompts you can test on ChatGPT, Perplexity, and other platforms.' },
            { Icon: PlayFilledIcon, title: 'Curated Videos', desc: 'Expert interviews from IBM researchers, professors, and industry leaders.' },
            { Icon: TrophyIcon, title: 'Graduation Badge', desc: 'Complete the course and pass the exam to earn a digital credential.' }
          ].map(f => (
            <div key={f.title} className="feature-card">
              <f.Icon size={32} color="var(--interactive-primary)" style={{ marginBottom: 'var(--spacing-04)', display: 'block' }} />
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-03)', fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="co-cta">
        <h2 style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: 'var(--spacing-03)' }}>Ready to Begin?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-06)', maxWidth: 480, margin: '0 auto var(--spacing-06)' }}>
          Start your journey to becoming an AI Agriculture Practitioner today.
        </p>
        <div style={{ display: 'flex', gap: 'var(--spacing-04)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            <ArrowRightIcon size={18} />
            Go to Dashboard
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/exam')}>
            <CertificateIcon size={18} />
            Take Final Exam
          </button>
        </div>
      </div>
    </div>
  );
}
