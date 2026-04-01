import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import {
  SchoolIcon, CatalogIcon, TimeIcon, TrophyIcon,
  ArrowRightIcon, CheckmarkOutlineIcon, SproutIcon, SatelliteIcon, CropGrowthIcon,
  CloudIcon, DeliveryIcon, PartnershipIcon,
  ChevronDownIcon, ChevronUpIcon, LaunchIcon,
  CheckmarkFilledIcon, CertificateIcon,
  ChevronLeftIcon, ChevronRightIcon, LocationIcon,
  AiModelIcon, WatsonIcon, GameControllerIcon,
  TerminalIcon, PlayFilledIcon,
} from '../components/CarbonIcons';

// University logo components — simple branded SVG marks
function UniLogo({ uni, size = 36 }) {
  const s = size;
  const logos = {
    wageningen: (
      <svg viewBox="0 0 40 40" width={s} height={s} aria-label="Wageningen University">
        <rect width="40" height="40" rx="6" fill="#00a6d6" />
        <text x="20" y="16" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="700" fontFamily="Arial,sans-serif">WUR</text>
        <rect x="8" y="20" width="24" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
        <text x="20" y="33" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="7" fontFamily="Arial,sans-serif">Wageningen</text>
      </svg>
    ),
    cornell: (
      <svg viewBox="0 0 40 40" width={s} height={s} aria-label="Cornell University">
        <rect width="40" height="40" rx="6" fill="#B31B1B" />
        <text x="20" y="24" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="Georgia,serif">CORNELL</text>
        <rect x="8" y="28" width="24" height="1.5" rx="0.75" fill="rgba(255,255,255,0.4)" />
      </svg>
    ),
    ucdavis: (
      <svg viewBox="0 0 40 40" width={s} height={s} aria-label="UC Davis">
        <rect width="40" height="40" rx="6" fill="#002855" />
        <text x="20" y="16" textAnchor="middle" fill="#DAAA00" fontSize="10" fontWeight="700" fontFamily="Arial,sans-serif">UC</text>
        <text x="20" y="29" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="600" fontFamily="Arial,sans-serif">DAVIS</text>
      </svg>
    ),
    ethz: (
      <svg viewBox="0 0 40 40" width={s} height={s} aria-label="ETH Zurich">
        <rect width="40" height="40" rx="6" fill="#1F407A" />
        <text x="20" y="18" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="700" fontFamily="Arial,sans-serif">ETH</text>
        <text x="20" y="31" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7" fontFamily="Arial,sans-serif">Zurich</text>
      </svg>
    ),
    reading: (
      <svg viewBox="0 0 40 40" width={s} height={s} aria-label="University of Reading">
        <rect width="40" height="40" rx="6" fill="#621244" />
        <text x="20" y="18" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="600" fontFamily="Arial,sans-serif">UoR</text>
        <text x="20" y="30" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="6" fontFamily="Arial,sans-serif">Reading</text>
      </svg>
    ),
  };
  return logos[uni] || null;
}

const BENCHMARK_UNIVERSITIES = [
  {
    name: 'Wageningen University & Research', country: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}',
    focus: 'Plant Sciences & Precision Farming', match: 92,
    logo: 'wageningen',
    url: 'https://www.wur.nl/en/education/master/masters-plant-sciences',
    urlLabel: 'MSc Plant Sciences programme',
    courses: [
      { name: 'MSc Plant Sciences (specialisation tracks)', maps: [1, 3] },
      { name: 'Precision Agriculture research group', maps: [2, 3] },
      { name: 'AI, Robotics & Smart Cultivation Technologies', maps: [2, 6] },
      { name: 'Climate-Smart Crop Systems', maps: [4] },
    ],
    explanation: 'Wageningen scores 92% because our curriculum covers their core plant-science and precision agriculture themes — AI foundations, sensor-based monitoring, crop analytics, and climate resilience. Their MSc Plant Sciences programme offers five specialisation tracks from molecular labs to high-tech greenhouses.',
  },
  {
    name: 'Cornell University', country: 'USA', flag: '\u{1F1FA}\u{1F1F8}',
    focus: 'Digital Agriculture Minor (CIDA)', match: 88,
    logo: 'cornell',
    url: 'https://cals.cornell.edu/education/degrees-programs/digital-agriculture-minor',
    urlLabel: 'Digital Agriculture Minor curriculum',
    courses: [
      { name: 'ALS 1110 — Introduction to Digital Agriculture', maps: [1] },
      { name: 'Data Science / Computer Science elective track', maps: [1, 3] },
      { name: 'Remote Sensing & Modeling for Ecosystems (PLSCI 4290)', maps: [2] },
      { name: 'Bio-Robotics & Food Safety Assurance electives', maps: [5, 6] },
    ],
    explanation: 'Cornell scores 88% based on their Digital Agriculture Minor — a 16-18 credit cross-disciplinary programme designed by the Cornell Institute for Digital Agriculture (CIDA). Our course aligns with their data-science, sensing, ethics and ag-production coursework. The gap is in advanced statistical-modeling labs delivered in semester-long practicum format.',
  },
  {
    name: 'UC Davis', country: 'USA', flag: '\u{1F1FA}\u{1F1F8}',
    focus: 'Precision Agriculture Minor', match: 85,
    logo: 'ucdavis',
    url: 'https://catalog.ucdavis.edu/departments-programs-degrees/biological-agricultural-engineering/precision-agriculture-minor/',
    urlLabel: 'Precision Agriculture Minor catalogue',
    courses: [
      { name: 'ESM 186 — Environmental Remote Sensing', maps: [2] },
      { name: 'ABT 150 — Introduction to GIS', maps: [2, 3] },
      { name: 'PLS 120 — Applied Statistics in Agricultural Sciences', maps: [3] },
      { name: 'SSC 109 — Sustainable Nutrient Management', maps: [4, 5] },
    ],
    explanation: 'UC Davis scores 85% based on their Precision Agriculture Minor in the Biological & Agricultural Engineering dept. The 18-credit programme covers GIS, GPS, Variable Rate Technologies, crop & soil sensors, and remote sensing. Their curriculum has deeper wet-lab biology components that our course does not replicate.',
  },
  {
    name: 'ETH Zurich', country: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}',
    focus: 'MSc Agricultural Sciences', match: 82,
    logo: 'ethz',
    url: 'https://usys.ethz.ch/en/studies/agricultural-sciences/master.html',
    urlLabel: 'MSc Agricultural Sciences programme',
    courses: [
      { name: 'MSc Major: Plant Sciences (Crop & Grassland Science)', maps: [3] },
      { name: 'MSc Major: Agricultural Economics', maps: [5] },
      { name: 'Climate Modeling & Environmental Systems', maps: [4] },
      { name: 'Data-Driven Crop Management electives', maps: [1, 2] },
    ],
    explanation: 'ETH scores 82% based on their 120-credit MSc Agricultural Sciences with three majors (Plant Sciences, Animal Sciences, Agricultural Economics). Strong alignment in data-driven crop management and climate modeling. Their emphasis on mechanical robotics and hardware engineering goes beyond our AI-software focus.',
  },
  {
    name: 'University of Reading', country: 'UK', flag: '\u{1F1EC}\u{1F1E7}',
    focus: 'MSc Agriculture & Development', match: 80,
    logo: 'reading',
    url: 'https://www.reading.ac.uk/ready-to-study/study/2026/international-development-and-applied-economics-pg/msc-agriculture-and-development',
    urlLabel: 'MSc Agriculture & Development programme',
    courses: [
      { name: 'AD3CSA — Climate Smart Agriculture', maps: [4] },
      { name: 'Agricultural Technology & Innovation modules', maps: [1, 6] },
      { name: 'Sustainable Land Management', maps: [2, 3] },
      { name: 'Applied Economics & Food Security', maps: [5] },
    ],
    explanation: 'Reading scores 80% reflecting their MSc Agriculture & Development with a strong Climate Smart Agriculture module (AD3CSA) covering global climate systems, plant-soil-climate interactions, and hands-on crop simulation. Their broader policy and development economics modules are outside our scope.',
  },
];

