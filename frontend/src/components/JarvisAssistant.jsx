import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles, MessageSquare, Play, RefreshCw, ChevronDown } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function JarvisAssistant({
  isOpen,
  onClose,
  onOpenResume,
  isSpeaking,
  onPlayVoice,
  onStopVoice,
  introText,
  timeGreeting = "Greetings"
}) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'jarvis',
      text: `${timeGreeting}! I am Jarvis, the autonomous Agentic AI Assistant engineered for Suryakiran P J. I'm here to explain his AI-integrated Python Django expertise, walk you through his background, or read his hero section aloud. How may I assist you today?`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [welcomeBannerVisible, setWelcomeBannerVisible] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition setup (Mic input)
  const handleMicToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        sendMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  const sendMessage = async (textToSend) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/jarvis/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const data = await res.json();

      const jarvisReply = data.reply || "I am processing your query regarding Suryakiran's engineering portfolio.";
      const jarvisMsg = { id: Date.now() + 1, sender: 'jarvis', text: jarvisReply };
      setMessages((prev) => [...prev, jarvisMsg]);

      // Voice read the response if desired
      onPlayVoice(jarvisReply);

      // Handle triggered actions
      if (data.action === 'READ_HERO') {
        onPlayVoice(introText);
      } else if (data.action === 'OPEN_RESUME_MODAL') {
        onOpenResume();
      } else if (data.action === 'SCROLL_EDUCATION') {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      } else if (data.action === 'SCROLL_PROJECTS') {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (data.action === 'SCROLL_CONTACT') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'jarvis',
          text: "I am temporarily operating in offline mode. Suryakiran is a Software Engineer specializing in Python Django Full Stack Development and Agentic AI."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Who is Suryakiran?",
    "Read Hero Section",
    "Tell me about his education & training",
    "What is his Python & Django tech stack?",
    "How can I contact him?"
  ];

  return (
    <>
      {/* 1. Onboarding Floating Welcome Notification on First Open */}
      {welcomeBannerVisible && !isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: 'clamp(12px, 3vw, 24px)',
            width: 'calc(100vw - 32px)',
            maxWidth: '360px',
            background: 'rgba(14, 20, 36, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            borderRadius: '18px',
            padding: '16px',
            zIndex: 90,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.2)',
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #a855f7 0%, #00f2fe 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bot size={16} />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>Jarvis AI Assistant</span>
            </div>
            <button
              onClick={() => setWelcomeBannerVisible(false)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={15} />
            </button>
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '12px' }}>
            Hi! I am Jarvis, Suryakiran's AI Assistant. Would you like me to introduce Suryakiran and read the hero section?
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => {
                onPlayVoice(introText);
                setWelcomeBannerVisible(false);
              }}
              style={{
                flex: 1,
                padding: '7px 12px',
                background: 'rgba(0, 242, 254, 0.15)',
                border: '1px solid var(--cyan)',
                color: 'var(--cyan)',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Volume2 size={14} />
              <span>Voice Intro</span>
            </button>

            <button
              onClick={() => {
                setWelcomeBannerVisible(false);
                onClose(); // toggles open
              }}
              style={{
                padding: '7px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              Chat
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Jarvis Orb Trigger Button (Bottom Right) */}
      <div style={{ position: 'fixed', bottom: 'clamp(16px, 3vw, 24px)', right: 'clamp(16px, 3vw, 24px)', zIndex: 90 }}>
        <button
          onClick={onClose}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.6), 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07090e',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          title="Open Jarvis AI Assistant"
        >
          <Bot size={28} />
          {isSpeaking && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10b981',
                border: '2px solid #07090e',
                animation: 'pulseGlow 1.5s infinite'
              }}
            />
          )}
        </button>
      </div>

      {/* 3. Full Jarvis AI Interactive Chat & Voice Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: 'clamp(12px, 3vw, 24px)',
            width: 'calc(100vw - 32px)',
            maxWidth: '420px',
            height: '600px',
            maxHeight: 'calc(100vh - 110px)',
            background: 'rgba(11, 16, 29, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 242, 254, 0.15)',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#07090e'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Jarvis AI Assistant
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                    Agentic
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Suryakiran's AI Representative
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isSpeaking ? (
                <button
                  onClick={onStopVoice}
                  title="Mute voice"
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                >
                  <VolumeX size={18} />
                </button>
              ) : (
                <button
                  onClick={() => onPlayVoice(introText)}
                  title="Read Hero Intro"
                  style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', padding: '4px' }}
                >
                  <Volume2 size={18} />
                </button>
              )}

              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div style={{
            padding: '10px 16px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderBottom: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            display: 'flex',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => sendMessage(prompt)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                  padding: '4px 10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.74rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--cyan)'; e.currentTarget.style.borderColor = 'var(--cyan)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: m.sender === 'user' ? '#07090e' : '#fff',
                  border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  whiteSpace: 'pre-line'
                }}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--cyan)',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Sparkles size={14} className="animate-spin" />
                <span>Jarvis is thinking...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Message Input Footer with Speech Recognition */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{
              padding: '14px 16px',
              borderTop: '1px solid var(--border-subtle)',
              background: 'rgba(7, 9, 14, 0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {/* Mic Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              title={isListening ? "Listening... click to stop" : "Speak to Jarvis"}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isListening ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                color: isListening ? '#f87171' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <input
              type="text"
              placeholder="Ask Jarvis anything about Suryakiran..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="form-input"
              style={{ padding: '10px 14px', fontSize: '0.88rem' }}
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: inputMessage.trim() ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.05)',
                border: 'none',
                color: '#07090e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMessage.trim() ? 'pointer' : 'default',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
