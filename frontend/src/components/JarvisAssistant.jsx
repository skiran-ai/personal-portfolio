import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Volume2, VolumeX, Sparkles, Briefcase, MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE } from '../config/api';
import { runFallbackJarvisChat, runFallbackJdMatch } from '../data/portfolioFallback';

export default function JarvisAssistant({
  isOpen,
  initialTab = 'chat',
  onClose,
  onOpenResume,
  onOpenSandbox,
  isSpeaking,
  onPlayVoice,
  onStopVoice,
  apiHealth,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }
  const msgIdRef = useRef(2);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'jarvis',
      text: "Hello! I'm Jarvis, grounded on Suryakiran's verified profile and Django project database. Ask technical questions, launch a live project sandbox, or switch to the JD Fit tab to evaluate a role.",
      followups: ['Open FinSight AI sandbox', 'What are PayMatch AI trade-offs?', 'Open ATS Resume'],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // JD Match Analyzer state
  const [jdText, setJdText] = useState('');
  const [jdLoading, setJdLoading] = useState(false);
  const [jdResult, setJdResult] = useState(null);
  const [jdError, setJdError] = useState('');

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  const handleAction = (action) => {
    if (!action || action === 'NONE') return;
    if (action === 'OPEN_RESUME') onOpenResume?.();
    else if (action === 'SCROLL_ABOUT') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    else if (action === 'SCROLL_SKILLS') document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
    else if (action === 'SCROLL_PROJECTS') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    else if (action === 'SCROLL_CONTACT') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    else if (action === 'OPEN_SANDBOX_FINSIGHT') onOpenSandbox?.('finsight');
    else if (action === 'OPEN_SANDBOX_PAYMATCH') onOpenSandbox?.('paymatch');
    else if (action === 'OPEN_SANDBOX_FINSIM') onOpenSandbox?.('finsim');
  };

  const sendMessage = async (textToSend) => {
    const msg = (textToSend ?? inputMessage).trim();
    if (!msg) return;

    const userMsg = { id: msgIdRef.current++, sender: 'user', text: msg };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/jarvis/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: nextMessages.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok || !ct.includes('application/json')) throw new Error('Backend unavailable');
      const data = await res.json();

      const jarvisMsg = {
        id: msgIdRef.current++,
        sender: 'jarvis',
        text: data.reply || 'No response received.',
        mode: data.mode,
        followups: data.suggested_followups || [],
      };
      setMessages((prev) => [...prev, jarvisMsg]);
      handleAction(data.action);
    } catch {
      const fallback = runFallbackJarvisChat(msg);
      setMessages((prev) => [
        ...prev,
        {
          id: msgIdRef.current++,
          sender: 'jarvis',
          mode: fallback.mode,
          text: fallback.reply,
          followups: fallback.suggested_followups || [],
        },
      ]);
      handleAction(fallback.action);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJD = async (e) => {
    e.preventDefault();
    if (jdText.trim().length < 20) {
      setJdError('Please paste at least 20 characters of a Job Description.');
      return;
    }
    setJdError('');
    setJdLoading(true);
    setJdResult(null);

    try {
      const res = await fetch(`${API_BASE}/jarvis/jd-match/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jdText }),
      });
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) throw new Error('Non-JSON response');
      const data = await res.json();
      if (!res.ok || data.status === 'error') {
        setJdError(data.message || 'Analysis failed.');
      } else {
        setJdResult(data);
      }
    } catch {
      setJdResult(runFallbackJdMatch(jdText));
    } finally {
      setJdLoading(false);
    }
  };

  const isLiveGemini = apiHealth?.jarvis_mode === 'gemini_live';

  return (
    <>
      {/* Floating Jarvis Trigger */}
      <div style={{ position: 'fixed', bottom: 'clamp(16px, 3vw, 24px)', right: 'clamp(16px, 3vw, 24px)', zIndex: 90 }}>
        <button
          onClick={onClose}
          style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            boxShadow: '0 0 22px rgba(0, 242, 254, 0.45), 0 10px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#07090e',
            cursor: 'pointer',
          }}
          title="Open Jarvis AI & JD Fit Analyzer"
          aria-label="Open Jarvis AI"
        >
          <Bot size={26} />
        </button>
      </div>

      {/* Drawer */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '86px',
            right: 'clamp(12px, 3vw, 24px)',
            width: 'calc(100vw - 24px)',
            maxWidth: '450px',
            height: 'min(620px, calc(100dvh - 104px))',
            maxHeight: 'calc(100dvh - 104px)',
            background: 'rgba(11, 16, 29, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '22px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
            zIndex: 95,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'linear-gradient(90deg, rgba(2, 132, 199, 0.14) 0%, rgba(168, 85, 247, 0.14) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00f2fe 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#07090e',
                }}
              >
                <Bot size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.94rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Jarvis Agent
                  <span
                    style={{
                      fontSize: '0.66rem',
                      padding: '2px 7px',
                      borderRadius: '6px',
                      background: isLiveGemini ? 'rgba(16, 185, 129, 0.16)' : 'rgba(56, 189, 248, 0.15)',
                      color: isLiveGemini ? '#34d399' : '#38bdf8',
                    }}
                  >
                    {isLiveGemini ? `Live • ${apiHealth?.gemini_model || 'Gemini'}` : 'Grounded Mode'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  Schema-enforced Q&amp;A &amp; Job Fit Evaluator
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isSpeaking && (
                <button
                  onClick={onStopVoice}
                  title="Stop Audio"
                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                >
                  <VolumeX size={18} />
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

          {/* Mode Tabs */}
          <div style={{ display: 'flex', padding: '8px 14px', gap: '8px', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.25)' }}>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                background: activeTab === 'chat' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                border: activeTab === 'chat' ? '1px solid var(--cyan)' : '1px solid transparent',
                color: activeTab === 'chat' ? 'var(--cyan)' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <MessageSquare size={14} />
              <span>Technical Q&amp;A</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('jd')}
              style={{
                flex: 1,
                padding: '7px 10px',
                borderRadius: '10px',
                background: activeTab === 'jd' ? 'rgba(168, 85, 247, 0.18)' : 'transparent',
                border: activeTab === 'jd' ? '1px solid #c084fc' : '1px solid transparent',
                color: activeTab === 'jd' ? '#e9d5ff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Briefcase size={14} />
              <span>JD Fit Analyzer</span>
            </button>
          </div>

          {/* Tab 1: Chat */}
          {activeTab === 'chat' ? (
            <>
              <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map((m) => (
                  <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start', gap: '6px' }}>
                    <div
                      style={{
                        maxWidth: '88%',
                        padding: '11px 14px',
                        borderRadius: m.sender === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: m.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #00f2fe 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: m.sender === 'user' ? '#07090e' : '#f8fafc',
                        border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                        fontSize: '0.85rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {m.text}
                      {m.sender === 'jarvis' && (
                        <div style={{ marginTop: '6px', display: 'flex', justifyContent: 'flex-end' }}>
                          <button
                            type="button"
                            onClick={() => onPlayVoice?.(m.text)}
                            title="Read aloud"
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem' }}
                          >
                            <Volume2 size={12} />
                            <span>Listen</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {m.followups?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '90%' }}>
                        {m.followups.map((f, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => sendMessage(f)}
                            style={{
                              fontSize: '0.72rem',
                              padding: '4px 9px',
                              borderRadius: '10px',
                              background: 'rgba(0, 242, 254, 0.08)',
                              border: '1px solid rgba(0, 242, 254, 0.25)',
                              color: 'var(--cyan)',
                              cursor: 'pointer',
                            }}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div style={{ color: 'var(--cyan)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                style={{
                  padding: '12px 14px',
                  borderTop: '1px solid var(--border-subtle)',
                  background: 'rgba(7, 9, 14, 0.85)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <input
                  type="text"
                  placeholder="Ask about Django architecture, PayMatch, or skills..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="form-input"
                  style={{ padding: '9px 12px', fontSize: '0.85rem' }}
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: inputMessage.trim() ? 'var(--cyan)' : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: '#07090e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputMessage.trim() ? 'pointer' : 'default',
                    flexShrink: 0,
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            /* Tab 2: JD Match Analyzer */
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <form onSubmit={handleAnalyzeJD} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Paste any Job Description below to evaluate Suryakiran&apos;s verified skills, project evidence, and honest gaps:
                </label>
                <textarea
                  rows={4}
                  className="form-input"
                  placeholder="e.g. Seeking a Python / Django Backend Engineer with REST APIs, PostgreSQL, and LLM integration experience..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  style={{ fontSize: '0.82rem', resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" disabled={jdLoading} className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '0.84rem' }}>
                    <Sparkles size={15} />
                    <span>{jdLoading ? 'Analyzing Fit...' : 'Evaluate Candidate Fit'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                    onClick={() =>
                      setJdText(
                        'Junior Full Stack / Backend Engineer (Python, Django, DRF, PostgreSQL, React). Bonus: Gemini/LLM API structured outputs, Docker, Git.'
                      )
                    }
                  >
                    Sample JD
                  </button>
                </div>
              </form>

              {jdError && (
                <div style={{ padding: '10px 12px', borderRadius: '10px', background: 'rgba(239,68,68,0.14)', border: '1px solid #ef4444', color: '#fca5a5', fontSize: '0.8rem', display: 'flex', gap: '6px' }}>
                  <AlertCircle size={15} style={{ flexShrink: 0 }} />
                  <span>{jdError}</span>
                </div>
              )}

              {jdResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '6px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.08)', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--cyan)' }}>VERIFIED FIT SCORE</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>{jdResult.match_score}%</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.5' }}>{jdResult.verdict}</p>
                  </div>

                  {jdResult.matched_skills?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--cyan)', marginBottom: '6px' }}>
                        Matched Capabilities
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {jdResult.matched_skills.map((sk, idx) => (
                          <span key={idx} className="tech-pill" style={{ fontSize: '0.71rem', padding: '3px 8px' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#34d399', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={13} /> Matched Evidence
                    </div>
                    <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                      {jdResult.project_evidence?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#fbbf24', marginBottom: '6px' }}>
                      Honest Gaps / Ramp-Up Areas
                    </div>
                    <ul style={{ paddingLeft: '16px', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                      {jdResult.honest_gaps?.map((gap, idx) => (
                        <li key={idx}>{gap}</li>
                      ))}
                    </ul>
                  </div>

                  {jdResult.interview_questions?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '0.76rem', fontWeight: '700', color: '#c084fc', marginBottom: '6px' }}>
                        Suggested Technical Interview Probes
                      </div>
                      <ul style={{ paddingLeft: '16px', fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                        {jdResult.interview_questions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
