import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const BENCHMARK_UNIVERSITIES = [
  { name: 'Wageningen University & Research', country: 'Netherlands', focus: 'Digital Agriculture & Precision Farming', match: 92 },
  { name: 'Cornell University', country: 'USA', focus: 'Agricultural Data Science & IoT', match: 88 },
  { name: 'UC Davis', country: 'USA', focus: 'Plant Sciences & AI Applications', match: 85 },
  { name: 'ETH Zurich', country: 'Switzerland', focus: 'Agricultural Engineering & Robotics', match: 82 },
  { name: 'University of Reading', country: 'UK', focus: 'Climate-Smart Agriculture', match: 80 },
];

const INDUSTRY_SOURCES = [
  { name: 'McKinsey & Company', contribution: 'AI value framework, 7 pillars of AI readiness, $250B market estimate' },
  { name: 'IBM Research', contribution: 'Watson Decision Platform, Liquid Prep, enterprise AI deployment' },
  { name: 'Microsoft Research', contribution: 'FarmBeats, edge computing, connectivity solutions' },
  { name: 'Google AI', contribution: 'Flood forecasting, satellite imagery analysis, TensorFlow applications' },
  { name: 'FAO (United Nations)', contribution: 'Global food security data, sustainable development goals alignment' },
];

const LEARNING_OUTCOMES = [
  { title: 'Understand the AI Agriculture Landscape', desc: 'Map the current state of AI adoption across global agriculture, from precision farming to supply chain intelligence.', icon: 'landscape' },
  { title: 'Evaluate IoT & Sensing Technologies', desc: 'Assess and recommend IoT sensor deployments, drone imaging systems, and satellite data pipelines for diverse farming contexts.', icon: 'sensors' },
  { title: 'Apply AI to Crop Management', desc: 'Deploy computer vision, predictive analytics, and precision planting models to optimize yield and reduce waste.', icon: 'eco' },
  { title: 'Build Climate-Resilient Systems', desc: 'Design AI-powered climate adaptation strategies including flood forecasting, drought management, and weather modeling.', icon: 'thermostat' },
  { title: 'Optimize Agricultural Supply Chains', desc: 'Implement demand forecasting, food safety AI, and cold chain intelligence for reduced waste and better distribution.', icon: 'local_shipping' },
  { title: 'Lead Human-AI Partnership', desc: 'Navigate ethical considerations, organizational readiness, and the future of human-AI augmentation in agriculture.', icon: 'handshake' },
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
  { num: 1, title: 'The AI Agriculture Revolution', lessons: 6, duration: '45 min', color: '#198038', topics: ['4th Agricultural Revolution', 'McKinsey $250B framework', 'Global adoption patterns', 'Value chain analysis'] },
  { num: 2, title: 'Sensing the Field', lessons: 6, duration: '55 min', color: '#0043ce', topics: ['IoT sensors & edge computing', 'Drone & satellite imaging', 'Microsoft FarmBeats', 'Data quality & preprocessing'] },
  { num: 3, title: 'AI-Powered Crop Management', lessons: 6, duration: '50 min', color: '#8a3ffc', topics: ['Computer vision for crops', 'Precision planting & irrigation', 'Disease detection models', 'Yield prediction'] },
  { num: 4, title: 'Climate Resilience', lessons: 6, duration: '50 min', color: '#007d79', topics: ['Weather forecasting AI', 'Drought & flood systems', 'Carbon footprint optimization', 'Climate adaptation strategies'] },
  { num: 5, title: 'Supply Chain Intelligence', lessons: 6, duration: '50 min', color: '#f1c21b', topics: ['Demand forecasting', 'Cold chain monitoring', 'Food safety AI', 'Waste reduction systems'] },
  { num: 6, title: 'The Human-AI Future', lessons: 6, duration: '50 min', color: '#ee5396', topics: ['AI ethics in agriculture', 'Organizational readiness', '7 pillars of AI adoption', 'Future workforce models'] },
];

const SKILL_CATEGORIES = {
  'Strategy': '#0f62fe',
  'Technical': '#8a3ffc',
  'Implementation': '#198038',
  'Analysis': '#007d79',
  'Operations': '#f1c21b',
  'Leadership': '#ee5396',
};

