import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckmarkIcon, EcoIcon,
  CatalogIcon, PlayFilledIcon, CertificateIcon, GameControllerIcon,
  EditIcon, DocumentIcon, ChevronLeftIcon, ChevronRightIcon,
  CheckmarkFilledIcon, TimeIcon, LaunchIcon, BotIcon,
  InformationIcon, QuotesIcon, WarningIcon, CodeIcon,
  TerminalIcon, CopyIcon, ChevronDownIcon, IdeaIcon,
} from '../components/CarbonIcons';
import QuizComponent from '../components/QuizComponent';
import MiniGame from '../components/MiniGame';

// ============================================================
// AI GLOSSARY — terms highlighted inline, linked to tooltip
// ============================================================
const AI_GLOSSARY = {
  'AI': { term: 'Artificial Intelligence', def: 'Computer systems that can perform tasks that normally require human intelligence, such as visual perception, speech recognition, and decision-making.' },
  'IoT': { term: 'Internet of Things', def: 'A network of physical devices embedded with sensors, software, and connectivity that enables them to collect and exchange data.' },
  'machine learning': { term: 'Machine Learning', def: 'A subset of AI where systems learn and improve from experience without being explicitly programmed, using algorithms that find patterns in data.' },
  'deep learning': { term: 'Deep Learning', def: 'A type of machine learning using neural networks with many layers, particularly effective for image recognition and natural language processing.' },
  'computer vision': { term: 'Computer Vision', def: 'AI that enables computers to interpret and understand visual information from images or video, used in crop disease detection and yield estimation.' },
  'precision agriculture': { term: 'Precision Agriculture', def: 'A farming management approach using technology and data to optimize crop yields and reduce waste by treating each part of a field according to its specific needs.' },
  'NDVI': { term: 'Normalized Difference Vegetation Index', def: 'A remote sensing measurement that indicates plant health by analyzing the difference between near-infrared and visible red light reflected by vegetation.' },
  'edge computing': { term: 'Edge Computing', def: 'Processing data near the source (on the farm) rather than sending it to a distant cloud server, reducing latency and bandwidth needs.' },
  'variable-rate technology': { term: 'Variable-Rate Technology (VRT)', def: 'Equipment that automatically adjusts the rate of inputs (seeds, fertilizer, water) across a field based on sensor data and prescription maps.' },
  'neural network': { term: 'Neural Network', def: 'A computing system inspired by biological neural networks, consisting of interconnected nodes that process information in layers to recognize patterns.' },
  'drone': { term: 'Unmanned Aerial Vehicle (UAV)', def: 'Remotely piloted aircraft used in agriculture for aerial imaging, crop monitoring, and precision spraying.' },
  'multispectral': { term: 'Multispectral Imaging', def: 'Capturing image data at specific frequencies across the electromagnetic spectrum, revealing plant health information invisible to the human eye.' },
  'ROI': { term: 'Return on Investment', def: 'A measure of the profit or cost savings generated relative to the investment made, critical for evaluating AI adoption decisions.' },
  'ETL': { term: 'Extract, Transform, Load', def: 'A data pipeline process that extracts data from sources, transforms it into a usable format, and loads it into a storage system for analysis.' },
  'NWP': { term: 'Numerical Weather Prediction', def: 'Using mathematical models of the atmosphere and oceans to predict weather, often enhanced by AI for local agricultural forecasting.' },
  'cold chain': { term: 'Cold Chain', def: 'A temperature-controlled supply chain for perishable goods, from farm to consumer, increasingly monitored by IoT sensors and AI.' },
  'CNN': { term: 'Convolutional Neural Network', def: 'A deep learning architecture designed for processing grid-like data such as images, widely used for crop disease detection from photographs.' },
  'blockchain': { term: 'Blockchain', def: 'A distributed digital ledger that records transactions across multiple computers, used in food supply chains for traceability and trust.' },
  'satellite imagery': { term: 'Satellite Imagery', def: 'Images of Earth captured by orbiting satellites, used in agriculture for large-scale crop monitoring, land use analysis, and climate tracking.' },
  'generative AI': { term: 'Generative AI', def: 'AI systems that can create new content — text, images, code, plans — based on patterns learned from training data.' },
};

