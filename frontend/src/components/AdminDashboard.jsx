import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Lock,
  Key,
  Plus,
  Trash2,
  Mail,
  Bot,
  Check,
  AlertCircle,
  RefreshCw,
  Layers,
  Terminal,
  Edit3,
  LogOut,
  BarChart3,
} from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { API_BASE } from '../config/api';

const EMPTY_FORM = {
  id: null,
  title: '',
  tagline: '',
  description: '',
  problem_statement: '',
  architecture_summary: '',
  engineering_tradeoffs: '',
  api_contract_sample: '',
  sandbox_slug: '',
  technologies: '',
  github_url: '',
  live_url: '',
  image_url: '',
  featured: false,
};

export default function AdminDashboard({
  isOpen,
  onClose,
  onProjectsChanged,
  projects = [],
  onDeleteProject,
  adminToken,
  onLoginSuccess,
  onLogout,
  initialTab = 'add',
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);

  const [projectForm, setProjectForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [jarvisTestPrompt, setJarvisTestPrompt] = useState('');
  const [jarvisTestResponse, setJarvisTestResponse] = useState('');
  const [testingJarvis, setTestingJarvis] = useState(false);

  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const isAuthenticated = Boolean(adminToken);

  const fetchMessages = useCallback(async () => {
    if (!adminToken) return;
    setLoadingMessages(true);
    try {
      const res = await fetch(`${API_BASE}/contact/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  }, [adminToken]);

  const fetchAnalytics = useCallback(async () => {
    if (!adminToken) return;
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API_BASE}/analytics/summary/`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'inbox') {
      fetchMessages();
    } else if (isAuthenticated && activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [isAuthenticated, activeTab, fetchMessages, fetchAnalytics]);

  const handleDeleteMessage = async (msgId) => {
    if (!adminToken || !window.confirm('Delete this inquiry message?')) return;
    try {
      const res = await fetch(`${API_BASE}/contact/${msgId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e?.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated && data.token) {
        setPassword('');
        onLoginSuccess?.(data.token);
      } else {
        setAuthError(data.message || 'Access denied. Invalid credentials.');
      }
    } catch {
      setAuthError('Cannot reach Django backend API to verify administrator session.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title.trim() || !projectForm.description.trim()) {
      setSubmitMessage({ type: 'error', text: 'Title and Description are required.' });
      return;
    }

    setSubmitting(true);
    setSubmitMessage(null);
    const isEditing = Boolean(projectForm.id);
    const url = isEditing ? `${API_BASE}/projects/${projectForm.id}/` : `${API_BASE}/projects/`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setSubmitMessage({
          type: 'success',
          text: isEditing
            ? `Updated "${projectForm.title}" successfully.`
            : `Published "${projectForm.title}" live to portfolio.`,
        });
        setProjectForm(EMPTY_FORM);
        onProjectsChanged?.();
      } else {
        setSubmitMessage({ type: 'error', text: data.message || 'Failed to save project.' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'Network error connecting to Django backend API.' });
    } finally {
      setSubmitting(false);
    }
  };

  const startEditingProject = (proj) => {
    setProjectForm({
      id: proj.id,
      title: proj.title || '',
      tagline: proj.tagline || '',
      description: proj.description || '',
      problem_statement: proj.problem_statement || '',
      architecture_summary: proj.architecture_summary || '',
      engineering_tradeoffs: proj.engineering_tradeoffs || '',
      api_contract_sample: proj.api_contract_sample || '',
      sandbox_slug: proj.sandbox_slug || '',
      technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || '',
      github_url: proj.github_url || '',
      live_url: proj.live_url || '',
      image_url: proj.image_url || '',
      featured: Boolean(proj.featured),
    });
    setSubmitMessage(null);
    setActiveTab('add');
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
        body: JSON.stringify({ message: jarvisTestPrompt }),
      });
      const data = await res.json();
      setJarvisTestResponse(`[${data.mode || 'unknown'}] ${data.reply || 'No response'}`);
    } catch {
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
          maxWidth: '940px',
          maxHeight: '94dvh',
          overflowY: 'auto',
          padding: 'clamp(16px, 3.5vw, 30px)',
          background: 'rgba(11, 16, 29, 0.98)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          borderRadius: '22px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', paddingBottom: '14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.14)', border: '1px solid rgba(245, 158, 11, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
              <Terminal size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', margin: 0 }}>Private Admin Console</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0 }}>
                Server-verified Bearer token authentication • Shortcuts: Ctrl+Shift+A or /admin
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="btn-secondary"
                style={{ padding: '7px 12px', fontSize: '0.78rem' }}
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            )}
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', borderRadius: '10px', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {!isAuthenticated ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', maxWidth: '420px', margin: '0 auto' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', margin: '0 auto 18px' }}>
              <Lock size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>Administrator Sign In</h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '22px' }}>
              Verified directly by Django backend (`/api/auth/login/`).
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" required />
              </div>
              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
              </div>

              {authError && (
                <div style={{ color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px', textAlign: 'left' }}>
                  <AlertCircle size={15} />
                  <span>{authError}</span>
                </div>
              )}

              <button type="submit" disabled={authLoading} className="btn-primary" style={{ width: '100%' }}>
                <Key size={16} />
                <span>{authLoading ? 'Verifying...' : 'Authorize Session'}</span>
              </button>
            </form>
          </div>
        ) : (
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              {[
                { key: 'add', label: projectForm.id ? 'Edit Project' : 'Add Project', icon: projectForm.id ? Edit3 : Plus },
                { key: 'manage', label: `Manage (${projects.length})`, icon: Layers },
                { key: 'inbox', label: 'Inbox', icon: Mail },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                { key: 'jarvis', label: 'Jarvis Sandbox', icon: Bot },
              ].map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      background: active ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                      border: active ? '1px solid var(--cyan)' : '1px solid transparent',
                      color: active ? 'var(--cyan)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.84rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Icon size={15} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {activeTab === 'add' && (
              <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Project Title *</label>
                    <input type="text" required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tagline</label>
                    <input type="text" placeholder="e.g. Payment Reconciliation Engine" value={projectForm.tagline} onChange={(e) => setProjectForm({ ...projectForm, tagline: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Tech Stack (Comma Separated)</label>
                    <input type="text" value={projectForm.technologies} onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Interactive Sandbox Slug (optional)</label>
                    <input type="text" placeholder="finsight | paymatch | finsim" value={projectForm.sandbox_slug} onChange={(e) => setProjectForm({ ...projectForm, sandbox_slug: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Problem Statement &amp; Description *</label>
                  <textarea required rows={3} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value, problem_statement: e.target.value })} className="form-input" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Architecture Pipeline Summary</label>
                    <textarea rows={2} value={projectForm.architecture_summary} onChange={(e) => setProjectForm({ ...projectForm, architecture_summary: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Key Engineering Trade-off</label>
                    <textarea rows={2} value={projectForm.engineering_tradeoffs} onChange={(e) => setProjectForm({ ...projectForm, engineering_tradeoffs: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Exact GitHub Repository URL</label>
                    <input type="url" placeholder="https://github.com/skiran-ai/repo-name" value={projectForm.github_url} onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })} className="form-input" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Live Demo URL</label>
                    <input type="url" placeholder="https://demo.example.com" value={projectForm.live_url} onChange={(e) => setProjectForm({ ...projectForm, live_url: e.target.value })} className="form-input" />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="featured-proj" checked={projectForm.featured} onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })} />
                  <label htmlFor="featured-proj" style={{ fontSize: '0.86rem', color: '#fff' }}>Mark as Flagship / Featured</label>
                </div>

                {submitMessage && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: submitMessage.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', border: submitMessage.type === 'success' ? '1px solid #10b981' : '1px solid #ef4444', color: submitMessage.type === 'success' ? '#34d399' : '#fca5a5', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {submitMessage.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                    <span>{submitMessage.text}</span>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 1 }}>
                    {submitting ? 'Saving via Django API...' : projectForm.id ? 'Update Project' : 'Publish Project'}
                  </button>
                  {projectForm.id && (
                    <button type="button" className="btn-secondary" onClick={() => setProjectForm(EMPTY_FORM)}>
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            )}

            {activeTab === 'manage' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {projects.map((proj) => (
                  <div key={proj.id} style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff' }}>
                        {proj.title}{' '}
                        {!proj.has_exact_repo && (
                          <span style={{ fontSize: '0.7rem', color: '#fbbf24', marginLeft: '6px' }}>• Profile link only (add repo URL)</span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {proj.github_url && (
                        <a href={proj.github_url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)' }}>
                          <GithubIcon size={16} />
                        </a>
                      )}
                      <button type="button" onClick={() => startEditingProject(proj)} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.76rem' }}>
                        <Edit3 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteProject?.(proj.id)}
                        style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.76rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inbox' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Protected recruiter &amp; visitor inquiries</span>
                  <button onClick={fetchMessages} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>
                {loadingMessages ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : messages.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Inbox is empty.</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map((msg) => (
                      <div key={msg.id} style={{ padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '8px' }}>
                          <strong style={{ color: '#fff', fontSize: '0.88rem' }}>{msg.name} ({msg.email})</strong>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{msg.created_at}</span>
                            <button onClick={() => handleDeleteMessage(msg.id)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }} title="Delete message">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        {msg.subject && <div style={{ fontSize: '0.8rem', color: 'var(--cyan)', marginBottom: '4px' }}>{msg.subject}</div>}
                        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>{msg.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                    Privacy-friendly engagement metrics (no cookies, no IP addresses, no PII)
                  </span>
                  <button onClick={fetchAnalytics} style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem' }}>
                    <RefreshCw size={14} /> Refresh
                  </button>
                </div>

                {loadingAnalytics || !analytics ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading analytics...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '10px' }}>
                      {[
                        { label: 'Resume Downloads', val: analytics.counts.resume_download, color: 'var(--cyan)' },
                        { label: 'CV Downloads', val: analytics.counts.cv_download, color: '#38bdf8' },
                        { label: 'FinSight Runs', val: analytics.counts.sandbox_finsight, color: '#10b981' },
                        { label: 'PayMatch Runs', val: analytics.counts.sandbox_paymatch, color: '#10b981' },
                        { label: 'FinSim Runs', val: analytics.counts.sandbox_finsim, color: '#10b981' },
                        { label: 'JD Fit Checks', val: analytics.counts.jd_match_run, color: '#c084fc' },
                        { label: 'Jarvis Chats', val: analytics.counts.jarvis_chat, color: '#c084fc' },
                        { label: 'Total Inquiries', val: analytics.inquiries_count, color: '#fbbf24' },
                      ].map((m, idx) => (
                        <div key={idx} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>{m.label}</div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '800', color: m.color, marginTop: '4px' }}>{m.val}</div>
                        </div>
                      ))}
                    </div>

                    {analytics.recent_events?.length > 0 && (
                      <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Recent Anonymous Events</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {analytics.recent_events.map((ev, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                              <span><strong style={{ color: 'var(--cyan)' }}>{ev.event_type}</strong> {ev.metadata ? `(${ev.metadata})` : ''}</span>
                              <span style={{ color: 'var(--text-muted)' }}>{ev.created_at}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jarvis' && (
              <div>
                <form onSubmit={handleTestJarvis} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input type="text" placeholder="Test a Jarvis prompt..." value={jarvisTestPrompt} onChange={(e) => setJarvisTestPrompt(e.target.value)} className="form-input" />
                  <button type="submit" disabled={testingJarvis} className="btn-primary" style={{ whiteSpace: 'nowrap' }}>
                    {testingJarvis ? 'Running...' : 'Test Agent'}
                  </button>
                </form>
                {jarvisTestResponse && (
                  <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', color: '#fff', fontSize: '0.86rem', whiteSpace: 'pre-line' }}>
                    {jarvisTestResponse}
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
