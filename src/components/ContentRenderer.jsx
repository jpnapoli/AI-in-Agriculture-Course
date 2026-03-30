import React, { useState } from 'react';

// Local persona images (served from public/images)
const PERSONA_IMAGES = {
  amara: '/images/persona-amara.png',
  carlos: '/images/persona-carlos.png',
  dr_okafor: '/images/persona-fatima.png',
  rajan: '/images/persona-rajan.png',
};

const PERSONA_NAMES = {
  amara: 'Amara Johnson',
  carlos: 'Carlos Mendoza',
  dr_okafor: 'Dr. Fatima Okafor',
  rajan: 'Rajan Patel',
};

const PERSONA_ROLES = {
  amara: 'Wheat Farmer, Kansas',
  carlos: 'Coffee Farmer, Colombia',
  dr_okafor: 'Agronomist, Nigeria',
  rajan: 'Food Distributor, India',
};

function SafeImage({ src, alt, style, className, fallbackIcon }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="img-fallback" style={style}>
        <span className="material-icons-round" style={{ fontSize: 40, opacity: 0.4 }}>{fallbackIcon || 'image'}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} style={style} className={className} loading="lazy" onError={() => setError(true)} />;
}

export default function ContentRenderer({ blocks }) {
  if (!blocks || !blocks.length) return null;
  return <div>{blocks.map((block, i) => <Block key={i} block={block} />)}</div>;
}

function Block({ block }) {
  switch (block.type) {
    case 'hero': return <HeroBlock {...block} />;
    case 'text': return <p className="text-block">{block.content}</p>;
    case 'stat_cards': return <StatCards stats={block.stats} />;
    case 'timeline': return <Timeline items={block.items} />;
    case 'quote': return <Quote {...block} />;
    case 'callout': return <Callout {...block} />;
    case 'comparison': return <Comparison {...block} />;
    case 'persona_intro': case 'persona_scenario': return <PersonaCard {...block} />;
    case 'interactive_reveal': return <InteractiveReveal {...block} />;
    case 'value_chart': return <ValueChart data={block.data} />;
    case 'case_study_preview': return <CaseStudy {...block} />;
    case 'prompt_test': return <PromptTest {...block} />;
    case 'data_layers': return <DataLayers layers={block.layers} />;
    case 'pillars': return <Pillars items={block.items} />;
    case 'architecture_diagram': return <Architecture components={block.components} />;
    case 'video_intro': return <p className="text-block" style={{ fontStyle: 'italic' }}>{block.text}</p>;
    case 'game_intro': return <div className="callout info"><div className="callout-title"><span className="material-icons-round" style={{ fontSize: 18 }}>sports_esports</span> Mini-Game</div><div className="callout-content">{block.text}</div></div>;
    default: return null;
  }
}

function HeroBlock({ title, subtitle, image }) {
  return (
    <div className="content-hero">
      <SafeImage src={image} alt={title} style={{ width: '100%', height: 300, objectFit: 'cover', filter: 'brightness(0.5)' }} fallbackIcon="landscape" />
      <div className="content-hero-text"><h2>{title}</h2><p>{subtitle}</p></div>
    </div>
  );
}

