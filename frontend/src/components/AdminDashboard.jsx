import React, { useState, useEffect } from 'react';
import { X, Lock, Key, Plus, Trash2, Mail, Bot, Check, AlertCircle, RefreshCw, Layers, Star, ExternalLink, Terminal } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import confetti from 'canvas-confetti';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function AdminDashboard({ isOpen, onClose, onProjectCreated, projects, onDeleteProject, initialTab = 'add' }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);

  // New Project Form State
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    image_url: '',
    featured: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Messages Inbox State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Jarvis Test Console State
  const [jarvisTestPrompt, setJarvisTestPrompt] = useState('');
  const [jarvisTestResponse, setJarvisTestResponse] = useState('');
  const [testingJarvis, setTestingJarvis] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'inbox') {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e) => {
    e?.preventDefault();
    if (passcode === 'admin123' || passcode === 'surya2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Hint: Use "admin123" or click Quick Unlock');
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setAuthError('');
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_BASE}/contact/`);
      const data = await res.json();
      if (data.status === 'success') {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim() || !newProject.description.trim()) {
      setSubmitMessage({ type: 'error', text: 'Title and Description are required.' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch(`${API_BASE}/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });

      const data = await res.json();

      if (data.status === 'success') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        setSubmitMessage({ type: 'success', text: `Project "${newProject.title}" published live to portfolio!` });
        setNewProject({
          title: '',
          description: '',
          technologies: '',
          github_url: '',
          live_url: '',
          image_url: '',
          featured: false
        });
        onProjectCreated();
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to create project.' });
      }
    } catch (err) {
      setSubmitMessage({ type: 'error', text: 'Network error connecting to Django backend API.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTestJarvis = async (e) => {
    e.preventDefault();
    if (!jarvisTestPrompt.trim()) return;

    setTestingJarvis(true);
    setJarvisTestResponse('');

    try {
      const res = await fetch(`${API_BASE}/jarvis/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: jarvisTestPrompt })
      });
      const data = await res.json();
      setJarvisTestResponse(data.reply || 'No response from Jarvis agent.');
    } catch (err) {
      setJarvisTestResponse('Error connecting to Jarvis AI backend.');
    } finally {
      setTestingJarvis(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '94vh',
          overflowY: 'auto',
          padding: 'clamp(16px, 3.5vw, 32px)',
          position: 'relative',
          background: 'rgba(11, 16, 29, 0.95)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)',
          borderRadius: 'clamp(16px, 3vw, 24px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24'
            }}>
              <Terminal size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                Embedded Admin Console
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Live Portfolio Management • Integrated with Python Django REST API
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Auth Gate */}
        {!isAuthenticated ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
              margin: '0 auto 20px auto'
            }}>
              <Lock size={28} />
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
              Administrator Authentication
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Enter security passcode to manage dynamic projects and review recruiter inquiries.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                placeholder="Enter passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input"
                autoFocus
              />

              {authError && (
                <div style={{ color: '#f87171', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={15} />
                  <span>{authError}</span>
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Key size={16} />
                <span>Authorize Access</span>
              </button>

              <button
                type="button"
                onClick={handleQuickUnlock}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cyan)',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginTop: '8px'
                }}
              >
                ⚡ Quick Unlock (One-Click Demo Access)
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div>
            {/* Real-time Status Badges */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '14px',
              marginBottom: '24px'
            }}>
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live Projects</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--cyan)' }}>{projects.length}</div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Backend Engine</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                  Django 6.1 (Active)
                </div>
              </div>

              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agentic AI Assistant</div>
                <div style={{ fontSize: '1rem', fontWeight: '700', color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
                  Jarvis Voice Ready
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <button
                onClick={() => setActiveTab('add')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: activeTab === 'add' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  border: activeTab === 'add' ? '1px solid var(--cyan)' : '1px solid transparent',
                  color: activeTab === 'add' ? 'var(--cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} />
                <span>Add Real Project</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: activeTab === 'manage' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  border: activeTab === 'manage' ? '1px solid var(--cyan)' : '1px solid transparent',
                  color: activeTab === 'manage' ? 'var(--cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={16} />
                <span>Manage Projects ({projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: activeTab === 'inbox' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  border: activeTab === 'inbox' ? '1px solid var(--cyan)' : '1px solid transparent',
                  color: activeTab === 'inbox' ? 'var(--cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Mail size={16} />
                <span>Inbox Messages</span>
              </button>

              <button
                onClick={() => setActiveTab('jarvis')}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  background: activeTab === 'jarvis' ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  border: activeTab === 'jarvis' ? '1px solid var(--cyan)' : '1px solid transparent',
                  color: activeTab === 'jarvis' ? 'var(--cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Bot size={16} />
                <span>Jarvis AI Sandbox</span>
              </button>
            </div>

            {/* Tab 1: Add New Project Form */}
            {activeTab === 'add' && (
              <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI-Powered Inventory & CRM System"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Tech Stack (Comma Separated) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Python, Django, React, PostgreSQL, AI Agent"
                      value={newProject.technologies}
                      onChange={(e) => setNewProject({ ...newProject, technologies: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Project Description *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the architecture, key problem solved, algorithms, and features..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="form-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/suryakiranpjineesh-bit/project"
                      value={newProject.github_url}
                      onChange={(e) => setNewProject({ ...newProject, github_url: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://your-live-demo.com"
                      value={newProject.live_url}
                      onChange={(e) => setNewProject({ ...newProject, live_url: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={newProject.featured}
                    onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--cyan)' }}
                  />
                  <label htmlFor="featured" style={{ fontSize: '0.9rem', color: '#fff', cursor: 'pointer' }}>
                    Mark as Featured Project
                  </label>
                </div>

                {submitMessage && (
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: submitMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: submitMessage.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444',
                    color: submitMessage.type === 'success' ? '#34d399' : '#f87171',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {submitMessage.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
                    <span>{submitMessage.text}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1, padding: '14px' }}>
                    {submitting ? 'Publishing via Django API...' : '🚀 Publish Project to Live Portfolio'}
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Manage Existing Projects */}
            {activeTab === 'manage' && (
              <div>
                {projects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No projects found in database. Use "Add Real Project" tab to publish your first project.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        style={{
                          padding: '16px 20px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{proj.title}</span>
                            {proj.featured && (
                              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24' }}>
                                Featured
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {proj.github_url && (
                            <a href={proj.github_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
                              <GithubIcon size={18} />
                            </a>
                          )}
                          <button
                            onClick={() => onDeleteProject(proj.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.35)',
                              color: '#f87171',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.8rem'
                            }}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Messages Inbox */}
            {activeTab === 'inbox' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Inquiries submitted via portfolio contact form</span>
                  <button onClick={fetchMessages} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                    <RefreshCw size={14} />
                    <span>Refresh</span>
                  </button>
                </div>

                {loadingMessages ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No visitor inquiries received yet. Any messages submitted through the contact form appear here immediately.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ padding: '16px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', color: '#fff' }}>{msg.name} ({msg.email})</span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{msg.created_at}</span>
                        </div>
                        {msg.subject && <div style={{ fontSize: '0.88rem', color: 'var(--cyan)', marginBottom: '6px' }}>Subject: {msg.subject}</div>}
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Jarvis AI Sandbox */}
            {activeTab === 'jarvis' && (
              <div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Test Jarvis AI agentic responses, inspect knowledge boundaries, and verify how it introduces Suryakiran.
                </p>

                <form onSubmit={handleTestJarvis} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Ask Jarvis anything (e.g. Tell me about Suryakiran's college at KMM)"
                    value={jarvisTestPrompt}
                    onChange={(e) => setJarvisTestPrompt(e.target.value)}
                    className="form-input"
                  />
                  <button type="submit" disabled={testingJarvis} className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
                    {testingJarvis ? 'Querying...' : 'Ask Jarvis'}
                  </button>
                </form>

                {jarvisTestResponse && (
                  <div style={{ padding: '16px', background: 'rgba(168, 85, 247, 0.08)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#c084fc', marginBottom: '6px' }}>Jarvis Response:</div>
                    <p style={{ fontSize: '0.9rem', color: '#fff', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{jarvisTestResponse}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