function GlossaryTerm({ children }) {
  const [show, setShow] = useState(false);
  const text = typeof children === 'string' ? children : '';
  const lower = text.toLowerCase();
  const entry = AI_GLOSSARY[lower] || AI_GLOSSARY[text] || Object.values(AI_GLOSSARY).find(e => e.term.toLowerCase() === lower);
  if (!entry) return <span className="slide-glossary-term">{children}</span>;
  return (
    <span className="slide-glossary-wrap" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="slide-glossary-term">{children}</span>
      {show && (
        <span className="slide-glossary-tooltip">
          <strong>{entry.term}</strong>
          <span>{entry.def}</span>
        </span>
      )}
    </span>
  );
}

// Highlight glossary terms in text
function highlightGlossary(text) {
  if (!text || typeof text !== 'string') return text;
  const terms = Object.keys(AI_GLOSSARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
    if (isMatch) return <GlossaryTerm key={i}>{part}</GlossaryTerm>;
    return part;
  });
}

// ============================================================
// SLIDE EXPANDER — breaks blocks into individual slides
// ============================================================
function expandBlocksToSlides(blocks, lesson) {
  const slides = [];

  // Title slide always first
  slides.push({
    type: 'title',
    title: lesson.title,
    lessonType: lesson.type,
    duration: lesson.duration_minutes,
  });

  for (const block of blocks) {
    switch (block.type) {
      case 'hero':
        slides.push({ type: 'hero', ...block });
        break;

      case 'text':
        // Split long text into multiple slides (~200 chars each for readability)
        const sentences = block.content.split(/(?<=\.)\s+/);
        let chunk = '';
        for (const s of sentences) {
          if ((chunk + ' ' + s).length > 280 && chunk.length > 0) {
            slides.push({ type: 'text', content: chunk.trim() });
            chunk = s;
          } else {
            chunk = chunk ? chunk + ' ' + s : s;
          }
        }
        if (chunk.trim()) slides.push({ type: 'text', content: chunk.trim() });
        break;

      case 'stat_cards':
        // Each stat gets its own slide for impact
        if (block.stats.length <= 2) {
          slides.push({ type: 'stat_cards', stats: block.stats });
        } else {
          // Show 2 stats per slide
          for (let i = 0; i < block.stats.length; i += 2) {
            slides.push({ type: 'stat_cards', stats: block.stats.slice(i, i + 2) });
          }
        }
        break;

      case 'timeline':
        // Each timeline item gets its own slide
        block.items.forEach((item, idx) => {
          slides.push({ type: 'timeline_item', item, index: idx, total: block.items.length });
        });
        break;

      case 'quote':
        slides.push({ type: 'quote', ...block });
        break;

      case 'callout':
        slides.push({ type: 'callout', ...block });
        break;

      case 'comparison':
        // Each comparison item gets its own slide
        if (block.items) {
          block.items.forEach(item => {
            slides.push({ type: 'comparison_item', item, title: block.title });
          });
        }
        break;

      case 'persona_intro':
      case 'persona_scenario':
        slides.push({ type: 'persona', ...block });
        break;

      case 'interactive_reveal':
        // Each reveal item gets its own slide
        if (block.items) {
          slides.push({ type: 'reveal_intro', title: block.title });
          block.items.forEach(item => {
            slides.push({ type: 'reveal_item', item });
          });
        }
        break;

      case 'value_chart':
        slides.push({ type: 'value_chart', data: block.data });
        break;

      case 'case_study_preview':
        slides.push({ type: 'case_study', ...block });
        break;

      case 'prompt_test':
        slides.push({ type: 'prompt', ...block });
        break;

      case 'data_layers':
        if (block.layers) {
          block.layers.forEach(layer => {
            slides.push({ type: 'data_layer', layer });
          });
        }
        break;

      case 'pillars':
        if (block.items) {
          block.items.forEach(p => {
            slides.push({ type: 'pillar', pillar: p });
          });
        }
        break;

      case 'architecture_diagram':
        if (block.components) {
          block.components.forEach(c => {
            slides.push({ type: 'architecture', component: c });
          });
        }
        break;

      case 'video_intro':
        slides.push({ type: 'text', content: block.text, italic: true });
        break;

      case 'game_intro':
        slides.push({ type: 'game_intro', text: block.text });
        break;

      case 'key_takeaways':
        if (block.items) {
          slides.push({ type: 'takeaways', items: block.items });
        }
        break;

      default:
        slides.push({ type: 'generic', block });
        break;
    }
  }

  // Add a chatbot CTA slide near the end
  slides.push({ type: 'chatbot_cta' });

  return slides;
}

