import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const LESSON_ICONS = { lecture: 'auto_stories', video: 'play_circle', checkpoint: 'quiz', game: 'sports_esports', activity: 'edit_note' };

function SafeImage({ src, alt, style, className, fallbackIcon }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div style={{ ...style, background: 'linear-gradient(135deg, var(--bg-secondary), var(--bg-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--text-tertiary)', opacity: 0.4 }}>{fallbackIcon || 'school'}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} style={style} className={className} loading="lazy" onError={() => setError(true)} />;
}

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

  if (!mod) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <span className="material-icons-round animate-pulse" style={{ fontSize: 48, color: 'var(--interactive-primary)' }}>eco</span>
    </div>
  );

  return (
    <div className="main-content">
      {/* Module Hero */}
      <div className="content-hero" style={{ minHeight: 320 }}>
        <SafeImage
          src={mod.image_url}
          alt={mod.title}
          style={{ width: '100%', height: 320, objectFit: 'cover', filter: 'brightness(0.5)' }}
          fallbackIcon="school"
        />
        <div className="content-hero-text">
          <div style={{ fontSize: '0.75rem', color: mod.color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 400 }}>Module {mod.order_index}</div>
          <h2>{mod.title}</h2>
          <p>{mod.subtitle}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-07)' }}>
        {/* Main content */}
        <div>
          <p className="text-block">{mod.description}</p>

          {/* Learning Objectives */}
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 'var(--spacing-06)', marginBottom: 'var(--spacing-07)' }}>
            <h4 style={{ marginBottom: 'var(--spacing-04)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--interactive-primary)' }}>flag</span>
              Learning Objectives
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(mod.learning_objectives || []).map((obj, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.43 }}>
                  <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--support-success)', marginTop: 3, flexShrink: 0 }}>check_circle</span>
                  {obj}
                </li>
              ))}
            </ul>
          </div>

          {/* Benchmarking */}
          {mod.benchmarked_university && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', background: 'var(--bg-secondary)', padding: 'var(--spacing-04) var(--spacing-05)', borderRadius: 8, marginBottom: 'var(--spacing-07)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="material-icons-round" style={{ fontSize: 14 }}>school</span>
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
              return (
                <div key={les.id} onClick={() => navigate(`/lesson/${les.id}`)}
                  className="card" style={{ padding: 'var(--spacing-04) var(--spacing-05)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, borderLeft: `3px solid ${status === 'completed' ? 'var(--support-success)' : status === 'in_progress' ? 'var(--interactive-primary)' : 'transparent'}` }}>
                  <span className="material-icons-round" style={{ fontSize: 20, color: status === 'completed' ? 'var(--support-success)' : 'var(--text-tertiary)' }}>
                    {status === 'completed' ? 'check_circle' : LESSON_ICONS[les.type] || 'article'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{les.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', gap: 8, fontWeight: 400 }}>
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
            <span className="material-icons-round" style={{ fontSize: 18 }}>play_arrow</span>
            {lessons.some(l => getLessonStatus(l.id) === 'in_progress') ? 'Continue Learning' : 'Start Module'}
          </button>
        </div>
      </div>
    </div>
  );
}
