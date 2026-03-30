import React, { useState, useEffect, useCallback } from 'react';

export default function MiniGame({ game, onComplete }) {
  switch (game.type) {
    case 'spot_ai': return <SpotAIGame game={game} onComplete={onComplete} />;
    case 'drone_pilot': return <DronePilotGame game={game} onComplete={onComplete} />;
    case 'crop_doctor': return <CropDoctorGame game={game} onComplete={onComplete} />;
    case 'weather_predict': return <WeatherGame game={game} onComplete={onComplete} />;
    case 'supply_chain': return <SupplyChainGame game={game} onComplete={onComplete} />;
    default: return <GenericGame game={game} onComplete={onComplete} />;
  }
}

function SpotAIGame({ game, onComplete }) {
  const [found, setFound] = useState({});
  const [showInfo, setShowInfo] = useState(null);
  const items = game.config?.items || [];
  const totalItems = items.length;
  const foundCount = Object.keys(found).length;
  const score = Math.round((foundCount / totalItems) * 100);
  const done = foundCount === totalItems;

  useEffect(() => { if (done && onComplete) onComplete(score); }, [done]);

  const farmObjects = [
    { id: 'tractor', emoji: '🚜', label: 'Tractor' },
    { id: 'drone', emoji: '🛸', label: 'Drone' },
    { id: 'weather', emoji: '🌤️', label: 'Weather' },
    { id: 'sensor', emoji: '📡', label: 'Sensor' },
    { id: 'phone', emoji: '📱', label: 'Phone' },
    { id: 'silo', emoji: '🏗️', label: 'Silo' },
    { id: 'satellite', emoji: '🛰️', label: 'Satellite' },
    { id: 'pivot', emoji: '💧', label: 'Irrigation' },
  ];

  return (
    <div className="game-container">
      <div className="game-header">
        <div>
          <h3 style={{ marginBottom: 4 }}>{game.title}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{game.description}</p>
        </div>
        <div className="game-score">{foundCount}/{totalItems}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {farmObjects.map(obj => {
          const item = items.find(it => it.id === obj.id);
          const isFound = found[obj.id];
          return (
            <div key={obj.id} className={`game-cell ${isFound ? 'found' : ''}`}
              onClick={() => {
                if (!isFound && item) { setFound(p => ({ ...p, [obj.id]: true })); setShowInfo(item); }
              }}
              style={{ cursor: isFound ? 'default' : 'pointer', minHeight: 100 }}>
              <span style={{ fontSize: 32, marginBottom: 4 }}>{obj.emoji}</span>
              <span style={{ fontWeight: 500 }}>{obj.label}</span>
              {isFound && <span className="material-icons-round" style={{ color: 'var(--support-success)', fontSize: 16, marginTop: 4 }}>check_circle</span>}
            </div>
          );
        })}
      </div>
      {showInfo && (
        <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--support-success)', animation: 'fadeInUp 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: 'var(--support-success)' }}>{showInfo.label}</strong>
            <button className="btn btn-ghost" onClick={() => setShowInfo(null)} style={{ fontSize: '0.75rem' }}>Close</button>
          </div>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.7, marginTop: 8 }}>{showInfo.desc}</p>
        </div>
      )}
      {done && (
        <div style={{ marginTop: 20, padding: 20, background: 'rgba(66,190,101,0.08)', borderRadius: 8, textAlign: 'center' }}>
          <span className="material-icons-round" style={{ fontSize: 40, color: 'var(--support-success)' }}>emoji_events</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--support-success)', fontFamily: 'var(--font-mono)', marginTop: 8 }}>All Found!</div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>You identified all AI systems on the farm.</p>
        </div>
      )}
    </div>
  );
}

