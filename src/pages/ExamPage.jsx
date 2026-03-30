import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../App';

// Map each question to a contextual image based on module
const QUESTION_IMAGES = {
  'exam-q-1': '/images/exam-coffee-drone.jpg',
  'exam-q-2': '/images/exam-wheat-field.jpg',
  'exam-q-3': '/images/exam-ai-adoption.jpg',
  'exam-q-4': '/images/exam-supply-chain.jpg',
  'exam-q-5': '/images/exam-climate-weather.jpg',
  'exam-q-6': '/images/exam-crop-genetics.jpg',
  'exam-q-7': '/images/exam-iot-sensing.jpg',
  'exam-q-8': '/images/exam-ai-adoption.jpg',
  'exam-q-9': '/images/exam-coffee-drone.jpg',
  'exam-q-10': '/images/exam-human-ai.jpg',
};

const MODULE_LABELS = {
  'mod-1-revolution': 'Module 1: Agricultural Revolution',
  'mod-2-sensing': 'Module 2: Sensing & IoT',
  'mod-3-crop-mgmt': 'Module 3: Crop Management',
  'mod-4-climate': 'Module 4: Climate Resilience',
  'mod-5-supply-chain': 'Module 5: Supply Chain',
  'mod-6-future': 'Module 6: Human-AI Future',
};

