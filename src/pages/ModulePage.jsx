import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import QuizComponent from '../components/QuizComponent';
import MiniGame from '../components/MiniGame';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckmarkIcon, EcoIcon,
  CatalogIcon, PlayFilledIcon, CertificateIcon, GameControllerIcon,
  EditIcon, DocumentIcon, ChevronLeftIcon, ChevronRightIcon,
  CheckmarkFilledIcon, TimeIcon, LaunchIcon, BotIcon,
  InformationIcon, QuotesIcon, WarningIcon, CodeIcon,
  TerminalIcon, CopyIcon, IdeaIcon, FlagIcon,
  SproutIcon, SatelliteIcon, CropGrowthIcon, CloudIcon,
  DeliveryIcon, PartnershipIcon,
} from '../components/CarbonIcons';

// ============================================================
// IBM DESIGN LANGUAGE — ISOMETRIC SVG ILLUSTRATIONS
// Full-size graphics with richer detail
// ============================================================
const IBM = {
  blue80: '#001d6c', blue60: '#0f62fe', blue50: '#4589ff', blue40: '#78a9ff', blue20: '#d0e2ff', blue10: '#edf5ff',
  green60: '#198038', green50: '#24a148', green40: '#42be65', green20: '#a7f0ba', green10: '#defbe6',
  purple60: '#8a3ffc', purple50: '#a56eff', purple40: '#be95ff', purple20: '#e8daff',
  teal60: '#007d79', teal50: '#009d9a', teal40: '#08bdba', teal20: '#9ef0f0',
  red60: '#da1e28', red40: '#ff8389',
  yellow30: '#f1c21b', yellow20: '#fddc69',
  gray100: '#161616', gray80: '#393939', gray60: '#6f6f6f', gray30: '#c6c6c6', gray10: '#f4f4f4',
  white: '#ffffff',
};

// Richer isometric illustrations (300x300 viewbox for bigger cards)
function IsometricSVG({ type, color = IBM.blue60, size = 280 }) {
  const c1 = color;
  const c2 = color + '99';
  const c3 = color + '33';
  const c4 = color + '15';

  const svgs = {
    farm: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="gfarm1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient>
          <linearGradient id="gfarm2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={IBM.green40}/><stop offset="100%" stopColor={IBM.green60}/></linearGradient>
        </defs>
        {/* Ground plane */}
        <path d="M30 200 L150 260 L270 200 L150 140 Z" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Barn */}
        <rect x="100" y="90" width="100" height="70" rx="2" fill="url(#gfarm1)" transform="skewX(-5)"/>
        <polygon points="95,90 150,50 205,90" fill={c1}/>
        <rect x="130" y="115" width="40" height="45" rx="2" fill={c3}/>
        <line x1="150" y1="115" x2="150" y2="160" stroke={c2} strokeWidth="1"/>
        <line x1="130" y1="137" x2="170" y2="137" stroke={c2} strokeWidth="1"/>
        {/* Silo */}
        <rect x="220" y="80" width="30" height="80" rx="15" fill={c2}/>
        <ellipse cx="235" cy="80" rx="15" ry="6" fill={c1}/>
        {/* Sun */}
        <circle cx="60" cy="55" r="22" fill={IBM.yellow30} opacity="0.85"/>
        {[0,45,90,135,180,225,270,315].map((a,i) => (
          <line key={i} x1={60+28*Math.cos(a*Math.PI/180)} y1={55+28*Math.sin(a*Math.PI/180)}
                x2={60+36*Math.cos(a*Math.PI/180)} y2={55+36*Math.sin(a*Math.PI/180)}
                stroke={IBM.yellow30} strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        ))}
        {/* Crop rows */}
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <line x1={50+i*45} y1={210+i*4} x2={80+i*45} y2={240+i*2} stroke={IBM.green60} strokeWidth="2" strokeDasharray="6 4"/>
            <circle cx={65+i*45} cy={225+i*3} r="4" fill={IBM.green40}/>
          </g>
        ))}
        {/* Data connection lines */}
        <path d="M150 160 Q180 180 210 170" stroke={IBM.blue40} strokeWidth="1" fill="none" strokeDasharray="4 3" opacity="0.6"/>
        <circle cx="210" cy="170" r="5" fill={IBM.blue60} opacity="0.7"/>
      </svg>
    ),
    sensors: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="gsen1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient>
        </defs>
        {/* Ground */}
        <path d="M30 210 L150 270 L270 210 L150 150 Z" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Drone */}
        <rect x="115" y="40" width="70" height="20" rx="4" fill={c1}/>
        <rect x="130" y="50" width="40" height="30" rx="2" fill={c2}/>
        <circle cx="150" cy="62" r="8" fill={IBM.white} opacity="0.3"/>
        {/* Propellers */}
        <line x1="100" y1="45" x2="130" y2="45" stroke={IBM.gray60} strokeWidth="2"/>
        <line x1="170" y1="45" x2="200" y2="45" stroke={IBM.gray60} strokeWidth="2"/>
        <circle cx="100" cy="45" r="12" fill="none" stroke={c2} strokeWidth="1" opacity="0.4"/>
        <circle cx="200" cy="45" r="12" fill="none" stroke={c2} strokeWidth="1" opacity="0.4"/>
        {/* Satellite signal */}
        <circle cx="250" cy="60" r="8" fill={IBM.blue60}/>
        {[18,28,38].map((r,i) => (
          <path key={i} d={`M${250-r} ${60} A${r} ${r} 0 0 1 ${250+r} ${60}`}
                fill="none" stroke={IBM.blue40} strokeWidth="1" opacity={0.6-i*0.15}
                transform={`rotate(-45 250 60)`}/>
        ))}
        {/* Sensor nodes */}
        {[[70,175],[150,195],[230,180]].map(([x,y],i) => (
          <g key={i}>
            <rect x={x-12} y={y-8} width="24" height="40" rx="3" fill="url(#gsen1)"/>
            <circle cx={x} cy={y-2} r="4" fill={IBM.white} opacity="0.4"/>
            <line x1={x} y1={y+32} x2={x} y2={y+60} stroke={c2} strokeWidth="1.5"/>
            {/* Signal rings */}
            <circle cx={x} cy={y-2} r="18" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.3"/>
          </g>
        ))}
        {/* Data connections */}
        <path d="M70 175 Q110 140 150 195" stroke={IBM.blue40} strokeWidth="1" fill="none" strokeDasharray="4 3" opacity="0.5"/>
        <path d="M150 195 Q190 155 230 180" stroke={IBM.blue40} strokeWidth="1" fill="none" strokeDasharray="4 3" opacity="0.5"/>
        {/* Data cloud */}
        <rect x="110" y="110" width="80" height="35" rx="6" fill={c2} opacity="0.6"/>
        <rect x="120" y="118" width="30" height="4" rx="2" fill={IBM.white} opacity="0.4"/>
        <rect x="120" y="126" width="50" height="3" rx="1" fill={IBM.white} opacity="0.3"/>
        <rect x="120" y="133" width="40" height="3" rx="1" fill={IBM.white} opacity="0.25"/>
      </svg>
    ),
    ai_crop: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <defs>
          <linearGradient id="gcrop1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={IBM.green40}/><stop offset="100%" stopColor={IBM.green60}/></linearGradient>
        </defs>
        {/* Ground */}
        <path d="M20 220 L150 270 L280 220 L150 170 Z" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        {/* Plant stems */}
        {[[80,220],[130,215],[180,218]].map(([x,y],i) => (
          <g key={i}>
            <path d={`M${x} ${y} Q${x} ${y-60} ${x+10} ${y-80}`} stroke="url(#gcrop1)" strokeWidth="3" fill="none"/>
            <ellipse cx={x+12} cy={y-85} rx="18" ry="12" fill={IBM.green40} opacity={0.8-i*0.1}/>
            <ellipse cx={x-8} cy={y-55} rx="12" ry="8" fill={IBM.green40} opacity="0.5"/>
          </g>
        ))}
        {/* AI Scanner device */}
        <rect x="200" y="70" width="60" height="85" rx="5" fill={c1}/>
        <rect x="208" y="78" width="44" height="28" rx="2" fill={IBM.white} opacity="0.15"/>
        {/* Screen bars */}
        {[0,1,2,3].map(i => (
          <rect key={i} x="208" y={112+i*9} width={20+Math.random()*20} height="4" rx="2" fill={IBM.white} opacity={0.3+i*0.05}/>
        ))}
        {/* Scan beam */}
        <path d="M200 110 L170 130 L130 215" stroke={c2} strokeWidth="1.5" fill="none" strokeDasharray="5 3" opacity="0.5"/>
        <circle cx="130" cy="215" r="20" fill="none" stroke={c1} strokeWidth="1" opacity="0.3"/>
        {/* Health indicator */}
        <circle cx="240" cy="180" r="18" fill={IBM.green60} opacity="0.8"/>
        <path d="M232 180 L238 186 L250 174" stroke={IBM.white} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    climate: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Ground with temp gradient */}
        <path d="M20 210 L150 265 L280 210 L150 155 Z" fill={IBM.teal20} opacity="0.3" stroke={IBM.teal40} strokeWidth="1"/>
        {/* Temperature line chart */}
        <path d="M40 195 Q70 175 100 185 Q130 165 160 180 Q190 160 220 175 Q250 155 280 170" stroke={IBM.teal60} strokeWidth="2.5" fill="none"/>
        {[40,100,160,220,280].map((x,i) => (
          <circle key={i} cx={x} cy={[195,185,180,175,170][i]} r="4" fill={IBM.teal60}/>
        ))}
        {/* Cloud with rain */}
        <circle cx="90" cy="60" r="28" fill={IBM.blue20}/>
        <circle cx="115" cy="52" r="24" fill={IBM.blue40} opacity="0.7"/>
        <circle cx="68" cy="68" r="18" fill={IBM.blue40} opacity="0.6"/>
        {[80,95,110].map((x,i) => (
          <line key={i} x1={x} y1="88" x2={x-3} y2="115" stroke={IBM.blue60} strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        ))}
        {/* Sun */}
        <circle cx="220" cy="55" r="25" fill={IBM.yellow30} opacity="0.85"/>
        {[0,60,120,180,240,300].map((a,i) => (
          <line key={i} x1={220+32*Math.cos(a*Math.PI/180)} y1={55+32*Math.sin(a*Math.PI/180)}
                x2={220+42*Math.cos(a*Math.PI/180)} y2={55+42*Math.sin(a*Math.PI/180)}
                stroke={IBM.yellow30} strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
        ))}
        {/* Thermometer */}
        <rect x="30" y="110" width="12" height="70" rx="6" fill={IBM.white} stroke={IBM.red60} strokeWidth="1.5"/>
        <circle cx="36" cy="185" r="10" fill={IBM.red60}/>
        <rect x="33" y="140" width="6" height="40" rx="3" fill={IBM.red40}/>
        {/* Wind arrows */}
        <path d="M170 110 L210 105" stroke={IBM.gray60} strokeWidth="1.5" markerEnd="url(#windA)"/>
        <path d="M175 125 L205 120" stroke={IBM.gray60} strokeWidth="1" opacity="0.6"/>
        <defs><marker id="windA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,1 L7,4 L0,7" fill={IBM.gray60}/></marker></defs>
      </svg>
    ),
    supply_chain: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <defs>
          <marker id="chainArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,1 L9,5 L0,9Z" fill={c2}/></marker>
        </defs>
        {/* Ground */}
        <path d="M20 230 L150 275 L280 230 L150 185 Z" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Farm box */}
        <rect x="15" y="100" width="65" height="50" rx="4" fill={IBM.green60}/>
        <rect x="22" y="107" width="50" height="14" rx="2" fill={IBM.white} opacity="0.15"/>
        <rect x="22" y="125" width="30" height="4" rx="1" fill={IBM.white} opacity="0.2"/>
        <rect x="22" y="133" width="40" height="4" rx="1" fill={IBM.white} opacity="0.15"/>
        {/* Processing box */}
        <rect x="117" y="80" width="65" height="60" rx="4" fill={c1}/>
        <rect x="124" y="87" width="50" height="16" rx="2" fill={IBM.white} opacity="0.15"/>
        <circle cx="149" cy="120" r="8" fill={IBM.white} opacity="0.15"/>
        {/* Retail box */}
        <rect x="220" y="95" width="65" height="55" rx="4" fill={IBM.teal60}/>
        <rect x="227" y="102" width="50" height="14" rx="2" fill={IBM.white} opacity="0.15"/>
        <rect x="227" y="120" width="35" height="4" rx="1" fill={IBM.white} opacity="0.2"/>
        <rect x="227" y="128" width="45" height="4" rx="1" fill={IBM.white} opacity="0.15"/>
        {/* Connecting arrows */}
        <path d="M80 125 L117 110" stroke={c2} strokeWidth="2" markerEnd="url(#chainArrow)"/>
        <path d="M182 110 L220 115" stroke={c2} strokeWidth="2" markerEnd="url(#chainArrow)"/>
        {/* Truck */}
        <rect x="95" y="170" width="35" height="22" rx="3" fill={IBM.gray80}/>
        <rect x="84" y="175" width="15" height="17" rx="2" fill={IBM.gray60}/>
        <circle cx="93" cy="195" r="5" fill={IBM.gray30}/><circle cx="120" cy="195" r="5" fill={IBM.gray30}/>
        {/* Data flow */}
        <path d="M50 95 Q150 40 250 90" stroke={IBM.blue40} strokeWidth="1" fill="none" strokeDasharray="5 3" opacity="0.5"/>
        <circle cx="150" cy="55" r="6" fill={IBM.blue60} opacity="0.6"/>
      </svg>
    ),
    future: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Central hub */}
        <circle cx="150" cy="140" r="55" fill="none" stroke={c3} strokeWidth="2"/>
        <circle cx="150" cy="140" r="38" fill="none" stroke={c2} strokeWidth="1.5"/>
        <circle cx="150" cy="140" r="22" fill={c1}/>
        <circle cx="150" cy="140" r="10" fill={IBM.white} opacity="0.3"/>
        {/* Orbital connections */}
        {[[150,60],[230,110],[230,175],[150,225],[70,175],[70,110]].map(([x,y],i) => (
          <g key={i}>
            <line x1="150" y1="140" x2={x} y2={y} stroke={c2} strokeWidth="1.5" opacity="0.4"/>
            <circle cx={x} cy={y} r="10" fill={[IBM.green40,IBM.blue40,IBM.purple40,IBM.teal40,IBM.yellow30,IBM.red40][i]}/>
          </g>
        ))}
        {/* Labels */}
        <rect x="70" y="245" width="160" height="35" rx="4" fill={c3}/>
        <rect x="85" y="252" width="60" height="5" rx="2" fill={c1} opacity="0.6"/>
        <rect x="85" y="261" width="90" height="4" rx="2" fill={c2} opacity="0.4"/>
        {/* Pulse rings */}
        <circle cx="150" cy="140" r="65" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.2">
          <animate attributeName="r" values="55;75;55" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite"/>
        </circle>
      </svg>
    ),
    stats: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Base */}
        <rect x="30" y="230" width="240" height="30" rx="3" fill={c4}/>
        {/* Bars */}
        {[
          [55,100,35,130,IBM.blue40],
          [105,130,35,100,IBM.green40],
          [155,60,35,170,c1],
          [205,150,35,80,IBM.purple40]
        ].map(([x,y,w,h,f],i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={f}/>
        ))}
        {/* Trend line */}
        <path d="M55 95 L105 125 L155 55 L205 145" stroke={IBM.yellow30} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {[55,105,155,205].map((x,i) => (
          <circle key={i} cx={x} cy={[95,125,55,145][i]} r="5" fill={IBM.yellow30}/>
        ))}
        {/* Grid lines */}
        {[100,150,200].map((y,i) => (
          <line key={i} x1="40" y1={y} x2="250" y2={y} stroke={IBM.gray30} strokeWidth="0.5" opacity="0.3"/>
        ))}
      </svg>
    ),
    quote: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="40" y="50" width="220" height="180" rx="8" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Quote marks */}
        <path d="M75 105 Q75 75 105 75" stroke={c1} strokeWidth="6" fill="none" strokeLinecap="round"/>
        <path d="M125 105 Q125 75 155 75" stroke={c1} strokeWidth="6" fill="none" strokeLinecap="round"/>
        {/* Text lines */}
        {[130,148,166,184].map((y,i) => (
          <rect key={i} x="70" y={y} width={160-i*20} height="6" rx="3" fill={c2} opacity={0.5-i*0.08}/>
        ))}
        {/* Author avatar */}
        <circle cx="90" cy="215" r="12" fill={c1}/>
        <rect x="112" y="208" width="70" height="5" rx="2" fill={c2} opacity="0.6"/>
        <rect x="112" y="218" width="50" height="4" rx="2" fill={c2} opacity="0.35"/>
      </svg>
    ),
    checkpoint: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="130" r="65" fill={c4}/>
        <circle cx="150" cy="130" r="45" fill={c3}/>
        <path d="M120 130 L140 150 L180 110" stroke={c1} strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="70" y="220" width="160" height="35" rx="6" fill={c1}/>
        <rect x="100" y="231" width="100" height="6" rx="3" fill={IBM.white} opacity="0.5"/>
        {/* Stars */}
        {[90,150,210].map((x,i) => (
          <polygon key={i} points={`${x},70 ${x+4},80 ${x+14},80 ${x+6},87 ${x+9},97 ${x},91 ${x-9},97 ${x-6},87 ${x-14},80 ${x-4},80`}
                   fill={IBM.yellow30} opacity={0.7}/>
        ))}
      </svg>
    ),
    video: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="35" y="55" width="230" height="145" rx="8" fill={c3}/>
        <rect x="40" y="60" width="220" height="135" rx="5" fill={IBM.gray100}/>
        {/* Play button */}
        <circle cx="150" cy="127" r="30" fill={c1} opacity="0.9"/>
        <polygon points="140,110 140,144 168,127" fill={IBM.white} opacity="0.9"/>
        {/* Progress bar */}
        <rect x="60" y="215" width="180" height="8" rx="4" fill={c4}/>
        <rect x="60" y="215" width="72" height="8" rx="4" fill={c1}/>
        <circle cx="132" cy="219" r="6" fill={c1}/>
        {/* Waveform */}
        {[0,1,2,3,4,5,6,7].map(i => (
          <rect key={i} x={70+i*22} y={240} width="8" height={10+Math.sin(i)*8+8} rx="2" fill={c2} opacity="0.4"/>
        ))}
      </svg>
    ),
    game: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Controller body */}
        <rect x="55" y="70" width="190" height="120" rx="20" fill={c3}/>
        {/* D-pad */}
        <rect x="85" y="110" width="14" height="44" rx="3" fill={c2}/>
        <rect x="78" y="123" width="28" height="14" rx="3" fill={c2}/>
        <rect x="88" y="126" width="8" height="8" rx="1" fill={c1}/>
        {/* Buttons */}
        <circle cx="210" cy="110" r="10" fill={c1}/><circle cx="230" cy="125" r="10" fill={IBM.green40}/>
        <circle cx="210" cy="140" r="10" fill={IBM.yellow30}/><circle cx="190" cy="125" r="10" fill={IBM.red40}/>
        {/* Screen */}
        <rect x="120" y="90" width="50" height="35" rx="4" fill={IBM.gray100}/>
        <rect x="125" y="95" width="40" height="25" rx="2" fill={c1} opacity="0.3"/>
        {/* Stars/score */}
        <text x="150" y="113" textAnchor="middle" fill={IBM.white} fontSize="14" fontWeight="700" fontFamily="monospace">★★★</text>
        {/* Start button */}
        <rect x="100" y="210" width="100" height="30" rx="15" fill={c1}/>
        <rect x="125" y="220" width="50" height="6" rx="3" fill={IBM.white} opacity="0.5"/>
      </svg>
    ),
    persona: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="90" r="42" fill={c3}/>
        <circle cx="150" cy="82" r="26" fill={c2}/>
        <ellipse cx="150" cy="160" rx="50" ry="32" fill={c1}/>
        {/* Speech bubble */}
        <rect x="190" y="55" width="80" height="50" rx="8" fill={c4} stroke={c3} strokeWidth="1"/>
        <polygon points="190,80 178,90 195,85" fill={c4} stroke={c3} strokeWidth="1"/>
        <rect x="200" y="65" width="50" height="4" rx="2" fill={c2} opacity="0.5"/>
        <rect x="200" y="74" width="40" height="3" rx="1" fill={c2} opacity="0.35"/>
        <rect x="200" y="82" width="55" height="3" rx="1" fill={c2} opacity="0.3"/>
        {/* Name card */}
        <rect x="75" y="210" width="150" height="40" rx="5" fill={c4}/>
        <rect x="90" y="220" width="60" height="5" rx="2" fill={c1} opacity="0.7"/>
        <rect x="90" y="230" width="80" height="4" rx="2" fill={c2} opacity="0.4"/>
      </svg>
    ),
    text: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="40" y="40" width="220" height="220" rx="6" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Header */}
        <rect x="60" y="65" width="120" height="10" rx="4" fill={c1} opacity="0.8"/>
        {/* Text lines */}
        {[0,1,2,3,4,5,6].map(i => (
          <rect key={i} x="60" y={95+i*22} width={180-((i%3)*30)} height="5" rx="2" fill={c2} opacity={0.45-i*0.03}/>
        ))}
        {/* Highlight */}
        <rect x="55" y={95+2*22-3} width={190} height="14" rx="2" fill={c1} opacity="0.08"/>
        {/* Icon */}
        <circle cx="240" cy="230" r="15" fill={c1} opacity="0.6"/>
        <rect x="232" y="225" width="16" height="3" rx="1" fill={IBM.white} opacity="0.5"/>
        <rect x="232" y="231" width="12" height="3" rx="1" fill={IBM.white} opacity="0.4"/>
      </svg>
    ),
    network: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Central node */}
        <circle cx="150" cy="150" r="25" fill={c1}/>
        <circle cx="150" cy="150" r="12" fill={IBM.white} opacity="0.25"/>
        {/* Outer nodes */}
        {[[80,70],[220,70],[260,150],[220,230],[80,230],[40,150]].map(([x,y],i) => (
          <g key={i}>
            <line x1="150" y1="150" x2={x} y2={y} stroke={c2} strokeWidth="1.5" opacity="0.5"/>
            <circle cx={x} cy={y} r="14" fill={[IBM.green40,IBM.blue40,IBM.purple40,IBM.teal40,IBM.yellow30,IBM.red40][i]}/>
          </g>
        ))}
        {/* Secondary connections */}
        <line x1="80" y1="70" x2="220" y2="70" stroke={c3} strokeWidth="1" opacity="0.3"/>
        <line x1="220" y1="230" x2="80" y2="230" stroke={c3} strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    insights: (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Lightbulb */}
        <circle cx="150" cy="100" r="50" fill={IBM.yellow30} opacity="0.2"/>
        <circle cx="150" cy="100" r="35" fill={IBM.yellow30} opacity="0.3"/>
        <circle cx="150" cy="100" r="20" fill={IBM.yellow30} opacity="0.8"/>
        {/* Filament */}
        <path d="M142 92 Q150 80 158 92" stroke={IBM.yellow30} strokeWidth="2" fill="none"/>
        {/* Base */}
        <rect x="138" y="140" width="24" height="15" rx="3" fill={IBM.gray60}/>
        <rect x="140" y="150" width="20" height="3" fill={IBM.gray30}/>
        {/* Rays */}
        {[0,45,90,135,180,225,270,315].map((a,i) => (
          <line key={i} x1={150+55*Math.cos(a*Math.PI/180)} y1={100+55*Math.sin(a*Math.PI/180)}
                x2={150+68*Math.cos(a*Math.PI/180)} y2={100+68*Math.sin(a*Math.PI/180)}
                stroke={IBM.yellow30} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        ))}
        {/* Key points */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="60" y={195+i*30} width="180" height="22" rx="4" fill={c4}/>
            <circle cx="78" cy={206+i*30} r="5" fill={c1}/>
            <rect x="90" y={202+i*30} width={100-i*15} height="5" rx="2" fill={c2} opacity="0.5"/>
          </g>
        ))}
      </svg>
    ),
  };
  return svgs[type] || svgs.insights;
}