export default function CourseOverviewPage() {
  const [course, setCourse] = useState(null);
  const navigate = useNavigate();
  const { progress } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/course').then(r => r.json()).then(data => setCourse(data.course)).catch(console.error);
  }, []);

  return (
    <div className="main-content">
      {/* Hero header */}
      <div className="co-hero">
        <div className="co-hero-content">
          <div className="co-hero-badge">
            <span className="material-icons-round" style={{ fontSize: 14 }}>verified</span>
            University-Benchmarked Curriculum
          </div>
          <h1 className="co-hero-title">Course Overview</h1>
          <p className="co-hero-subtitle">
            A comprehensive, practitioner-focused curriculum designed to transform agricultural professionals 
            into AI-augmented decision makers. Benchmarked against leading university programs worldwide.
          </p>
        </div>
      </div>

      {/* At a Glance */}
      <div className="co-section">
        <div className="co-glance-grid">
          {[
            { value: '6', label: 'Modules', icon: 'school' },
            { value: '36', label: 'Lessons', icon: 'menu_book' },
            { value: '5h', label: 'Total Content', icon: 'schedule' },
            { value: '10', label: 'Exam Questions', icon: 'quiz' },
            { value: '6', label: 'Learning Outcomes', icon: 'emoji_events' },
            { value: '10', label: 'Key Skills', icon: 'psychology' },
          ].map((s, i) => (
            <div key={i} className="co-glance-item">
              <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--interactive-primary)', marginBottom: 'var(--spacing-03)' }}>{s.icon}</span>
              <div className="co-glance-value">{s.value}</div>
              <div className="co-glance-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Who Is This Course For */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Target Audience</div>
          <h2 className="section-title">Who Is This Course For?</h2>
          <p className="section-desc">
            This course is designed for professionals at the intersection of agriculture and technology 
            who want to leverage AI to create measurable impact.
          </p>
        </div>
        <div className="co-audience-grid">
          {[
            { title: 'Farm Operators & Managers', icon: 'agriculture', desc: 'Managing small to large-scale operations, seeking data-driven decision tools for planting, irrigation, and harvest optimization.' },
            { title: 'Agronomists & Crop Scientists', icon: 'biotech', desc: 'Advising farmers on best practices and wanting to integrate AI tools into their consulting and research workflows.' },
            { title: 'Agri-Tech Professionals', icon: 'devices', desc: 'Building or deploying agricultural technology solutions and seeking deeper understanding of AI applications in the field.' },
            { title: 'Supply Chain & Food Industry', icon: 'inventory_2', desc: 'Managing agricultural supply chains, food distribution, or quality assurance and looking to implement AI-driven optimization.' },
            { title: 'Policy Makers & Researchers', icon: 'policy', desc: 'Developing agricultural policy or researching food security and wanting to understand AI capabilities and limitations.' },
            { title: 'MBA & Graduate Students', icon: 'school', desc: 'Pursuing agribusiness or agricultural technology specialization and seeking practical, applied AI knowledge.' },
          ].map((a, i) => (
            <div key={i} className="co-audience-card">
              <span className="material-icons-round" style={{ fontSize: 24, color: 'var(--interactive-primary)', marginBottom: 'var(--spacing-04)' }}>{a.icon}</span>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{a.title}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{a.desc}</p>
            </div>
          ))}
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
              <div className="co-module-num" style={{ background: mod.color }}>{mod.num}</div>
              <div className="co-module-info">
                <h4 className="co-module-title">{mod.title}</h4>
                <div className="co-module-meta">
                  <span><span className="material-icons-round" style={{ fontSize: 14 }}>menu_book</span> {mod.lessons} lessons</span>
                  <span><span className="material-icons-round" style={{ fontSize: 14 }}>schedule</span> {mod.duration}</span>
                </div>
                <div className="co-module-topics">
                  {mod.topics.map((t, ti) => (
                    <span key={ti} className="co-module-topic-tag">{t}</span>
                  ))}
                </div>
              </div>
              <span className="material-icons-round co-module-arrow">arrow_forward</span>
            </div>
          ))}
          {/* Final Exam */}
          <div className="co-module-row co-module-exam" onClick={() => navigate('/exam')}>
            <div className="co-module-num" style={{ background: 'linear-gradient(135deg, #f1c21b, #da8b00)' }}>
              <span className="material-icons-round" style={{ fontSize: 18, color: '#fff' }}>emoji_events</span>
            </div>
            <div className="co-module-info">
              <h4 className="co-module-title">Final Examination</h4>
              <div className="co-module-meta">
                <span><span className="material-icons-round" style={{ fontSize: 14 }}>quiz</span> 10 questions</span>
                <span><span className="material-icons-round" style={{ fontSize: 14 }}>schedule</span> 30 min</span>
                <span><span className="material-icons-round" style={{ fontSize: 14 }}>verified</span> 70% to pass</span>
              </div>
            </div>
            <span className="material-icons-round co-module-arrow">arrow_forward</span>
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
                <span className="material-icons-round" style={{ fontSize: 24 }}>{lo.icon}</span>
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{lo.title}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{lo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Skills */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Competencies</div>
          <h2 className="section-title">Key Skills You Will Gain</h2>
          <p className="section-desc">
            Practical, marketable skills that position you as an AI Agriculture Practitioner.
          </p>
        </div>
        <div className="co-skills-grid">
          {KEY_SKILLS.map((s, i) => (
            <div key={i} className="co-skill-card">
              <div className="co-skill-header">
                <span className="co-skill-category" style={{ color: SKILL_CATEGORIES[s.category], borderColor: SKILL_CATEGORIES[s.category] }}>
                  {s.category}
                </span>
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{s.skill}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
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

        <div className="co-benchmark-table">
          <div className="co-benchmark-header-row">
            <div className="co-benchmark-cell co-benchmark-cell-name">University</div>
            <div className="co-benchmark-cell co-benchmark-cell-country">Country</div>
            <div className="co-benchmark-cell co-benchmark-cell-focus">Focus Area</div>
            <div className="co-benchmark-cell co-benchmark-cell-match">Match</div>
          </div>
          {BENCHMARK_UNIVERSITIES.map((u, i) => (
            <div key={i} className="co-benchmark-row">
              <div className="co-benchmark-cell co-benchmark-cell-name">
                <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--interactive-primary)' }}>school</span>
                <span>{u.name}</span>
              </div>
              <div className="co-benchmark-cell co-benchmark-cell-country">{u.country}</div>
              <div className="co-benchmark-cell co-benchmark-cell-focus">{u.focus}</div>
              <div className="co-benchmark-cell co-benchmark-cell-match">
                <div className="co-benchmark-bar">
                  <div className="co-benchmark-bar-fill" style={{ width: `${u.match}%` }} />
                </div>
                <span className="co-benchmark-pct">{u.match}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Industry Sources */}
        <div style={{ marginTop: 'var(--spacing-08)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-05)' }}>Industry & Research Sources</h3>
          <div className="co-industry-grid">
            {INDUSTRY_SOURCES.map((s, i) => (
              <div key={i} className="co-industry-card">
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)', color: 'var(--text-primary)' }}>{s.name}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{s.contribution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Methodology</div>
          <h2 className="section-title">How We Teach</h2>
        </div>
        <div className="co-method-grid">
          {[
            { icon: 'person', title: 'Persona-Driven Scenarios', desc: 'Follow four agricultural professionals as they apply AI to real challenges in their daily work.' },
            { icon: 'sports_esports', title: 'Interactive Mini-Games', desc: 'Gamified learning activities that reinforce concepts through drone piloting, disease diagnosis, and more.' },
            { icon: 'smart_toy', title: 'AI Companion (Noor)', desc: 'An always-available AI assistant that provides deeper explanations, generates study materials, and answers questions.' },
            { icon: 'terminal', title: 'Hands-On AI Prompts', desc: 'Real prompts you can test on ChatGPT, Perplexity, and other AI platforms to see concepts in action.' },
            { icon: 'play_circle', title: 'Expert Video Content', desc: 'Curated interviews and demonstrations from IBM researchers, university professors, and industry leaders.' },
            { icon: 'psychology', title: 'Scenario Checkpoints', desc: 'Application-based assessments where you solve realistic agricultural AI challenges.' },
          ].map((m, i) => (
            <div key={i} className="co-method-card">
              <span className="material-icons-round" style={{ fontSize: 28, color: 'var(--interactive-primary)', marginBottom: 'var(--spacing-04)' }}>{m.icon}</span>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{m.title}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{m.desc}</p>
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
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>dashboard</span>
            Go to Dashboard
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/exam')}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>quiz</span>
            Take Final Exam
          </button>
        </div>
      </div>
    </div>
  );
}