// ============================================================
// PERSONA DATA
// ============================================================
const PERSONA_COLORS = { amara: '#198038', carlos: '#0043ce', dr_okafor: '#8a3ffc', rajan: '#007d79', khalid: '#da1e28' };
const PERSONA_NAMES = { amara: 'Amara Johnson', carlos: 'Carlos Mendoza', dr_okafor: 'Dr. Fatima Okafor', rajan: 'Rajan Patel', khalid: 'Khalid Al-Rashidi' };
const PERSONA_ROLES = { amara: 'Wheat Farmer, Kansas', carlos: 'Coffee Farmer, Colombia', dr_okafor: 'Agronomist, Nigeria', rajan: 'Food Distributor, India', khalid: 'AgriTech Director, Saudi Arabia' };
const PERSONA_INITIALS = { amara: 'AJ', carlos: 'CM', dr_okafor: 'FO', rajan: 'RP', khalid: 'KR' };

// ============================================================
// SLIDE COMPONENTS — each fills the viewport
// ============================================================

function SlideTitle({ slide }) {
  const typeIcons = { lecture: CatalogIcon, video: PlayFilledIcon, checkpoint: CertificateIcon, game: GameControllerIcon, activity: EditIcon };
  const Icon = typeIcons[slide.lessonType] || DocumentIcon;
  return (
    <div className="slide-content slide-title">
      <div className="slide-title-badge">
        <Icon size={20} />
        <span>{slide.lessonType}</span>
        <span className="slide-title-duration"><TimeIcon size={14} /> {slide.duration} min</span>
      </div>
      <h1 className="slide-title-heading">{slide.title}</h1>
      <p className="slide-title-hint">Use arrow keys or swipe to navigate</p>
    </div>
  );
}

function SlideHero({ slide }) {
  return (
    <div className="slide-content slide-hero">
      <div className="slide-hero-image">
        <img src={slide.image} alt={slide.title} onError={e => { e.target.style.display = 'none'; }} />
        <div className="slide-hero-overlay" />
      </div>
      <div className="slide-hero-text">
        <h2>{slide.title}</h2>
        {slide.subtitle && <p>{slide.subtitle}</p>}
      </div>
    </div>
  );
}

function SlideText({ slide }) {
  return (
    <div className="slide-content slide-text">
      <p className="slide-text-body" style={slide.italic ? { fontStyle: 'italic' } : {}}>
        {highlightGlossary(slide.content)}
      </p>
    </div>
  );
}