const MODULE_LABELS = [
  'The AI Agriculture Revolution',
  'Sensing the Field',
  'AI-Powered Crop Management',
  'Climate Resilience',
  'Supply Chain Intelligence',
  'The Human-AI Future',
];

const LEARNING_OUTCOMES = [
  { title: 'Understand the AI Agriculture Landscape', desc: 'Map the current state of AI adoption across global agriculture, from precision farming to supply chain intelligence.', Icon: SproutIcon },
  { title: 'Evaluate IoT & Sensing Technologies', desc: 'Assess and recommend IoT sensor deployments, drone imaging systems, and satellite data pipelines for diverse farming contexts.', Icon: SatelliteIcon },
  { title: 'Apply AI to Crop Management', desc: 'Deploy computer vision, predictive analytics, and precision planting models to optimize yield and reduce waste.', Icon: CropGrowthIcon },
  { title: 'Build Climate-Resilient Systems', desc: 'Design AI-powered climate adaptation strategies including flood forecasting, drought management, and weather modeling.', Icon: CloudIcon },
  { title: 'Optimize Agricultural Supply Chains', desc: 'Implement demand forecasting, food safety AI, and cold chain intelligence for reduced waste and better distribution.', Icon: DeliveryIcon },
  { title: 'Lead Human-AI Partnership', desc: 'Navigate ethical considerations, organizational readiness, and the future of human-AI augmentation in agriculture.', Icon: PartnershipIcon },
];

const KEY_SKILLS = [
  { skill: 'AI Needs Assessment', category: 'Strategy', desc: 'Evaluate where AI adds the most value in agricultural operations' },
  { skill: 'Data Pipeline Design', category: 'Technology', desc: 'Architect sensor-to-insight data flows for farm environments' },
  { skill: 'Computer Vision Application', category: 'Technology', desc: 'Apply image recognition to crop disease, weed, and yield estimation' },
  { skill: 'Predictive Modeling', category: 'Technology', desc: 'Build and interpret weather, yield, and demand prediction models' },
  { skill: 'IoT Deployment Planning', category: 'Technology', desc: 'Select, deploy, and manage agricultural IoT sensor networks' },
  { skill: 'Climate Risk Analysis', category: 'Agriculture', desc: 'Assess and mitigate climate-related agricultural risks using AI' },
  { skill: 'Supply Chain Intelligence', category: 'Agriculture', desc: 'Optimize food logistics and reduce post-harvest losses' },
  { skill: 'AI Ethics & Governance', category: 'Leadership', desc: 'Navigate bias, privacy, and fairness in agricultural AI systems' },
  { skill: 'Stakeholder Communication', category: 'Leadership', desc: 'Translate AI insights for farmers, agronomists, and executives' },
  { skill: 'Organizational Readiness', category: 'Strategy', desc: "Assess and improve an organization's AI adoption maturity" },
];