function StatCards({ stats }) {
  const icons = { people: 'groups', trending_up: 'trending_up', payments: 'payments', warning: 'warning', delete: 'delete', trending_down: 'trending_down', eco: 'eco' };
  return (
    <div className="stat-cards-grid">
      {stats.map((s, i) => (
        <div key={i} className="stat-card">
          <span className="material-icons-round" style={{ fontSize: 24, color: 'var(--interactive-primary)', marginBottom: 8, display: 'block' }}>{icons[s.icon] || 'info'}</span>
          <div className="stat-card-value">{s.value}</div>
          <div className="stat-card-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="timeline">
      {items.map((item, i) => (
        <div key={i} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-year">{item.year}</div>
          <div className="timeline-title">{item.title}</div>
          <div className="timeline-desc">{item.desc}</div>
        </div>
      ))}
    </div>
  );
}

function Quote({ text, author, role }) {
  return (
    <div className="quote-block">
      <div className="quote-text">"{text}"</div>
      <div className="quote-author">{author}</div>
      {role && <div className="quote-role">{role}</div>}
    </div>
  );
}

function Callout({ style, title, content }) {
  const icons = { info: 'info', success: 'check_circle', warning: 'warning', technical: 'code' };
  return (
    <div className={`callout ${style || 'info'}`}>
      <div className="callout-title"><span className="material-icons-round" style={{ fontSize: 18 }}>{icons[style] || 'info'}</span> {title}</div>
      <div className="callout-content">{content}</div>
    </div>
  );
}

function Comparison({ title, items }) {
  return (
    <div>
      {title && <h4 style={{ marginBottom: 'var(--spacing-04)', fontWeight: 600 }}>{title}</h4>}
      <div className="comparison-grid">
        {items.map((item, i) => (
          <div key={i} className="comparison-col">
            <h4>{item.category}</h4>
            <p>{item.description}</p>
            <ul>{item.examples.map((ex, j) => <li key={j}>{ex}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaCard({ persona, scenario }) {
  const imgUrl = PERSONA_IMAGES[persona];
  const name = PERSONA_NAMES[persona] || 'Persona';
  const role = PERSONA_ROLES[persona] || '';
  const [imgError, setImgError] = useState(false);

  return (
    <div className="persona-card">
      <div style={{ flexShrink: 0 }}>
        {imgUrl && !imgError ? (
          <img
            src={imgUrl}
            alt={name}
            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="persona-avatar-fallback">
            {name[0]}
          </div>
        )}
      </div>
      <div className="persona-info">
        <h4>{name}</h4>
        {role && <div className="persona-role">{role}</div>}
        <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{scenario}</p>
      </div>
    </div>
  );
}

function InteractiveReveal({ title, items }) {
  const [openItems, setOpenItems] = useState({});
  return (
    <div>
      {title && <h4 style={{ marginBottom: 'var(--spacing-04)', fontWeight: 600 }}>{title}</h4>}
      <div className="reveal-grid">
        {items.map((item, i) => (
          <div key={i} className={`reveal-card ${openItems[i] ? 'open' : ''}`} onClick={() => setOpenItems(prev => ({ ...prev, [i]: !prev[i] }))}>
            <div className="reveal-visible">
              {item.visible}
              <span className="material-icons-round" style={{ fontSize: 18, transition: 'transform 0.2s', transform: openItems[i] ? 'rotate(180deg)' : '' }}>expand_more</span>
            </div>
            {openItems[i] && <div className="reveal-hidden">{item.hidden}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueChart({ data }) {
  if (!data) return null;
  const Section = ({ title, total, items, color }) => (
    <div className="value-section">
      <div className="value-section-header">
        <div className="value-section-title">{title}</div>
        <div className="value-section-total">${total}B</div>
      </div>
      {items.map((item, i) => (
        <div key={i} className="value-bar-row">
          <div className="value-bar-label">{item.label}</div>
          <div className="value-bar">
            <div className="value-bar-fill" style={{ width: `${(item.value / total) * 100}%`, background: color || 'var(--interactive-primary)' }}>${item.value}B</div>
          </div>
        </div>
      ))}
    </div>
  );
  return (
    <div className="value-chart">
      {data.onAcre && <Section title="On the Acre" total={data.onAcre.total} items={data.onAcre.items} color="var(--ibm-green-60)" />}
      {data.enterprise && <Section title="For the Enterprise" total={data.enterprise.total} items={data.enterprise.items} color="var(--interactive-primary)" />}
    </div>
  );
}

function CaseStudy({ company, title, text }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 0, padding: 'var(--spacing-06)', marginBottom: 'var(--spacing-07)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--interactive-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontWeight: 600 }}>{company}</div>
      <h4 style={{ marginBottom: 'var(--spacing-03)', fontWeight: 600 }}>{title}</h4>
      <p style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{text}</p>
    </div>
  );
}

function PromptTest({ title, platform, prompt, expected }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="prompt-test">
      <div className="prompt-test-header">
        <span className="material-icons-round" style={{ fontSize: 20, color: 'var(--interactive-primary)' }}>terminal</span>
        <strong style={{ fontSize: '0.875rem' }}>{title}</strong>
        <span className="prompt-test-badge">{platform}</span>
      </div>
      <div className="prompt-text">{prompt}</div>
      <button className="prompt-copy-btn" onClick={copy}>
        <span className="material-icons-round" style={{ fontSize: 14 }}>{copied ? 'check' : 'content_copy'}</span>
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
      {expected && <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-04)', fontStyle: 'italic' }}>Expected insight: {expected}</p>}
    </div>
  );
}

function DataLayers({ layers }) {
  const icons = { sensors: 'sensors', flight: 'flight', satellite_alt: 'satellite_alt', cloud: 'cloud' };
  return (
    <div className="data-layers">
      {layers.map((l, i) => (
        <div key={i} className="data-layer-card">
          <div className="data-layer-icon"><span className="material-icons-round">{icons[l.icon] || 'layers'}</span></div>
          <div className="data-layer-info">
            <h4>{l.name}</h4>
            <p>{l.description}</p>
            {l.example && <div className="data-layer-example">{l.example}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function Pillars({ items }) {
  return (
    <div className="pillars-grid">
      {items.map((p, i) => (
        <div key={i} className="pillar-card">
          <div className="pillar-number">{p.number}</div>
          <div className="pillar-title">{p.title}</div>
          <div className="pillar-desc">{p.desc}</div>
        </div>
      ))}
    </div>
  );
}

function Architecture({ components }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--spacing-04)', marginBottom: 'var(--spacing-07)' }}>
      {components.map((c, i) => (
        <div key={i} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: 0, padding: 'var(--spacing-05)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{c.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.34 }}>{c.desc}</div>
        </div>
      ))}
    </div>
  );
}
