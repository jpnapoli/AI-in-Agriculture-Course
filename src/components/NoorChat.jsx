import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import { useLocation } from 'react-router-dom';
import { CloseIcon, MicrophoneIcon, MicrophoneOffIcon, SendIcon, VolumeUpIcon, VolumeOffIcon, CopyIcon, StopIcon } from '../components/CarbonIcons';

// Custom Noor icon - stylized leaf+circuit design
function NoorIcon({ size = 22, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 3C10 3 5 9 5 16c0 6 4 11 9 12.5V18l-4-3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16 3c6 0 11 6 11 13 0 6-4 11-9 12.5V18l4-3.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="16" y1="6" x2="16" y2="28" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="16" cy="10" r="1.5" fill={color} />
      <circle cx="12" cy="14" r="1.2" fill={color} />
      <circle cx="20" cy="14" r="1.2" fill={color} />
      <circle cx="16" cy="18" r="1.5" fill={color} />
      <line x1="12" y1="14" x2="16" y2="10" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="14" x2="16" y2="10" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="12" y1="14" x2="16" y2="18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <line x1="20" y1="14" x2="16" y2="18" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

// All 6 personas for the fan selector (Noor first, then the 5 experts)
const ALL_PERSONAS = [
  {
    id: 'noor',
    name: 'Noor',
    role: 'AI Agriculture Companion',
    avatar: '/images/icon-noor.png',
    color: '#0f62fe',
    accent: 'Neutral international',
    greeting: "Hey! I'm Noor, your AI agriculture companion. Ask me anything about the course — I'll keep it quick and useful.",
  },
  {
    id: 'khalid',
    name: 'Khalid',
    fullName: 'Khalid Al-Rashidi',
    role: 'AgriTech Director',
    avatar: '/images/persona-khalid.png',
    color: '#da1e28',
    accent: 'Saudi Arabian',
    greeting: "As-salamu alaykum! I'm Khalid, AgriTech Director from Riyadh. Ask me anything about desert farming and AI-driven water management!",
  },
  {
    id: 'amara',
    name: 'Amara',
    fullName: 'Amara Johnson',
    role: 'Wheat Farmer',
    avatar: '/images/persona-amara.png',
    color: '#198038',
    accent: 'American Midwestern',
    greeting: "Hey there! I'm Amara from Kansas. I went from AI skeptic to advocate after a 12% yield boost. What's on your mind?",
  },
  {
    id: 'carlos',
    name: 'Carlos',
    fullName: 'Carlos Mendoza',
    role: 'Coffee Farmer',
    avatar: '/images/persona-carlos.png',
    color: '#0043ce',
    accent: 'Colombian Spanish',
    greeting: "¡Hola! I'm Carlos from Huila, Colombia. Let's talk about drones, sensors, and growing world-class coffee sustainably!",
  },
  {
    id: 'fatima',
    name: 'Fatima',
    fullName: 'Dr. Fatima Okafor',
    role: 'Agronomist',
    avatar: '/images/persona-fatima.png',
    color: '#8a3ffc',
    accent: 'Nigerian English',
    greeting: "Welcome! I'm Dr. Okafor from Lagos. I use satellite AI to help smallholder farmers across Africa. How can I help you?",
  },
  {
    id: 'rajan',
    name: 'Rajan',
    fullName: 'Rajan Patel',
    role: 'Food Distributor',
    avatar: '/images/persona-rajan.png',
    color: '#007d79',
    accent: 'Indian English',
    greeting: "Namaste! I'm Rajan from Mumbai. My AI systems cut food waste by 40% across 200 distribution points. Ask me anything!",
  },
];

const STT_CONFIG = { silenceTimeout: 2500 };

const QUICK_ASKS = [
  'What is precision agriculture?',
  'Explain generative AI briefly',
  'Key course topics',
  'Tell me about the personas'
];

export default function NoorChat() {
  const [isOpen, setIsOpen] = useState(false);       // chat panel open
  const [showFan, setShowFan] = useState(false);      // fan selector visible
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('idle');
  const [interimText, setInterimText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(false);

  // Active persona (starts null — user must pick from fan)
  const [activePersona, setActivePersona] = useState(ALL_PERSONAS[0]); // Default to Noor

  const { user } = useContext(AppContext);
  const location = useLocation();
  const messagesEnd = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const inputRef = useRef(null);
  const fanRef = useRef(null);

  const lessonId = location.pathname.startsWith('/lesson/') ? location.pathname.split('/lesson/')[1] : null;

  // Close fan when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (showFan && fanRef.current && !fanRef.current.contains(e.target)) {
        setShowFan(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFan]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      stopListening();
    };
  }, []);

  const getStatus = () => {
    if (loading) return { text: 'Thinking...', dotClass: 'loading' };
    if (voiceState === 'listening') return { text: 'Listening...', dotClass: 'listening' };
    if (voiceState === 'speaking') return { text: 'Speaking...', dotClass: 'speaking' };
    if (voiceState === 'loading-voice') return { text: 'Preparing voice...', dotClass: 'loading' };
    return { text: 'Ready', dotClass: 'ready' };
  };

  // ======== TTS via backend /api/noor/tts ========
  const speakText = useCallback(async (text) => {
    if (!text) return;
    try {
      setVoiceState('loading-voice');
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[*_~`#]/g, '')
        .trim();

      if (!cleanText) { setVoiceState('idle'); return; }

      const response = await fetch('/api/noor/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, personaId: activePersona.id }),
      });

      if (!response.ok) {
        console.warn('TTS not available');
        setVoiceState('idle');
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setVoiceState('idle');
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
        setVoiceState('idle');
      };

      setVoiceState('speaking');
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setVoiceState('idle');
    }
  }, [activePersona]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (audioRef.current.src) {
        URL.revokeObjectURL(audioRef.current.src);
      }
      audioRef.current = null;
    }
    setVoiceState('idle');
  }, []);

  // ======== STT with Web Speech API ========
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    stopSpeaking();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setVoiceState('listening');
      setInterimText('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) { final += transcript; } else { interim += transcript; }
      }
      setInterimText(interim || final);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (final) {
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          handleSendMessage(final.trim());
        }, STT_CONFIG.silenceTimeout);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setVoiceState('idle');
      setInterimText('');
    };

    recognition.onend = () => {
      if (voiceState === 'listening') {
        setVoiceState('idle');
        setInterimText('');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceState]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceState('idle');
    setInterimText('');
  }, []);

  const toggleMic = () => {
    if (voiceState === 'listening') {
      if (interimText.trim()) {
        stopListening();
        handleSendMessage(interimText.trim());
      } else {
        stopListening();
      }
    } else {
      startListening();
    }
  };

  // ======== Chat via backend API (server handles LLM call) ========
  const handleSendMessage = async (messageText) => {
    const msg = messageText || input.trim();
    if (!msg || loading) return;

    setInput('');
    setInterimText('');
    const newMessages = [...messages, { role: 'user', text: msg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/noor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          lessonId,
          message: msg,
          history: newMessages.filter(m => m.role !== 'system').slice(-10),
          personaId: activePersona.id,
        }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      const reply = data.reply || "I couldn't generate a response. Please try again.";

      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);

      if (autoSpeak && reply) {
        speakText(reply);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please try again in a moment!" }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ======== Persona selection from fan ========
  const handleSelectPersona = (persona) => {
    const switchingPersona = persona.id !== activePersona.id;
    setActivePersona(persona);
    setShowFan(false);

    if (switchingPersona) {
      // Add switch message and greeting
      if (messages.length > 0) {
        setMessages(prev => [
          ...prev,
          { role: 'system', text: `Switched to ${persona.fullName || persona.name} (${persona.role})` },
          { role: 'assistant', text: persona.greeting },
        ]);
      } else {
        setMessages([{ role: 'assistant', text: persona.greeting }]);
      }
    } else if (messages.length === 0) {
      setMessages([{ role: 'assistant', text: persona.greeting }]);
    }

    setIsOpen(true);
  };

  // ======== FAB click logic ========
  const handleFabClick = () => {
    if (isOpen) {
      // Chat is open — close chat and show fan to switch
      setIsOpen(false);
      setShowFan(false);
    } else if (showFan) {
      // Fan is showing — close it
      setShowFan(false);
    } else {
      // Nothing open — show the fan
      setShowFan(true);
    }
  };

  const status = getStatus();
  const isNoor = activePersona.id === 'noor';
  const personaColor = activePersona.color || '#0f62fe';

  // Fan positions: quarter-circle arc fanning from left to above the FAB
  // 6 personas equally spaced along a 90° arc (180° = left, 270° = up)
  // Radius chosen so adjacent 48px circles have ~8px gap
  const getFanPosition = (index, total) => {
    const radius = 180;
    const startAngle = 180;   // directly left of FAB
    const endAngle   = 270;   // directly above FAB
    const angle = startAngle + (index / (total - 1)) * (endAngle - startAngle);
    const rad = (angle * Math.PI) / 180;
    return {
      x: Math.cos(rad) * radius,   // all ≤ 0 → items go left
      y: Math.sin(rad) * radius,   // all ≤ 0 → items go up
    };
  };

  return (
    <>
      {/* Fan persona selector */}
      {showFan && (
        <div className="persona-fan-container" ref={fanRef}>
          {ALL_PERSONAS.map((persona, i) => {
            const pos = getFanPosition(i, ALL_PERSONAS.length);
            const isActive = persona.id === activePersona.id;
            return (
              <button
                key={persona.id}
                className={`persona-fan-item ${isActive ? 'active' : ''}`}
                style={{
                  '--fan-x': `${pos.x}px`,
                  '--fan-y': `${pos.y}px`,
                  transform: `translate(var(--fan-x), var(--fan-y))`,
                  animationDelay: `${i * 0.05}s`,
                  borderColor: persona.color,
                }}
                onClick={() => handleSelectPersona(persona)}
                title={`${persona.fullName || persona.name} — ${persona.role}`}
              >
                <img
                  src={persona.avatar}
                  alt={persona.name}
                  className="persona-fan-img"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="persona-fan-fallback" style={{ display: 'none', background: persona.color }}>
                  {persona.name[0]}
                </div>
                <span className="persona-fan-label">{persona.name}</span>
                {isActive && <div className="persona-fan-active-ring" style={{ borderColor: persona.color }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* FAB Button — shows active persona avatar or Noor icon */}
      <button
        className={`noor-fab ${showFan ? 'fan-open' : ''}`}
        onClick={handleFabClick}
        title={isOpen ? 'Close chat' : showFan ? 'Close selector' : 'Choose an AI persona to chat with'}
        style={!isNoor && !showFan ? { background: personaColor } : {}}
      >
        {isOpen ? (
          <CloseIcon size={20} color="white" />
        ) : showFan ? (
          <CloseIcon size={20} color="white" />
        ) : activePersona.avatar ? (
          <img
            src={activePersona.avatar}
            alt={activePersona.name}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <NoorIcon size={24} color="currentColor" />
        )}
      </button>

      {isOpen && (
        <div className="noor-panel animate-fadeInUp">
          {/* Header — persona-aware */}
          <div className="noor-header" style={!isNoor ? { borderBottom: `2px solid ${personaColor}` } : {}}>
            <div className="noor-avatar-sm" style={!isNoor ? { background: personaColor } : {}}>
              {activePersona.avatar ? (
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <NoorIcon size={22} color="currentColor" />
              )}
            </div>
            <div className="noor-header-info">
              <div className="noor-header-name">{activePersona.fullName || activePersona.name}</div>
              <div className="noor-header-status" style={{ color: status.dotClass === 'ready' ? 'var(--support-success)' : status.dotClass === 'listening' ? 'var(--support-success)' : status.dotClass === 'speaking' ? personaColor : 'var(--ibm-yellow-30)' }}>
                <span className={`noor-status-dot ${status.dotClass}`} />
                {status.text}
              </div>
              {!isNoor && (
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: 1 }}>
                  {activePersona.role} &middot; {activePersona.accent}
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              {/* Switch persona button */}
              <button
                onClick={() => { setIsOpen(false); setTimeout(() => setShowFan(true), 150); }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.65rem',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-sans)',
                }}
                title="Switch persona"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 8.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zM1.5 8.5a.5.5 0 0 1 0-1h1a.5.5 0 0 1 0 1h-1zM8 2.5a.5.5 0 0 1-.5-.5V1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5zM8 15a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-1a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                Switch
              </button>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                style={{
                  background: autoSpeak ? `${personaColor}1a` : 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 0,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.65rem',
                  color: autoSpeak ? personaColor : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-sans)',
                }}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                {autoSpeak ? <VolumeUpIcon size={14} /> : <VolumeOffIcon size={14} />}
              </button>
            </div>
          </div>

          {/* Quick Ask Chips */}
          <div className="noor-quick-ask">
            {QUICK_ASKS.map((q, i) => (
              <button
                key={i}
                className="noor-quick-chip"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                style={!isNoor ? { borderColor: `${personaColor}40` } : {}}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="noor-messages">
            {messages.map((msg, i) => (
              msg.role === 'system' ? (
                <div key={i} className="noor-system-msg">
                  <span className="noor-system-dot" style={{ background: personaColor }} />
                  {msg.text}
                </div>
              ) : (
                <div key={i} className={`noor-message ${msg.role}`}>
                  {msg.text}
                  {msg.role === 'assistant' && i > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => { navigator.clipboard.writeText(msg.text); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                        title="Copy"
                      >
                        <CopyIcon size={14} />
                      </button>
                      <button
                        onClick={() => speakText(msg.text)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                        title="Listen"
                      >
                        <VolumeUpIcon size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )
            ))}
            {loading && (
              <div className="noor-message assistant" style={{ padding: '12px 16px' }}>
                <div className="noor-thinking">
                  <div className="noor-thinking-dot" style={!isNoor ? { background: personaColor } : {}} />
                  <div className="noor-thinking-dot" style={!isNoor ? { background: personaColor } : {}} />
                  <div className="noor-thinking-dot" style={!isNoor ? { background: personaColor } : {}} />
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Listening Bar */}
          {voiceState === 'listening' && (
            <div className="noor-listening-bar">
              <MicrophoneIcon size={16} color="#da1e28" />
              <div className="noor-listening-text">
                {interimText || 'Listening... tap mic or wait to send'}
              </div>
            </div>
          )}

          {/* Stop Speaking Bar */}
          {voiceState === 'speaking' && (
            <div className="noor-stop-bar" onClick={stopSpeaking}>
              <StopIcon size={16} color={personaColor} />
              <span className="noor-stop-text">Stop Speaking</span>
              <div className="noor-voice-wave">
                <div className="noor-voice-bar" style={!isNoor ? { background: personaColor } : {}} />
                <div className="noor-voice-bar" style={!isNoor ? { background: personaColor } : {}} />
                <div className="noor-voice-bar" style={!isNoor ? { background: personaColor } : {}} />
                <div className="noor-voice-bar" style={!isNoor ? { background: personaColor } : {}} />
                <div className="noor-voice-bar" style={!isNoor ? { background: personaColor } : {}} />
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="noor-input-area">
            <button
              className={`noor-mic-btn ${voiceState === 'listening' ? 'active' : ''}`}
              onClick={toggleMic}
              title={voiceState === 'listening' ? 'Stop listening' : 'Start voice input'}
            >
              {voiceState === 'listening' ? <MicrophoneIcon size={18} /> : <MicrophoneOffIcon size={18} />}
            </button>
            <textarea
              ref={inputRef}
              className="noor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${activePersona.fullName || activePersona.name} anything...`}
              rows={1}
            />
            <button
              className="noor-send"
              onClick={() => handleSendMessage()}
              disabled={loading || (!input.trim() && voiceState !== 'listening')}
              style={!isNoor ? { background: personaColor } : {}}
            >
              <SendIcon size={18} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