// ── Circular Radar Skill Data ──
// 4 Quadrants: Agriculture (top-right), Technology (bottom-right), Strategy (bottom-left), Leadership (top-left)
// 5 concentric rings = depth levels 1-5 (how deeply the course covers the skill)
const RADAR_QUADRANTS = [
  { name: 'Agriculture', angleStart: 0, angleEnd: 90, color: '#198038' },
  { name: 'Technology', angleStart: 90, angleEnd: 180, color: '#0043ce' },
  { name: 'Strategy', angleStart: 180, angleEnd: 270, color: '#8a3ffc' },
  { name: 'Leadership', angleStart: 270, angleEnd: 360, color: '#ee5396' },
];

const RADAR_SKILLS = [
  // Agriculture quadrant (0-90 degrees)
  { skill: 'Crop Disease Detection', level: 5, angle: 10, quadrant: 'Agriculture', module: 3, modules: [3], desc: 'AI-powered identification of plant diseases from imagery', topics: ['Computer vision', 'Leaf analysis', 'Disease classification'], lessons: ['les-3-2', 'les-3-3'] },
  { skill: 'Precision Planting', level: 4, angle: 25, quadrant: 'Agriculture', module: 3, modules: [3], desc: 'Variable-rate seeding based on AI soil analysis', topics: ['Soil mapping', 'Variable-rate tech', 'Seed optimization'], lessons: ['les-3-1'] },
  { skill: 'Yield Prediction', level: 5, angle: 40, quadrant: 'Agriculture', module: 3, modules: [3, 4], desc: 'Machine learning models for crop yield forecasting', topics: ['Regression models', 'Satellite data', 'Historical patterns'], lessons: ['les-3-4', 'les-3-5'] },
  { skill: 'Climate Risk Analysis', level: 4, angle: 55, quadrant: 'Agriculture', module: 4, modules: [4], desc: 'AI assessment of climate threats to agricultural systems', topics: ['Climate modeling', 'Risk scoring', 'Adaptation planning'], lessons: ['les-4-1', 'les-4-2'] },
  { skill: 'Water Management', level: 4, angle: 70, quadrant: 'Agriculture', module: 4, modules: [2, 4], desc: 'Smart irrigation and water conservation using AI', topics: ['Soil moisture AI', 'Irrigation scheduling', 'Water recycling'], lessons: ['les-4-3', 'les-2-4'] },
  { skill: 'Supply Chain Intelligence', level: 4, angle: 82, quadrant: 'Agriculture', module: 5, modules: [5], desc: 'AI-optimized food logistics and distribution', topics: ['Route optimization', 'Cold chain AI', 'Demand forecasting'], lessons: ['les-5-1', 'les-5-2'] },

  // Technology quadrant (90-180 degrees)
  { skill: 'IoT Deployment Planning', level: 5, angle: 100, quadrant: 'Technology', module: 2, modules: [2], desc: 'Design and deploy agricultural sensor networks', topics: ['Sensor selection', 'Network design', 'Edge computing'], lessons: ['les-2-1', 'les-2-2'] },
  { skill: 'Data Pipeline Design', level: 4, angle: 115, quadrant: 'Technology', module: 2, modules: [2, 3], desc: 'Architect sensor-to-insight data flows', topics: ['ETL processes', 'Real-time pipelines', 'Data lakes'], lessons: ['les-2-3', 'les-2-4'] },
  { skill: 'Drone & Satellite Imaging', level: 4, angle: 128, quadrant: 'Technology', module: 2, modules: [2], desc: 'Aerial and space-based crop monitoring systems', topics: ['Multispectral imaging', 'NDVI analysis', 'Flight planning'], lessons: ['les-2-3', 'les-2-5'] },
  { skill: 'Computer Vision', level: 5, angle: 142, quadrant: 'Technology', module: 3, modules: [3], desc: 'Image recognition for agricultural applications', topics: ['CNN models', 'Object detection', 'Image segmentation'], lessons: ['les-3-2', 'les-3-3'] },
  { skill: 'Predictive Modeling', level: 4, angle: 155, quadrant: 'Technology', module: 3, modules: [3, 4, 5], desc: 'Build and interpret agricultural prediction models', topics: ['Regression', 'Time series', 'Ensemble methods'], lessons: ['les-3-4', 'les-4-2'] },
  { skill: 'Weather Forecasting AI', level: 3, angle: 170, quadrant: 'Technology', module: 4, modules: [4], desc: 'AI-enhanced weather prediction for farming', topics: ['NWP integration', 'Local prediction', 'Alert systems'], lessons: ['les-4-1'] },

  // Strategy quadrant (180-270 degrees)
  { skill: 'AI Needs Assessment', level: 5, angle: 195, quadrant: 'Strategy', module: 1, modules: [1, 6], desc: 'Evaluate where AI adds most value in ag operations', topics: ['Value chain mapping', 'Opportunity scoring', 'ROI analysis'], lessons: ['les-1-1', 'les-1-4'] },
  { skill: 'Organizational Readiness', level: 4, angle: 212, quadrant: 'Strategy', module: 6, modules: [6], desc: 'Assess and improve AI adoption maturity', topics: ['7 pillars framework', 'Change management', 'Skill gaps'], lessons: ['les-6-2', 'les-6-3'] },
  { skill: 'ROI Frameworks', level: 3, angle: 228, quadrant: 'Strategy', module: 1, modules: [1, 5], desc: 'Calculate return on AI investments in agriculture', topics: ['Cost-benefit analysis', 'McKinsey $250B model', 'Payback periods'], lessons: ['les-1-4'] },
  { skill: 'Technology Selection', level: 3, angle: 242, quadrant: 'Strategy', module: 6, modules: [1, 6], desc: 'Choose the right AI tools for specific farm needs', topics: ['Vendor evaluation', 'Build vs buy', 'Platform selection'], lessons: ['les-6-4'] },
  { skill: 'AI Action Planning', level: 4, angle: 258, quadrant: 'Strategy', module: 6, modules: [6], desc: 'Create personal AI implementation roadmaps', topics: ['Goal setting', 'Milestone planning', 'Resource allocation'], lessons: ['les-6-5', 'les-6-6'] },

  // Leadership quadrant (270-360 degrees)
  { skill: 'AI Ethics & Governance', level: 5, angle: 282, quadrant: 'Leadership', module: 6, modules: [6], desc: 'Navigate bias, privacy, and fairness in agricultural AI', topics: ['Bias mitigation', 'Data privacy', 'Fairness frameworks'], lessons: ['les-6-1', 'les-6-2'] },
  { skill: 'Stakeholder Communication', level: 4, angle: 298, quadrant: 'Leadership', module: 6, modules: [1, 6], desc: 'Translate AI insights for diverse audiences', topics: ['Farmer engagement', 'Executive reporting', 'Visualization'], lessons: ['les-6-3'] },
  { skill: 'Human-AI Augmentation', level: 4, angle: 315, quadrant: 'Leadership', module: 6, modules: [6], desc: 'Design workflows where AI enhances human expertise', topics: ['Augmentation vs automation', 'Decision support', 'Trust building'], lessons: ['les-6-4', 'les-6-5'] },
  { skill: 'Food Security Policy', level: 3, angle: 332, quadrant: 'Leadership', module: 1, modules: [1, 4], desc: 'AI-informed policy for global food systems', topics: ['2050 food challenge', 'Global adoption', 'Policy frameworks'], lessons: ['les-1-2', 'les-1-3'] },
  { skill: 'Workforce Development', level: 3, angle: 348, quadrant: 'Leadership', module: 6, modules: [6], desc: 'Train agricultural teams for AI-augmented work', topics: ['Skill mapping', 'Training programs', 'Future workforce'], lessons: ['les-6-5', 'les-6-6'] },
];

