import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import ContentRenderer from '../components/ContentRenderer';
import QuizComponent from '../components/QuizComponent';
import MiniGame from '../components/MiniGame';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckmarkIcon, EcoIcon,
  CatalogIcon, PlayFilledIcon, CertificateIcon, GameControllerIcon,
  EditIcon, DocumentIcon, ChevronLeftIcon, ChevronRightIcon,
  CheckmarkFilledIcon, TimeIcon, LaunchIcon,
} from '../components/CarbonIcons';

const LESSON_TYPE_ICONS = {
  lecture: CatalogIcon,
  video: PlayFilledIcon,
  checkpoint: CertificateIcon,
  game: GameControllerIcon,
  activity: EditIcon,
};

// Supplemental reading resources — now inside lesson flow
const SUPPLEMENTAL_RESOURCES = {
  'mod-1-revolution': [
    { source: 'McKinsey & Company', title: 'Agriculture\'s connected future: How technology can yield new growth', desc: 'AI value framework, 7 pillars of AI readiness, and the $250B market opportunity.', url: 'https://www.mckinsey.com/industries/agriculture/our-insights/agricultures-connected-future-how-technology-can-yield-new-growth', icon: '\ud83d\udcca' },
    { source: 'FAO (United Nations)', title: 'The State of Food and Agriculture 2024', desc: 'Global food security data and SDG alignment for agricultural AI adoption.', url: 'https://www.fao.org/publications/sofa/en/', icon: '\ud83c\udf0d' },
  ],
  'mod-2-sensing': [
    { source: 'Microsoft Research', title: 'FarmBeats: AI, Edge & IoT for Agriculture', desc: 'TV white spaces, edge computing, and AI for data-driven farming.', url: 'https://www.microsoft.com/en-us/research/project/farmbeats-iot-agriculture/', icon: '\ud83d\udce1' },
    { source: 'IBM Research', title: 'Watson Decision Platform for Agriculture', desc: 'Enterprise AI for crop monitoring, yield prediction, and precision agriculture.', url: 'https://research.ibm.com/topics/agriculture-and-food', icon: '\ud83d\udda5\ufe0f' },
  ],
  'mod-3-crop-mgmt': [
    { source: 'Google AI', title: 'AI for Social Good — Agriculture & Food Security', desc: 'TensorFlow for satellite imagery, crop disease, and flood forecasting.', url: 'https://ai.google/social-good/', icon: '\ud83d\udd2c' },
    { source: 'IBM Research', title: 'IBM Liquid Prep — Open Source Water Management', desc: 'AI-powered irrigation optimization from real-time data.', url: 'https://github.com/Liquid-Prep', icon: '\ud83d\udca7' },
  ],
  'mod-4-climate': [
    { source: 'Google AI', title: 'Flood Forecasting with Machine Learning', desc: 'Google\'s initiative for life-saving flood predictions.', url: 'https://sites.research.google/floods/', icon: '\ud83c\udf0a' },
    { source: 'FAO (United Nations)', title: 'Climate-Smart Agriculture Sourcebook', desc: 'Integrating climate resilience into agricultural planning.', url: 'https://www.fao.org/climate-smart-agriculture-sourcebook/en/', icon: '\ud83c\udf21\ufe0f' },
  ],
  'mod-5-supply-chain': [
    { source: 'McKinsey & Company', title: 'How AI is transforming the food supply chain', desc: 'Demand forecasting, waste reduction, and cold-chain optimization.', url: 'https://www.mckinsey.com/industries/agriculture/our-insights/', icon: '\ud83d\ude9a' },
    { source: 'IBM Research', title: 'IBM Food Trust — Blockchain for Food Supply', desc: 'Traceability connecting growers, processors, and retailers.', url: 'https://www.ibm.com/products/supply-chain-intelligence-suite/food-trust', icon: '\ud83d\udd17' },
  ],
  'mod-6-future': [
    { source: 'McKinsey & Company', title: 'The bio revolution: Innovations transforming economies', desc: 'AI ethics, 7 pillars of adoption, and future workforce.', url: 'https://www.mckinsey.com/industries/life-sciences/our-insights/the-bio-revolution-innovations-transforming-economies-societies-and-our-lives', icon: '\ud83e\udd1d' },
    { source: 'Microsoft Research', title: 'Responsible AI in Agriculture', desc: 'Frameworks for responsible AI in farming communities.', url: 'https://www.microsoft.com/en-us/research/theme/technology-and-empowerment/', icon: '\u2696\ufe0f' },
  ],
};

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [moduleInfo, setModuleInfo] = useState(null);
  const { user, progress, refreshProgress } = useContext(AppContext);
  const navigate = useNavigate();
  const startTime = useRef(Date.now());
  const contentRef = useRef(null);

  useEffect(() => {
    startTime.current = Date.now();
    fetch(`/api/lessons/${lessonId}`).then(r => r.json()).then(data => {
      setLessonData(data);
      if (user) {
        fetch(`/api/users/${user.id}/progress`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, moduleId: data.lesson.module_id, status: 'in_progress' })
        });
      }
      fetch(`/api/modules/${data.lesson.module_id}`).then(r => r.json()).then(md => {
        setAllLessons(md.lessons);
        setModuleInfo(md.module);
      });
    });
    window.scrollTo(0, 0);
  }, [lessonId]);

  const markComplete = async () => {
    if (!user) return;
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    await fetch(`/api/users/${user.id}/progress`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, moduleId: lessonData.lesson.module_id, status: 'completed', timeSpent })
    });
    await refreshProgress();
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

  const goToLesson = (lid) => navigate(`/lesson/${lid}`);

  if (!lessonData) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EcoIcon size={48} color="var(--interactive-primary)" style={{ animation: 'pulse 2s infinite' }} />
    </div>
  );

  const { lesson, activities, games, videos, prompts } = lessonData;
  const currentIdx = allLessons.findIndex(l => l.id === lessonId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx < allLessons.length - 1;
  const TypeIcon = LESSON_TYPE_ICONS[lesson.type] || DocumentIcon;
  const isLastLesson = currentIdx === allLessons.length - 1;
  const moduleResources = isLastLesson ? (SUPPLEMENTAL_RESOURCES[lesson.module_id] || []) : [];

  // Calculate module progress
  const completedCount = allLessons.filter(l => getLessonStatus(l.id) === 'completed').length;
  const modulePct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

  return (
    <div className="lesson-focused">
      {/* Top bar — module info + lesson dots */}
      <div className="lesson-topbar">
        <div className="lesson-topbar-left">
          <button className="lesson-topbar-back" onClick={() => navigate(`/module/${lesson.module_id}`)}>
            <ArrowLeftIcon size={16} />
            {moduleInfo && <span>Module {moduleInfo.order_index}</span>}
          </button>
          {moduleInfo && <span className="lesson-topbar-title">{moduleInfo.title}</span>}
        </div>

        {/* Module progress */}
        <div className="lesson-topbar-progress">
          <div className="lesson-topbar-progress-bar">
            <div className="lesson-topbar-progress-fill" style={{ width: `${modulePct}%` }} />
          </div>
          <span className="lesson-topbar-progress-label">{completedCount}/{allLessons.length}</span>
        </div>
      </div>

      {/* Lesson dots navigation */}
      <div className="lesson-dots-bar">
        {allLessons.map((l, i) => {
          const st = getLessonStatus(l.id);
          const isCurrent = l.id === lessonId;
          return (
            <button key={l.id}
              className={`lesson-dot ${isCurrent ? 'current' : ''} ${st === 'completed' ? 'completed' : ''}`}
              onClick={() => goToLesson(l.id)}
              title={`${i + 1}. ${l.title}${st === 'completed' ? ' (completed)' : ''}`}
              aria-label={`Lesson ${i + 1}`}>
              {st === 'completed' && !isCurrent && <CheckmarkIcon size={10} color="#fff" />}
            </button>
          );
        })}
      </div>

      {/* Stage with arrows */}
      <div className="lesson-stage">
        <button className="lesson-stage-arrow" disabled={!hasPrev}
          onClick={() => hasPrev && goToLesson(allLessons[currentIdx - 1].id)} aria-label="Previous lesson">
          <ChevronLeftIcon size={24} />
        </button>

        {/* The main content card */}
        <div className="lesson-card" ref={contentRef}>
          {/* Card header */}
          <div className="lesson-card-header">
            <div className="lesson-card-type">
              <TypeIcon size={16} />
              <span style={{ textTransform: 'capitalize' }}>{lesson.type}</span>
              <span className="lesson-card-duration"><TimeIcon size={12} /> {lesson.duration_minutes} min</span>
            </div>
            <div className="lesson-card-counter">
              {currentIdx + 1} / {allLessons.length}
            </div>
          </div>

          {/* Card title */}
          <h1 className="lesson-card-title">{lesson.title}</h1>

          {/* Content blocks */}
          <div className="lesson-card-content">
            <ContentRenderer blocks={lesson.content?.blocks || []} />

            {lesson.video_url && (
              <div className="video-container">
                <iframe
                  src={lesson.video_url.replace('watch?v=', 'embed/').split('&')[0]}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {activities.map(act => (
              <QuizComponent key={act.id} activity={act} onComplete={(score) => {
                if (user) {
                  fetch(`/api/users/${user.id}/progress`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId, moduleId: lesson.module_id, status: 'completed', score })
                  }).then(() => refreshProgress());
                }
              }} />
            ))}

            {games.map(game => (
              <MiniGame key={game.id} game={game} onComplete={(score) => {
                if (user) {
                  fetch(`/api/users/${user.id}/progress`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lessonId, moduleId: lesson.module_id, status: 'completed', score })
                  }).then(() => refreshProgress());
                }
              }} />
            ))}

            {/* Supplemental Reading — shown on last lesson of each module */}
            {moduleResources.length > 0 && (
              <div className="supplemental-section" style={{ marginTop: 'var(--spacing-07)' }}>
                <h4 className="supplemental-title">
                  <DocumentIcon size={20} color="var(--interactive-primary)" />
                  Supplemental Reading
                </h4>
                <p className="supplemental-desc">
                  Explore these resources to deepen your understanding of this module's topics.
                </p>
                <div className="supplemental-grid">
                  {moduleResources.map((r, ri) => (
                    <a key={ri} href={r.url} target="_blank" rel="noopener noreferrer" className="supplemental-card">
                      <div className="supplemental-card-icon">{r.icon}</div>
                      <div className="supplemental-card-body">
                        <div className="supplemental-card-source">{r.source}</div>
                        <h5 className="supplemental-card-title">{r.title}</h5>
                        <p className="supplemental-card-desc">{r.desc}</p>
                      </div>
                      <LaunchIcon size={16} color="var(--link-primary)" className="supplemental-card-launch" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card footer */}
          <div className="lesson-card-footer">
            <button className="btn btn-primary btn-lg" onClick={markComplete}>
              <CheckmarkFilledIcon size={18} />
              Complete & Continue
            </button>
          </div>
        </div>

        <button className="lesson-stage-arrow" disabled={!hasNext}
          onClick={() => hasNext && goToLesson(allLessons[currentIdx + 1].id)} aria-label="Next lesson">
          <ChevronRightIcon size={24} />
        </button>
      </div>
    </div>
  );
}