const MODULE_COLORS = {
  'mod-1-revolution': '#198038',
  'mod-2-sensing': '#0043ce',
  'mod-3-crop-mgmt': '#8a3ffc',
  'mod-4-climate': '#007d79',
  'mod-5-supply-chain': '#f1c21b',
  'mod-6-future': '#ee5396',
};

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState('');
  const { user, refreshProgress } = useContext(AppContext);

  useEffect(() => {
    fetch('/api/exam').then(r => r.json()).then(setQuestions);
  }, []);

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= questions.length) return;
    setSlideDirection(idx > currentIndex ? 'slide-left' : 'slide-right');
    setTimeout(() => {
      setCurrentIndex(idx);
      setSlideDirection('');
    }, 10);
  }, [currentIndex, questions.length]);

  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (!started || result) return;
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [started, result, currentIndex, questions.length]);

  const handleSubmit = async () => {
    if (!user) return;
    const answerMap = {};
    questions.forEach(q => { answerMap[q.id] = answers[q.id]; });
    const res = await fetch(`/api/users/${user.id}/exam`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: answerMap })
    });
    const data = await res.json();
    setResult(data);
    refreshProgress();
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  // =========== RESULTS VIEW ===========
  if (result) {
    return (
      <div className="main-content">
        <div className="graduation-card">
          {result.passed ? (
            <>
              <img className="graduation-badge" src="/images/graduation-badge.png" alt="Badge" />
              <h2 className="graduation-title">Congratulations!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-06)' }}>
                You've earned your AI in Agriculture certification.
              </p>
              <div className="graduation-score">{result.percentage}%</div>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: 'var(--spacing-03)' }}>
                {result.score} / {result.totalPoints} points
              </p>
            </>
          ) : (
            <>
              <span className="material-icons-round" style={{ fontSize: 64, color: 'var(--support-warning)', marginBottom: 'var(--spacing-05)' }}>psychology</span>
              <h2 className="graduation-title">Keep Learning!</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-06)' }}>
                You need 70% to pass. Review the modules and try again.
              </p>
              <div className="graduation-score" style={{ color: 'var(--support-warning)' }}>{result.percentage}%</div>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 'var(--spacing-06)' }}
                onClick={() => { setResult(null); setAnswers({}); setStarted(false); setCurrentIndex(0); }}>
                Try Again
              </button>
            </>
          )}
          <div style={{ textAlign: 'left', marginTop: 'var(--spacing-08)' }}>
            <h4 style={{ marginBottom: 'var(--spacing-05)' }}>Review Answers</h4>
            {result.results?.map((r, i) => (
              <div key={i} style={{
                padding: 'var(--spacing-04)',
                marginBottom: 'var(--spacing-03)',
                background: r.correct ? 'rgba(66,190,101,0.06)' : 'rgba(218,30,40,0.06)',
                borderLeft: `3px solid ${r.correct ? 'var(--support-success)' : 'var(--support-error)'}`
              }}>
                <div style={{
                  fontSize: '0.75rem', fontWeight: 600,
                  color: r.correct ? 'var(--support-success)' : 'var(--support-error)',
                  marginBottom: 'var(--spacing-02)'
                }}>
                  {r.correct ? 'Correct' : 'Incorrect'} — Question {i + 1}
                </div>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{r.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========== START SCREEN ===========
  if (!started) {
    return (
      <div className="main-content">
        <div className="exam-intro">
          <div className="exam-intro-visual">
            <div className="exam-intro-icon-ring">
              <span className="material-icons-round" style={{ fontSize: 48, color: '#f1c21b' }}>emoji_events</span>
            </div>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 'var(--spacing-03)', textAlign: 'center' }}>
            Final Examination
          </h1>
          <p style={{
            color: 'var(--text-secondary)', maxWidth: 560,
            margin: '0 auto var(--spacing-07)', textAlign: 'center', lineHeight: 1.5
          }}>
            This exam evaluates your understanding of AI in Agriculture across all six modules.
            Navigate through scenario-based question cards using the arrows or keyboard.
            You need 70% to earn your certification badge.
          </p>
          <div className="exam-intro-stats">
            <div className="exam-intro-stat">
              <div className="exam-intro-stat-value">{questions.length}</div>
              <div className="exam-intro-stat-label">Questions</div>
            </div>
            <div className="exam-intro-stat">
              <div className="exam-intro-stat-value">110</div>
              <div className="exam-intro-stat-label">Total Points</div>
            </div>
            <div className="exam-intro-stat">
              <div className="exam-intro-stat-value">70%</div>
              <div className="exam-intro-stat-label">Pass Threshold</div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-07)' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setStarted(true)}>
              <span className="material-icons-round" style={{ fontSize: 18 }}>play_arrow</span>
              Begin Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========== FLOATING CARD DECK VIEW ===========
  const q = questions[currentIndex];
  if (!q) return null;
  const qImage = QUESTION_IMAGES[q.id] || '/images/exam-human-ai.jpg';
  const moduleLabel = MODULE_LABELS[q.module_id] || '';
  const moduleColor = MODULE_COLORS[q.module_id] || 'var(--interactive-primary)';

  return (
    <div className="exam-deck">
      {/* Top bar */}
      <div className="exam-deck-topbar">
        <div className="exam-deck-topbar-left">
          <span className="material-icons-round" style={{ fontSize: 18, color: 'var(--ibm-yellow-30)' }}>emoji_events</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Final Examination</span>
        </div>
        <div className="exam-deck-topbar-right">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
            {answeredCount} of {questions.length} answered
          </span>
        </div>
      </div>

      {/* Card stage with arrows */}
      <div className="exam-deck-stage">
        {/* Left arrow */}
        <button
          className="exam-deck-arrow"
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="Previous question"
        >
          <span className="material-icons-round">chevron_left</span>
        </button>

        {/* The floating card */}
        <div className={`exam-deck-card ${slideDirection}`} key={currentIndex}>
          {/* Card image */}
          <div className="exam-deck-card-image">
            <img src={qImage} alt="" loading="lazy" />
            <div className="exam-deck-card-image-overlay">
              <span className="exam-deck-card-badge" style={{ borderColor: moduleColor, color: moduleColor }}>
                {moduleLabel}
              </span>
            </div>
            <div className="exam-deck-card-qnum">
              {currentIndex + 1} / {questions.length}
            </div>
          </div>

          {/* Card body */}
          <div className="exam-deck-card-body">
            <div className="exam-deck-card-meta">
              <span className="exam-deck-card-type">{q.type}</span>
              <span className="exam-deck-card-points">{q.points} pts</span>
            </div>

            <h3 className="exam-deck-card-question">{q.question}</h3>

            {q.scenario_context && (
              <div className="exam-deck-card-scenario">
                <span className="material-icons-round" style={{ fontSize: 14, flexShrink: 0, marginTop: 2 }}>lightbulb</span>
                <span>{q.scenario_context}</span>
              </div>
            )}

            {/* Options */}
            {q.type === 'matching' ? (
              <div className="exam-deck-matching">
                <div className="exam-deck-matching-pairs">
                  {q.options.map((pair, pi) => (
                    <div key={pi} className="exam-deck-matching-row">
                      <span className="exam-deck-matching-concept">{pair.concept}</span>
                      <span className="material-icons-round" style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>arrow_forward</span>
                      <span className="exam-deck-matching-app">{pair.application}</span>
                    </div>
                  ))}
                </div>
                <div className="exam-deck-options">
                  {['All matches are correct', 'Some matches are incorrect'].map(opt => (
                    <div key={opt}
                      className={`exam-deck-option ${answers[q.id] === opt ? 'selected' : ''}`}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: opt }))}
                      tabIndex={0}
                      role="radio"
                      aria-checked={answers[q.id] === opt}
                    >
                      <div className="exam-deck-option-radio" />
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="exam-deck-options">
                {q.options.map((opt, oi) => {
                  const optText = typeof opt === 'string' ? opt : opt.text || JSON.stringify(opt);
                  return (
                    <div key={oi}
                      className={`exam-deck-option ${answers[q.id] === optText ? 'selected' : ''}`}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: optText }))}
                      tabIndex={0}
                      role="radio"
                      aria-checked={answers[q.id] === optText}
                    >
                      <div className="exam-deck-option-radio" />
                      <span>{optText}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right arrow */}
        <button
          className="exam-deck-arrow"
          onClick={goNext}
          disabled={currentIndex === questions.length - 1}
          aria-label="Next question"
        >
          <span className="material-icons-round">chevron_right</span>
        </button>
      </div>

      {/* Dot navigation + submit */}
      <div className="exam-deck-footer">
        <div className="exam-deck-dots">
          {questions.map((qq, i) => {
            const isAnswered = !!answers[qq.id];
            const isCurrent = i === currentIndex;
            return (
              <button
                key={i}
                className={`exam-deck-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                onClick={() => goTo(i)}
                title={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                aria-label={`Go to question ${i + 1}`}
              />
            );
          })}
        </div>

        {allAnswered ? (
          <button className="btn btn-primary" onClick={handleSubmit} style={{ marginTop: 'var(--spacing-05)' }}>
            <span className="material-icons-round" style={{ fontSize: 18 }}>check_circle</span>
            Submit Exam
          </button>
        ) : (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-04)' }}>
            Answer all {questions.length} questions to submit
          </div>
        )}
      </div>
    </div>
  );
}