// Module theme mapping
const MODULE_THEMES = {
  'mod-1-revolution': { icon: 'farm', color: IBM.green60, accent: IBM.green40 },
  'mod-2-sensing': { icon: 'sensors', color: IBM.blue60, accent: IBM.blue40 },
  'mod-3-crop-mgmt': { icon: 'ai_crop', color: IBM.purple60, accent: IBM.purple40 },
  'mod-4-climate': { icon: 'climate', color: IBM.teal60, accent: IBM.teal40 },
  'mod-5-supply-chain': { icon: 'supply_chain', color: IBM.blue60, accent: IBM.blue40 },
  'mod-6-future': { icon: 'future', color: IBM.purple60, accent: IBM.purple40 },
};

// ============================================================
// MODULE-SPECIFIC ILLUSTRATIONS — unique SVG per (module, slideType)
// Each module gets content-appropriate graphics instead of generic placeholders
// ============================================================
function ModuleIllustration({ moduleId, slideType, color = IBM.blue60, size = 260 }) {
  const c1 = color;
  const c2 = color + '99';
  const c3 = color + '33';
  const c4 = color + '15';
  const uid = `${moduleId}-${slideType}`.replace(/[^a-z0-9]/gi, '');

  // Module-specific SVG library — keys are "moduleId:slideType"
  const illustrations = {
    // ─── MOD 1: AI Revolution ─── tractor, barn, field analytics
    'mod-1-revolution:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <defs><linearGradient id={`g${uid}1`} x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor={c1}/><stop offset="100%" stopColor={c2}/></linearGradient></defs>
        <path d="M20 230 L150 270 L280 230 L150 190 Z" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        {/* Tractor */}
        <rect x="40" y="130" width="80" height="55" rx="6" fill={c1}/>
        <rect x="60" y="115" width="40" height="20" rx="3" fill={c2}/>
        <circle cx="55" cy="195" r="16" fill={IBM.gray80}/><circle cx="55" cy="195" r="8" fill={IBM.gray30}/>
        <circle cx="108" cy="195" r="22" fill={IBM.gray80}/><circle cx="108" cy="195" r="10" fill={IBM.gray30}/>
        {/* Rising chart overlay */}
        <rect x="160" y="60" width="110" height="80" rx="5" fill={IBM.white} stroke={c3} strokeWidth="1.5"/>
        <path d="M172 125 L190 105 L210 115 L230 85 L250 70" stroke={c1} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {[172,190,210,230,250].map((x,i)=> <circle key={i} cx={x} cy={[125,105,115,85,70][i]} r="3.5" fill={c1}/>)}
        <path d="M172 125 L190 105 L210 115 L230 85 L250 70 L250 130 L172 130 Z" fill={c4}/>
        <text x="205" y="155" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">AI Adoption Growth</text>
      </svg>
    ),
    'mod-1-revolution:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Traditional vs AI farming */}
        <rect x="15" y="40" width="120" height="110" rx="6" fill={IBM.gray10} stroke={IBM.gray30} strokeWidth="1"/>
        <text x="75" y="62" textAnchor="middle" fontSize="10" fill={IBM.gray60} fontWeight="600" fontFamily="sans-serif">Traditional</text>
        <rect x="30" y="74" width="90" height="6" rx="2" fill={IBM.gray30}/><rect x="30" y="86" width="70" height="6" rx="2" fill={IBM.gray30}/><rect x="30" y="98" width="80" height="6" rx="2" fill={IBM.gray30}/>
        <path d="M40 120 L55 115 L70 125 L85 118 L100 122" stroke={IBM.gray60} strokeWidth="1.5" fill="none"/>
        <rect x="165" y="40" width="120" height="110" rx="6" fill={c4} stroke={c1} strokeWidth="1.5"/>
        <text x="225" y="62" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">AI-Powered</text>
        <rect x="180" y="74" width="90" height="6" rx="2" fill={c3}/><rect x="180" y="86" width="70" height="6" rx="2" fill={c3}/><rect x="180" y="98" width="80" height="6" rx="2" fill={c3}/>
        <path d="M190 125 L205 118 L220 112 L235 100 L250 85" stroke={c1} strokeWidth="2" fill="none"/>
        {/* Arrow between */}
        <path d="M140 95 L160 95" stroke={c1} strokeWidth="2" markerEnd={`url(#arr${uid})`} />
        <defs><marker id={`arr${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,2 L8,5 L0,8Z" fill={c1}/></marker></defs>
        {/* Bottom yield comparison bars */}
        <text x="75" y="185" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Yield</text>
        <rect x="30" y="192" width="90" height="18" rx="3" fill={IBM.gray30}/><text x="75" y="205" textAnchor="middle" fontSize="9" fill={IBM.gray80} fontFamily="sans-serif">Baseline</text>
        <text x="225" y="185" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Yield</text>
        <rect x="180" y="192" width="90" height="18" rx="3" fill={c1}/><text x="225" y="205" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">+20-35%</text>
      </svg>
    ),
    'mod-1-revolution:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* World map with AI adoption dots */}
        <ellipse cx="150" cy="130" rx="125" ry="85" fill={c4} stroke={c3} strokeWidth="1"/>
        {[[60,100],[90,90],[150,75],[200,85],[240,100],[80,140],[120,130],[180,120],[220,140],[150,160]].map(([x,y],i)=> (
          <g key={i}>
            <circle cx={x} cy={y} r={4+Math.random()*5} fill={c1} opacity={0.3+Math.random()*0.5}/>
            {i<4 && <circle cx={x} cy={y} r={10+i*3} fill="none" stroke={c2} strokeWidth="0.5" opacity="0.3"/>}
          </g>
        ))}
        <circle cx="150" cy="130" r="10" fill={c1}/>
        <text x="150" y="134" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">AI</text>
        <rect x="50" y="225" width="200" height="30" rx="5" fill={c3}/>
        <text x="150" y="244" textAnchor="middle" fontSize="10" fill={c1} fontFamily="sans-serif">Global AgTech Investment: $10B+</text>
      </svg>
    ),
    'mod-1-revolution:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Three pillars of AI agriculture */}
        {[{x:50,h:120,label:'Data'},{x:125,h:150,label:'AI/ML'},{x:200,h:100,label:'Action'}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={230-p.h} width="50" height={p.h} rx="4" fill={[IBM.green40,c1,IBM.teal40][i]}/>
            <rect x={p.x+5} y={235-p.h} width="40" height="12" rx="2" fill={IBM.white} opacity="0.2"/>
            <text x={p.x+25} y={250} textAnchor="middle" fontSize="10" fill={IBM.gray60} fontFamily="sans-serif">{p.label}</text>
          </g>
        ))}
        <path d="M75 110 L150 80 M150 80 L225 130" stroke={c2} strokeWidth="1.5" strokeDasharray="5 3" fill="none"/>
        <text x="150" y="40" textAnchor="middle" fontSize="11" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Agriculture Framework</text>
        <rect x="20" y="260" width="260" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-1-revolution:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Farm data architecture */}
        <rect x="90" y="20" width="120" height="40" rx="6" fill={c1}/><text x="150" y="45" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif">Cloud AI Engine</text>
        <rect x="25" y="110" width="80" height="35" rx="4" fill={IBM.green60}/><text x="65" y="132" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Field Sensors</text>
        <rect x="195" y="110" width="80" height="35" rx="4" fill={IBM.teal60}/><text x="235" y="132" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Satellite</text>
        <rect x="110" y="110" width="80" height="35" rx="4" fill={IBM.blue60}/><text x="150" y="132" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Drones</text>
        <rect x="60" y="200" width="80" height="35" rx="4" fill={c2}/><text x="100" y="222" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Analytics</text>
        <rect x="160" y="200" width="80" height="35" rx="4" fill={c2}/><text x="200" y="222" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Automation</text>
        <rect x="80" y="265" width="140" height="25" rx="4" fill={c3}/><text x="150" y="282" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Farm Management Dashboard</text>
        {/* Connections */}
        <line x1="65" y1="145" x2="130" y2="60" stroke={c2} strokeWidth="1" strokeDasharray="4 3"/>
        <line x1="150" y1="145" x2="150" y2="60" stroke={c2} strokeWidth="1" strokeDasharray="4 3"/>
        <line x1="235" y1="145" x2="170" y2="60" stroke={c2} strokeWidth="1" strokeDasharray="4 3"/>
        <line x1="100" y1="200" x2="120" y2="145" stroke={c3} strokeWidth="1"/><line x1="200" y1="200" x2="180" y2="145" stroke={c3} strokeWidth="1"/>
        <line x1="120" y1="235" x2="150" y2="265" stroke={c3} strokeWidth="1"/><line x1="180" y1="235" x2="150" y2="265" stroke={c3} strokeWidth="1"/>
      </svg>
    ),
    'mod-1-revolution:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Stacked farm data layers */}
        {[{y:50,label:'Satellite Imagery',c:IBM.teal40},{y:100,label:'Weather Data',c:IBM.blue40},{y:150,label:'Soil Sensors',c:IBM.green40},{y:200,label:'Crop History',c:c1}].map((l,i)=> (
          <g key={i}>
            <path d={`M40 ${l.y} L150 ${l.y+30} L260 ${l.y} L150 ${l.y-20} Z`} fill={l.c} opacity={0.7-i*0.1} stroke={IBM.white} strokeWidth="1"/>
            <text x="150" y={l.y+8} textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="270" textAnchor="middle" fontSize="10" fill={IBM.gray60} fontFamily="sans-serif">Integrated Farm Data Stack</text>
      </svg>
    ),
    'mod-1-revolution:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={IBM.green40} fontFamily="monospace">$ ai-farm analyze</text>
        <text x="45" y="98" fontSize="9" fill={c2} fontFamily="monospace">🌾 Scanning field data...</text>
        <text x="45" y="116" fontSize="9" fill={c2} fontFamily="monospace">📊 Yield prediction: +28%</text>
        <text x="45" y="134" fontSize="9" fill={c2} fontFamily="monospace">💧 Irrigation: optimal</text>
        <text x="45" y="152" fontSize="9" fill={IBM.green40} fontFamily="monospace">✓ Recommendations ready</text>
        <rect x="45" y="168" width="8" height="14" rx="1" fill={IBM.green40} opacity="0.8"><animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.2s" repeatCount="indefinite"/></rect>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">AI Prompt Engineering for Agriculture</text>
      </svg>
    ),
    'mod-1-revolution:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Mind map: AI Agriculture concepts */}
        <circle cx="150" cy="130" r="35" fill={c1}/><text x="150" y="126" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">AI</text><text x="150" y="138" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Agriculture</text>
        {[{x:60,y:55,t:'Precision'},{x:240,y:55,t:'Robotics'},{x:40,y:180,t:'Data'},{x:260,y:180,t:'IoT'},{x:150,y:240,t:'ML'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="130" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="22" fill={[IBM.green40,IBM.blue40,IBM.purple40,IBM.teal40,IBM.yellow30][i]} opacity="0.8"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),
    // ─── MOD 1 additional: objectives — checklist with growing seedling ───
    'mod-1-revolution:objectives': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Seedling growing from checklist */}
        <rect x="60" y="40" width="180" height="220" rx="8" fill={c4} stroke={c3} strokeWidth="1"/>
        <rect x="60" y="40" width="180" height="32" rx="8" fill={c1}/>
        <text x="150" y="61" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Learning Objectives</text>
        {[0,1,2,3,4].map(i => (
          <g key={i}>
            <rect x="80" y={88+i*35} width="16" height="16" rx="3" fill={i<3?c1:c3}/>
            {i<3 && <path d={`M84 ${96+i*35} L88 ${100+i*35} L96 ${92+i*35}`} stroke={IBM.white} strokeWidth="2" fill="none" strokeLinecap="round"/>}
            <rect x="105" y={90+i*35} width={100-i*10} height="6" rx="3" fill={c2} opacity={0.6-i*0.08}/>
            <rect x="105" y={100+i*35} width={70-i*8} height="4" rx="2" fill={c3} opacity="0.4"/>
          </g>
        ))}
        {/* Growing seedling sprouting from the page */}
        <path d="M200 260 Q200 220 210 200" stroke={IBM.green60} strokeWidth="3" fill="none"/>
        <ellipse cx="218" cy="192" rx="14" ry="10" fill={IBM.green40}/>
        <ellipse cx="200" cy="205" rx="10" ry="7" fill={IBM.green40} opacity="0.7"/>
        <circle cx="215" cy="180" r="5" fill={IBM.yellow30} opacity="0.6"/>
      </svg>
    ),
    // ─── MOD 1 additional: hero — sunrise over smart farm ───
    'mod-1-revolution:hero': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Sunrise over AI-powered farm */}
        <defs><linearGradient id={`gh${uid}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={IBM.yellow30}/><stop offset="60%" stopColor={c4}/><stop offset="100%" stopColor={IBM.green10}/></linearGradient></defs>
        <rect x="0" y="0" width="300" height="300" rx="0" fill={`url(#gh${uid})`}/>
        {/* Sun */}
        <circle cx="150" cy="120" r="40" fill={IBM.yellow30} opacity="0.8"/>
        {[0,30,60,90,120,150,180,210,240,270,300,330].map((a,i) => (
          <line key={i} x1={150+50*Math.cos(a*Math.PI/180)} y1={120+50*Math.sin(a*Math.PI/180)}
                x2={150+65*Math.cos(a*Math.PI/180)} y2={120+65*Math.sin(a*Math.PI/180)}
                stroke={IBM.yellow30} strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        ))}
        {/* Rolling hills */}
        <path d="M0 200 Q75 170 150 195 Q225 220 300 190 L300 300 L0 300 Z" fill={IBM.green20} opacity="0.6"/>
        <path d="M0 220 Q100 200 200 215 Q260 225 300 210 L300 300 L0 300 Z" fill={IBM.green40} opacity="0.5"/>
        {/* Farm buildings silhouette */}
        <rect x="60" y="195" width="30" height="25" rx="2" fill={c1} opacity="0.7"/>
        <polygon points="55,195 75,178 95,195" fill={c1} opacity="0.7"/>
        <rect x="200" y="188" width="20" height="32" rx="8" fill={c2} opacity="0.6"/>
        {/* Drone */}
        <rect x="110" y="100" width="18" height="6" rx="2" fill={c1} opacity="0.8"/>
        <line x1="105" y1="103" x2="115" y2="103" stroke={IBM.gray60} strokeWidth="1.5"/>
        <line x1="123" y1="103" x2="133" y2="103" stroke={IBM.gray60} strokeWidth="1.5"/>
        {/* Data waves from drone */}
        <path d="M119 110 Q125 125 135 120" stroke={c2} strokeWidth="1" fill="none" strokeDasharray="3 3" opacity="0.6"/>
        {/* Title area */}
        <rect x="40" y="250" width="220" height="30" rx="5" fill={c1} opacity="0.85"/>
        <text x="150" y="270" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">The AI Agriculture Revolution</text>
      </svg>
    ),
    // ─── MOD 1 additional: insight — lightbulb with agricultural data streams ───
    'mod-1-revolution:insight': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Agricultural insight lightbulb */}
        <circle cx="150" cy="110" r="55" fill={IBM.yellow30} opacity="0.15"/>
        <circle cx="150" cy="110" r="40" fill={IBM.yellow30} opacity="0.25"/>
        <circle cx="150" cy="110" r="25" fill={IBM.yellow30} opacity="0.7"/>
        <path d="M142 102 Q150 88 158 102" stroke={IBM.yellow30} strokeWidth="2.5" fill="none"/>
        <rect x="140" y="150" width="20" height="15" rx="3" fill={IBM.gray60}/>
        {/* Data streams flowing into the bulb */}
        {[{x1:30,y1:80,label:'🌾'},{x1:270,y1:80,label:'📡'},{x1:30,y1:140,label:'💧'},{x1:270,y1:140,label:'🌤️'}].map((s,i) => (
          <g key={i}>
            <path d={`M${s.x1} ${s.y1} Q${i%2===0?90:210} ${s.y1} 150 110`} stroke={[IBM.green40,IBM.blue40,IBM.teal40,IBM.purple40][i]} strokeWidth="1.5" fill="none" strokeDasharray="4 4" opacity="0.5"/>
            <text x={s.x1} y={s.y1+5} textAnchor="middle" fontSize="14">{s.label}</text>
          </g>
        ))}
        {/* Key insight cards */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x="50" y={195+i*30} width="200" height="24" rx="4" fill={c4} stroke={c3} strokeWidth="0.5"/>
            <circle cx="70" cy={207+i*30} r="6" fill={[IBM.green40,c1,IBM.teal40][i]}/>
            <rect x="84" y={203+i*30} width={120-i*15} height="5" rx="2" fill={c2} opacity="0.5"/>
          </g>
        ))}
      </svg>
    ),
    // ─── MOD 1 additional: timeline — farming evolution epochs ───
    'mod-1-revolution:timeline': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Four agricultural revolutions timeline */}
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Four Agricultural Revolutions</text>
        <line x1="45" y1="60" x2="45" y2="270" stroke={c3} strokeWidth="2"/>
        {[
          {y:70,yr:'~10,000 BC',t:'Neolithic',d:'Domestication of crops & animals',c:IBM.green40,icon:'🌾'},
          {y:120,yr:'18th Century',t:'Mechanization',d:'Plows, seed drills, crop rotation',c:IBM.blue40,icon:'⚙️'},
          {y:170,yr:'1960s',t:'Green Revolution',d:'Fertilizers, irrigation, high-yield crops',c:IBM.teal40,icon:'🧪'},
          {y:220,yr:'2020s',t:'AI Revolution',d:'Sensors, ML, precision agriculture',c:c1,icon:'🤖'},
        ].map((e,i) => (
          <g key={i}>
            <circle cx="45" cy={e.y+10} r="8" fill={e.c}/>
            <text x="45" y={e.y+14} textAnchor="middle" fontSize="10">{e.icon}</text>
            <text x="65" y={e.y+5} fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">{e.yr}</text>
            <text x="65" y={e.y+18} fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">{e.t}</text>
            <text x="65" y={e.y+30} fontSize="7.5" fill={IBM.gray60} fontFamily="sans-serif">{e.d}</text>
            {i<3 && <line x1="45" y1={e.y+18} x2="45" y2={e.y+52} stroke={c3} strokeWidth="1.5" strokeDasharray="3 3"/>}
          </g>
        ))}
        {/* Highlight current era */}
        <rect x="58" y="214" width="225" height="42" rx="4" fill={c4} stroke={c1} strokeWidth="1.5"/>
      </svg>
    ),
    // ─── MOD 1 additional: quote — expert speech bubble with farm ───
    'mod-1-revolution:quote': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Expert quote with agriculture context */}
        <path d="M20 230 L150 270 L280 230 L150 190 Z" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        {/* Crop rows in background */}
        {[0,1,2,3].map(i => <line key={i} x1={40+i*60} y1={220+i*5} x2={70+i*60} y2={245+i*3} stroke={IBM.green40} strokeWidth="1.5" strokeDasharray="5 4" opacity="0.4"/>)}
        {/* Large quote bubble */}
        <rect x="40" y="25" width="220" height="145" rx="10" fill={c4} stroke={c3} strokeWidth="1"/>
        <polygon points="100,170 120,170 90,195" fill={c4} stroke={c3} strokeWidth="1"/>
        {/* Quote marks */}
        <path d="M65 60 Q65 40 85 40" stroke={c1} strokeWidth="5" fill="none" strokeLinecap="round"/>
        <path d="M100 60 Q100 40 120 40" stroke={c1} strokeWidth="5" fill="none" strokeLinecap="round"/>
        {/* Text lines */}
        {[80,96,112,128].map((y,i) => (
          <rect key={i} x="65" y={y} width={170-i*25} height="5" rx="2" fill={c2} opacity={0.5-i*0.08}/>
        ))}
        {/* Author avatar */}
        <circle cx="70" cy="195" r="15" fill={c1}/>
        <circle cx="70" cy="190" r="8" fill={c2}/>
        <rect x="90" y="188" width="60" height="5" rx="2" fill={c2} opacity="0.7"/>
        <rect x="90" y="197" width="45" height="4" rx="2" fill={c3} opacity="0.5"/>
      </svg>
    ),
    // ─── MOD 1 additional: persona — farmer with digital overlay ───
    'mod-1-revolution:persona': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Farmer persona with AI tools */}
        <path d="M20 240 L150 280 L280 240 L150 200 Z" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        {/* Person silhouette */}
        <circle cx="120" cy="75" r="30" fill={c3}/>
        <circle cx="120" cy="68" r="18" fill={c2}/>
        <ellipse cx="120" cy="130" rx="35" ry="25" fill={c1}/>
        {/* Hat */}
        <ellipse cx="120" cy="50" rx="22" ry="5" fill={IBM.green60}/>
        <rect x="105" y="42" width="30" height="10" rx="2" fill={IBM.green60}/>
        {/* Digital tablet */}
        <rect x="175" y="55" width="85" height="110" rx="6" fill={IBM.gray100} stroke={c3} strokeWidth="1"/>
        <rect x="182" y="62" width="71" height="55" rx="3" fill={c1} opacity="0.2"/>
        {/* Screen content: mini chart */}
        <path d="M190 100 L205 90 L220 95 L235 80 L245 85" stroke={c1} strokeWidth="1.5" fill="none"/>
        {[190,205,220,235,245].map((x,i) => <circle key={i} cx={x} cy={[100,90,95,80,85][i]} r="2.5" fill={c1}/>)}
        {/* Screen labels */}
        <rect x="182" y="125" width="40" height="4" rx="1" fill={c2} opacity="0.5"/>
        <rect x="182" y="133" width="55" height="4" rx="1" fill={c2} opacity="0.4"/>
        <rect x="182" y="141" width="35" height="4" rx="1" fill={c2} opacity="0.3"/>
        {/* Connection line */}
        <path d="M155 110 L175 90" stroke={c2} strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
        {/* Name badge */}
        <rect x="60" y="170" width="120" height="28" rx="4" fill={c4} stroke={c3} strokeWidth="0.5"/>
        <rect x="70" y="177" width="50" height="5" rx="2" fill={c1} opacity="0.7"/>
        <rect x="70" y="186" width="70" height="4" rx="2" fill={c2} opacity="0.4"/>
      </svg>
    ),
    // ─── MOD 1 additional: reveal — flip cards showing AI features ───
    'mod-1-revolution:reveal': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Interactive reveal cards */}
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Discover AI in Agriculture</text>
        {[
          {x:20,y:40,label:'GPS Tractors',icon:'🚜',detail:'Auto-steer reduces overlap 15%'},
          {x:160,y:40,label:'Crop Drones',icon:'🛸',detail:'Detect disease 2 weeks early'},
          {x:20,y:145,label:'Soil Sensors',icon:'📡',detail:'Real-time moisture, pH, nutrients'},
          {x:160,y:145,label:'Yield AI',icon:'📊',detail:'Predict harvest within 5%'},
        ].map((card,i) => (
          <g key={i}>
            <rect x={card.x} y={card.y} width="120" height="90" rx="6" fill={c4} stroke={i<2?c1:c3} strokeWidth={i<2?1.5:1}/>
            <text x={card.x+60} y={card.y+30} textAnchor="middle" fontSize="22">{card.icon}</text>
            <text x={card.x+60} y={card.y+52} textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">{card.label}</text>
            <text x={card.x+60} y={card.y+68} textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">{card.detail}</text>
            {i<2 && <circle cx={card.x+105} cy={card.y+12} r="6" fill={c1} opacity="0.7"/>}
            {i<2 && <text x={card.x+105} y={card.y+15} textAnchor="middle" fontSize="8" fill={IBM.white}>✓</text>}
            {i>=2 && <circle cx={card.x+105} cy={card.y+12} r="6" fill={c3}/>}
            {i>=2 && <text x={card.x+105} y={card.y+15} textAnchor="middle" fontSize="8" fill={IBM.white}>?</text>}
          </g>
        ))}
        <rect x="50" y="255" width="200" height="25" rx="4" fill={c3}/>
        <text x="150" y="272" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Click to reveal AI capabilities</text>
      </svg>
    ),
    // ─── MOD 1 additional: value_chart — dollar value stacked bars ───
    'mod-1-revolution:value_chart': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* McKinsey $250B AI agriculture value */}
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Value in Agriculture: $250B+</text>
        <text x="150" y="42" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">McKinsey Global Institute Estimate</text>
        {/* Two stacked columns */}
        <rect x="40" y="60" width="95" height="170" rx="4" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        <text x="87" y="78" textAnchor="middle" fontSize="9" fill={IBM.green60} fontWeight="600" fontFamily="sans-serif">On the Acre</text>
        <text x="87" y="92" textAnchor="middle" fontSize="12" fill={IBM.green60} fontWeight="700" fontFamily="sans-serif">$100B+</text>
        {[{y:105,h:22,l:'Precision planting',c:IBM.green60},{y:130,h:18,l:'Crop monitoring',c:IBM.green40},{y:151,h:16,l:'Irrigation AI',c:IBM.teal40},{y:170,h:14,l:'Yield optimization',c:IBM.blue40}].map((b,i) => (
          <g key={i}><rect x="50" y={b.y} width="75" height={b.h} rx="2" fill={b.c} opacity="0.8"/><text x="87" y={b.y+b.h/2+3} textAnchor="middle" fontSize="6.5" fill={IBM.white} fontFamily="sans-serif">{b.l}</text></g>
        ))}
        <rect x="165" y="60" width="95" height="170" rx="4" fill={c4} stroke={c3} strokeWidth="1"/>
        <text x="212" y="78" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">Enterprise</text>
        <text x="212" y="92" textAnchor="middle" fontSize="12" fill={c1} fontWeight="700" fontFamily="sans-serif">$150B+</text>
        {[{y:105,h:25,l:'Supply chain',c:c1},{y:133,h:20,l:'Demand forecast',c:IBM.purple40},{y:156,h:16,l:'Quality control',c:IBM.teal60},{y:175,h:12,l:'Logistics',c:IBM.blue40}].map((b,i) => (
          <g key={i}><rect x="175" y={b.y} width="75" height={b.h} rx="2" fill={b.c} opacity="0.8"/><text x="212" y={b.y+b.h/2+3} textAnchor="middle" fontSize="6.5" fill={IBM.white} fontFamily="sans-serif">{b.l}</text></g>
        ))}
        <rect x="30" y="248" width="240" height="28" rx="4" fill={c3}/>
        <text x="150" y="266" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">Source: McKinsey &amp; Company — AI in Agriculture</text>
      </svg>
    ),
    // ─── MOD 1 additional: case_study — company spotlight card ───
    'mod-1-revolution:case_study': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Case study: real-world AI farm deployment */}
        <rect x="25" y="25" width="250" height="250" rx="8" fill={c4} stroke={c3} strokeWidth="1"/>
        <rect x="25" y="25" width="250" height="40" rx="8" fill={c1}/>
        <text x="150" y="50" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Case Study: AI Farm Transformation</text>
        {/* Before/After */}
        <rect x="40" y="80" width="100" height="80" rx="4" fill={IBM.gray10} stroke={IBM.gray30} strokeWidth="1"/>
        <text x="90" y="98" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontWeight="600" fontFamily="sans-serif">Before AI</text>
        <text x="90" y="120" textAnchor="middle" fontSize="22">🌾</text>
        <text x="90" y="148" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Yield: baseline</text>
        <rect x="160" y="80" width="100" height="80" rx="4" fill={IBM.green10} stroke={c1} strokeWidth="1.5"/>
        <text x="210" y="98" textAnchor="middle" fontSize="8" fill={c1} fontWeight="600" fontFamily="sans-serif">After AI</text>
        <text x="210" y="120" textAnchor="middle" fontSize="22">🤖🌾</text>
        <text x="210" y="148" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">Yield: +28%</text>
        {/* Arrow between */}
        <text x="150" y="125" textAnchor="middle" fontSize="16" fill={c1}>→</text>
        {/* Results row */}
        {[{v:'+28%',l:'Yield',c:IBM.green40},{v:'-30%',l:'Water',c:IBM.blue40},{v:'-15%',l:'Cost',c:IBM.teal40}].map((r,i) => (
          <g key={i}>
            <rect x={40+i*78} y="180" width="70" height="40" rx="4" fill={r.c} opacity="0.15"/>
            <text x={75+i*78} y="200" textAnchor="middle" fontSize="14" fill={r.c} fontWeight="700" fontFamily="sans-serif">{r.v}</text>
            <text x={75+i*78} y="214" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">{r.l}</text>
          </g>
        ))}
        <rect x="50" y="238" width="200" height="22" rx="3" fill={c3}/>
        <text x="150" y="253" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">2,000-acre wheat farm, Kansas, USA</text>
      </svg>
    ),
    // ─── MOD 1 additional: checkpoint — knowledge check shield ───
    'mod-1-revolution:checkpoint': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Knowledge check with agriculture theme */}
        <circle cx="150" cy="110" r="60" fill={c4}/>
        <circle cx="150" cy="110" r="42" fill={c3}/>
        {/* Shield / badge */}
        <path d="M150 65 L185 82 L185 120 Q185 145 150 155 Q115 145 115 120 L115 82 Z" fill={c1}/>
        <path d="M135 110 L145 120 L168 97" stroke={IBM.white} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Stars */}
        {[100,150,200].map((x,i) => (
          <polygon key={i} points={`${x},45 ${x+3},55 ${x+12},55 ${x+5},61 ${x+8},71 ${x},65 ${x-8},71 ${x-5},61 ${x-12},55 ${x-3},55`}
                   fill={IBM.yellow30} opacity={0.8}/>
        ))}
        {/* Question cards */}
        {[0,1,2].map(i => (
          <g key={i}>
            <rect x={50+i*75} y="185" width="65" height="45" rx="4" fill={IBM.white} stroke={c3} strokeWidth="1"/>
            <text x={82+i*75} y="205" textAnchor="middle" fontSize="16" fill={[IBM.green40,c1,IBM.teal40][i]}>{'❓📝✅'.split('')[i]}</text>
            <rect x={58+i*75} y="218" width="49" height="4" rx="1" fill={c3}/>
          </g>
        ))}
        <text x="150" y="260" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Test Your AI Agriculture Knowledge</text>
      </svg>
    ),
    // ─── MOD 1 additional: game — farm gamification ───
    'mod-1-revolution:game': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Spot the AI on the Farm game */}
        <rect x="20" y="20" width="260" height="180" rx="8" fill={IBM.green10} stroke={IBM.green20} strokeWidth="1"/>
        <text x="150" y="42" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Spot the AI!</text>
        {/* Farm scene */}
        <path d="M20 170 Q80 140 150 160 Q220 180 280 155 L280 200 L20 200 Z" fill={IBM.green40} opacity="0.3"/>
        {/* Items to find */}
        {[
          {x:55,y:80,icon:'🚜',label:'GPS Tractor',found:true},
          {x:140,y:70,icon:'🛸',label:'Drone',found:true},
          {x:225,y:85,icon:'📡',label:'IoT Sensor',found:false},
          {x:90,y:130,icon:'💧',label:'Smart Irrigation',found:false},
          {x:200,y:140,icon:'🤖',label:'Robot Harvester',found:true},
        ].map((item,i) => (
          <g key={i}>
            <circle cx={item.x} cy={item.y} r="18" fill={item.found?c4:IBM.white} stroke={item.found?c1:IBM.gray30} strokeWidth={item.found?2:1} strokeDasharray={item.found?'none':'4 3'}/>
            <text x={item.x} y={item.y+5} textAnchor="middle" fontSize="14">{item.icon}</text>
            {item.found && <circle cx={item.x+14} cy={item.y-14} r="7" fill={IBM.green40}/> }
            {item.found && <text x={item.x+14} y={item.y-11} textAnchor="middle" fontSize="8" fill={IBM.white}>✓</text>}
          </g>
        ))}
        {/* Score bar */}
        <rect x="40" y="215" width="220" height="30" rx="5" fill={c3}/>
        <text x="80" y="234" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">Score: 3/5</text>
        <text x="250" y="234" textAnchor="end" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">⭐⭐⭐</text>
        <rect x="50" y="260" width="200" height="22" rx="3" fill={c4}/>
        <text x="150" y="275" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">Interactive: Find all AI technologies!</text>
      </svg>
    ),
    // ─── MOD 1 additional: takeaway — graduation cap with key points ───
    'mod-1-revolution:takeaway': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Module summary / takeaway */}
        <circle cx="150" cy="90" r="50" fill={c4}/>
        {/* Graduation cap */}
        <polygon points="150,45 200,68 150,88 100,68" fill={c1}/>
        <rect x="145" y="55" width="10" height="30" fill={c1}/>
        <line x1="195" y1="68" x2="195" y2="95" stroke={c2} strokeWidth="1.5"/>
        <circle cx="195" cy="98" r="4" fill={IBM.yellow30}/>
        {/* Key takeaway list */}
        {[0,1,2,3].map(i => (
          <g key={i}>
            <rect x="50" y={150+i*32} width="200" height="26" rx="5" fill={c4} stroke={c3} strokeWidth="0.5"/>
            <circle cx="70" cy={163+i*32} r="8" fill={[IBM.green40,c1,IBM.teal40,IBM.purple40][i]}/>
            <text x="70" y={167+i*32} textAnchor="middle" fontSize="9" fill={IBM.white} fontWeight="600">{i+1}</text>
            <rect x="85" y={159+i*32} width={130-i*10} height="5" rx="2" fill={c2} opacity={0.6-i*0.1}/>
          </g>
        ))}
        <text x="150" y="286" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Module 1 Complete — Key Takeaways</text>
      </svg>
    ),
    // ─── MOD 1 additional: chatbot_cta — Noor assistant with farm context ───
    'mod-1-revolution:chatbot_cta': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Noor AI assistant invitation */}
        <circle cx="150" cy="100" r="50" fill={c4}/>
        <circle cx="150" cy="92" r="32" fill={c2}/>
        {/* Chat bot face */}
        <circle cx="138" cy="85" r="5" fill={IBM.white}/><circle cx="162" cy="85" r="5" fill={IBM.white}/>
        <circle cx="138" cy="85" r="2.5" fill={c1}/><circle cx="162" cy="85" r="2.5" fill={c1}/>
        <path d="M140 100 Q150 108 160 100" stroke={IBM.white} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Antenna */}
        <line x1="150" y1="60" x2="150" y2="50" stroke={c1} strokeWidth="2"/>
        <circle cx="150" cy="47" r="4" fill={IBM.yellow30}/>
        {/* Chat bubbles */}
        <rect x="195" y="65" width="85" height="35" rx="6" fill={c1}/>
        <polygon points="195,85 185,95 200,88" fill={c1}/>
        <rect x="203" y="73" width="55" height="4" rx="2" fill={IBM.white} opacity="0.5"/>
        <rect x="203" y="82" width="40" height="4" rx="2" fill={IBM.white} opacity="0.35"/>
        <rect x="20" y="110" width="75" height="30" rx="6" fill={IBM.green40}/>
        <polygon points="95,130 105,135 92,133" fill={IBM.green40}/>
        <rect x="28" y="118" width="45" height="4" rx="2" fill={IBM.white} opacity="0.5"/>
        <rect x="28" y="126" width="35" height="3" rx="1" fill={IBM.white} opacity="0.35"/>
        {/* Farm context icons */}
        {[{x:50,y:185,e:'🌾'},{x:120,y:190,e:'🚜'},{x:190,y:185,e:'📊'},{x:250,y:190,e:'🤖'}].map((f,i) => (
          <g key={i}>
            <circle cx={f.x} cy={f.y} r="15" fill={c4} stroke={c3} strokeWidth="0.5"/>
            <text x={f.x} y={f.y+5} textAnchor="middle" fontSize="12">{f.e}</text>
          </g>
        ))}
        {/* CTA */}
        <rect x="60" y="225" width="180" height="35" rx="6" fill={c1}/>
        <text x="150" y="247" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Chat with Noor about Module 1</text>
        <circle cx="150" cy="280" r="4" fill={c1} opacity="0.4"><animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite"/></circle>
      </svg>
    ),

    // ─── MOD 2: Sensing the Field ─── drones, satellites, soil probes, IoT
    'mod-2-sensing:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="40" width="240" height="160" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1.5"/>
        {/* Sensor data dashboard */}
        <text x="150" y="62" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Sensor Dashboard</text>
        {/* Soil moisture gauge */}
        <circle cx="80" cy="120" r="30" fill="none" stroke={c3} strokeWidth="8"/><circle cx="80" cy="120" r="30" fill="none" stroke={c1} strokeWidth="8" strokeDasharray="132 188" transform="rotate(-90 80 120)"/>
        <text x="80" y="124" textAnchor="middle" fontSize="11" fill={c1} fontWeight="700" fontFamily="sans-serif">72%</text>
        <text x="80" y="162" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Moisture</text>
        {/* Temperature line */}
        <path d="M140 140 Q160 100 180 115 Q200 95 220 108 L250 90" stroke={IBM.red40} strokeWidth="2" fill="none"/>
        <text x="195" y="160" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Temperature</text>
        {/* pH bars */}
        {[0,1,2,3].map(i => <rect key={i} x={140+i*28} y={170-[35,28,40,32][i]} width="18" height={[35,28,40,32][i]} rx="2" fill={[IBM.green40,IBM.green60,c1,IBM.teal40][i]}/>)}
        <text x="180" y="182" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Soil pH by Zone</text>
        {/* Live indicator */}
        <circle cx="255" cy="50" r="4" fill={IBM.red60}/><circle cx="255" cy="50" r="4" fill={IBM.red60} opacity="0.5"><animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite"/></circle>
        <text x="246" y="65" textAnchor="end" fontSize="7" fill={IBM.red60} fontFamily="sans-serif">LIVE</text>
        <rect x="55" y="225" width="190" height="25" rx="4" fill={c3}/><text x="150" y="242" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Real-time Field Monitoring</text>
      </svg>
    ),
    'mod-2-sensing:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Satellite vs Drone vs Ground sensors */}
        {[{x:40,y:30,h:55,label:'Satellite',icon:'🛰️',res:'10m/px'},{x:125,y:70,h:55,label:'Drone UAV',icon:'🚁',res:'2cm/px'},{x:210,y:120,h:55,label:'Ground IoT',icon:'📡',res:'Point'}].map((s,i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width="80" height={s.h} rx="6" fill={[IBM.teal40,c1,IBM.green40][i]}/>
            <text x={s.x+40} y={s.y+22} textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{s.label}</text>
            <text x={s.x+40} y={s.y+38} textAnchor="middle" fontSize="8" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{s.res}</text>
            {i<2 && <path d={`M${s.x+60} ${s.y+s.h} L${s.x+85} ${s.y+s.h+15}`} stroke={c2} strokeWidth="1.5" strokeDasharray="4 3"/>}
          </g>
        ))}
        {/* Coverage area visualization */}
        <path d="M30 210 L150 260 L270 210 L150 175 Z" fill={c4} stroke={c3} strokeWidth="1"/>
        <ellipse cx="150" cy="218" rx="90" ry="25" fill="none" stroke={IBM.teal40} strokeWidth="1" strokeDasharray="6 4"/>
        <ellipse cx="150" cy="218" rx="50" ry="14" fill="none" stroke={c1} strokeWidth="1.5" strokeDasharray="4 3"/>
        <circle cx="150" cy="218" r="5" fill={IBM.green40}/>
        <text x="150" y="285" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Multi-scale Sensing Coverage</text>
      </svg>
    ),
    'mod-2-sensing:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* IoT data stack layers */}
        {[{y:40,label:'🛰️ Satellite NDVI',c:IBM.teal60},{y:85,label:'🚁 Drone Multispectral',c:c1},{y:130,label:'📡 IoT Soil Probes',c:IBM.green60},{y:175,label:'🌡️ Weather Station',c:IBM.blue40},{y:220,label:'📊 Aggregation Layer',c:IBM.purple40}].map((l,i)=> (
          <g key={i}>
            <path d={`M35 ${l.y} L150 ${l.y+25} L265 ${l.y} L150 ${l.y-18} Z`} fill={l.c} opacity={0.8-i*0.08} stroke={IBM.white} strokeWidth="0.5"/>
            <text x="150" y={l.y+6} textAnchor="middle" fontSize="8.5" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="280" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Sensor Data Integration Stack</text>
      </svg>
    ),
    'mod-2-sensing:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Edge-to-cloud IoT architecture */}
        <text x="150" y="22" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Edge-to-Cloud Architecture</text>
        {/* Cloud */}
        <rect x="90" y="32" width="120" height="38" rx="8" fill={c1}/><text x="150" y="56" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">☁️ Cloud Processing</text>
        {/* Edge gateway */}
        <rect x="100" y="105" width="100" height="32" rx="5" fill={c2}/><text x="150" y="125" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Edge Gateway</text>
        <line x1="150" y1="70" x2="150" y2="105" stroke={c2} strokeWidth="1.5" strokeDasharray="4 3"/>
        {/* Sensors */}
        {[{x:30,l:'Soil'},{x:110,l:'Weather'},{x:190,l:'Camera'},{x:250,l:'Drone'}].map((s,i) => (
          <g key={i}>
            <rect x={s.x} y="175" width="55" height="28" rx="4" fill={[IBM.green40,IBM.blue40,IBM.purple40,IBM.teal40][i]}/>
            <text x={s.x+27} y="193" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{s.l}</text>
            <line x1={s.x+27} y1="175" x2="150" y2="137" stroke={c3} strokeWidth="1"/>
          </g>
        ))}
        {/* Analytics output */}
        <rect x="60" y="240" width="180" height="30" rx="5" fill={c3}/><text x="150" y="259" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">📊 Real-time Analytics Dashboard</text>
        <line x1="150" y1="70" x2="150" y2="240" stroke={c4} strokeWidth="0.5"/>
      </svg>
    ),
    'mod-2-sensing:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Precision Sensing Pillars</text>
        {[{x:25,label:'Spatial',sub:'Resolution',c:IBM.teal40,h:110},{x:100,label:'Temporal',sub:'Frequency',c:c1,h:140},{x:175,label:'Spectral',sub:'Bands',c:IBM.green40,h:100},{x:245,label:'Radiometric',sub:'Accuracy',c:IBM.purple40,h:120}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={230-p.h} width="55" height={p.h} rx="4" fill={p.c}/>
            <text x={p.x+27} y={240-p.h+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{p.label}</text>
            <text x={p.x+27} y={240-p.h+30} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{p.sub}</text>
            <text x={p.x+27} y="250" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">{p.label}</text>
          </g>
        ))}
        <rect x="20" y="230" width="260" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-2-sensing:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* NDVI map visualization */}
        <rect x="30" y="30" width="240" height="180" rx="6" fill={IBM.gray100}/>
        <text x="150" y="24" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">NDVI Vegetation Health Map</text>
        {/* Color grid representing NDVI */}
        {[0,1,2,3,4,5,6,7].map(row => [0,1,2,3,4,5,6,7,8,9].map(col => {
          const v = Math.sin(row*0.7+col*0.5)*0.3+0.5;
          const fill = v > 0.6 ? IBM.green40 : v > 0.4 ? IBM.green20 : v > 0.25 ? IBM.yellow30 : IBM.red40;
          return <rect key={`${row}-${col}`} x={38+col*23} y={38+row*20} width="20" height="17" rx="1" fill={fill} opacity={0.7+v*0.3}/>;
        }))}
        {/* Legend */}
        <rect x="50" y="225" width="200" height="20" rx="3" fill="none"/>
        {[IBM.red40,IBM.yellow30,IBM.green20,IBM.green40].map((c,i) => <rect key={i} x={60+i*50} y="228" width="40" height="12" rx="2" fill={c}/>)}
        <text x="80" y="258" fontSize="7" fill={IBM.gray60} textAnchor="middle" fontFamily="sans-serif">Stressed</text>
        <text x="230" y="258" fontSize="7" fill={IBM.gray60} textAnchor="middle" fontFamily="sans-serif">Healthy</text>
      </svg>
    ),
    'mod-2-sensing:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={c1} fontFamily="monospace">&gt; analyze_field --sensor=ndvi</text>
        <text x="45" y="98" fontSize="9" fill={IBM.green40} fontFamily="monospace">📡 3,200 data points loaded</text>
        <text x="45" y="116" fontSize="9" fill={c2} fontFamily="monospace">🗺️ Zone mapping: 12 zones</text>
        <text x="45" y="134" fontSize="9" fill={c2} fontFamily="monospace">🌿 Anomaly: Zone 7 stress</text>
        <text x="45" y="152" fontSize="9" fill={IBM.yellow30} fontFamily="monospace">⚠ Alert: irrigation needed</text>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">IoT Sensor Query Interface</text>
      </svg>
    ),
    'mod-2-sensing:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="120" r="40" fill={c1}/><text x="150" y="116" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Remote</text><text x="150" y="128" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Sensing</text>
        {[{x:50,y:45,t:'NDVI'},{x:250,y:45,t:'LiDAR'},{x:35,y:185,t:'Thermal'},{x:265,y:185,t:'Radar'},{x:150,y:230,t:'Multi-\nspectral'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="120" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="24" fill={[IBM.green40,IBM.teal40,IBM.red40,IBM.blue40,IBM.purple40][i]} opacity="0.85"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),

    // ─── MOD 3: AI-Powered Crop Management ─── plants, disease detection, yields
    'mod-3-crop-mgmt:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Crop yield prediction chart */}
        <rect x="30" y="30" width="240" height="170" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1"/>
        <text x="150" y="52" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Crop Yield Prediction Accuracy</text>
        <path d="M55 180 L95 165 L135 140 L175 120 L215 90 L255 70" stroke={IBM.gray30} strokeWidth="1.5" fill="none" strokeDasharray="4 3"/>
        <path d="M55 175 L95 155 L135 130 L175 115 L215 85 L255 68" stroke={c1} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M55 175 L95 155 L135 130 L175 115 L215 85 L255 68 L255 180 L55 180 Z" fill={c4}/>
        {[55,95,135,175,215,255].map((x,i) => <circle key={i} cx={x} cy={[175,155,130,115,85,68][i]} r="4" fill={c1}/>)}
        {/* Legend */}
        <rect x="60" y="210" width="8" height="8" rx="1" fill={c1}/><text x="74" y="218" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">AI Prediction</text>
        <rect x="150" y="210" width="8" height="8" rx="1" fill={IBM.gray30}/><text x="164" y="218" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Baseline</text>
        <text x="150" y="260" textAnchor="middle" fontSize="11" fill={c1} fontWeight="700" fontFamily="sans-serif">95.2% Accuracy</text>
        <text x="150" y="278" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">AI vs traditional forecasting</text>
      </svg>
    ),
    'mod-3-crop-mgmt:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Disease detection: manual vs AI */}
        <rect x="15" y="35" width="125" height="95" rx="6" fill={IBM.gray10} stroke={IBM.gray30} strokeWidth="1"/>
        <text x="77" y="55" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontWeight="600" fontFamily="sans-serif">Manual Scouting</text>
        <text x="77" y="75" textAnchor="middle" fontSize="20" fontFamily="sans-serif">👨‍🌾</text>
        <text x="77" y="105" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">~70% accuracy</text>
        <text x="77" y="120" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Days to detect</text>
        <rect x="160" y="35" width="125" height="95" rx="6" fill={c4} stroke={c1} strokeWidth="1.5"/>
        <text x="222" y="55" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Vision System</text>
        <text x="222" y="75" textAnchor="middle" fontSize="20" fontFamily="sans-serif">🤖</text>
        <text x="222" y="105" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">98.5% accuracy</text>
        <text x="222" y="120" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">Real-time detection</text>
        {/* Leaf with disease markers */}
        <ellipse cx="100" cy="200" rx="40" ry="55" fill={IBM.green40} transform="rotate(-15 100 200)"/>
        <circle cx="90" cy="185" r="6" fill={IBM.red40} opacity="0.7"/><circle cx="110" cy="210" r="5" fill={IBM.yellow30} opacity="0.7"/>
        {/* AI scan overlay */}
        <rect x="160" y="160" width="90" height="90" rx="4" fill="none" stroke={c1} strokeWidth="2" strokeDasharray="6 4"/>
        <line x1="160" y1="185" x2="250" y2="185" stroke={c1} strokeWidth="0.5" opacity="0.3"/><line x1="205" y1="160" x2="205" y2="250" stroke={c1} strokeWidth="0.5" opacity="0.3"/>
        <text x="205" y="210" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">CNN Analysis</text>
      </svg>
    ),
    'mod-3-crop-mgmt:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {[{y:40,label:'🌾 Crop Phenology Model',c:IBM.green60},{y:85,label:'🔬 Disease Detection CNN',c:c1},{y:130,label:'💧 Irrigation Optimization',c:IBM.blue40},{y:175,label:'🧪 Nutrient Management',c:IBM.teal40},{y:220,label:'📈 Yield Prediction Engine',c:IBM.purple40}].map((l,i)=> (
          <g key={i}>
            <path d={`M35 ${l.y} L150 ${l.y+25} L265 ${l.y} L150 ${l.y-18} Z`} fill={l.c} opacity={0.8-i*0.08} stroke={IBM.white} strokeWidth="0.5"/>
            <text x="150" y={l.y+6} textAnchor="middle" fontSize="8.5" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="280" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">AI Crop Management Stack</text>
      </svg>
    ),
    'mod-3-crop-mgmt:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Precision Crop Management</text>
        {[{x:20,label:'Detection',sub:'Disease ID',c:IBM.red40,h:110},{x:80,label:'Prediction',sub:'Yield Model',c:c1,h:150},{x:140,label:'Optimization',sub:'Input Mgmt',c:IBM.green40,h:130},{x:200,label:'Automation',sub:'Robotics',c:IBM.blue40,h:100}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={235-p.h} width="60" height={p.h} rx="4" fill={p.c}/>
            <text x={p.x+30} y={245-p.h+20} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{p.label}</text>
            <text x={p.x+30} y={245-p.h+32} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{p.sub}</text>
          </g>
        ))}
        <rect x="15" y="235" width="270" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-3-crop-mgmt:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="20" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Crop AI Pipeline</text>
        <rect x="20" y="35" width="75" height="35" rx="4" fill={IBM.green40}/><text x="57" y="57" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">📷 Image</text>
        <rect x="112" y="35" width="75" height="35" rx="4" fill={c1}/><text x="149" y="57" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">🧠 CNN Model</text>
        <rect x="205" y="35" width="75" height="35" rx="4" fill={IBM.teal40}/><text x="242" y="57" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">🎯 Diagnosis</text>
        <path d="M95 52 L112 52" stroke={c2} strokeWidth="1.5"/><path d="M187 52 L205 52" stroke={c2} strokeWidth="1.5"/>
        <rect x="40" y="100" width="220" height="80" rx="6" fill={c4} stroke={c3} strokeWidth="1"/>
        <text x="150" y="118" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif" fontWeight="600">Training Pipeline</text>
        <rect x="55" y="128" width="55" height="22" rx="3" fill={IBM.green20}/><text x="82" y="143" textAnchor="middle" fontSize="7" fill={IBM.green60} fontFamily="sans-serif">Dataset</text>
        <rect x="122" y="128" width="55" height="22" rx="3" fill={c3}/><text x="149" y="143" textAnchor="middle" fontSize="7" fill={c1} fontFamily="sans-serif">Augment</text>
        <rect x="190" y="128" width="55" height="22" rx="3" fill={c2}/><text x="217" y="143" textAnchor="middle" fontSize="7" fill={IBM.white} fontFamily="sans-serif">Train</text>
        <rect x="50" y="210" width="200" height="30" rx="5" fill={c3}/><text x="150" y="229" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">🌾 Farm Management System</text>
        <line x1="150" y1="180" x2="150" y2="210" stroke={c2} strokeWidth="1" strokeDasharray="4 3"/>
      </svg>
    ),
    'mod-3-crop-mgmt:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Computer vision scanning a leaf */}
        <ellipse cx="120" cy="140" rx="65" ry="90" fill={IBM.green40} transform="rotate(-10 120 140)"/>
        <ellipse cx="120" cy="140" rx="50" ry="70" fill={IBM.green20} transform="rotate(-10 120 140)" opacity="0.5"/>
        {/* Disease spots */}
        <circle cx="100" cy="110" r="8" fill={IBM.red40} opacity="0.6"/><circle cx="130" cy="155" r="6" fill={IBM.yellow30} opacity="0.6"/><circle cx="110" cy="170" r="5" fill={IBM.red40} opacity="0.4"/>
        {/* AI scan grid */}
        <rect x="180" y="50" width="100" height="120" rx="5" fill={IBM.white} stroke={c1} strokeWidth="1.5"/>
        <text x="230" y="68" textAnchor="middle" fontSize="8" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Analysis</text>
        <rect x="190" y="76" width="80" height="6" rx="2" fill={IBM.green40}/><text x="232" y="97" textAnchor="end" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Healthy: 82%</text>
        <rect x="190" y="102" width="35" height="6" rx="2" fill={IBM.red40}/><text x="232" y="123" textAnchor="end" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Blight: 12%</text>
        <rect x="190" y="128" width="15" height="6" rx="2" fill={IBM.yellow30}/><text x="232" y="149" textAnchor="end" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Rust: 6%</text>
        {/* Connection */}
        <path d="M160 120 L180 100" stroke={c1} strokeWidth="1.5" strokeDasharray="4 3"/>
        <text x="150" y="270" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">AI-Powered Disease Detection</text>
      </svg>
    ),
    'mod-3-crop-mgmt:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={c1} fontFamily="monospace">&gt; crop_ai diagnose leaf.jpg</text>
        <text x="45" y="98" fontSize="9" fill={IBM.green40} fontFamily="monospace">🔬 Analyzing image...</text>
        <text x="45" y="116" fontSize="9" fill={c2} fontFamily="monospace">🌿 Species: Wheat (T. aest.)</text>
        <text x="45" y="134" fontSize="9" fill={IBM.red40} fontFamily="monospace">⚠ Disease: Leaf Rust (89%)</text>
        <text x="45" y="152" fontSize="9" fill={IBM.green40} fontFamily="monospace">💊 Treatment: Fungicide R-3</text>
        <text x="45" y="170" fontSize="9" fill={c2} fontFamily="monospace">📅 Apply within 48 hours</text>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Crop Disease Diagnostic AI</text>
      </svg>
    ),
    'mod-3-crop-mgmt:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="120" r="40" fill={c1}/><text x="150" y="116" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Crop</text><text x="150" y="128" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">AI</text>
        {[{x:50,y:45,t:'Disease\nDetect'},{x:250,y:45,t:'Yield\nPredict'},{x:35,y:195,t:'Variable\nRate'},{x:265,y:195,t:'Growth\nModel'},{x:150,y:240,t:'Precision\nPlanting'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="120" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="24" fill={[IBM.red40,IBM.green40,IBM.blue40,IBM.teal40,IBM.purple40][i]} opacity="0.85"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="7" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),

    // ─── MOD 4: Climate Resilience ─── weather, flood models, drought prediction
    'mod-4-climate:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="170" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1"/>
        <text x="150" y="52" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Climate Risk Assessment</text>
        {/* Temperature anomaly chart */}
        <path d="M50 150 Q80 140 110 145 Q140 120 170 130 Q200 100 230 80 L260 65" stroke={IBM.red40} strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M50 150 Q80 155 110 148 Q140 160 170 155 Q200 165 230 170 L260 175" stroke={IBM.blue40} strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Baseline */}
        <line x1="50" y1="150" x2="260" y2="150" stroke={IBM.gray30} strokeWidth="1" strokeDasharray="4 3"/>
        <text x="267" y="67" fontSize="7" fill={IBM.red40} fontFamily="sans-serif">+2.5°C</text>
        <text x="267" y="177" fontSize="7" fill={IBM.blue40} fontFamily="sans-serif">Precip</text>
        {/* Extreme weather events markers */}
        {[{x:130,y:120,t:'🌪️'},{x:200,y:100,t:'🌊'},{x:250,y:65,t:'🔥'}].map((e,i) => (
          <text key={i} x={e.x} y={e.y-8} fontSize="14" textAnchor="middle">{e.t}</text>
        ))}
        <rect x="40" y="225" width="220" height="25" rx="4" fill={c3}/><text x="150" y="242" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">AI Climate Projection Model</text>
      </svg>
    ),
    'mod-4-climate:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Climate Adaptation Strategies</text>
        <rect x="15" y="40" width="125" height="105" rx="6" fill={IBM.red40} opacity="0.1" stroke={IBM.red40} strokeWidth="1"/>
        <text x="77" y="60" textAnchor="middle" fontSize="9" fill={IBM.red60} fontWeight="600" fontFamily="sans-serif">Without AI</text>
        <text x="77" y="78" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif"> ✗ Reactive response</text>
        <text x="77" y="94" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif"> ✗ Crop loss 15-30%</text>
        <text x="77" y="110" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif"> ✗ Late warnings</text>
        <text x="77" y="126" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif"> ✗ Fixed varieties</text>
        <rect x="160" y="40" width="125" height="105" rx="6" fill={c4} stroke={c1} strokeWidth="1.5"/>
        <text x="222" y="60" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">With AI</text>
        <text x="222" y="78" fontSize="8" fill={c1} fontFamily="sans-serif"> ✓ Predictive planning</text>
        <text x="222" y="94" fontSize="8" fill={c1} fontFamily="sans-serif"> ✓ Loss reduced 60%</text>
        <text x="222" y="110" fontSize="8" fill={c1} fontFamily="sans-serif"> ✓ 72-hr early alert</text>
        <text x="222" y="126" fontSize="8" fill={c1} fontFamily="sans-serif"> ✓ Adaptive varieties</text>
        {/* Weather visualization */}
        <circle cx="80" cy="210" r="25" fill={IBM.blue20}/><circle cx="100" cy="205" r="20" fill={IBM.blue40} opacity="0.6"/>
        {[70,85,100].map((x,i)=> <line key={i} x1={x} y1="230" x2={x-3} y2="255" stroke={IBM.blue40} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>)}
        <circle cx="220" cy="205" r="28" fill={IBM.yellow30} opacity="0.3"/>
        <circle cx="220" cy="205" r="18" fill={IBM.yellow30} opacity="0.6"/>
        <path d="M210 200 L218 195 L225 210" stroke={IBM.green40} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    'mod-4-climate:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {[{y:35,label:'🛰️ Satellite Weather Data',c:IBM.blue60},{y:80,label:'🌡️ Climate Model Output',c:IBM.red40},{y:125,label:'💧 Hydrology Layer',c:c1},{y:170,label:'🌱 Crop Vulnerability Map',c:IBM.green40},{y:215,label:'📊 Risk Assessment Engine',c:IBM.purple40}].map((l,i)=> (
          <g key={i}>
            <path d={`M35 ${l.y} L150 ${l.y+25} L265 ${l.y} L150 ${l.y-18} Z`} fill={l.c} opacity={0.8-i*0.08} stroke={IBM.white} strokeWidth="0.5"/>
            <text x="150" y={l.y+6} textAnchor="middle" fontSize="8.5" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="278" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Climate-Agricultural Data Stack</text>
      </svg>
    ),
    'mod-4-climate:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="20" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Climate Resilience System</text>
        <rect x="80" y="30" width="140" height="35" rx="5" fill={c1}/><text x="150" y="52" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">🌍 Climate Data Ingestion</text>
        <rect x="30" y="95" width="100" height="30" rx="4" fill={IBM.blue40}/><text x="80" y="114" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Weather API</text>
        <rect x="170" y="95" width="100" height="30" rx="4" fill={IBM.red40}/><text x="220" y="114" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Risk Model</text>
        <line x1="120" y1="65" x2="80" y2="95" stroke={c2} strokeWidth="1"/><line x1="180" y1="65" x2="220" y2="95" stroke={c2} strokeWidth="1"/>
        <rect x="80" y="155" width="140" height="35" rx="5" fill={IBM.teal40}/><text x="150" y="177" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">🧠 AI Decision Engine</text>
        <line x1="80" y1="125" x2="120" y2="155" stroke={c3} strokeWidth="1"/><line x1="220" y1="125" x2="180" y2="155" stroke={c3} strokeWidth="1"/>
        <rect x="50" y="220" width="85" height="30" rx="4" fill={IBM.green40}/><text x="92" y="239" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Early Warning</text>
        <rect x="165" y="220" width="85" height="30" rx="4" fill={IBM.purple40}/><text x="207" y="239" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Adapt Plan</text>
        <line x1="130" y1="190" x2="92" y2="220" stroke={c3} strokeWidth="1"/><line x1="170" y1="190" x2="207" y2="220" stroke={c3} strokeWidth="1"/>
        <rect x="70" y="270" width="160" height="20" rx="3" fill={c3}/><text x="150" y="284" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">📱 Farmer Alert System</text>
      </svg>
    ),
    'mod-4-climate:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Climate Resilience Framework</text>
        {[{x:20,label:'Predict',sub:'Weather AI',c:IBM.blue40,h:100},{x:85,label:'Protect',sub:'Early Warning',c:c1,h:140},{x:150,label:'Adapt',sub:'Crop Planning',c:IBM.green40,h:120},{x:215,label:'Recover',sub:'Insurance AI',c:IBM.red40,h:90}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={235-p.h} width="55" height={p.h} rx="4" fill={p.c}/>
            <text x={p.x+27} y={245-p.h+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{p.label}</text>
            <text x={p.x+27} y={245-p.h+30} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{p.sub}</text>
          </g>
        ))}
        <rect x="15" y="235" width="270" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-4-climate:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Flood risk heat map */}
        <rect x="30" y="25" width="240" height="180" rx="6" fill={IBM.gray100}/>
        <text x="150" y="20" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Flood Risk Prediction</text>
        {[0,1,2,3,4,5].map(row => [0,1,2,3,4,5,6,7].map(col => {
          const risk = Math.sin(row*0.8+col*0.6)*0.3 + Math.cos(row*col*0.3)*0.2+0.4;
          const fill = risk > 0.65 ? IBM.red40 : risk > 0.45 ? IBM.yellow30 : risk > 0.3 ? IBM.blue20 : IBM.teal20;
          return <rect key={`${row}-${col}`} x={40+col*28} y={35+row*26} width="25" height="23" rx="2" fill={fill} opacity={0.6+risk*0.4}/>;
        }))}
        <text x="150" y="230" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">72-hour advance flood probability map</text>
        {[{c:IBM.red40,l:'High'},{c:IBM.yellow30,l:'Med'},{c:IBM.blue20,l:'Low'},{c:IBM.teal20,l:'Safe'}].map((lg,i) => (
          <g key={i}><rect x={60+i*55} y="248" width="12" height="12" rx="2" fill={lg.c}/><text x={78+i*55} y="258" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">{lg.l}</text></g>
        ))}
      </svg>
    ),
    'mod-4-climate:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={c1} fontFamily="monospace">&gt; climate_ai forecast --days=7</text>
        <text x="45" y="98" fontSize="9" fill={IBM.blue40} fontFamily="monospace">🌧️ Day 1-3: Heavy rain (85%)</text>
        <text x="45" y="116" fontSize="9" fill={IBM.yellow30} fontFamily="monospace">⚠ Flood risk: Zone 4,7 HIGH</text>
        <text x="45" y="134" fontSize="9" fill={IBM.green40} fontFamily="monospace">🌤️ Day 4-7: Clear, warm</text>
        <text x="45" y="152" fontSize="9" fill={c2} fontFamily="monospace">📋 Drain fields Zone 4 by Tue</text>
        <text x="45" y="170" fontSize="9" fill={IBM.green40} fontFamily="monospace">✓ Alert sent to 247 farmers</text>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Climate Early Warning System</text>
      </svg>
    ),
    'mod-4-climate:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="120" r="40" fill={c1}/><text x="150" y="116" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Climate</text><text x="150" y="128" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">AI</text>
        {[{x:50,y:45,t:'Weather\nModel'},{x:250,y:45,t:'Drought\nIndex'},{x:35,y:195,t:'Flood\nRisk'},{x:265,y:195,t:'Heat\nStress'},{x:150,y:240,t:'Carbon\nTrack'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="120" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="24" fill={[IBM.blue40,IBM.yellow30,IBM.blue60,IBM.red40,IBM.green40][i]} opacity="0.85"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="7" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),

    // ─── MOD 5: Supply Chain Intelligence ─── logistics, warehouse, blockchain
    'mod-5-supply-chain:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="170" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1"/>
        <text x="150" y="52" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Supply Chain Efficiency</text>
        {/* Pie chart - waste reduction */}
        <circle cx="100" cy="130" r="45" fill={IBM.gray10}/>
        <circle cx="100" cy="130" r="45" fill={c1} strokeDasharray={`${0.35*283} 283`} stroke="none" transform="rotate(-90 100 130)" style={{clipPath:'circle(45px at 100px 130px)'}}/>
        <path d="M100 85 A45 45 0 0 1 131 160 L100 130 Z" fill={c1}/><path d="M100 85 A45 45 0 1 0 131 160 L100 130 Z" fill={IBM.gray10}/>
        <text x="100" y="134" textAnchor="middle" fontSize="14" fill={c1} fontWeight="700" fontFamily="sans-serif">35%</text>
        <text x="100" y="190" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Waste Reduced</text>
        {/* KPI bars */}
        {[{l:'Traceability',v:92,c:IBM.green40},{l:'Freshness',v:88,c:c1},{l:'Cost Savings',v:76,c:IBM.teal40}].map((k,i) => (
          <g key={i}>
            <text x="178" y={98+i*32} fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">{k.l}</text>
            <rect x="178" y={102+i*32} width="80" height="10" rx="3" fill={IBM.gray10}/>
            <rect x="178" y={102+i*32} width={k.v*0.8} height="10" rx="3" fill={k.c}/>
            <text x={180+k.v*0.8} y={111+i*32} fontSize="7" fill={k.c} fontWeight="600" fontFamily="sans-serif">{k.v}%</text>
          </g>
        ))}
        <rect x="55" y="225" width="190" height="25" rx="4" fill={c3}/><text x="150" y="242" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">AI-Optimized Supply Chain KPIs</text>
      </svg>
    ),
    'mod-5-supply-chain:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Traditional vs Smart Supply Chain</text>
        {/* Traditional */}
        <rect x="15" y="40" width="125" height="110" rx="6" fill={IBM.gray10} stroke={IBM.gray30} strokeWidth="1"/>
        <text x="77" y="60" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontWeight="600" fontFamily="sans-serif">Traditional</text>
        {['📦 Manual tracking','📋 Paper records','🕐 48-hr delays','❌ 30% food waste'].map((t,i) =>
          <text key={i} x="28" y={80+i*18} fontSize="7.5" fill={IBM.gray60} fontFamily="sans-serif">{t}</text>
        )}
        {/* Smart */}
        <rect x="160" y="40" width="125" height="110" rx="6" fill={c4} stroke={c1} strokeWidth="1.5"/>
        <text x="222" y="60" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">AI-Powered</text>
        {['🔗 Blockchain trace','📊 Real-time data','⚡ 2-hr response','✓ 8% food waste'].map((t,i) =>
          <text key={i} x="173" y={80+i*18} fontSize="7.5" fill={c1} fontFamily="sans-serif">{t}</text>
        )}
        {/* Logistics flow */}
        {[{x:40,y:195,e:'🌾'},{x:110,y:185,e:'🏭'},{x:180,y:190,e:'🚛'},{x:250,y:195,e:'🏪'}].map((n,i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r="18" fill={i<2?IBM.green20:c4} stroke={c3} strokeWidth="1"/>
            <text x={n.x} y={n.y+5} textAnchor="middle" fontSize="14">{n.e}</text>
            {i<3 && <path d={`M${n.x+18} ${n.y} L${n.x+35} ${n.y}`} stroke={c2} strokeWidth="1.5"/>}
          </g>
        ))}
      </svg>
    ),
    'mod-5-supply-chain:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {[{y:35,label:'🔗 Blockchain Traceability',c:IBM.blue60},{y:80,label:'📦 Warehouse Management AI',c:c1},{y:125,label:'🚛 Route Optimization',c:IBM.green40},{y:170,label:'❄️ Cold Chain Monitoring',c:IBM.teal40},{y:215,label:'📊 Demand Forecasting',c:IBM.purple40}].map((l,i)=> (
          <g key={i}>
            <path d={`M35 ${l.y} L150 ${l.y+25} L265 ${l.y} L150 ${l.y-18} Z`} fill={l.c} opacity={0.8-i*0.08} stroke={IBM.white} strokeWidth="0.5"/>
            <text x="150" y={l.y+6} textAnchor="middle" fontSize="8.5" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="278" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Supply Chain Intelligence Stack</text>
      </svg>
    ),
    'mod-5-supply-chain:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="20" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Smart Supply Chain Architecture</text>
        {/* Farm → Processing → Warehouse → Retail */}
        {[{x:15,y:45,w:55,l:'🌾 Farm',c:IBM.green40},{x:85,y:45,w:55,l:'🏭 Process',c:c1},{x:160,y:45,w:55,l:'📦 Store',c:IBM.teal40},{x:230,y:45,w:55,l:'🏪 Retail',c:IBM.purple40}].map((n,i) => (
          <g key={i}>
            <rect x={n.x} y={n.y} width={n.w} height="35" rx="4" fill={n.c}/>
            <text x={n.x+n.w/2} y={n.y+22} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{n.l}</text>
            {i<3 && <path d={`M${n.x+n.w} ${n.y+17} L${n.x+n.w+15} ${n.y+17}`} stroke={c2} strokeWidth="1.5"/>}
          </g>
        ))}
        {/* Central AI */}
        <rect x="80" y="110" width="140" height="40" rx="6" fill={c1}/><text x="150" y="134" textAnchor="middle" fontSize="10" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">🧠 AI Decision Hub</text>
        {/* Sub-systems */}
        {[{x:20,y:185,l:'Blockchain'},{x:110,y:185,l:'Analytics'},{x:200,y:185,l:'IoT Sensors'}].map((s,i) => (
          <g key={i}>
            <rect x={s.x} y={s.y} width="80" height="28" rx="4" fill={c2}/>
            <text x={s.x+40} y={s.y+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{s.l}</text>
            <line x1={s.x+40} y1={s.y} x2="150" y2="150" stroke={c3} strokeWidth="1"/>
          </g>
        ))}
        <rect x="60" y="240" width="180" height="25" rx="4" fill={c3}/><text x="150" y="257" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">📱 Consumer Transparency Portal</text>
      </svg>
    ),
    'mod-5-supply-chain:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Supply Chain Intelligence Pillars</text>
        {[{x:20,label:'Trace',sub:'Blockchain',c:IBM.blue60,h:100},{x:85,label:'Predict',sub:'Demand AI',c:c1,h:145},{x:150,label:'Optimize',sub:'Logistics',c:IBM.green40,h:125},{x:215,label:'Monitor',sub:'Cold Chain',c:IBM.teal40,h:110}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={235-p.h} width="55" height={p.h} rx="4" fill={p.c}/>
            <text x={p.x+27} y={245-p.h+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{p.label}</text>
            <text x={p.x+27} y={245-p.h+30} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{p.sub}</text>
          </g>
        ))}
        <rect x="15" y="235" width="270" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-5-supply-chain:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Blockchain traceability visualization */}
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Farm-to-Fork Traceability</text>
        {[{x:50,y:55,l:'Harvest',d:'Jan 15'},{x:150,y:55,l:'Process',d:'Jan 16'},{x:250,y:55,l:'Ship',d:'Jan 17'}].map((b,i) => (
          <g key={i}>
            <rect x={b.x-30} y={b.y} width="60" height="45" rx="4" fill={c1} opacity={0.7+i*0.1}/>
            <text x={b.x} y={b.y+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{b.l}</text>
            <text x={b.x} y={b.y+32} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{b.d}</text>
            {i<2 && <line x1={b.x+30} y1={b.y+22} x2={b.x+50} y2={b.y+22} stroke={c2} strokeWidth="2" strokeDasharray="4 3"/>}
          </g>
        ))}
        {/* Chain links visual */}
        {[50,90,130,170,210,250].map((x,i) => (
          <g key={i}><rect x={x-12} y="130" width="24" height="16" rx="8" fill="none" stroke={c1} strokeWidth="2"/></g>
        ))}
        {/* QR code hint */}
        <rect x="100" y="175" width="100" height="80" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1"/>
        <rect x="115" y="190" width="70" height="50" rx="3" fill={IBM.gray100}/>
        {[0,1,2,3,4].map(r => [0,1,2,3,4].map(c => {
          const on = (r+c)%3!==0;
          return on ? <rect key={`${r}-${c}`} x={120+c*12} y={195+r*9} width="9" height="7" fill={IBM.white}/> : null;
        }))}
        <text x="150" y="270" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">Scan for complete food journey</text>
      </svg>
    ),
    'mod-5-supply-chain:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={c1} fontFamily="monospace">&gt; supply_ai optimize route</text>
        <text x="45" y="98" fontSize="9" fill={IBM.green40} fontFamily="monospace">🚛 15 deliveries optimized</text>
        <text x="45" y="116" fontSize="9" fill={c2} fontFamily="monospace">📍 Route: 340km → 215km</text>
        <text x="45" y="134" fontSize="9" fill={c2} fontFamily="monospace">❄️ Cold chain: all zones OK</text>
        <text x="45" y="152" fontSize="9" fill={IBM.green40} fontFamily="monospace">💰 Savings: $2,400/trip</text>
        <text x="45" y="170" fontSize="9" fill={c2} fontFamily="monospace">🌱 CO₂ reduced: -37%</text>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Logistics Optimization Engine</text>
      </svg>
    ),
    'mod-5-supply-chain:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="120" r="40" fill={c1}/><text x="150" y="116" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Supply</text><text x="150" y="128" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">Chain AI</text>
        {[{x:50,y:45,t:'Block-\nchain'},{x:250,y:45,t:'Demand\nForecast'},{x:35,y:195,t:'Cold\nChain'},{x:265,y:195,t:'Route\nOptimize'},{x:150,y:240,t:'Food\nSafety'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="120" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="24" fill={[IBM.blue40,IBM.purple40,IBM.teal40,IBM.green40,IBM.red40][i]} opacity="0.85"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="7" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),

    // ─── MOD 6: Human-AI Future ─── collaboration, ethics, partnership
    'mod-6-future:stats': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="170" rx="6" fill={IBM.white} stroke={c3} strokeWidth="1"/>
        <text x="150" y="52" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">AI Workforce Transformation</text>
        {/* Job impact bars */}
        {[{l:'New AI Roles',v:85,c:IBM.green40},{l:'Augmented Jobs',v:92,c:c1},{l:'Reskilling Need',v:78,c:IBM.teal40},{l:'Productivity Gain',v:95,c:IBM.purple40}].map((b,i) => (
          <g key={i}>
            <text x="48" y={82+i*30} fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">{b.l}</text>
            <rect x="48" y={86+i*30} width="200" height="12" rx="3" fill={IBM.gray10}/>
            <rect x="48" y={86+i*30} width={b.v*2} height="12" rx="3" fill={b.c}/>
            <text x={52+b.v*2} y={96+i*30} fontSize="7" fill={b.c} fontWeight="600" fontFamily="sans-serif">{b.v}%</text>
          </g>
        ))}
        <rect x="55" y="225" width="190" height="25" rx="4" fill={c3}/><text x="150" y="242" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Human-AI Workforce Impact Study</text>
      </svg>
    ),
    'mod-6-future:comparison': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Human vs AI Capabilities</text>
        {/* Venn diagram */}
        <circle cx="120" cy="150" r="70" fill={IBM.green20} opacity="0.4" stroke={IBM.green40} strokeWidth="1.5"/>
        <circle cx="180" cy="150" r="70" fill={c4} stroke={c1} strokeWidth="1.5"/>
        <text x="85" y="130" textAnchor="middle" fontSize="9" fill={IBM.green60} fontWeight="600" fontFamily="sans-serif">Human</text>
        <text x="85" y="148" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Empathy</text>
        <text x="85" y="162" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Creativity</text>
        <text x="85" y="176" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Judgment</text>
        <text x="215" y="130" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">AI</text>
        <text x="215" y="148" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Speed</text>
        <text x="215" y="162" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Scale</text>
        <text x="215" y="176" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Precision</text>
        {/* Overlap */}
        <text x="150" y="140" textAnchor="middle" fontSize="8" fill={c1} fontWeight="700" fontFamily="sans-serif">Partnership</text>
        <text x="150" y="155" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Best of</text>
        <text x="150" y="167" textAnchor="middle" fontSize="7" fill={IBM.gray60} fontFamily="sans-serif">Both</text>
        <rect x="60" y="250" width="180" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">Augmentation Over Replacement</text>
      </svg>
    ),
    'mod-6-future:data_layer': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {[{y:35,label:'🤝 Human Decision Layer',c:IBM.green40},{y:80,label:'🧠 AI Recommendation Engine',c:c1},{y:125,label:'⚖️ Ethics & Governance',c:IBM.purple40},{y:170,label:'🔒 Privacy & Security',c:IBM.teal40},{y:215,label:'🌍 Community Impact',c:IBM.blue40}].map((l,i)=> (
          <g key={i}>
            <path d={`M35 ${l.y} L150 ${l.y+25} L265 ${l.y} L150 ${l.y-18} Z`} fill={l.c} opacity={0.8-i*0.08} stroke={IBM.white} strokeWidth="0.5"/>
            <text x="150" y={l.y+6} textAnchor="middle" fontSize="8.5" fill={IBM.white} fontFamily="sans-serif">{l.label}</text>
          </g>
        ))}
        <text x="150" y="278" textAnchor="middle" fontSize="9" fill={IBM.gray60} fontFamily="sans-serif">Human-AI Partnership Stack</text>
      </svg>
    ),
    'mod-6-future:architecture': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="20" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Responsible AI Framework</text>
        <rect x="80" y="30" width="140" height="35" rx="6" fill={c1}/><text x="150" y="52" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">👥 Human Oversight</text>
        {[{x:25,y:95,l:'Transparency',c:IBM.green40},{x:115,y:95,l:'Fairness',c:IBM.blue40},{x:205,y:95,l:'Privacy',c:IBM.teal40}].map((b,i) => (
          <g key={i}>
            <rect x={b.x} y={b.y} width="80" height="30" rx="4" fill={b.c}/>
            <text x={b.x+40} y={b.y+19} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">{b.l}</text>
            <line x1={b.x+40} y1={b.y} x2="150" y2="65" stroke={c3} strokeWidth="1"/>
          </g>
        ))}
        <rect x="60" y="155" width="180" height="35" rx="5" fill={c2}/><text x="150" y="177" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">🧠 AI Decision Engine</text>
        <line x1="65" y1="125" x2="120" y2="155" stroke={c3} strokeWidth="1"/><line x1="150" y1="125" x2="150" y2="155" stroke={c3} strokeWidth="1"/><line x1="245" y1="125" x2="180" y2="155" stroke={c3} strokeWidth="1"/>
        <rect x="40" y="220" width="90" height="28" rx="4" fill={IBM.purple40}/><text x="85" y="238" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Audit Trail</text>
        <rect x="170" y="220" width="90" height="28" rx="4" fill={IBM.green60}/><text x="215" y="238" textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif">Community</text>
        <line x1="120" y1="190" x2="85" y2="220" stroke={c3} strokeWidth="1"/><line x1="180" y1="190" x2="215" y2="220" stroke={c3} strokeWidth="1"/>
        <rect x="80" y="268" width="140" height="22" rx="4" fill={c3}/><text x="150" y="283" textAnchor="middle" fontSize="8" fill={c1} fontFamily="sans-serif">Continuous Improvement Loop</text>
      </svg>
    ),
    'mod-6-future:pillar': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <text x="150" y="28" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Future of Agricultural AI</text>
        {[{x:15,label:'Ethics',sub:'Responsible',c:IBM.purple40,h:110},{x:80,label:'Skills',sub:'Reskilling',c:c1,h:145},{x:145,label:'Access',sub:'Equity',c:IBM.green40,h:125},{x:210,label:'Sustain',sub:'Long-term',c:IBM.teal40,h:135}].map((p,i) => (
          <g key={i}>
            <rect x={p.x} y={235-p.h} width="60" height={p.h} rx="4" fill={p.c}/>
            <text x={p.x+30} y={245-p.h+18} textAnchor="middle" fontSize="8" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">{p.label}</text>
            <text x={p.x+30} y={245-p.h+30} textAnchor="middle" fontSize="7" fill={IBM.white} opacity="0.8" fontFamily="sans-serif">{p.sub}</text>
          </g>
        ))}
        <rect x="10" y="235" width="280" height="5" rx="2" fill={c3}/>
      </svg>
    ),
    'mod-6-future:callout': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        {/* Human-AI collaboration visual */}
        <text x="150" y="25" textAnchor="middle" fontSize="10" fill={c1} fontWeight="600" fontFamily="sans-serif">Augmented Intelligence</text>
        {/* Human figure */}
        <circle cx="90" cy="70" r="22" fill={IBM.green40}/><text x="90" y="76" textAnchor="middle" fontSize="18">👤</text>
        <rect x="70" y="95" width="40" height="60" rx="5" fill={IBM.green20}/>
        {/* AI figure */}
        <circle cx="210" cy="70" r="22" fill={c1}/><text x="210" y="76" textAnchor="middle" fontSize="18">🤖</text>
        <rect x="190" y="95" width="40" height="60" rx="5" fill={c4}/>
        {/* Handshake / connection */}
        <path d="M110 120 Q150 90 190 120" stroke={IBM.yellow30} strokeWidth="3" fill="none" strokeDasharray="8 4"/>
        <circle cx="150" cy="105" r="12" fill={IBM.yellow30}/><text x="150" y="110" textAnchor="middle" fontSize="12">🤝</text>
        {/* Benefits */}
        <rect x="40" y="180" width="220" height="75" rx="6" fill={c4} stroke={c3} strokeWidth="1"/>
        <text x="150" y="198" textAnchor="middle" fontSize="9" fill={c1} fontWeight="600" fontFamily="sans-serif">Partnership Benefits</text>
        <text x="150" y="216" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">✓ Human creativity + AI precision</text>
        <text x="150" y="232" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">✓ Empathy-guided + data-driven</text>
        <text x="150" y="248" textAnchor="middle" fontSize="8" fill={IBM.gray60} fontFamily="sans-serif">✓ Ethical oversight + scalability</text>
      </svg>
    ),
    'mod-6-future:prompt': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <rect x="30" y="30" width="240" height="200" rx="8" fill={IBM.gray100}/>
        <rect x="30" y="30" width="240" height="28" rx="8" fill={IBM.gray80}/><circle cx="50" cy="44" r="5" fill={IBM.red40}/><circle cx="66" cy="44" r="5" fill={IBM.yellow30}/><circle cx="82" cy="44" r="5" fill={IBM.green40}/>
        <text x="45" y="80" fontSize="9" fill={c1} fontFamily="monospace">&gt; ai_ethics evaluate model</text>
        <text x="45" y="98" fontSize="9" fill={IBM.green40} fontFamily="monospace">🔍 Bias audit: PASSED</text>
        <text x="45" y="116" fontSize="9" fill={c2} fontFamily="monospace">🔒 Privacy score: 94/100</text>
        <text x="45" y="134" fontSize="9" fill={c2} fontFamily="monospace">⚖️ Fairness index: 0.97</text>
        <text x="45" y="152" fontSize="9" fill={c2} fontFamily="monospace">👥 Inclusivity: all regions</text>
        <text x="45" y="170" fontSize="9" fill={IBM.green40} fontFamily="monospace">✓ Ready for deployment</text>
        <rect x="50" y="250" width="200" height="25" rx="4" fill={c3}/><text x="150" y="267" textAnchor="middle" fontSize="9" fill={c1} fontFamily="sans-serif">AI Ethics Evaluation Console</text>
      </svg>
    ),
    'mod-6-future:key_concepts': (
      <svg viewBox="0 0 300 300" width={size} height={size} aria-hidden="true">
        <circle cx="150" cy="120" r="40" fill={c1}/><text x="150" y="116" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif" fontWeight="600">Human</text><text x="150" y="128" textAnchor="middle" fontSize="9" fill={IBM.white} fontFamily="sans-serif">+AI</text>
        {[{x:50,y:45,t:'Ethics'},{x:250,y:45,t:'Reskill'},{x:35,y:195,t:'Equity'},{x:265,y:195,t:'Govern-\nance'},{x:150,y:240,t:'Sustain-\nability'}].map((n,i) => (
          <g key={i}>
            <line x1="150" y1="120" x2={n.x} y2={n.y} stroke={c3} strokeWidth="1.5"/>
            <circle cx={n.x} cy={n.y} r="24" fill={[IBM.purple40,IBM.green40,IBM.blue40,IBM.teal40,IBM.yellow30][i]} opacity="0.85"/>
            <text x={n.x} y={n.y+4} textAnchor="middle" fontSize="7" fill={IBM.white} fontFamily="sans-serif">{n.t}</text>
          </g>
        ))}
      </svg>
    ),
  };

  // Look up module-specific illustration first, then fall back to generic
  const key = `${moduleId}:${slideType}`;
  if (illustrations[key]) return illustrations[key];

  // Fall back to the existing IsometricSVG system for types without module-specific art
  const fallbackMap = {
    title: 'farm', objectives: 'checkpoint', hero: 'farm', insight: 'insights',
    stats: 'stats', timeline: 'farm', quote: 'quote', callout: 'text',
    persona: 'persona', comparison: 'stats', reveal: 'network', value_chart: 'stats',
    case_study: 'farm', data_layer: 'sensors', pillar: 'network', architecture: 'sensors',
    prompt: 'text', checkpoint: 'checkpoint', video: 'video', game: 'game',
    chatbot_cta: 'persona', takeaway: 'checkpoint', key_concepts: 'insights',
  };
  return <IsometricSVG type={fallbackMap[slideType] || 'insights'} color={color} size={size} />;
}

