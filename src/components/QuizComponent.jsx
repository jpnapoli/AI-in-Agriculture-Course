import React, { useState } from 'react';

export default function QuizComponent({ activity, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!activity?.content?.questions) return null;
  const questions = activity.content.questions;

  const handleSubmit = () => {
    let s = 0;
    questions.forEach(q => {
      const selected = answers[q.id];
      const correct = q.options.find(o => o.correct);
      if (selected === correct?.id) s++;
    });
    const pct = Math.round((s / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);
    if (onComplete) onComplete(pct);
  };

  return (
    <div className="quiz-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--spacing-06)' }}>
        <span className="material-icons-round" style={{ fontSize: 24, color: 'var(--interactive-primary)' }}>quiz</span>
        <div>
          <h3 style={{ fontSize: '1.25rem' }}>{activity.title}</h3>
          {activity.description && <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>{activity.description}</p>}
        </div>
      </div>

      {questions.map((q, qi) => {
        const correct = q.options.find(o => o.correct);
        return (
          <div key={q.id} className="quiz-question">
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: 8 }}>Question {qi + 1} of {questions.length}</div>
            <div className="quiz-scenario">{q.scenario}</div>
            <div className="quiz-options">
              {q.options.map(opt => {
                let cls = 'quiz-option';
                if (answers[q.id] === opt.id) cls += ' selected';
                if (submitted && opt.correct) cls += ' correct';
                if (submitted && answers[q.id] === opt.id && !opt.correct) cls += ' incorrect';
                return (
                  <div key={opt.id} className={cls} onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: opt.id }))}>
                    <div className="quiz-option-radio" />
                    <span>{opt.text}</span>
                  </div>
                );
              })}
            </div>
            {submitted && q.explanation && <div className="quiz-explanation"><strong>Explanation:</strong> {q.explanation}</div>}
          </div>
        );
      })}

      {!submitted ? (
        <button className="btn btn-primary btn-lg" onClick={handleSubmit}
          disabled={Object.keys(answers).length < questions.length}
          style={{ marginTop: 'var(--spacing-05)', opacity: Object.keys(answers).length < questions.length ? 0.5 : 1 }}>
          Submit Answers
        </button>
      ) : (
        <div style={{ marginTop: 'var(--spacing-05)', padding: 'var(--spacing-06)', background: score >= 70 ? 'rgba(66,190,101,0.08)' : 'rgba(218,30,40,0.08)', borderRadius: 8, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: score >= 70 ? 'var(--support-success)' : 'var(--support-error)', fontFamily: 'var(--font-mono)' }}>{score}%</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{score >= 70 ? 'Great job! You passed this checkpoint.' : 'Review the material and try again.'}</div>
        </div>
      )}
    </div>
  );
}