const COURSE_MODULES = [
  { num: 1, title: 'The AI Agriculture Revolution', lessons: 6, duration: '45 min', color: '#198038', topics: ['4th Agricultural Revolution', 'Global adoption patterns', 'Value chain analysis'] },
  { num: 2, title: 'Sensing the Field', lessons: 6, duration: '55 min', color: '#0043ce', topics: ['IoT sensors & edge computing', 'Drone & satellite imaging', 'Data quality & preprocessing'] },
  { num: 3, title: 'AI-Powered Crop Management', lessons: 6, duration: '50 min', color: '#8a3ffc', topics: ['Computer vision for crops', 'Precision planting & irrigation', 'Yield prediction'] },
  { num: 4, title: 'Climate Resilience', lessons: 6, duration: '50 min', color: '#007d79', topics: ['Weather forecasting AI', 'Drought & flood systems', 'Climate adaptation strategies'] },
  { num: 5, title: 'Supply Chain Intelligence', lessons: 6, duration: '50 min', color: '#f1c21b', topics: ['Demand forecasting', 'Cold chain monitoring', 'Waste reduction systems'] },
  { num: 6, title: 'The Human-AI Future', lessons: 6, duration: '50 min', color: '#ee5396', topics: ['AI ethics in agriculture', 'Organizational readiness', 'Future workforce models'] },
];

const QUADRANT_COLORS = {
  'Agriculture': '#198038',
  'Technology': '#0043ce', 
  'Strategy': '#8a3ffc',
  'Leadership': '#ee5396',
};

const MODULE_COLORS = {
  1: '#198038', 2: '#0043ce', 3: '#8a3ffc',
  4: '#007d79', 5: '#f1c21b', 6: '#ee5396',
};

const PERSONA_PHOTOS = {
  'Khalid Al-Rashidi': '/images/persona-khalid.png',
  'Amara Johnson': '/images/persona-amara.png',
  'Carlos Mendoza': '/images/persona-carlos.png',
  'Dr. Fatima Okafor': '/images/persona-fatima.png',
  'Rajan Patel': '/images/persona-rajan.png',
};

