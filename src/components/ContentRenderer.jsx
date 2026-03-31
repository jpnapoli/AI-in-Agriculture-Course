import React, { useState } from 'react';
import {
  InformationIcon, CheckmarkFilledIcon, WarningIcon, CodeIcon,
  CopyIcon, CheckmarkIcon, ChevronDownIcon, TerminalIcon,
  IdeaIcon, ArrowRightIcon, GroupIcon, GameControllerIcon,
  QuotesIcon,
} from './CarbonIcons';

// Persona colors (Carbon palette) — no AI-generated images
const PERSONA_COLORS = {
  amara: '#198038',
  carlos: '#0043ce',
  dr_okafor: '#8a3ffc',
  rajan: '#007d79',
};

const PERSONA_INITIALS = {
  amara: 'AJ',
  carlos: 'CM',
  dr_okafor: 'FO',
  rajan: 'RP',
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

function SafeImage({ src, alt, style, className }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div className="img-fallback" style={style}>
        <InformationIcon size={32} color="var(--text-tertiary)" style={{ opacity: 0.4 }} />
      </div>
    );
  }
  return <img src={src} alt={alt || ''} style={style} className={className} loading="lazy" onError={() => setError(true)} />;
}

export default function ContentRenderer({ blocks }) {
  if (!blocks || !blocks.length) return null;
  return <div className="cr-cards">{blocks.map((block, i) => <Block key={i} block={block} />)}</div>;
}

function Block({ block }) {
  switch (block.type) {
    case 'hero': return <HeroCard {...block} />;
    case 'text': return <TextCard content={block.content} />;
    case 'stat_cards': return <StatCards stats={block.stats} />;
    case 'timeline': return <TimelineCards items={block.items} />;
    case 'quote': return <QuoteCard {...block} />;
    case 'callout': return <CalloutCard {...block} />;
    case 'comparison': return <ComparisonCards {...block} />;
    case 'persona_intro': case 'persona_scenario': return <PersonaCard {...block} />;
    case 'interactive_reveal': return <RevealCards {...block} />;
    case 'value_chart': return <ValueChart data={block.data} />;
    case 'case_study_preview': return <CaseStudyCard {...block} />;
    case 'prompt_test': return <PromptCard {...block} />;
    case 'data_layers': return <DataLayerCards layers={block.layers} />;
    case 'pillars': return <PillarCards items={block.items} />;
    case 'architecture_diagram': return <ArchitectureCards components={block.components} />;
    case 'video_intro': return <TextCard content={block.text} italic />;
    case 'game_intro': return <GameIntroCard text={block.text} />;
    default: return null;
  }
}

/* Card components — Carbon Design System compliant */