// Map slide types to best illustration (kept for backward compatibility)
const SLIDE_ILLUSTRATIONS = {
  title: (t) => t.icon,
  objectives: () => 'checkpoint',
  hero: (t) => t.icon,
  insight: () => 'insights',
  stats: () => 'stats',
  timeline: (t) => t.icon,
  quote: () => 'quote',
  callout: () => 'text',
  persona: () => 'persona',
  comparison: () => 'stats',
  reveal: () => 'network',
  value_chart: () => 'stats',
  case_study: (t) => t.icon,
  data_layer: () => 'sensors',
  pillar: () => 'network',
  architecture: () => 'sensors',
  prompt: () => 'text',
  checkpoint: () => 'checkpoint',
  video: () => 'video',
  game: () => 'game',
  chatbot_cta: () => 'persona',
  takeaway: () => 'checkpoint',
  key_concepts: () => 'insights',
};

// ============================================================
// AI GLOSSARY — inline term highlighting with tooltips
// ============================================================
const AI_GLOSSARY = {
  'AI': { term: 'Artificial Intelligence', def: 'Computer systems performing tasks that require human intelligence — perception, decision-making, and learning.' },
  'IoT': { term: 'Internet of Things', def: 'Network of sensor-embedded physical devices that collect and exchange data.' },
  'machine learning': { term: 'Machine Learning', def: 'AI subset where systems improve from data without explicit programming.' },
  'deep learning': { term: 'Deep Learning', def: 'Neural networks with many layers, powerful for image and language tasks.' },
  'computer vision': { term: 'Computer Vision', def: 'AI interpreting visual information — crop disease detection, yield estimation.' },
  'precision agriculture': { term: 'Precision Agriculture', def: 'Data-driven farming treating each field zone to its specific needs.' },
  'NDVI': { term: 'Normalized Difference Vegetation Index', def: 'Remote sensing metric indicating plant health via light reflectance.' },
  'edge computing': { term: 'Edge Computing', def: 'Processing data on-farm rather than in distant cloud servers.' },
  'variable-rate technology': { term: 'Variable-Rate Technology', def: 'Equipment auto-adjusting inputs based on sensor data.' },
  'neural network': { term: 'Neural Network', def: 'Computing system of interconnected nodes processing information in layers.' },
  'drone': { term: 'UAV', def: 'Remotely piloted aircraft for aerial imaging and precision spraying.' },
  'multispectral': { term: 'Multispectral Imaging', def: 'Capturing data across electromagnetic frequencies to reveal plant health.' },
  'ROI': { term: 'Return on Investment', def: 'Profit generated relative to cost — critical for AI adoption.' },
  'cold chain': { term: 'Cold Chain', def: 'Temperature-controlled supply chain for perishables.' },
  'CNN': { term: 'Convolutional Neural Network', def: 'Deep learning for image processing — crop disease detection.' },
  'blockchain': { term: 'Blockchain', def: 'Distributed ledger for supply chain traceability and food trust.' },
  'satellite imagery': { term: 'Satellite Imagery', def: 'Orbital images for large-scale crop monitoring and climate tracking.' },
  'generative AI': { term: 'Generative AI', def: 'AI that creates new content from learned patterns.' },
};