function SlideStats({ slide }) {
  return (
    <div className="slide-content slide-stats">
      <div className="slide-stats-grid">
        {slide.stats.map((s, i) => (
          <div key={i} className="slide-stat-card">
            <div className="slide-stat-value">{s.value}</div>
            <div className="slide-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTimelineItem({ slide }) {
  return (
    <div className="slide-content slide-timeline-item">
      <div className="slide-timeline-counter">{slide.index + 1} of {slide.total}</div>
      <div className="slide-timeline-year">{slide.item.year}</div>
      <h3 className="slide-timeline-heading">{slide.item.title}</h3>
      <p className="slide-timeline-desc">{highlightGlossary(slide.item.desc)}</p>
    </div>
  );
}

function SlideQuote({ slide }) {
  return (
    <div className="slide-content slide-quote">
      <QuotesIcon size={48} color="var(--interactive-primary)" style={{ opacity: 0.4, marginBottom: 'var(--spacing-05)' }} />
      <blockquote className="slide-quote-text">{highlightGlossary(slide.text)}</blockquote>
      <div className="slide-quote-author">{slide.author}</div>
      {slide.role && <div className="slide-quote-role">{slide.role}</div>}
    </div>
  );
}

function SlideCallout({ slide }) {
  const iconMap = { info: InformationIcon, success: CheckmarkFilledIcon, warning: WarningIcon, technical: CodeIcon };
  const Icon = iconMap[slide.style] || InformationIcon;
  return (
    <div className="slide-content slide-callout">
      <div className="slide-callout-icon">
        <Icon size={36} color="var(--interactive-primary)" />
      </div>
      <h3 className="slide-callout-title">{slide.title}</h3>
      <p className="slide-callout-body">{highlightGlossary(slide.content)}</p>
    </div>
  );
}

function SlidePersona({ slide }) {
  const name = PERSONA_NAMES[slide.persona] || 'Persona';
  const role = PERSONA_ROLES[slide.persona] || '';
  const color = PERSONA_COLORS[slide.persona] || '#0f62fe';
  const initials = PERSONA_INITIALS[slide.persona] || name[0];
  return (
    <div className="slide-content slide-persona">
      <div className="slide-persona-avatar" style={{ background: color }}>{initials}</div>
      <h3 className="slide-persona-name">{name}</h3>
      <div className="slide-persona-role">{role}</div>
      <p className="slide-persona-scenario">{highlightGlossary(slide.scenario)}</p>
    </div>
  );
}

function SlideComparisonItem({ slide }) {
  return (
    <div className="slide-content slide-comparison">
      {slide.title && <div className="slide-comparison-label">{slide.title}</div>}
      <h3 className="slide-comparison-heading">{slide.item.category}</h3>
      <p className="slide-comparison-desc">{highlightGlossary(slide.item.description)}</p>
      {slide.item.examples && (
        <ul className="slide-comparison-list">
          {slide.item.examples.map((ex, j) => (
            <li key={j}><CheckmarkIcon size={16} color="var(--support-success)" /><span>{ex}</span></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SlideRevealItem({ slide }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="slide-content slide-reveal">
      <div className="slide-reveal-question" onClick={() => setRevealed(!revealed)}>
        <IdeaIcon size={28} color="var(--interactive-primary)" />
        <p>{slide.item.visible}</p>
        <span className="slide-reveal-toggle">{revealed ? 'Hide' : 'Reveal'}</span>
      </div>
      {revealed && (
        <div className="slide-reveal-answer">
          <p>{highlightGlossary(slide.item.hidden)}</p>
        </div>
      )}
    </div>
  );
}

function SlideChatbotCTA() {
  return (
    <div className="slide-content slide-chatbot-cta">
      <BotIcon size={56} color="var(--interactive-primary)" />
      <h3>Need Help Understanding Something?</h3>
      <p>Click the chat button in the bottom-right corner to ask your AI companion for a deeper explanation of any concept in this lesson.</p>
      <div className="slide-cta-hint">
        <span className="slide-cta-dot" /> Noor is ready to help
      </div>
    </div>
  );
}

function SlideDataLayer({ slide }) {
  return (
    <div className="slide-content slide-data-layer">
      <h3 className="slide-layer-name">{slide.layer.name}</h3>
      <p className="slide-layer-desc">{highlightGlossary(slide.layer.description)}</p>
      {slide.layer.example && <div className="slide-layer-example">{slide.layer.example}</div>}
    </div>
  );
}

function SlidePillar({ slide }) {
  return (
    <div className="slide-content slide-pillar">
      <div className="slide-pillar-num">{slide.pillar.number}</div>
      <h3 className="slide-pillar-title">{slide.pillar.title}</h3>
      <p className="slide-pillar-desc">{highlightGlossary(slide.pillar.desc)}</p>
    </div>
  );
}

function SlideCaseStudy({ slide }) {
  return (
    <div className="slide-content slide-case-study">
      <div className="slide-case-badge">{slide.company}</div>
      <h3 className="slide-case-title">{slide.title}</h3>
      <p className="slide-case-body">{highlightGlossary(slide.text)}</p>
    </div>
  );
}

function SlideValueChart({ slide }) {
  if (!slide.data) return null;
  const Section = ({ title, total, items, color }) => (
    <div className="slide-value-section">
      <div className="slide-value-header"><span>{title}</span><strong>${total}B</strong></div>
      {items.map((item, i) => (
        <div key={i} className="slide-value-row">
          <div className="slide-value-label">{item.label}</div>
          <div className="slide-value-bar-bg">
            <div className="slide-value-bar-fill" style={{ width: `${(item.value / total) * 100}%`, background: color }}>${item.value}B</div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="slide-content slide-value-chart">
      {slide.data.onAcre && <Section title="On the Acre" total={slide.data.onAcre.total} items={slide.data.onAcre.items} color="var(--ibm-green-60)" />}
      {slide.data.enterprise && <Section title="For the Enterprise" total={slide.data.enterprise.total} items={slide.data.enterprise.items} color="var(--interactive-primary)" />}
    </div>
  );
}

function SlidePrompt({ slide }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(slide.prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="slide-content slide-prompt">
      <div className="slide-prompt-header"><TerminalIcon size={24} color="var(--interactive-primary)" /><strong>{slide.title}</strong></div>
      <pre className="slide-prompt-text">{slide.prompt}</pre>
      <button className="slide-prompt-copy" onClick={copy}>
        {copied ? <CheckmarkIcon size={14} /> : <CopyIcon size={14} />}
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
    </div>
  );
}

function SlideGameIntro({ slide }) {
  return (
    <div className="slide-content slide-game-intro">
      <GameControllerIcon size={48} color="var(--interactive-primary)" />
      <h3>Mini-Game</h3>
      <p>{highlightGlossary(slide.text)}</p>
    </div>
  );
}

function SlideTakeaways({ slide }) {
  return (
    <div className="slide-content slide-takeaways">
      <CheckmarkFilledIcon size={36} color="var(--support-success)" />
      <h3>Key Takeaways</h3>
      <ul className="slide-takeaways-list">
        {slide.items.map((item, i) => (
          <li key={i}><CheckmarkIcon size={16} color="var(--support-success)" /><span>{typeof item === 'string' ? item : item.text || item.title || ''}</span></li>
        ))}
      </ul>
    </div>
  );
}

// Render a single slide
function RenderSlide({ slide }) {
  switch (slide.type) {
    case 'title': return <SlideTitle slide={slide} />;
    case 'hero': return <SlideHero slide={slide} />;
    case 'text': return <SlideText slide={slide} />;
    case 'stat_cards': return <SlideStats slide={slide} />;
    case 'timeline_item': return <SlideTimelineItem slide={slide} />;
    case 'quote': return <SlideQuote slide={slide} />;
    case 'callout': return <SlideCallout slide={slide} />;
    case 'persona': return <SlidePersona slide={slide} />;
    case 'comparison_item': return <SlideComparisonItem slide={slide} />;
    case 'reveal_intro': return <SlideText slide={{ content: slide.title, type: 'text' }} />;
    case 'reveal_item': return <SlideRevealItem slide={slide} />;
    case 'value_chart': return <SlideValueChart slide={slide} />;
    case 'case_study': return <SlideCaseStudy slide={slide} />;
    case 'prompt': return <SlidePrompt slide={slide} />;
    case 'data_layer': return <SlideDataLayer slide={slide} />;
    case 'pillar': return <SlidePillar slide={slide} />;
    case 'game_intro': return <SlideGameIntro slide={slide} />;
    case 'takeaways': return <SlideTakeaways slide={slide} />;
    case 'chatbot_cta': return <SlideChatbotCTA />;
    default: return <div className="slide-content"><p>Content</p></div>;
  }
}

// ============================================================
// SUPPLEMENTAL READING
// ============================================================
const SUPPLEMENTAL_RESOURCES = {
  'mod-1-revolution': [
    { source: 'McKinsey & Company', title: "Agriculture's connected future", url: 'https://www.mckinsey.com/industries/agriculture/our-insights/', icon: '\ud83d\udcca' },
    { source: 'FAO (United Nations)', title: 'State of Food and Agriculture 2024', url: 'https://www.fao.org/publications/sofa/en/', icon: '\ud83c\udf0d' },
  ],
  'mod-2-sensing': [
    { source: 'Microsoft Research', title: 'FarmBeats: AI, Edge & IoT', url: 'https://www.microsoft.com/en-us/research/project/farmbeats-iot-agriculture/', icon: '\ud83d\udce1' },
    { source: 'IBM Research', title: 'Watson Decision Platform', url: 'https://research.ibm.com/topics/agriculture-and-food', icon: '\ud83d\udda5\ufe0f' },
  ],
  'mod-3-crop-mgmt': [
    { source: 'Google AI', title: 'AI for Agriculture & Food Security', url: 'https://ai.google/social-good/', icon: '\ud83d\udd2c' },
    { source: 'IBM Research', title: 'Liquid Prep Water Management', url: 'https://github.com/Liquid-Prep', icon: '\ud83d\udca7' },
  ],
  'mod-4-climate': [
    { source: 'Google AI', title: 'Flood Forecasting with ML', url: 'https://sites.research.google/floods/', icon: '\ud83c\udf0a' },
    { source: 'FAO', title: 'Climate-Smart Agriculture', url: 'https://www.fao.org/climate-smart-agriculture-sourcebook/en/', icon: '\ud83c\udf21\ufe0f' },
  ],
  'mod-5-supply-chain': [
    { source: 'McKinsey', title: 'AI in the food supply chain', url: 'https://www.mckinsey.com/industries/agriculture/our-insights/', icon: '\ud83d\ude9a' },
    { source: 'IBM', title: 'Food Trust Blockchain', url: 'https://www.ibm.com/products/supply-chain-intelligence-suite/food-trust', icon: '\ud83d\udd17' },
  ],
  'mod-6-future': [
    { source: 'McKinsey', title: 'The bio revolution', url: 'https://www.mckinsey.com/industries/life-sciences/our-insights/', icon: '\ud83e\udd1d' },
    { source: 'Microsoft', title: 'Responsible AI in Agriculture', url: 'https://www.microsoft.com/en-us/research/theme/technology-and-empowerment/', icon: '\u2696\ufe0f' },
  ],
};

// ============================================================
// MAIN LESSON PAGE — SLIDE-BASED NAVIGATION
// ============================================================
export default function LessonPage() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [moduleInfo, setModuleInfo] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const { user, progress, refreshProgress } = useContext(AppContext);
  const navigate = useNavigate();
  const startTime = useRef(Date.now());
  const slideContainerRef = useRef(null);
  const touchStartX = useRef(null);

  // Fetch lesson data
  useEffect(() => {
    startTime.current = Date.now();
    setCurrentSlide(0);
    fetch(`/api/lessons/${lessonId}`).then(r => r.json()).then(data => {
      setLessonData(data);
      fetch(`/api/modules/${data.lesson.module_id}`).then(r => r.json()).then(md => {
        setAllLessons(md.lessons);
        setModuleInfo(md.module);
      });

      // Expand blocks into slides
      const expanded = expandBlocksToSlides(data.lesson.content?.blocks || [], data.lesson);

      // If video, add video slide
      if (data.lesson.video_url) {
        expanded.splice(1, 0, { type: 'video', url: data.lesson.video_url, title: data.lesson.title });
      }

      setSlides(expanded);
    });
  }, [lessonId]);

  // Mark lesson as in_progress when user is available
  useEffect(() => {
    if (!user || !lessonData) return;
    fetch(`/api/users/${user.id}/progress`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, moduleId: lessonData.lesson.module_id, status: 'in_progress' })
    }).catch(err => console.error('Failed to mark lesson in_progress:', err));
  }, [user, lessonData, lessonId]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goPrevSlide();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [slides.length, currentSlide]);

  // Touch/swipe support
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNextSlide();
      else goPrevSlide();
    }
    touchStartX.current = null;
  };

  const goNextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goPrevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  }, []);

  const markComplete = async () => {
    if (!user || !lessonData) {
      console.error('Cannot complete lesson: user or lessonData is null');
      return;
    }
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    try {
      await fetch(`/api/users/${user.id}/progress`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, moduleId: lessonData.lesson.module_id, status: 'completed', timeSpent })
      });
      await refreshProgress();
    } catch (err) {
      console.error('Error completing lesson:', err);
    }
    const currentIdx = allLessons.findIndex(l => l.id === lessonId);
    if (currentIdx < allLessons.length - 1) {
      navigate(`/lesson/${allLessons[currentIdx + 1].id}`);
    } else {
      navigate(`/module/${lessonData.lesson.module_id}`);
    }
  };

  const getLessonStatus = (lid) => {
    if (!progress?.progress) return 'not_started';
    return progress.progress.find(p => p.lesson_id === lid)?.status || 'not_started';
  };

  if (!lessonData || slides.length === 0) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <EcoIcon size={48} color="var(--interactive-primary)" style={{ animation: 'pulse 2s infinite' }} />
    </div>
  );

  const { lesson } = lessonData;
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const hasPrevLesson = currentIdx > 0;
  const hasNextLesson = currentIdx < allLessons.length - 1;
  const completedCount = allLessons.filter(l => getLessonStatus(l.id) === 'completed').length;
  const modulePct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
  const isLastSlide = currentSlide === slides.length - 1;
  const isLastLesson = currentIdx === allLessons.length - 1;
  const moduleResources = isLastLesson && isLastSlide ? (SUPPLEMENTAL_RESOURCES[lesson.module_id] || []) : [];

  return (
    <div className="slide-lesson" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Top bar */}
      <div className="slide-topbar">
        <div className="slide-topbar-left">
          <button className="slide-topbar-back" onClick={() => navigate(`/module/${lesson.module_id}`)}>
            <ArrowLeftIcon size={16} />
            {moduleInfo && <span>Module {moduleInfo.order_index}</span>}
          </button>
        </div>

        {/* Slide dots */}
        <div className="slide-dots">
          {slides.map((_, i) => (
            <button key={i}
              className={`slide-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'visited' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="slide-topbar-right">
          <span className="slide-counter">{currentSlide + 1}/{slides.length}</span>
        </div>
      </div>

      {/* Lesson dots (which lesson in the module) */}
      <div className="slide-lesson-dots">
        {allLessons.map((l, i) => {
          const st = getLessonStatus(l.id);
          const isCurrent = l.id === lessonId;
          return (
            <button key={l.id}
              className={`slide-lesson-dot ${isCurrent ? 'current' : ''} ${st === 'completed' ? 'completed' : ''}`}
              onClick={() => navigate(`/lesson/${l.id}`)}
              title={`${i + 1}. ${l.title}`}
            >
              {st === 'completed' && !isCurrent && <CheckmarkIcon size={8} color="#fff" />}
            </button>
          );
        })}
      </div>

      {/* Main slide area */}
      <div className="slide-stage" ref={slideContainerRef}>
        {/* Prev arrow */}
        <button className="slide-arrow slide-arrow-left" disabled={currentSlide === 0} onClick={goPrevSlide}>
          <ChevronLeftIcon size={28} />
        </button>

        {/* The slide card */}
        <div className="slide-card" key={currentSlide}>
          <RenderSlide slide={slides[currentSlide]} />

          {/* Activities/games/quizzes on last content slide */}
          {isLastSlide && lessonData.activities?.map(act => (
            <QuizComponent key={act.id} activity={act} onComplete={(score) => {
              if (user) {
                fetch(`/api/users/${user.id}/progress`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ lessonId, moduleId: lesson.module_id, status: 'completed', score })
                }).then(() => refreshProgress());
              }
            }} />
          ))}

          {isLastSlide && lessonData.games?.map(game => (
            <MiniGame key={game.id} game={game} onComplete={(score) => {
              if (user) {
                fetch(`/api/users/${user.id}/progress`, {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ lessonId, moduleId: lesson.module_id, status: 'completed', score })
                }).then(() => refreshProgress());
              }
            }} />
          ))}

          {/* Supplemental reading on last slide of last lesson */}
          {moduleResources.length > 0 && (
            <div className="slide-supplemental">
              <h4><DocumentIcon size={18} /> Further Reading</h4>
              {moduleResources.map((r, ri) => (
                <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer" className="slide-supplemental-link">
                  <span className="slide-supplemental-icon">{r.icon}</span>
                  <span>{r.source}: {r.title}</span>
                  <LaunchIcon size={14} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Next arrow */}
        <button className="slide-arrow slide-arrow-right" disabled={isLastSlide} onClick={goNextSlide}>
          <ChevronRightIcon size={28} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="slide-bottombar">
        {hasPrevLesson && (
          <button className="slide-nav-btn" onClick={() => navigate(`/lesson/${allLessons[currentIdx - 1].id}`)}>
            <ArrowLeftIcon size={14} /> Previous Lesson
          </button>
        )}
        <div style={{ flex: 1 }} />
        {isLastSlide ? (
          <button className="btn btn-primary" onClick={markComplete}>
            <CheckmarkFilledIcon size={18} />
            Complete & Continue
          </button>
        ) : (
          <button className="slide-nav-btn slide-nav-next" onClick={goNextSlide}>
            Next <ArrowRightIcon size={14} />
          </button>
        )}
        {hasNextLesson && isLastSlide && (
          <button className="slide-nav-btn" style={{ marginLeft: 8 }} onClick={() => navigate(`/lesson/${allLessons[currentIdx + 1].id}`)}>
            Next Lesson <ArrowRightIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