function DronePilotGame({ game, onComplete }) {
  const zones = game.config?.zones || [];
  const [clicked, setClicked] = useState({});
  const [score, setScore] = useState(0);
  const gridSize = 8;
  const cells = [];

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const zone = zones.find(z => z.x === x && z.y === y);
      cells.push({ x, y, zone });
    }
  }

  const handleClick = (x, y, zone) => {
    const key = `${x}-${y}`;
    if (clicked[key]) return;
    setClicked(p => ({ ...p, [key]: true }));
    if (zone && zone.type !== 'healthy') {
      setScore(s => {
        const ns = s + 20;
        if (ns >= 80 && onComplete) onComplete(ns);
        return ns;
      });
    }
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div><h3>{game.title}</h3><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Click on crop stress zones. Avoid healthy areas.</p></div>
        <div className="game-score">{score} pts</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 1fr)`, gap: 4 }}>
        {cells.map((cell, i) => {
          const key = `${cell.x}-${cell.y}`;
          const wasClicked = clicked[key];
          const bg = wasClicked && cell.zone ? cell.zone.color : wasClicked ? 'var(--support-error)' : '#26de81';
          return (
            <div key={i} onClick={() => handleClick(cell.x, cell.y, cell.zone)}
              style={{ aspectRatio: '1', background: wasClicked ? bg : `hsl(${120 + Math.random() * 20}, 50%, ${30 + Math.random() * 15}%)`, borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', opacity: wasClicked ? 1 : 0.8, transition: 'all 0.2s', border: wasClicked && cell.zone ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)' }}>
              {wasClicked && cell.zone && <span className="material-icons-round" style={{ fontSize: 14 }}>location_on</span>}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-05)', marginTop: 'var(--spacing-04)', flexWrap: 'wrap' }}>
        {[{ color: '#ff6b6b', label: 'Water Stress' }, { color: '#ffd93d', label: 'Nutrient Deficiency' }, { color: '#ff9f43', label: 'Pest Damage' }, { color: '#a55eea', label: 'Disease' }, { color: '#26de81', label: 'Healthy' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} /> {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function CropDoctorGame({ game, onComplete }) {
  const cases = game.config?.cases || [];
  const [currentCase, setCurrentCase] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const c = cases[currentCase];
  if (!c) return null;

  const diagnoses = cases.map(cs => cs.diagnosis);
  const handleSelect = (d) => { if (!revealed) setSelected(d); };
  const handleReveal = () => {
    setRevealed(true);
    if (selected === c.diagnosis) setTotalScore(s => s + 25);
  };
  const handleNext = () => {
    if (currentCase < cases.length - 1) {
      setCurrentCase(i => i + 1); setSelected(null); setRevealed(false);
    } else if (onComplete) onComplete(totalScore);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div><h3>{game.title}</h3><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Case {currentCase + 1} of {cases.length}</p></div>
        <div className="game-score">{totalScore} pts</div>
      </div>
      <div style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--interactive-primary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Symptoms</div>
        <p style={{ fontSize: '0.9rem', marginBottom: 12 }}>{c.symptoms}</p>
        <div style={{ fontSize: '0.75rem', color: 'var(--interactive-primary)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Data</div>
        <p style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>{c.data}</p>
      </div>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>Your Diagnosis:</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {diagnoses.map(d => (
          <div key={d} onClick={() => handleSelect(d)}
            className={`quiz-option ${selected === d ? 'selected' : ''} ${revealed && d === c.diagnosis ? 'correct' : ''} ${revealed && selected === d && d !== c.diagnosis ? 'incorrect' : ''}`}>
            <div className="quiz-option-radio" />
            <span>{d}</span>
          </div>
        ))}
      </div>
      {!revealed ? (
        <button className="btn btn-primary" onClick={handleReveal} disabled={!selected} style={{ opacity: selected ? 1 : 0.5 }}>Check Diagnosis</button>
      ) : (
        <div>
          <div style={{ padding: 12, background: selected === c.diagnosis ? 'rgba(66,190,101,0.08)' : 'rgba(218,30,40,0.08)', borderRadius: 8, marginBottom: 12 }}>
            <strong>Treatment: </strong><span style={{ fontSize: '0.85rem' }}>{c.treatment}</span>
          </div>
          <button className="btn btn-primary" onClick={handleNext}>{currentCase < cases.length - 1 ? 'Next Case' : 'Complete Game'}</button>
        </div>
      )}
    </div>
  );
}

function WeatherGame({ game, onComplete }) {
  const rounds = game.config?.rounds || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const r = rounds[current];
  if (!r) return null;

  const handleCheck = () => {
    setRevealed(true);
    if (selected === r.correct) setScore(s => s + 33);
  };
  const next = () => {
    if (current < rounds.length - 1) { setCurrent(i => i + 1); setSelected(null); setRevealed(false); }
    else if (onComplete) onComplete(score);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div><h3>{game.title}</h3><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Round {current + 1} of {rounds.length}</p></div>
        <div className="game-score">{score} pts</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
        {Object.entries(r.data).map(([k, v]) => (
          <div key={k} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{typeof v === 'number' ? v : v}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: 12 }}>{r.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {r.options.map((opt, i) => (
          <div key={i} className={`quiz-option ${selected === i ? 'selected' : ''} ${revealed && i === r.correct ? 'correct' : ''} ${revealed && selected === i && i !== r.correct ? 'incorrect' : ''}`}
            onClick={() => !revealed && setSelected(i)}>
            <div className="quiz-option-radio" /><span>{opt}</span>
          </div>
        ))}
      </div>
      {!revealed ? (
        <button className="btn btn-primary" onClick={handleCheck} disabled={selected === null} style={{ opacity: selected !== null ? 1 : 0.5 }}>Check Answer</button>
      ) : (
        <div>
          <div className="callout success"><div className="callout-title">Farming Decision</div><div className="callout-content">{r.farming_decision}</div></div>
          <button className="btn btn-primary" onClick={next}>{current < rounds.length - 1 ? 'Next Round' : 'Complete Game'}</button>
        </div>
      )}
    </div>
  );
}

function SupplyChainGame({ game, onComplete }) {
  const decisions = game.config?.decisions || [];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const d = decisions[current];
  if (!d) return null;

  const handleCheck = () => {
    setRevealed(true);
    if (selected === d.optimal) setScore(s => s + d.points);
  };
  const next = () => {
    if (current < decisions.length - 1) { setCurrent(i => i + 1); setSelected(null); setRevealed(false); }
    else if (onComplete) onComplete(score);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <div><h3>{game.title}</h3><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Decision {current + 1} of {decisions.length}</p></div>
        <div className="game-score">{score} pts</div>
      </div>
      <div className="quiz-scenario">{d.context}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        {d.options.map((opt, i) => (
          <div key={i} className={`quiz-option ${selected === i ? 'selected' : ''} ${revealed && i === d.optimal ? 'correct' : ''} ${revealed && selected === i && i !== d.optimal ? 'incorrect' : ''}`}
            onClick={() => !revealed && setSelected(i)}>
            <div className="quiz-option-radio" /><span>{opt}</span>
          </div>
        ))}
      </div>
      {!revealed ? (
        <button className="btn btn-primary" onClick={handleCheck} disabled={selected === null} style={{ opacity: selected !== null ? 1 : 0.5 }}>Submit Decision</button>
      ) : (
        <button className="btn btn-primary" onClick={next} style={{ marginTop: 12 }}>{current < decisions.length - 1 ? 'Next Decision' : 'Complete Game'}</button>
      )}
    </div>
  );
}

function GenericGame({ game, onComplete }) {
  return (
    <div className="game-container">
      <div className="game-header">
        <div><h3>{game.title}</h3><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{game.description}</p></div>
      </div>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--interactive-primary)' }}>sports_esports</span>
        <p style={{ marginTop: 12 }}>Game loading...</p>
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => onComplete && onComplete(80)}>Complete Game</button>
      </div>
    </div>
  );
}