function GlossaryTerm({ children }) {
  const [show, setShow] = useState(false);
  const text = typeof children === 'string' ? children : '';
  const lower = text.toLowerCase();
  const entry = AI_GLOSSARY[lower] || AI_GLOSSARY[text] || Object.values(AI_GLOSSARY).find(e => e.term.toLowerCase() === lower);
  if (!entry) return <span className="ms-glossary-term">{children}</span>;
  return (
    <span className="ms-glossary-wrap" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <span className="ms-glossary-term">{children}</span>
      {show && (
        <span className="ms-glossary-tooltip">
          <strong>{entry.term}</strong>
          <span>{entry.def}</span>
        </span>
      )}
    </span>
  );
}

function highlightGlossary(text) {
  if (!text || typeof text !== 'string') return text;
  const terms = Object.keys(AI_GLOSSARY).sort((a, b) => b.length - a.length);
  const regex = new RegExp(`\\b(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const isMatch = terms.some(t => t.toLowerCase() === part.toLowerCase());
    return isMatch ? <GlossaryTerm key={i}>{part}</GlossaryTerm> : part;
  });
}

// ============================================================
// PERSONA DATA
// ============================================================
const PERSONA_DATA = {
  amara: { name: 'Amara Johnson', role: 'Wheat Farmer, Kansas', initials: 'AJ', color: '#198038', photo: '/images/persona-amara.png' },
  carlos: { name: 'Carlos Mendoza', role: 'Coffee Farmer, Colombia', initials: 'CM', color: '#0043ce', photo: '/images/persona-carlos.png' },
  dr_okafor: { name: 'Dr. Fatima Okafor', role: 'Agronomist, Nigeria', initials: 'FO', color: '#8a3ffc', photo: '/images/persona-fatima.png' },
  rajan: { name: 'Rajan Patel', role: 'Food Distributor, India', initials: 'RP', color: '#007d79', photo: '/images/persona-rajan.png' },
  khalid: { name: 'Khalid Al-Rashidi', role: 'AgriTech Director, Saudi Arabia', initials: 'KR', color: '#da1e28', photo: '/images/persona-khalid.png' },
};

// Helper: extract YouTube video ID from URL
function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/);
  return m ? m[1] : null;
}

// Module hero background images
const MODULE_HERO_IMAGES = {
  'mod-1-revolution': '/images/modules/mod1-revolution.jpg',
  'mod-2-sensing': '/images/modules/mod2-sensing.jpg',
  'mod-3-crop-mgmt': '/images/modules/mod3-crop.jpg',
  'mod-4-climate': '/images/modules/mod4-climate.jpg',
  'mod-5-supply-chain': '/images/modules/mod5-supply.jpg',
  'mod-6-future': '/images/modules/mod6-future.jpg',
};

// Contextual images for different slide types — each type gets a DISTINCT image
const CONTEXTUAL_IMAGES = {
  'mod-1-revolution': { insight: '/images/hero-agriculture-ai.jpg', stats: '/images/exam-wheat-field.jpg', case_study: '/images/exam-ai-adoption.jpg' },
  'mod-2-sensing': { insight: '/images/companies/iot-soil-sensor.jpg', stats: '/images/companies/smart-farm-sensors.jpg', case_study: '/images/companies/drone-crop-monitoring.jpg' },
  'mod-3-crop-mgmt': { insight: '/images/companies/precision-agriculture-drone.jpg', stats: '/images/exam-crop-genetics.jpg', case_study: '/images/exam-coffee-drone.jpg' },
  'mod-4-climate': { insight: '/images/exam-climate-weather.jpg', stats: '/images/modules/mod4-climate.jpg', case_study: '/images/exam-wheat-field.jpg' },
  'mod-5-supply-chain': { insight: '/images/companies/supply-chain-robotics.jpg', stats: '/images/companies/warehouse-automation.jpg', case_study: '/images/exam-supply-chain.jpg' },
  'mod-6-future': { insight: '/images/exam-human-ai.jpg', stats: '/images/exam-ai-adoption.jpg', case_study: '/images/modules/mod6-future.jpg' },
};

// ============================================================
// CONTENT MERGER — Combines blocks into 20-30 rich slides
// Strategy: Merge related content, add key-concept cards,
//           generate takeaway summaries, enriched insights
// ============================================================
function mergeModuleToSlides(moduleData) {
  const { module: mod, lessons: fullLessons } = moduleData;
  const slides = [];
  const themeBase = MODULE_THEMES[mod.id] || { icon: 'farm', color: IBM.blue60, accent: IBM.blue40 };
  const theme = { ...themeBase, moduleId: mod.id };

  // ── 1. Module Title Card ──
  slides.push({
    type: 'title',
    title: mod.title,
    subtitle: mod.subtitle || mod.description,
    moduleNum: mod.order_index,
    moduleId: mod.id,
    duration: fullLessons.reduce((s, fl) => s + (fl.lesson.duration_minutes || 0), 0),
    lessonCount: fullLessons.length,
    theme,
  });

  // ── 2. Learning Objectives ──
  if (mod.learning_objectives?.length) {
    slides.push({ type: 'objectives', objectives: mod.learning_objectives, theme });
  }

  // ── 3. Process ALL lessons, merging content ──
  const allTextSegments = [];
  const allHeroes = [];
  const allStats = [];
  const allTimelines = [];
  const allQuotes = [];
  const allCallouts = [];
  const allComparisons = [];
  const allReveals = [];
  const allPersonas = [];
  const allValueCharts = [];
  const allCaseStudies = [];
  const allDataLayers = [];
  const allPillars = [];
  const allArchitectures = [];
  const allPrompts = [];
  const checkpointActivities = [];
  const gameData = [];
  const videoData = [];

  for (const { lesson, activities, games } of fullLessons) {
    const blocks = lesson.content?.blocks || [];

    for (const block of blocks) {
      switch (block.type) {
        case 'hero':
          allHeroes.push({ ...block, lessonTitle: lesson.title });
          break;
        case 'text':
          allTextSegments.push({ content: block.content, title: lesson.title, lessonId: lesson.id });
          break;
        case 'stat_cards':
          allStats.push(...(block.stats || []));
          break;
        case 'timeline':
          allTimelines.push(...(block.items || []));
          break;
        case 'quote':
          allQuotes.push(block);
          break;
        case 'callout':
          allCallouts.push(block);
          break;
        case 'comparison':
          allComparisons.push(...(block.items || []));
          break;
        case 'interactive_reveal':
          allReveals.push(...(block.items || []));
          break;
        case 'persona_intro':
        case 'persona_scenario':
          allPersonas.push(block);
          break;
        case 'value_chart':
          allValueCharts.push(block);
          break;
        case 'case_study_preview':
          allCaseStudies.push(block);
          break;
        case 'data_layers':
          allDataLayers.push(...(block.layers || []));
          break;
        case 'pillars':
          allPillars.push(...(block.items || []));
          break;
        case 'architecture_diagram':
          allArchitectures.push(...(block.components || []));
          break;
        case 'prompt_test':
          allPrompts.push(block);
          break;
        default:
          // video_intro, game_intro — handled via lesson type
          break;
      }
    }

    if (lesson.type === 'checkpoint' && activities?.length) {
      checkpointActivities.push({ activities, lessonId: lesson.id, moduleId: lesson.module_id, title: lesson.title });
    }
    if (lesson.type === 'video') {
      videoData.push({
        title: lesson.title, url: lesson.video_url,
        text: blocks[0]?.text || blocks[0]?.content || '',
        duration: lesson.duration_minutes,
      });
    }
    if (lesson.type === 'game' && games?.length) {
      gameData.push({ games, lessonId: lesson.id, moduleId: lesson.module_id, title: lesson.title, description: blocks[0]?.text || '' });
    }
  }

  // ── Now build slides from collected content ──

  // Hero card (use the first hero, or module title if none)
  if (allHeroes.length > 0) {
    const h = allHeroes[0];
    slides.push({
      type: 'hero', title: h.title || h.lessonTitle, subtitle: h.subtitle, image: h.image, theme,
    });
  }

  // TEXT: Group into insight cards — each card gets 2-3 text segments for richness
  // Extract key points from text to make cards more visual
  const ctxImages = CONTEXTUAL_IMAGES[mod.id] || {};
  const textChunks = [];
  for (let i = 0; i < allTextSegments.length; i += 2) {
    const batch = allTextSegments.slice(i, i + 2);
    const combined = batch.map(t => t.content).join('\n\n');
    const title = batch[0].title;
    // Extract key bullets from text
    const sentences = combined.split(/[.!?]+/).filter(s => s.trim().length > 30).slice(0, 5);
    // Alternate contextual images
    const imgIdx = Math.floor(i / 2) % 2;
    const contextImage = imgIdx === 0 ? ctxImages.insight : null;
    textChunks.push({ title, content: combined, keyPoints: sentences.map(s => s.trim() + '.'), theme, contextImage });
  }
  for (const chunk of textChunks) {
    slides.push({ type: 'insight', ...chunk });
  }

  // Additional heroes (after first) → secondary hero cards
  for (let i = 1; i < allHeroes.length; i++) {
    const h = allHeroes[i];
    slides.push({ type: 'hero', title: h.title || h.lessonTitle, subtitle: h.subtitle, image: h.image, theme });
  }

  // Stats → single rich card (with source)
  if (allStats.length > 0) {
    slides.push({ type: 'stats', title: 'Key Numbers', stats: allStats.slice(0, 8), theme,
      sources: [
        { label: 'UN Population Prospects 2022', url: 'https://population.un.org/wpp/' },
        { label: 'FAO — The Future of Food and Agriculture', url: 'https://www.fao.org/global-perspectives-studies/' },
      ],
    });
  }

  // Timeline → single card
  if (allTimelines.length > 0) {
    slides.push({ type: 'timeline', title: 'Key Milestones', items: allTimelines, theme });
  }

  // Quotes → one card per quote (they're impactful)
  for (const q of allQuotes) {
    slides.push({ type: 'quote', text: q.text, author: q.author, role: q.role, theme });
  }

  // Callouts → one card per callout
  for (const c of allCallouts) {
    slides.push({ type: 'callout', title: c.title, content: c.content, style: c.style, theme });
  }

  // Comparison → one rich card
  if (allComparisons.length > 0) {
    slides.push({ type: 'comparison', title: 'Compare & Contrast', items: allComparisons, theme });
  }

  // Interactive reveal → one card
  if (allReveals.length > 0) {
    slides.push({ type: 'reveal', title: 'Explore & Discover', items: allReveals, theme });
  }

  // Persona scenarios → one card per persona (with photo references & tools)
  for (const p of allPersonas) {
    const pData = p.name ? p : p;
    const tools = p.items?.map(it => it.visible || it.title) || [];
    slides.push({ type: 'persona', persona: pData.persona || pData.name, scenario: pData.scenario, tools, theme });
  }

  // Value charts (with source)
  for (const v of allValueCharts) {
    slides.push({ type: 'value_chart', data: v.data, theme,
      sources: [{ label: 'McKinsey & Company — Agriculture practice', url: 'https://www.mckinsey.com/industries/agriculture' }],
    });
  }

  // Case studies (with source)
  for (const cs of allCaseStudies) {
    slides.push({ type: 'case_study', company: cs.company, title: cs.title, text: cs.text, theme, contextImage: ctxImages.case_study || null,
      sources: cs.company === 'McKinsey' ? [{ label: 'McKinsey Global Farmer Insights 2024', url: 'https://www.mckinsey.com/industries/agriculture/our-insights/agricultural-technology' }] : [],
    });
  }

  // Data layers → one card
  if (allDataLayers.length > 0) {
    slides.push({ type: 'data_layer', layers: allDataLayers, theme });
  }

  // Pillars → one card
  if (allPillars.length > 0) {
    slides.push({ type: 'pillar', pillars: allPillars, theme });
  }

  // Architecture → one card
  if (allArchitectures.length > 0) {
    slides.push({ type: 'architecture', components: allArchitectures, theme });
  }

  // Prompts → one card per prompt
  for (const pr of allPrompts) {
    slides.push({ type: 'prompt', title: pr.title, prompt: pr.prompt, theme });
  }

  // Videos → one card per video
  for (const v of videoData) {
    slides.push({ type: 'video', ...v, theme });
  }

  // Checkpoints → one card per checkpoint
  for (const cp of checkpointActivities) {
    slides.push({ type: 'checkpoint', ...cp, theme });
  }

  // Games → one card per game
  for (const g of gameData) {
    slides.push({ type: 'game', ...g, theme });
  }

  // Key Takeaways card (always before CTA)
  const takeaways = mod.learning_objectives?.slice(0, 4) || [];
  if (takeaways.length > 0) {
    slides.push({ type: 'takeaway', objectives: takeaways, moduleTitle: mod.title, moduleId: mod.id, theme });
  }

  // Final: Chatbot CTA
  slides.push({ type: 'chatbot_cta', theme });

  // If slide count < 20, add "key concepts" cards from remaining text
  if (slides.length < 20 && allTextSegments.length > 2) {
    // Insert additional concept cards before takeaway
    const insertIdx = slides.length - 2; // before takeaway and CTA
    const extraTexts = allTextSegments.slice(Math.floor(allTextSegments.length / 2));
    for (const t of extraTexts) {
      if (slides.length >= 25) break;
      const sentences = t.content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      if (sentences.length >= 2) {
        slides.splice(insertIdx, 0, {
          type: 'key_concepts',
          title: t.title,
          concepts: sentences.slice(0, 4).map(s => s.trim()),
          theme,
        });
      }
    }
  }

  return slides;
}

// ============================================================
// SLIDE CARD COMPONENTS — 2× larger with graphic+text layout
// ============================================================

function SlideTitle({ slide }) {
  const heroImg = MODULE_HERO_IMAGES[slide.moduleId];
  return (
    <div className="ms-card ms-card-title ms-card-fullbleed">
      {heroImg && (
        <div className="ms-fullbleed-bg">
          <img src={heroImg} alt={slide.title} onError={e => { e.target.style.display = 'none'; }} />
          <div className="ms-fullbleed-overlay" />
        </div>
      )}
      <div className="ms-card-body ms-card-body-center" style={{ position: 'relative', zIndex: 1, color: heroImg ? '#fff' : undefined }}>
        <div className="ms-badge" style={heroImg ? { color: '#78a9ff' } : {}}>Module {slide.moduleNum}</div>
        <h1 className="ms-heading-xl">{slide.title}</h1>
        <p className="ms-subtitle" style={heroImg ? { color: 'rgba(255,255,255,0.85)' } : {}}>{slide.subtitle}</p>
        <div className="ms-meta-row" style={heroImg ? { color: 'rgba(255,255,255,0.7)' } : {}}>
          <span><TimeIcon size={16} /> {slide.duration} minutes</span>
          <span><CatalogIcon size={16} /> {slide.lessonCount} lessons</span>
        </div>
        <p className="ms-hint" style={heroImg ? { color: 'rgba(255,255,255,0.5)' } : {}}>Use arrow keys or swipe to navigate &rarr;</p>
      </div>
    </div>
  );
}

function SlideObjectives({ slide }) {
  return (
    <div className="ms-card ms-card-objectives">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="objectives" color={slide.theme.color} size={260} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge"><FlagIcon size={14} /> Learning Objectives</div>
        <h2 className="ms-heading-lg">What You'll Learn</h2>
        <ul className="ms-objectives-list">
          {slide.objectives.map((obj, i) => (
            <li key={i}><CheckmarkFilledIcon size={18} color="var(--support-success)" /><span>{highlightGlossary(obj)}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SlideHero({ slide }) {
  const hasImage = !!slide.image;
  return (
    <div className={`ms-card ms-card-hero ${hasImage ? 'ms-card-fullbleed' : ''}`}>
      {hasImage && (
        <div className="ms-fullbleed-bg">
          <img src={slide.image} alt={slide.title} onError={e => { e.target.style.display = 'none'; }} />
          <div className="ms-fullbleed-overlay" />
        </div>
      )}
      {!hasImage && (
        <div className="ms-card-graphic">
          <ModuleIllustration moduleId={slide.theme.moduleId} slideType="hero" color={slide.theme.color} size={280} />
        </div>
      )}
      <div className="ms-card-body" style={hasImage ? { position: 'relative', zIndex: 1, color: '#fff', justifyContent: 'flex-end', paddingBottom: '4rem' } : {}}>
        <h2 className="ms-heading-xl">{slide.title}</h2>
        {slide.subtitle && <p className="ms-subtitle" style={hasImage ? { color: 'rgba(255,255,255,0.85)', fontSize: '1.25rem' } : {}}>{highlightGlossary(slide.subtitle)}</p>}
        {slide.lessonContext && <p className="ms-paragraph" style={hasImage ? { color: 'rgba(255,255,255,0.7)' } : {}}>{slide.lessonContext}</p>}
      </div>
    </div>
  );
}

function SlideInsight({ slide }) {
  const paragraphs = slide.content.split(/\n\n+/).filter(Boolean);
  const keyPoints = slide.keyPoints || [];
  const contextImg = slide.contextImage;
  return (
    <div className="ms-card ms-card-insight">
      <div className="ms-card-graphic">
        {contextImg ? (
          <img src={contextImg} alt={slide.title} className="ms-graphic-photo" onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <ModuleIllustration moduleId={slide.theme.moduleId} slideType="insight" color={slide.theme.color} size={280} />
        )}
      </div>
      <div className="ms-card-body">
        <div className="ms-badge"><IdeaIcon size={14} /> Key Insight</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-text-content">
          {paragraphs.map((p, i) => (
            <p key={i} className="ms-paragraph">{highlightGlossary(p)}</p>
          ))}
        </div>
        {keyPoints.length > 0 && (
          <div className="ms-key-points">
            <div className="ms-key-points-header"><IdeaIcon size={16} color={slide.theme.color} /> Key Takeaways</div>
            {keyPoints.slice(0, 4).map((point, i) => (
              <div key={i} className="ms-key-point">
                <span className="ms-key-point-num" style={{ background: slide.theme.color }}>{i + 1}</span>
                <span>{highlightGlossary(point)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="ms-noor-hint"><BotIcon size={14} /> Ask Noor to explain further</div>
      </div>
    </div>
  );
}

function SlideStats({ slide }) {
  return (
    <div className="ms-card ms-card-stats">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="stats" color={slide.theme.color} size={260} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Data Snapshot</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-stats-grid">
          {slide.stats.map((s, i) => (
            <div key={i} className="ms-stat-item" style={{ borderTop: `3px solid ${slide.theme.color}` }}>
              <div className="ms-stat-value">{s.value}</div>
              <div className="ms-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
        <SourceLinks sources={slide.sources} />
      </div>
    </div>
  );
}

function SlideTimeline({ slide }) {
  return (
    <div className="ms-card ms-card-timeline">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="timeline" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Historical Context</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-timeline">
          {slide.items.map((item, i) => (
            <div key={i} className="ms-timeline-item">
              <div className="ms-timeline-marker">
                <div className="ms-timeline-dot" style={{ background: slide.theme.color }} />
                {i < slide.items.length - 1 && <div className="ms-timeline-line" />}
              </div>
              <div className="ms-timeline-content">
                <span className="ms-timeline-year">{item.year}</span>
                <strong>{item.title}</strong>
                <p>{highlightGlossary(item.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideQuote({ slide }) {
  return (
    <div className="ms-card ms-card-quote">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="quote" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <QuotesIcon size={40} color={slide.theme.color} style={{ opacity: 0.4 }} />
        <blockquote className="ms-quote-text">{highlightGlossary(slide.text)}</blockquote>
        <div className="ms-quote-author">&mdash; {slide.author}</div>
        {slide.role && <div className="ms-quote-role">{slide.role}</div>}
      </div>
    </div>
  );
}

function SlideCallout({ slide }) {
  const iconMap = { info: InformationIcon, success: CheckmarkFilledIcon, warning: WarningIcon, technical: CodeIcon };
  const Icon = iconMap[slide.style] || InformationIcon;
  return (
    <div className="ms-card ms-card-callout">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="callout" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-callout-header">
          <Icon size={28} color={slide.theme.color} />
          <h3 className="ms-heading-lg">{slide.title}</h3>
        </div>
        <p className="ms-paragraph">{highlightGlossary(slide.content)}</p>
        <div className="ms-noor-hint"><BotIcon size={14} /> Ask Noor for details</div>
      </div>
    </div>
  );
}

function SlidePersona({ slide }) {
  const p = PERSONA_DATA[slide.persona] || { name: 'Persona', role: '', initials: '?', color: '#0f62fe', photo: null };
  return (
    <div className="ms-card ms-card-persona">
      <div className="ms-card-graphic ms-persona-graphic">
        {p.photo ? (
          <img src={p.photo} alt={p.name} className="ms-persona-photo" onError={e => {
            e.target.style.display = 'none';
            e.target.nextSibling && (e.target.nextSibling.style.display = 'flex');
          }} />
        ) : null}
        <div className="ms-persona-avatar-lg" style={{ background: p.color, display: p.photo ? 'none' : 'flex' }}>{p.initials}</div>
        <div className="ms-persona-info">
          <strong>{p.name}</strong>
          <span>{p.role}</span>
        </div>
      </div>
      <div className="ms-card-body">
        <div className="ms-badge" style={{ color: p.color }}>Real-World Scenario</div>
        <h3 className="ms-heading-lg">{p.name}</h3>
        <div className="ms-persona-role">{p.role}</div>
        <p className="ms-paragraph ms-persona-scenario">{highlightGlossary(slide.scenario)}</p>
        {slide.tools && slide.tools.length > 0 && (
          <div className="ms-persona-tools">
            <strong>AI Tools Used:</strong>
            <ul>{slide.tools.map((t, i) => <li key={i}><CheckmarkIcon size={14} color={p.color} /> {t}</li>)}</ul>
          </div>
        )}
        <div className="ms-noor-hint"><BotIcon size={14} /> Ask Noor how this applies to your context</div>
      </div>
    </div>
  );
}

function SlideComparison({ slide }) {
  return (
    <div className="ms-card ms-card-comparison">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="comparison" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Analysis</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-comparison-grid">
          {slide.items.map((item, i) => (
            <div key={i} className="ms-comparison-item" style={{ borderLeft: `4px solid ${i % 2 === 0 ? slide.theme.color : slide.theme.accent}` }}>
              <h4>{item.category}</h4>
              <p>{highlightGlossary(item.description)}</p>
              {item.examples && (
                <ul>{item.examples.map((ex, j) => <li key={j}><CheckmarkIcon size={14} color="var(--support-success)" /> {ex}</li>)}</ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideReveal({ slide }) {
  const [opened, setOpened] = useState({});
  return (
    <div className="ms-card ms-card-reveal">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="reveal" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Interactive</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <p className="ms-subtitle">Click each item to reveal the answer</p>
        <div className="ms-reveal-list">
          {slide.items.map((item, i) => (
            <div key={i} className={`ms-reveal-item ${opened[i] ? 'open' : ''}`} onClick={() => setOpened(p => ({ ...p, [i]: !p[i] }))}>
              <div className="ms-reveal-q">
                <span className="ms-reveal-num" style={{ background: slide.theme.color }}>{i + 1}</span>
                <span>{item.visible}</span>
                <span className="ms-reveal-toggle">{opened[i] ? '−' : '+'}</span>
              </div>
              {opened[i] && <div className="ms-reveal-a">{highlightGlossary(item.hidden)}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideValueChart({ slide }) {
  if (!slide.data) return null;
  const Section = ({ title, total, items, color }) => (
    <div className="ms-value-section">
      <div className="ms-value-header"><span>{title}</span><strong>${total}B</strong></div>
      {items.map((item, i) => (
        <div key={i} className="ms-value-row">
          <span className="ms-value-label">{item.label}</span>
          <div className="ms-value-bar"><div className="ms-value-fill" style={{ width: `${(item.value / total) * 100}%`, background: color }}>${item.value}B</div></div>
        </div>
      ))}
      {items[0]?.desc && <p className="ms-value-desc">{items[0].desc}</p>}
    </div>
  );
  return (
    <div className="ms-card ms-card-value">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="value_chart" color={slide.theme.color} size={260} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Market Analysis</div>
        <h3 className="ms-heading-lg">AI Value in Agriculture</h3>
        {slide.data.onAcre && <Section title="On the Acre" total={slide.data.onAcre.total} items={slide.data.onAcre.items} color={IBM.green60} />}
        {slide.data.enterprise && <Section title="Enterprise" total={slide.data.enterprise.total} items={slide.data.enterprise.items} color={IBM.blue60} />}
        <SourceLinks sources={slide.sources} />
      </div>
    </div>
  );
}

function SlideCaseStudy({ slide }) {
  const contextImg = slide.contextImage;
  return (
    <div className="ms-card ms-card-case">
      <div className="ms-card-graphic">
        {contextImg ? (
          <img src={contextImg} alt={slide.title} className="ms-graphic-photo" onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <ModuleIllustration moduleId={slide.theme.moduleId} slideType="case_study" color={slide.theme.color} size={280} />
        )}
      </div>
      <div className="ms-card-body">
        <div className="ms-badge"><DocumentIcon size={14} /> Case Study</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-case-company">{slide.company}</div>
        <p className="ms-paragraph">{highlightGlossary(slide.text)}</p>
        <SourceLinks sources={slide.sources} />
        <div className="ms-noor-hint"><BotIcon size={14} /> Discuss this case study with Noor</div>
      </div>
    </div>
  );
}

function SlideDataLayers({ slide }) {
  return (
    <div className="ms-card ms-card-layers">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="data_layer" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Technical Architecture</div>
        <h3 className="ms-heading-lg">Data Layers</h3>
        <div className="ms-layers-list">
          {slide.layers.map((l, i) => (
            <div key={i} className="ms-layer-item" style={{ borderLeftColor: slide.theme.color }}>
              <div className="ms-layer-num" style={{ background: slide.theme.color }}>{i + 1}</div>
              <div>
                <strong>{l.name}</strong>
                <p>{highlightGlossary(l.description)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlidePillars({ slide }) {
  return (
    <div className="ms-card ms-card-pillars">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="pillar" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">Framework</div>
        <h3 className="ms-heading-lg">Key Pillars</h3>
        <div className="ms-pillars-grid">
          {slide.pillars.map((p, i) => (
            <div key={i} className="ms-pillar-item">
              <span className="ms-pillar-num" style={{ background: slide.theme.color }}>{p.number || (i + 1)}</span>
              <div><strong>{p.title}</strong><p>{highlightGlossary(p.desc)}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideArchitecture({ slide }) {
  return (
    <div className="ms-card ms-card-arch">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="architecture" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge">System Design</div>
        <h3 className="ms-heading-lg">Architecture</h3>
        <div className="ms-arch-list">
          {slide.components.map((c, i) => (
            <div key={i} className="ms-arch-item" style={{ borderLeft: `3px solid ${slide.theme.color}` }}>
              <strong>{c.name}</strong><p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlidePrompt({ slide }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(slide.prompt); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="ms-card ms-card-prompt">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="prompt" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge"><TerminalIcon size={14} /> AI Prompt Lab</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <pre className="ms-prompt-text">{slide.prompt}</pre>
        <button className="ms-prompt-copy" onClick={copy}>
          {copied ? <CheckmarkIcon size={16} /> : <CopyIcon size={16} />}
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
    </div>
  );
}

function SlideCheckpoint({ slide }) {
  const { user, refreshProgress } = useContext(AppContext);
  return (
    <div className="ms-card ms-card-checkpoint">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="checkpoint" color={slide.theme.color} size={220} />
      </div>
      <div className="ms-card-body ms-card-body-scroll">
        <div className="ms-badge"><CertificateIcon size={14} /> Knowledge Check</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        {slide.activities.map(act => (
          <QuizComponent key={act.id} activity={act} onComplete={(score) => {
            if (user) {
              fetch(`/api/users/${user.id}/progress`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: slide.lessonId, moduleId: slide.moduleId, status: 'completed', score })
              }).then(() => refreshProgress());
            }
          }} />
        ))}
      </div>
    </div>
  );
}

function SlideVideo({ slide }) {
  const videoId = getYouTubeId(slide.url);
  return (
    <div className="ms-card ms-card-video ms-card-fullbleed">
      <div className="ms-video-embed-wrap">
        {videoId ? (
          <iframe
            className="ms-video-iframe"
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=0`}
            title={slide.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="ms-video-placeholder">
            <ModuleIllustration moduleId={slide.theme.moduleId} slideType="video" color={slide.theme.color} size={200} />
          </div>
        )}
      </div>
      <div className="ms-video-info">
        <div className="ms-badge"><PlayFilledIcon size={14} /> Video — {slide.duration} min</div>
        <h3 className="ms-heading-md">{slide.title}</h3>
        {slide.text && <p className="ms-paragraph">{highlightGlossary(slide.text)}</p>}
      </div>
    </div>
  );
}