function HeroCard({ title, subtitle, image }) {
  return (
    <div className="cr-hero-card">
      <div className="cr-hero-img">
        <SafeImage src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div className="cr-hero-overlay" />
      </div>
      <div className="cr-hero-text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}

function TextCard({ content, italic }) {
  return (
    <div className="cr-text-card">
      <p style={{ fontStyle: italic ? 'italic' : 'normal' }}>{content}</p>
    </div>
  );
}

function StatCards({ stats }) {
  return (
    <div className="cr-stat-grid">
      {stats.map((s, i) => (
        <div key={i} className="cr-stat-card">
          <div className="cr-stat-value">{s.value}</div>
          <div className="cr-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function TimelineCards({ items }) {
  return (
    <div className="cr-timeline">
      {items.map((item, i) => (
        <div key={i} className="cr-timeline-card">
          <div className="cr-timeline-marker">
            <div className="cr-timeline-dot" />
            {i < items.length - 1 && <div className="cr-timeline-line" />}
          </div>
          <div className="cr-timeline-content">
            <div className="cr-timeline-year">{item.year}</div>
            <h4 className="cr-timeline-title">{item.title}</h4>
            <p className="cr-timeline-desc">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuoteCard({ text, author, role }) {
  return (
    <div className="cr-quote-card">
      <QuotesIcon size={24} color="var(--interactive-primary)" style={{ marginBottom: 'var(--spacing-04)', opacity: 0.6 }} />
      <blockquote className="cr-quote-text">{text}</blockquote>
      <div className="cr-quote-author">{author}</div>
      {role && <div className="cr-quote-role">{role}</div>}
    </div>
  );
}

function CalloutCard({ style, title, content }) {
  const iconMap = {
    info: InformationIcon,
    success: CheckmarkFilledIcon,
    warning: WarningIcon,
    technical: CodeIcon,
  };
  const colorMap = {
    info: 'var(--interactive-primary)',
    success: 'var(--support-success)',
    warning: 'var(--support-warning)',
    technical: 'var(--ibm-purple-60)',
  };
  const IconComp = iconMap[style] || InformationIcon;
  return (
    <div className={`cr-callout cr-callout--${style || 'info'}`}>
      <div className="cr-callout-header">
        <IconComp size={20} color={colorMap[style] || 'var(--interactive-primary)'} />
        <span>{title}</span>
      </div>
      <p className="cr-callout-body">{content}</p>
    </div>
  );
}

function ComparisonCards({ title, items }) {
  return (
    <div className="cr-section">
      {title && <h4 className="cr-section-title">{title}</h4>}
      <div className="cr-comparison-grid">
        {items.map((item, i) => (
          <div key={i} className="cr-comparison-card">
            <h4 className="cr-comparison-heading">{item.category}</h4>
            <p className="cr-comparison-desc">{item.description}</p>
            <ul className="cr-comparison-list">
              {item.examples.map((ex, j) => (
                <li key={j}>
                  <CheckmarkIcon size={14} color="var(--support-success)" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonaCard({ persona, scenario }) {
  const name = PERSONA_NAMES[persona] || 'Persona';
  const role = PERSONA_ROLES[persona] || '';
  const color = PERSONA_COLORS[persona] || '#0f62fe';
  const initials = PERSONA_INITIALS[persona] || name[0];

  return (
    <div className="cr-persona-card">
      <div className="cr-persona-header">
        <div className="cr-persona-avatar">
          <div className="cr-persona-initial" style={{ background: color }}>{initials}</div>
        </div>
        <div>
          <h4 className="cr-persona-name">{name}</h4>
          <div className="cr-persona-role">{role}</div>
        </div>
      </div>
      <p className="cr-persona-scenario">{scenario}</p>
    </div>
  );
}

function RevealCards({ title, items }) {
  const [openItems, setOpenItems] = useState({});
  return (
    <div className="cr-section">
      {title && <h4 className="cr-section-title">{title}</h4>}
      <div className="cr-reveal-grid">
        {items.map((item, i) => (
          <div key={i}
            className={`cr-reveal-card ${openItems[i] ? 'open' : ''}`}
            onClick={() => setOpenItems(prev => ({ ...prev, [i]: !prev[i] }))}
            role="button"
            tabIndex={0}
            aria-expanded={!!openItems[i]}
          >
            <div className="cr-reveal-front">
              <span>{item.visible}</span>
              <ChevronDownIcon
                size={16}
                color="var(--text-tertiary)"
                style={{ transform: openItems[i] ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
              />
            </div>
            {openItems[i] && <div className="cr-reveal-back">{item.hidden}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ValueChart({ data }) {
  if (!data) return null;
  const Section = ({ title, total, items, color }) => (
    <div className="cr-value-section">
      <div className="cr-value-header">
        <span>{title}</span>
        <strong>${total}B</strong>
      </div>
      {items.map((item, i) => (
        <div key={i} className="cr-value-row">
          <div className="cr-value-label">{item.label}</div>
          <div className="cr-value-bar-bg">
            <div className="cr-value-bar-fill" style={{ width: `${(item.value / total) * 100}%`, background: color }}>
              ${item.value}B
            </div>
          </div>
          <p className="cr-value-desc">{item.desc}</p>
        </div>
      ))}
    </div>
  );
  return (
    <div className="cr-value-chart">
      {data.onAcre && <Section title="On the Acre" total={data.onAcre.total} items={data.onAcre.items} color="var(--ibm-green-60)" />}
      {data.enterprise && <Section title="For the Enterprise" total={data.enterprise.total} items={data.enterprise.items} color="var(--interactive-primary)" />}
    </div>
  );
}

function CaseStudyCard({ company, title, text }) {
  return (
    <div className="cr-case-card">
      <div className="cr-case-badge">{company}</div>
      <h4 className="cr-case-title">{title}</h4>
      <p className="cr-case-body">{text}</p>
    </div>
  );
}

function PromptCard({ title, platform, prompt, expected }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="cr-prompt-card">
      <div className="cr-prompt-header">
        <TerminalIcon size={20} color="var(--interactive-primary)" />
        <strong>{title}</strong>
        <span className="cr-prompt-badge">{platform}</span>
      </div>
      <pre className="cr-prompt-text">{prompt}</pre>
      <button className="cr-prompt-copy" onClick={copy}>
        {copied ? <CheckmarkIcon size={14} color="currentColor" /> : <CopyIcon size={14} color="currentColor" />}
        {copied ? 'Copied!' : 'Copy Prompt'}
      </button>
      {expected && <p className="cr-prompt-expected">Expected: {expected}</p>}
    </div>
  );
}

function DataLayerCards({ layers }) {
  return (
    <div className="cr-layer-grid">
      {layers.map((l, i) => (
        <div key={i} className="cr-layer-card">
          <div className="cr-layer-level">{l.name}</div>
          <p className="cr-layer-desc">{l.description}</p>
          {l.example && <div className="cr-layer-example">{l.example}</div>}
        </div>
      ))}
    </div>
  );
}

function PillarCards({ items }) {
  return (
    <div className="cr-pillar-grid">
      {items.map((p, i) => (
        <div key={i} className="cr-pillar-card">
          <div className="cr-pillar-num">{p.number}</div>
          <h4 className="cr-pillar-title">{p.title}</h4>
          <p className="cr-pillar-desc">{p.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ArchitectureCards({ components }) {
  return (
    <div className="cr-arch-grid">
      {components.map((c, i) => (
        <div key={i} className="cr-arch-card">
          <h4 className="cr-arch-name">{c.name}</h4>
          <p className="cr-arch-desc">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}

function GameIntroCard({ text }) {
  return (
    <div className="cr-callout cr-callout--info">
      <div className="cr-callout-header">
        <GameControllerIcon size={20} color="var(--interactive-primary)" />
        <span>Mini-Game</span>
      </div>
      <p className="cr-callout-body">{text}</p>
    </div>
  );
}