const PERSONAS = [
  {
    name: 'Khalid Al-Rashidi', role: 'AgriTech Director', location: 'Riyadh, Saudi Arabia', initial: 'KR', color: '#da1e28',
    modules: [2, 4], industry: 'Desert Agriculture & Food Security',
    bio: 'Khalid leads digital transformation at a major Saudi agricultural company focused on desert farming using controlled-environment agriculture and AI-driven water management under Vision 2030.',
    scenario: 'Managing greenhouse operations in Riyadh\'s extreme heat, Khalid deployed AI-controlled climate systems and hydroponic sensors that reduced water consumption by 90% compared to traditional farming.',
    challenge: 'How can AI and controlled-environment agriculture help arid nations achieve food security while conserving scarce water resources?',
  },
  {
    name: 'Amara Johnson', role: 'Wheat Farmer', location: 'Kansas, USA', initial: 'AJ', color: '#198038',
    modules: [1], industry: 'Large-scale Grain Farming',
    bio: 'Amara is a 3rd-generation farmer managing 2,000 acres of wheat and sorghum. She values her family\'s farming intuition but is open to technology that can prove its worth.',
    scenario: 'When her GPS-guided tractor suggested variable-rate seeding based on soil analysis, Amara was skeptical. But after one season of 12% yield improvement, she became the biggest AI adoption advocate in her county.',
    challenge: 'How can AI help experienced farmers make better decisions without replacing generations of intuition?',
  },
  {
    name: 'Carlos Mendoza', role: 'Coffee Farmer', location: 'Huila, Colombia', initial: 'CM', color: '#0043ce',
    modules: [2, 3], industry: 'Specialty Coffee Production',
    bio: 'Carlos runs a mid-size specialty coffee farm. He\'s embraced IoT sensors and drone imaging to monitor his shade-grown Arabica plants and optimize harvest timing.',
    scenario: 'Using soil moisture sensors and a weather prediction model, Carlos reduced water usage by 30% while maintaining his farm\'s SCA cupping score above 85.',
    challenge: 'Can precision sensing make specialty coffee farming both more sustainable and more profitable for smallholder farmers?',
  },
  {
    name: 'Dr. Fatima Okafor', role: 'Agronomist', location: 'Lagos, Nigeria', initial: 'FO', color: '#8a3ffc',
    modules: [3, 4], industry: 'Agricultural Advisory',
    bio: 'Dr. Okafor advises 50 smallholder farms across southwestern Nigeria using satellite monitoring and AI platforms to deliver personalized crop management recommendations.',
    scenario: 'When flooding threatened her farmers\' cassava crops, Fatima used a satellite-based early warning system to issue 72-hour advance alerts, saving 85% of the harvest.',
    challenge: 'How can AI-powered advisory services scale to help millions of smallholder farmers who lack internet connectivity?',
  },
  {
    name: 'Rajan Patel', role: 'Food Distributor', location: 'Mumbai, India', initial: 'RP', color: '#007d79',
    modules: [5, 6], industry: 'Agricultural Supply Chain',
    bio: 'Rajan manages distribution of perishable goods across western India using AI demand forecasting and IoT cold-chain monitoring to minimize food waste.',
    scenario: 'By implementing AI-powered demand prediction across 200 distribution points, Rajan reduced food waste by 40% and improved delivery freshness scores by 25%.',
    challenge: 'Can AI transform agricultural supply chains in developing countries where infrastructure is fragmented?',
  },
];

