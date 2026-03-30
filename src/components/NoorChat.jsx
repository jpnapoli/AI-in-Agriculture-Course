import React, { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { AppContext } from '../App';
import { useLocation } from 'react-router-dom';

// Set your OpenAI API key in environment variable VITE_OPENAI_API_KEY
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const NOOR_CONFIG = {
  name: 'Noor',
  subtitle: 'AI Agriculture Companion',
  tts: { model: 'tts-1-hd', voice: 'nova', speed: 1.0, format: 'mp3' },
  llm: { model: 'gpt-4o-mini', temperature: 0.6, max_tokens: 800 },
  stt: { silenceTimeout: 2500 },
  quickAsk: [
    'What is precision agriculture?',
    'Explain AI in farming',
    'Key course concepts',
    'Latest AgriTech trends'
  ]
};

const SYSTEM_PROMPT = `You are Noor (نور), an AI Agriculture Research Companion created for the "AI in Agriculture: From Field to Future" course. You are knowledgeable, concise, and professional. Answer questions about agricultural AI, precision farming, IoT in agriculture, climate resilience, supply chain intelligence, and the human-AI partnership.

Key course topics:
- The 4th Agricultural Revolution & AI's $250B value potential (McKinsey)
- IoT sensors, drones, satellites for data collection (Microsoft FarmBeats, IBM Liquid Prep)
- AI-powered crop management (computer vision, precision planting, IBM Watson Decision Platform)
- Climate resilience (ClimateAi, Google flood forecasting)
- Intelligent supply chains (demand forecasting, food safety)
- Human-AI augmentation, ethics, McKinsey's 7 pillars of AI readiness

Personas: Amara Johnson (wheat farmer, Kansas), Carlos Mendoza (coffee farmer, Colombia), Dr. Fatima Okafor (agronomist, Nigeria), Rajan Patel (food distributor, India).

Rules:
- Be concise but thorough. Use bullet points for complex answers.
- Never say you can't browse or search — rely on your training data.
- Match the user's language.
- Reference course content and real case studies when relevant.`;

export default function NoorChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm Noor, your AI agriculture learning companion. Ask me anything about the course content, request deeper explanations, or explore research topics. I'm here to amplify your learning! 🌱" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceState, setVoiceState] = useState('idle'); // idle, listening, speaking, loading-voice
  const [interimText, setInterimText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);

  const { user } = useContext(AppContext);
  const location = useLocation();
  const messagesEnd = useRef(null);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const inputRef = useRef(null);

  const lessonId = location.pathname.startsWith('/lesson/') ? location.pathname.split('/lesson/')[1] : null;

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

  // ======== TTS with OpenAI (nova voice) ========
  const speakText = useCallback(async (text) => {
    if (!text || voiceState === 'speaking') return;
    
    try {
      setVoiceState('loading-voice');
      
      // Clean text for TTS
      const cleanText = text
        .replace(/[*_~`#]/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .substring(0, 4096);

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NOOR_CONFIG.tts.model,
          input: cleanText,
          voice: NOOR_CONFIG.tts.voice,
          speed: NOOR_CONFIG.tts.speed,
          response_format: NOOR_CONFIG.tts.format,
        }),
      });

      if (!response.ok) {
        console.error('TTS API error:', response.status);
        setVoiceState('idle');
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      
      const audio = new Audio(url);
      audioRef.current = audio;
      
      audio.onplay = () => setVoiceState('speaking');
      audio.onended = () => {
        setVoiceState('idle');
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => {
        setVoiceState('idle');
        URL.revokeObjectURL(url);
      };
      
      await audio.play();
    } catch (err) {
      console.error('TTS error:', err);
      setVoiceState('idle');
    }
  }, [voiceState]);

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
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }
      
      setInterimText(interim || final);
      
      // Reset silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      if (final) {
        silenceTimerRef.current = setTimeout(() => {
          recognition.stop();
          handleSendMessage(final.trim());
        }, NOOR_CONFIG.stt.silenceTimeout);
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
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceState('idle');
    setInterimText('');
  }, []);

  const toggleMic = () => {
    if (voiceState === 'listening') {
      // Stop and send what we have
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

  // ======== Chat with OpenAI ========
  const handleSendMessage = async (messageText) => {
    const msg = messageText || input.trim();
    if (!msg || loading) return;
    
    setInput('');
    setInterimText('');
    setMessages(prev => [...prev, { role: 'user', text: msg }]);
    setLoading(true);
    
    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text
      }));

      let contextNote = '';
      if (lessonId) {
        contextNote = `\n\n[Context: The user is currently on lesson ${lessonId}. Provide relevant answers related to the lesson content if applicable.]`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: NOOR_CONFIG.llm.model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT + contextNote },
            ...conversationHistory,
            { role: 'user', content: msg }
          ],
          temperature: NOOR_CONFIG.llm.temperature,
          max_tokens: NOOR_CONFIG.llm.max_tokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response. Please try again.";
      
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      
      // Also store in backend for history
      try {
        fetch('/api/noor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id, lessonId, message: msg })
        });
      } catch {}

      // Auto-speak response if enabled
      if (autoSpeak) {
        setTimeout(() => speakText(reply), 300);
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

  const status = getStatus();

  return (
    <>
      {/* FAB Button */}
      <button className="noor-fab" onClick={() => setIsOpen(!isOpen)} title="Chat with Noor">
        {isOpen ? (
          <span className="material-icons-round">close</span>
        ) : (
          <img src="/images/icon-noor.png" alt="Noor" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
        )}
      </button>

      {isOpen && (
        <div className="noor-panel animate-fadeInUp">
          {/* Header */}
          <div className="noor-header">
            <div className="noor-avatar-sm">
              <img src="/images/icon-noor.png" alt="Noor" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div className="noor-header-info">
              <div className="noor-header-name">{NOOR_CONFIG.name}</div>
              <div className="noor-header-status" style={{ color: status.dotClass === 'ready' ? 'var(--support-success)' : status.dotClass === 'listening' ? 'var(--support-success)' : status.dotClass === 'speaking' ? 'var(--interactive-primary)' : 'var(--ibm-yellow-30)' }}>
                <span className={`noor-status-dot ${status.dotClass}`} />
                {status.text}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                style={{
                  background: autoSpeak ? 'rgba(15,98,254,0.1)' : 'transparent',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 4,
                  padding: '4px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.65rem',
                  color: autoSpeak ? 'var(--interactive-primary)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-sans)',
                }}
                title={autoSpeak ? 'Auto-speak ON' : 'Auto-speak OFF'}
              >
                <span className="material-icons-round" style={{ fontSize: 14 }}>{autoSpeak ? 'volume_up' : 'volume_off'}</span>
              </button>
            </div>
          </div>

          {/* Quick Ask Chips */}
          <div className="noor-quick-ask">
            {NOOR_CONFIG.quickAsk.map((q, i) => (
              <button
                key={i}
                className="noor-quick-chip"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="noor-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`noor-message ${msg.role}`}>
                {msg.text}
                {msg.role === 'assistant' && i > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
                    <button
                      onClick={() => speakText(msg.text)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                      title="Read aloud"
                    >
                      <span className="material-icons-round" style={{ fontSize: 14 }}>volume_up</span>
                    </button>
                    <button
                      onClick={() => { navigator.clipboard.writeText(msg.text); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center' }}
                      title="Copy"
                    >
                      <span className="material-icons-round" style={{ fontSize: 14 }}>content_copy</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="noor-message assistant" style={{ padding: '12px 16px' }}>
                <div className="noor-thinking">
                  <div className="noor-thinking-dot" />
                  <div className="noor-thinking-dot" />
                  <div className="noor-thinking-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Listening Bar */}
          {voiceState === 'listening' && (
            <div className="noor-listening-bar">
              <span className="material-icons-round" style={{ fontSize: 16, color: '#da1e28' }}>mic</span>
              <div className="noor-listening-text">
                {interimText || 'Listening... tap mic or wait to send'}
              </div>
            </div>
          )}

          {/* Stop Speaking Bar */}
          {voiceState === 'speaking' && (
            <div className="noor-stop-bar" onClick={stopSpeaking}>
              <span className="material-icons-round" style={{ fontSize: 16, color: 'var(--interactive-primary)' }}>stop_circle</span>
              <span className="noor-stop-text">Stop Speaking</span>
              <div className="noor-voice-wave">
                <div className="noor-voice-bar" />
                <div className="noor-voice-bar" />
                <div className="noor-voice-bar" />
                <div className="noor-voice-bar" />
                <div className="noor-voice-bar" />
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
              <span className="material-icons-round" style={{ fontSize: 18 }}>
                {voiceState === 'listening' ? 'mic' : 'mic_none'}
              </span>
            </button>
            <textarea
              ref={inputRef}
              className="noor-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Noor anything..."
              rows={1}
            />
            <button
              className="noor-send"
              onClick={() => handleSendMessage()}
              disabled={loading || (!input.trim() && voiceState !== 'listening')}
            >
              <span className="material-icons-round" style={{ fontSize: 18 }}>send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
