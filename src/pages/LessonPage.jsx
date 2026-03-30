import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import ContentRenderer from '../components/ContentRenderer';
import QuizComponent from '../components/QuizComponent';
import MiniGame from '../components/MiniGame';

const LESSON_ICONS = { lecture: 'auto_stories', video: 'play_circle', checkpoint: 'quiz', game: 'sports_esports', activity: 'edit_note' };

export default function LessonPage() {
  const { lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [moduleInfo, setModuleInfo] = useState(null);
  const { user, progress, refreshProgress } = useContext(AppContext);
  const navigate = useNavigate();
  const startTime = useRef(Date.now());

  useEffect(() => {
    startTime.current = Date.now();
    fetch(`/api/lessons/${lessonId}`).then(r => r.json()).then(data => {
      setLessonData(data);
      // Mark as in_progress
      if (user) {
        fetch(`/api/users/${user.id}/progress`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId, moduleId: data.lesson.module_id, status: 'in_progress' })
        });
      }
      // Get module lessons for sidebar
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
    // Navigate to next lesson
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

  if (!lessonData) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <span className="material-icons-round animate-pulse" style={{ fontSize: 48, color: 'var(--interactive-primary)' }}>eco</span>
    </div>
  );

  const { lesson, activities, games, videos, prompts } = lessonData;

  return (
    <div className="lesson-layout">
      {/* Sidebar */}
      <aside className="lesson-sidebar">
        {moduleInfo && (
          <div style={{ padding: 'var(--spacing-04) var(--spacing-05)', marginBottom: 'var(--spacing-04)' }}>
            <div onClick={() => navigate(`/module/${moduleInfo.id}`)} style={{ cursor: 'pointer', fontSize: '0.75rem', color: 'var(--interactive-primary)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <span className="material-icons-round" style={{ fontSize: 14 }}>arrow_back</span> Back to Module
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Module {moduleInfo.order_index}</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{moduleInfo.title}</div>
          </div>
        )}
        {allLessons.map(l => {
          const st = getLessonStatus(l.id);
          return (
            <div key={l.id} className={`lesson-nav-item ${l.id === lessonId ? 'active' : ''} ${st === 'completed' ? 'completed' : ''}`}
              onClick={() => navigate(`/lesson/${l.id}`)}>
              <div className="lesson-nav-icon" style={{ background: st === 'completed' ? 'rgba(66,190,101,0.1)' : l.id === lessonId ? 'rgba(15,98,254,0.1)' : 'var(--bg-secondary)', color: st === 'completed' ? 'var(--support-success)' : l.id === lessonId ? 'var(--interactive-primary)' : 'var(--text-tertiary)' }}>
                <span className="material-icons-round" style={{ fontSize: 14 }}>{st === 'completed' ? 'check' : LESSON_ICONS[l.type] || 'article'}</span>
              </div>
              <div style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{l.title}</div>
            </div>
          );
        })}
      </aside>

      {/* Content */}
      <main className="lesson-content">
        <div style={{ marginBottom: 'var(--spacing-03)', fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>{lesson.type}</span>
          <span>·</span>
          <span>{lesson.duration_minutes} min</span>
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--spacing-07)', lineHeight: 1.3 }}>{lesson.title}</h1>

        {/* Render content blocks */}
        <ContentRenderer blocks={lesson.content?.blocks || []} />

        {/* Video embed */}
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

        {/* Activities / Checkpoints */}
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

        {/* Mini Games */}
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

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--spacing-09)', paddingTop: 'var(--spacing-07)', borderTop: '1px solid var(--border-subtle)' }}>
          <button className="btn btn-secondary" onClick={() => {
            const idx = allLessons.findIndex(l => l.id === lessonId);
            if (idx > 0) navigate(`/lesson/${allLessons[idx - 1].id}`);
            else navigate(`/module/${lesson.module_id}`);
          }}>
            <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_back</span> Previous
          </button>
          <button className="btn btn-primary btn-lg" onClick={markComplete}>
            Complete & Continue <span className="material-icons-round" style={{ fontSize: 16 }}>arrow_forward</span>
          </button>
        </div>
      </main>
    </div>
  );
}