// ── Interactive Circular Radar Skill Profile ──
function SkillRadarChart() {
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeQuadrant, setActiveQuadrant] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const cx = 250, cy = 250, maxR = 200;
  const rings = 5;
  const ringSpacing = maxR / rings;

  const getPoint = (angleDeg, radius) => {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const concentricRings = Array.from({ length: rings }, (_, i) => i + 1);

  const handleSkillClick = (skill) => {
    if (activeSkill?.skill === skill.skill) {
      setActiveSkill(null);
    } else {
      setActiveSkill(skill);
      setActiveQuadrant(skill.quadrant);
    }
  };

  const handleQuadrantClick = (name) => {
    if (activeQuadrant === name) {
      setActiveQuadrant(null);
      setActiveSkill(null);
    } else {
      setActiveQuadrant(name);
      setActiveSkill(null);
    }
  };

  const filteredSkills = activeQuadrant
    ? RADAR_SKILLS.filter(s => s.quadrant === activeQuadrant)
    : RADAR_SKILLS;

  const displayedSkill = activeSkill || hoveredSkill;

  return (
    <div className="radar-chart-container">
      <div className="radar-chart-visual">
        <svg viewBox="0 0 500 500" className="radar-svg">
          {/* Quadrant background fills */}
          {RADAR_QUADRANTS.map((q, i) => {
            const startRad = (q.angleStart - 90) * (Math.PI / 180);
            const endRad = (q.angleEnd - 90) * (Math.PI / 180);
            const outerR = maxR;
            const x1 = cx + outerR * Math.cos(startRad);
            const y1 = cy + outerR * Math.sin(startRad);
            const x2 = cx + outerR * Math.cos(endRad);
            const y2 = cy + outerR * Math.sin(endRad);
            return (
              <path key={i}
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} Z`}
                fill={q.color}
                fillOpacity={activeQuadrant === q.name ? 0.12 : 0.04}
                stroke="none"
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.3s' }}
                onClick={() => handleQuadrantClick(q.name)}
              />
            );
          })}

          {/* Concentric rings */}
          {concentricRings.map(level => (
            <circle key={level}
              cx={cx} cy={cy} r={ringSpacing * level}
              fill="none"
              stroke="var(--border-subtle)"
              strokeWidth={level === rings ? 1.5 : 0.5}
              strokeDasharray={level < rings ? '3 3' : 'none'}
              opacity={0.5}
            />
          ))}

          {/* Ring level labels */}
          {concentricRings.map(level => (
            <text key={`label-${level}`}
              x={cx + 6} y={cy - ringSpacing * level + 3}
              fill="var(--text-tertiary)" fontSize={9}
              fontFamily="var(--font-mono)" opacity={0.7}>
              L{level}
            </text>
          ))}

          {/* Quadrant divider lines */}
          {RADAR_QUADRANTS.map((q, i) => {
            const end = getPoint(q.angleStart, maxR + 5);
            return (
              <line key={i}
                x1={cx} y1={cy} x2={end.x} y2={end.y}
                stroke="var(--border-strong)" strokeWidth={1} opacity={0.4}
              />
            );
          })}

          {/* Skill dots */}
          {RADAR_SKILLS.map((skill, i) => {
            const radius = ringSpacing * skill.level;
            const pt = getPoint(skill.angle, radius);
            const isActive = activeSkill?.skill === skill.skill;
            const isHovered = hoveredSkill?.skill === skill.skill;
            const isInActiveQuadrant = !activeQuadrant || skill.quadrant === activeQuadrant;
            const qColor = QUADRANT_COLORS[skill.quadrant];

            return (
              <g key={i} style={{ cursor: 'pointer' }}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}>
                {(isActive || isHovered) && (
                  <circle cx={pt.x} cy={pt.y} r={12}
                    fill={qColor} fillOpacity={0.15}
                    stroke={qColor} strokeWidth={1} strokeOpacity={0.4}
                  />
                )}
                {isActive && (
                  <line x1={cx} y1={cy} x2={pt.x} y2={pt.y}
                    stroke={qColor} strokeWidth={1} strokeDasharray="4 4" opacity={0.5}
                  />
                )}
                <circle cx={pt.x} cy={pt.y}
                  r={isActive ? 7 : isHovered ? 6 : 4.5}
                  fill={qColor}
                  fillOpacity={isInActiveQuadrant ? 1 : 0.3}
                  stroke="var(--bg-primary)" strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: 'all 0.2s' }}
                />
                {(isActive || isHovered) && (
                  <text x={pt.x} y={pt.y - 14}
                    textAnchor="middle" dominantBaseline="auto"
                    fill="var(--text-primary)" fontSize={10}
                    fontWeight={600} fontFamily="var(--font-sans)">
                    {skill.skill}
                  </text>
                )}
              </g>
            );
          })}

          {/* Quadrant labels */}
          {RADAR_QUADRANTS.map((q, i) => {
            const midAngle = (q.angleStart + q.angleEnd) / 2;
            const labelPt = getPoint(midAngle, maxR + 28);
            const isActive = activeQuadrant === q.name;
            const skillCount = RADAR_SKILLS.filter(s => s.quadrant === q.name).length;
            return (
              <g key={`qlabel-${i}`} style={{ cursor: 'pointer' }} onClick={() => handleQuadrantClick(q.name)}>
                <text x={labelPt.x} y={labelPt.y}
                  textAnchor="middle" dominantBaseline="middle"
                  fill={isActive ? q.color : 'var(--text-primary)'}
                  fontSize={isActive ? 13 : 12} fontWeight={isActive ? 700 : 600}
                  fontFamily="var(--font-sans)">
                  {q.name}
                </text>
                <text x={labelPt.x} y={labelPt.y + 15}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="var(--text-tertiary)" fontSize={10}
                  fontFamily="var(--font-mono)">
                  {skillCount} skills
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <circle cx={cx} cy={cy} r={18} fill="var(--bg-secondary)" stroke="var(--border-subtle)" strokeWidth={1} />
          <text x={cx} y={cy - 3} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-primary)" fontSize={8} fontWeight={700} fontFamily="var(--font-sans)">SKILL</text>
          <text x={cx} y={cy + 7} textAnchor="middle" dominantBaseline="middle"
            fill="var(--text-primary)" fontSize={8} fontWeight={700} fontFamily="var(--font-sans)">RADAR</text>
        </svg>
      </div>

      {/* Detail panel */}
      <div className="radar-chart-detail">
        {!displayedSkill && !activeQuadrant && (
          <div className="radar-detail-prompt">
            <AiModelIcon size={32} color="var(--interactive-primary)" />
            <h4>Explore the Skill Radar</h4>
            <p>Click any dot on the radar to see where that skill is covered in the course. Each ring represents the depth of coverage (Level 1-5). Click a quadrant label to filter.</p>
            <div className="radar-quadrant-pills">
              {RADAR_QUADRANTS.map(q => (
                <button key={q.name} className="radar-quadrant-pill"
                  style={{ borderColor: q.color, color: q.color }}
                  onClick={() => handleQuadrantClick(q.name)}>
                  {q.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeQuadrant && !displayedSkill && (
          <div className="radar-quadrant-panel">
            <div className="radar-quadrant-header" style={{ borderColor: QUADRANT_COLORS[activeQuadrant] }}>
              <h4 style={{ color: QUADRANT_COLORS[activeQuadrant] }}>{activeQuadrant}</h4>
              <span className="radar-quadrant-count">{filteredSkills.length} skills</span>
            </div>
            <div className="radar-skills-list">
              {filteredSkills.map((sk, i) => (
                <div key={i} className="radar-skill-list-item" onClick={() => handleSkillClick(sk)} style={{ cursor: 'pointer' }}>
                  <div className="radar-skill-list-row">
                    <span className="radar-skill-list-name">{sk.skill}</span>
                    <div className="radar-skill-level-dots">
                      {[1,2,3,4,5].map(l => (
                        <span key={l} className={`radar-level-dot ${l <= sk.level ? 'filled' : ''}`}
                          style={l <= sk.level ? { background: QUADRANT_COLORS[activeQuadrant] } : {}} />
                      ))}
                    </div>
                  </div>
                  <p className="radar-skill-list-desc">{sk.desc}</p>
                </div>
              ))}
            </div>
            <button className="radar-clear-btn" onClick={() => { setActiveQuadrant(null); setActiveSkill(null); }}>Show All Quadrants</button>
          </div>
        )}

        {displayedSkill && (
          <div className="radar-skill-detail" key={displayedSkill.skill}>
            <div className="radar-skill-detail-header">
              <div className="radar-skill-detail-badge" style={{ borderColor: QUADRANT_COLORS[displayedSkill.quadrant], color: QUADRANT_COLORS[displayedSkill.quadrant] }}>
                {displayedSkill.quadrant}
              </div>
              <div className="radar-skill-level-indicator">
                <span className="radar-level-label">Depth:</span>
                <div className="radar-skill-level-dots">
                  {[1,2,3,4,5].map(l => (
                    <span key={l} className={`radar-level-dot ${l <= displayedSkill.level ? 'filled' : ''}`}
                      style={l <= displayedSkill.level ? { background: QUADRANT_COLORS[displayedSkill.quadrant] } : {}} />
                  ))}
                </div>
                <span className="radar-level-text">Level {displayedSkill.level}/5</span>
              </div>
            </div>
            <h4 className="radar-skill-detail-name">{displayedSkill.skill}</h4>
            <p className="radar-skill-detail-desc">{displayedSkill.desc}</p>
            <div className="radar-skill-modules">
              <span className="radar-skill-section-label">Covered in:</span>
              {displayedSkill.modules.map(m => (
                <span key={m} className="radar-skill-module-tag" style={{ borderColor: MODULE_COLORS[m], color: MODULE_COLORS[m] }}>
                  Module {m}: {MODULE_LABELS[m - 1]}
                </span>
              ))}
            </div>
            <div className="radar-skill-topics">
              <span className="radar-skill-section-label">Topics:</span>
              <div className="radar-skill-topic-list">
                {displayedSkill.topics.map((t, i) => (
                  <span key={i} className="radar-skill-topic-tag">{t}</span>
                ))}
              </div>
            </div>
            {activeSkill && (
              <button className="radar-clear-btn" onClick={() => setActiveSkill(null)}>
                Back to {activeQuadrant || 'Overview'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Persona Showcase with photo-based horizontal cards ──
function PersonaShowcase() {
  const [current, setCurrent] = useState(0);
  const p = PERSONAS[current];
  const photoSrc = PERSONA_PHOTOS[p.name];
  return (
    <div className="persona-showcase">
      <div className="persona-hz-card">
        {/* Left: Photo segment */}
        <div className="persona-hz-photo" style={{ borderRight: `4px solid ${p.color}` }}>
          <img
            src={photoSrc}
            alt={p.name}
            className="persona-hz-photo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="persona-hz-photo-fallback" style={{ display: 'none', background: p.color }}>
            {p.initial}
          </div>
          <div className="persona-hz-photo-overlay">
            <h3 className="persona-hz-name">{p.name}</h3>
            <div className="persona-hz-role" style={{ color: p.color }}>{p.role}</div>
            <div className="persona-hz-location"><LocationIcon size={12} /> {p.location}</div>
          </div>
        </div>

        {/* Right: Details segment */}
        <div className="persona-hz-details">
          <div className="persona-hz-industry">{p.industry}</div>
          <p className="persona-hz-bio">{p.bio}</p>

          <div className="persona-scenario-block">
            <div className="persona-scenario-label">Real-World Scenario</div>
            <p className="persona-scenario-text">{p.scenario}</p>
          </div>

          <div className="persona-challenge-block">
            <AiModelIcon size={18} color="var(--interactive-primary)" />
            <p className="persona-challenge-text">{p.challenge}</p>
          </div>

          <div className="persona-modules-tags">
            <span className="persona-tag-label">Featured in:</span>
            {p.modules.map(m => (
              <span key={m} className="persona-module-tag" style={{ borderColor: MODULE_COLORS[m], color: MODULE_COLORS[m] }}>
                Module {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="persona-nav">
        <button className="persona-nav-arrow" onClick={() => setCurrent(c => (c - 1 + PERSONAS.length) % PERSONAS.length)} aria-label="Previous persona"><ChevronLeftIcon size={20} /></button>
        <div className="persona-dots">
          {PERSONAS.map((per, i) => (
            <button key={i} className={`persona-dot ${i === current ? 'active' : ''}`} style={i === current ? { background: per.color } : {}}
              onClick={() => setCurrent(i)} title={per.name} />
          ))}
        </div>
        <button className="persona-nav-arrow" onClick={() => setCurrent(c => (c + 1) % PERSONAS.length)} aria-label="Next persona"><ChevronRightIcon size={20} /></button>
      </div>
    </div>
  );
}

export default function CourseOverviewPage() {
  const navigate = useNavigate();
  const { progress } = useContext(AppContext);
  const [expandedUni, setExpandedUni] = useState(null);

  const toggleUni = (i) => setExpandedUni(expandedUni === i ? null : i);

  return (
    <div className="main-content">
      {/* Hero with background image */}
      <div className="co-hero-image">
        <img src="/images/hero-agriculture-ai.jpg" alt="Drone technology in agriculture" className="co-hero-image-bg" />
        <div className="co-hero-image-overlay" />
        <div className="co-hero-image-content">
          <div className="co-hero-badge">
            <CheckmarkOutlineIcon size={14} />
            Practitioner-Focused Curriculum <span className="co-version-tag">v1.0</span>
          </div>
          <h1 className="co-hero-image-title">
            <strong>AI</strong> in Agriculture:<br />From Field to <strong>Future</strong>
          </h1>
          <p className="co-hero-image-subtitle">
            A comprehensive, practitioner-focused curriculum designed to transform agricultural professionals
            into AI-augmented decision makers.
          </p>
          <div className="co-hero-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
              <ArrowRightIcon size={18} />
              Start Learning
            </button>
          </div>
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
              <div className="co-module-num" style={{ background: '#393939' }}>{mod.num}</div>
              <div className="co-module-info">
                <h4 className="co-module-title">{mod.title}</h4>
                <div className="co-module-meta">
                  <span><CatalogIcon size={14} /> {mod.lessons} lessons</span>
                  <span><TimeIcon size={14} /> {mod.duration}</span>
                </div>
                <div className="co-module-topics">
                  {mod.topics.map((t, ti) => (
                    <span key={ti} className="co-module-topic-tag">{t}</span>
                  ))}
                </div>
              </div>
              <ArrowRightIcon size={20} color="var(--text-tertiary)" className="co-module-arrow" />
            </div>
          ))}
          {/* Final Exam */}
          <div className="co-module-row co-module-exam" onClick={() => navigate('/exam')}>
            <div className="co-module-num" style={{ background: '#393939' }}>
              <TrophyIcon size={18} color="#fff" />
            </div>
            <div className="co-module-info">
              <h4 className="co-module-title">Final Examination</h4>
              <div className="co-module-meta">
                <span><CertificateIcon size={14} /> 10 questions</span>
                <span><TimeIcon size={14} /> 30 min</span>
                <span><CheckmarkOutlineIcon size={14} /> 70% to pass</span>
              </div>
            </div>
            <ArrowRightIcon size={20} color="var(--text-tertiary)" className="co-module-arrow" />
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
                <lo.Icon size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 'var(--spacing-02)' }}>{lo.title}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.43, color: 'var(--text-secondary)' }}>{lo.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Skills — Interactive Spider / Diamond Chart */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Competencies</div>
          <h2 className="section-title">Key Skills You Will Gain</h2>
          <p className="section-desc">
            Explore 23 skills across four dimensions. Each dot represents a skill covered in the course.
            The ring level (1-5) shows the depth of coverage. Click any dot to explore.
          </p>
        </div>
        <SkillRadarChart />
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

        {/* Explanation of percentages */}
        <div className="co-benchmark-explainer">
          <CheckmarkOutlineIcon size={16} color="var(--interactive-primary)" />
          <p>
            <strong>How we calculate match percentages:</strong> Each university's relevant courses are mapped
            topic-by-topic to our six modules. The percentage reflects how many of their core learning objectives
            are covered by our curriculum. Click any university to see the detailed mapping.
          </p>
        </div>

        <div className="co-benchmark-list">
          {BENCHMARK_UNIVERSITIES.map((u, i) => (
            <div key={i} className="co-benchmark-item">
              <div className="co-benchmark-row-v2" onClick={() => toggleUni(i)} role="button" tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleUni(i)}>
                <div className="co-benchmark-left">
                  <UniLogo uni={u.logo} size={36} />
                  <div>
                    <div className="co-benchmark-name">
                      {u.flag} {u.name}
                    </div>
                    <div className="co-benchmark-focus">{u.focus} &middot; {u.country}</div>
                  </div>
                </div>
                <div className="co-benchmark-right">
                  <div className="co-benchmark-bar-v2">
                    <div className="co-benchmark-bar-fill-v2" style={{ width: `${u.match}%` }} />
                  </div>
                  <span className="co-benchmark-pct-v2">{u.match}%</span>
                  {expandedUni === i ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                </div>
              </div>

              {expandedUni === i && (
                <div className="co-benchmark-detail">
                  <p className="co-benchmark-explanation">{u.explanation}</p>
                  <div className="co-benchmark-courses">
                    <h5 className="co-benchmark-courses-title">Course Mapping</h5>
                    {u.courses.map((c, ci) => (
                      <div key={ci} className="co-benchmark-course-row">
                        <span className="co-benchmark-course-name">{c.name}</span>
                        <span className="co-benchmark-course-arrow"><ArrowRightIcon size={14} /></span>
                        <span className="co-benchmark-course-maps">
                          {c.maps.map(m => (
                            <span key={m} className="co-benchmark-module-tag"
                              style={{ borderColor: COURSE_MODULES[m-1].color, color: COURSE_MODULES[m-1].color }}>
                              M{m}: {MODULE_LABELS[m-1]}
                            </span>
                          ))}
                        </span>
                      </div>
                    ))}
                  </div>
                  <a href={u.url} target="_blank" rel="noopener noreferrer" className="co-benchmark-link">
                    <LaunchIcon size={14} />
                    View {u.urlLabel || `${u.name} program details`}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Personas — Photo-based horizontal cards */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Meet Your Guides</div>
          <h2 className="section-title">Learning Personas</h2>
          <p className="section-desc">Follow five agricultural professionals from different countries and industries as they discover how AI transforms their work.</p>
        </div>
        <PersonaShowcase />
      </div>

      {/* Course Tools — Interactive Learning Features (moved from Dashboard) */}
      <div className="co-section">
        <div className="section-header">
          <div className="section-label">Course Tools</div>
          <h2 className="section-title">Interactive Learning Features</h2>
          <p className="section-desc">
            Engage with cutting-edge tools designed to deepen your understanding and make learning practical.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(256px, 1fr))', gap: 'var(--spacing-06)', marginBottom: 'var(--spacing-09)' }}>
          {[
            { Icon: WatsonIcon, title: 'Noor AI Assistant', desc: 'Chat with Noor to dive deeper into topics, ask questions, or generate study materials.' },
            { Icon: GameControllerIcon, title: 'Mini-Games', desc: 'Gamified activities \u2014 from piloting drones to diagnosing crop diseases.' },
            { Icon: AiModelIcon, title: 'Scenario Checkpoints', desc: 'Apply AI to real agricultural challenges in use-case-based assessments.' },
            { Icon: TerminalIcon, title: 'AI Prompts to Try', desc: 'Real prompts you can test on ChatGPT, Perplexity, and other platforms.' },
            { Icon: PlayFilledIcon, title: 'Curated Videos', desc: 'Expert interviews from IBM researchers, professors, and industry leaders.' },
            { Icon: TrophyIcon, title: 'Graduation Badge', desc: 'Complete the course and pass the exam to earn a digital credential.' }
          ].map(f => (
            <div key={f.title} className="feature-card">
              <f.Icon size={32} color="var(--interactive-primary)" style={{ marginBottom: 'var(--spacing-04)', display: 'block' }} />
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-03)', fontWeight: 600, color: 'var(--text-primary)' }}>{f.title}</h4>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.43 }}>{f.desc}</p>
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
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/dashboard')}>
            <ArrowRightIcon size={18} />
            Go to Dashboard
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/exam')}>
            <CertificateIcon size={18} />
            Take Final Exam
          </button>
        </div>
      </div>
    </div>
  );
}