function SlideGame({ slide }) {
  const { user, refreshProgress } = useContext(AppContext);
  return (
    <div className="ms-card ms-card-game">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="game" color={slide.theme.color} size={220} />
      </div>
      <div className="ms-card-body ms-card-body-scroll">
        <div className="ms-badge"><GameControllerIcon size={14} /> Interactive Challenge</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        {slide.games.map(game => (
          <MiniGame key={game.id} game={game} onComplete={(score) => {
            if (user) {
              fetch(`/api/users/${user.id}/progress`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lessonId: slide.lessonId, moduleId: slide.moduleId, status: 'completed', score })
              }).then(() => refreshProgress());
            }
          }} />
        ))}
      </div>
    </div>
  );
}

function SlideTakeaway({ slide }) {
  const heroImg = MODULE_HERO_IMAGES[slide.moduleId];
  return (
    <div className={`ms-card ms-card-takeaway ${heroImg ? 'ms-card-fullbleed' : ''}`}>
      {heroImg && (
        <div className="ms-fullbleed-bg">
          <img src={heroImg} alt="Module summary" onError={e => { e.target.style.display = 'none'; }} />
          <div className="ms-fullbleed-overlay ms-fullbleed-overlay-heavy" />
        </div>
      )}
      {!heroImg && (
        <div className="ms-card-graphic">
          <ModuleIllustration moduleId={slide.theme.moduleId} slideType="takeaway" color={slide.theme.color} size={260} />
        </div>
      )}
      <div className="ms-card-body" style={heroImg ? { position: 'relative', zIndex: 1, color: '#fff' } : {}}>
        <div className="ms-badge" style={heroImg ? { color: '#78a9ff' } : {}}><CheckmarkFilledIcon size={14} /> Module Summary</div>
        <h3 className="ms-heading-lg">Key Takeaways</h3>
        <p className="ms-subtitle" style={heroImg ? { color: 'rgba(255,255,255,0.8)' } : {}}>{slide.moduleTitle}</p>
        <div className="ms-takeaway-list">
          {slide.objectives.map((obj, i) => (
            <div key={i} className="ms-takeaway-item" style={heroImg ? { color: '#fff' } : {}}>
              <span className="ms-takeaway-num" style={{ background: slide.theme.color }}>{i + 1}</span>
              <span>{highlightGlossary(obj)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SlideKeyConcepts({ slide }) {
  return (
    <div className="ms-card ms-card-concepts">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="key_concepts" color={slide.theme.color} size={240} />
      </div>
      <div className="ms-card-body">
        <div className="ms-badge"><IdeaIcon size={14} /> Deep Dive</div>
        <h3 className="ms-heading-lg">{slide.title}</h3>
        <div className="ms-concepts-list">
          {slide.concepts.map((c, i) => (
            <div key={i} className="ms-concept-item">
              <div className="ms-concept-bullet" style={{ background: slide.theme.color }} />
              <span>{highlightGlossary(c)}</span>
            </div>
          ))}
        </div>
        <div className="ms-noor-hint"><BotIcon size={14} /> Ask Noor to elaborate on any concept</div>
      </div>
    </div>
  );
}

function SlideChatbotCTA({ slide }) {
  return (
    <div className="ms-card ms-card-cta">
      <div className="ms-card-graphic">
        <ModuleIllustration moduleId={slide.theme.moduleId} slideType="chatbot_cta" color={slide.theme.color} size={260} />
      </div>
      <div className="ms-card-body ms-card-body-center">
        <BotIcon size={56} color={slide.theme.color} />
        <h3 className="ms-heading-xl">Module Complete!</h3>
        <p className="ms-paragraph">You've completed all slides in this module. Click the chat button to discuss any concept with Noor, or continue to the next module.</p>
        <div className="ms-cta-status">
          <span className="ms-cta-dot" /> Noor is ready to help
        </div>
      </div>
    </div>
  );
}

// ── Source Links Component ──
function SourceLinks({ sources }) {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="ms-source-links">
      <span className="ms-source-label">Sources:</span>
      {sources.map((s, i) => (
        <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="ms-source-link">
          <LaunchIcon size={10} /> {s.label}
        </a>
      ))}
    </div>
  );
}

// Route to correct component
function RenderSlide({ slide }) {
  switch (slide.type) {
    case 'title': return <SlideTitle slide={slide} />;
    case 'objectives': return <SlideObjectives slide={slide} />;
    case 'hero': return <SlideHero slide={slide} />;
    case 'insight': return <SlideInsight slide={slide} />;
    case 'stats': return <SlideStats slide={slide} />;
    case 'timeline': return <SlideTimeline slide={slide} />;
    case 'quote': return <SlideQuote slide={slide} />;
    case 'callout': return <SlideCallout slide={slide} />;
    case 'persona': return <SlidePersona slide={slide} />;
    case 'comparison': return <SlideComparison slide={slide} />;
    case 'reveal': return <SlideReveal slide={slide} />;
    case 'value_chart': return <SlideValueChart slide={slide} />;
    case 'case_study': return <SlideCaseStudy slide={slide} />;
    case 'data_layer': return <SlideDataLayers slide={slide} />;
    case 'pillar': return <SlidePillars slide={slide} />;
    case 'architecture': return <SlideArchitecture slide={slide} />;
    case 'prompt': return <SlidePrompt slide={slide} />;
    case 'checkpoint': return <SlideCheckpoint slide={slide} />;
    case 'video': return <SlideVideo slide={slide} />;
    case 'game': return <SlideGame slide={slide} />;
    case 'takeaway': return <SlideTakeaway slide={slide} />;
    case 'key_concepts': return <SlideKeyConcepts slide={slide} />;
    case 'chatbot_cta': return <SlideChatbotCTA slide={slide} />;
    default: return <div className="ms-card"><div className="ms-card-body"><p>Content</p></div></div>;
  }
}

// ============================================================
// MAIN MODULE PAGE — UNIFIED SLIDE DECK
// ============================================================
export default function ModulePage() {
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [completing, setCompleting] = useState(false);
  const { user, progress, refreshProgress } = useContext(AppContext);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const startTime = useRef(Date.now());

  // Fetch ALL module content
  useEffect(() => {
    startTime.current = Date.now();
    setCurrentSlide(0);
    fetch(`/api/modules/${moduleId}/full`)
      .then(r => r.json())
      .then(data => {
        setModuleData(data);
        const merged = mergeModuleToSlides(data);
        setSlides(merged);
      });
  }, [moduleId]);

  // Mark all lessons as in_progress when user is available
  useEffect(() => {
    if (!user || !moduleData) return;
    for (const { lesson } of moduleData.lessons) {
      fetch(`/api/users/${user.id}/progress`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id, moduleId: lesson.module_id, status: 'in_progress' })
      }).catch(err => console.error('Failed to mark in_progress:', err));
    }
  }, [user, moduleData]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [slides.length, currentSlide]);

  // Touch support
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  const goNext = useCallback(() => setCurrentSlide(p => Math.min(p + 1, slides.length - 1)), [slides.length]);
  const goPrev = useCallback(() => setCurrentSlide(p => Math.max(p - 1, 0)), []);

  const markModuleComplete = async () => {
    if (!user || !moduleData) {
      console.error('Cannot complete module: user or moduleData is null', { user: !!user, moduleData: !!moduleData });
      return;
    }
    if (completing) return; // prevent double-click
    setCompleting(true);
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    const perLesson = Math.round(timeSpent / moduleData.lessons.length);
    try {
      // Fire all progress saves in parallel for speed
      const promises = moduleData.lessons.map(({ lesson }) =>
        fetch(`/api/users/${user.id}/progress`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lessonId: lesson.id, moduleId: lesson.module_id, status: 'completed', timeSpent: perLesson })
        }).then(resp => {
          if (!resp.ok) console.error('Progress save failed for', lesson.id, resp.status);
          return resp;
        })
      );
      await Promise.all(promises);
      await refreshProgress();
    } catch (err) {
      console.error('Error completing module:', err);
    }
    navigate('/dashboard');
  };

  if (!moduleData || slides.length === 0) return (
    <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <EcoIcon size={48} color="var(--interactive-primary)" style={{ animation: 'pulse 2s infinite' }} />
    </div>
  );

  const isLastSlide = currentSlide === slides.length - 1;
  const pct = Math.round(((currentSlide + 1) / slides.length) * 100);

  return (
    <div className="ms-deck" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Top bar */}
      <div className="ms-topbar">
        <div className="ms-topbar-left">
          <button className="ms-back-btn" onClick={() => navigate('/dashboard')}>
            <ArrowLeftIcon size={16} /> Dashboard
          </button>
        </div>
        <div className="ms-dots">
          {slides.map((s, i) => (
            <button key={i}
              className={`ms-dot ${i === currentSlide ? 'active' : ''} ${i < currentSlide ? 'visited' : ''}`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="ms-topbar-right">
          <span className="ms-counter">{currentSlide + 1} / {slides.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="ms-progress-bar">
        <div className="ms-progress-fill" style={{ width: `${pct}%`, background: slides[currentSlide]?.theme?.color || 'var(--interactive-primary)' }} />
      </div>

      {/* Stage */}
      <div className="ms-stage">
        <button className="ms-arrow ms-arrow-left" disabled={currentSlide === 0} onClick={goPrev}>
          <ChevronLeftIcon size={32} />
        </button>

        <div className="ms-slide-container" key={currentSlide}>
          <RenderSlide slide={slides[currentSlide]} />
        </div>

        <button className="ms-arrow ms-arrow-right" disabled={isLastSlide} onClick={goNext}>
          <ChevronRightIcon size={32} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="ms-bottombar">
        <button className="ms-nav-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeftIcon size={14} /> Back to Dashboard
        </button>
        <div style={{ flex: 1 }} />
        {isLastSlide ? (
          <button className="btn btn-primary ms-complete-btn" onClick={markModuleComplete} disabled={completing}>
            <CheckmarkFilledIcon size={18} /> Complete Module
          </button>
        ) : (
          <button className="ms-nav-btn ms-nav-next" onClick={goNext}>
            Next <ArrowRightIcon size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
