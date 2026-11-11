import React, { useState } from 'react';
import { FolderGit2, ExternalLink, Play, Layers, Star, ChevronDown, ChevronUp, Trash2, GitBranch, ArrowRight } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Projects({
  projects = [],
  githubSummary = null,
  onOpenSandbox,
  onDeleteProject,
  isAdminAuthenticated = false,
  activeFilter = 'all',
  onFilterChange,
}) {
  const [revealRef, isVisible] = useScrollReveal();
  const [expandedArchId, setExpandedArchId] = useState(null);
  const [archTab, setArchTab] = useState('flow'); // 'flow' | 'api' | 'tradeoffs'

  const filterTabs = [
    { key: 'all', label: 'All Projects' },
    { key: 'django', label: 'Python & Django' },
    { key: 'ai', label: 'AI & Agents' },
    { key: 'fintech', label: 'FinTech Systems' },
  ];

  const matchesFilter = (proj) => {
    if (!activeFilter || activeFilter === 'all') return true;
    const haystack = JSON.stringify(proj).toLowerCase();
    if (activeFilter === 'ai') return haystack.includes('ai') || haystack.includes('langchain') || haystack.includes('gemini');
    if (activeFilter === 'django') return haystack.includes('django') || haystack.includes('python');
    if (activeFilter === 'fintech') return haystack.includes('fin') || haystack.includes('paymatch') || haystack.includes('cash') || haystack.includes('reconcil');
    return haystack.includes(activeFilter.toLowerCase());
  };

  const visibleProjects = projects.filter(matchesFilter);

  const toggleInspector = (projId) => {
    if (expandedArchId === projId) {
      setExpandedArchId(null);
    } else {
      setExpandedArchId(projId);
      setArchTab('flow');
    }
  };

  return (
    <section id="projects" className="section-pad">
      <div
        ref={revealRef}
        className="container-shell"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div className="section-index-pill">
            <FolderGit2 size={14} color="var(--cyan)" />
            <span>03 // EXECUTABLE CASE STUDIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.75rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Projects &amp; <span className="font-serif-accent" style={{ color: 'var(--cyan)', fontSize: '1.12em' }}>Live Sandboxes</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', fontSize: '0.96rem' }}>
            Inspect data-flow pipelines, API contracts, engineering trade-offs, and run live Python/Django simulations directly without signing up.
          </p>
        </div>

        {/* Live GitHub Telemetry Strip (@skiran-ai) */}
        {githubSummary && (
          <div
            className="glass-panel"
            style={{
              padding: '14px 20px',
              marginBottom: '28px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              background: 'rgba(13, 19, 34, 0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontWeight: '700', fontSize: '0.86rem', color: '#fff' }}>
                <GithubIcon size={17} />
                <span>@{githubSummary.username}</span>
              </div>
              <span className="tech-pill tech-pill-emerald" style={{ fontSize: '0.72rem', padding: '2px 9px' }}>
                {githubSummary.source === 'github_live' ? 'Live GitHub Sync' : 'Verified GitHub'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {githubSummary.public_repos} Public Repo • Last push: <strong style={{ color: 'var(--cyan)' }}>{githubSummary.last_push_ago}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              {githubSummary.repos?.slice(0, 3).map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 11px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--border-subtle)',
                    color: '#e2e8f0',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: '600',
                  }}
                >
                  <GitBranch size={13} color="var(--cyan)" />
                  <span>{repo.name}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>({repo.language})</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
          {filterTabs.map((tab) => {
            const selected = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onFilterChange?.(tab.key)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  background: selected ? 'var(--cyan)' : 'rgba(255, 255, 255, 0.04)',
                  color: selected ? '#07090e' : 'var(--text-secondary)',
                  border: selected ? '1px solid var(--cyan)' : '1px solid var(--border-subtle)',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            );
          })}
          {!filterTabs.some((t) => t.key === activeFilter) && (
            <button
              type="button"
              onClick={() => onFilterChange?.('all')}
              style={{
                padding: '7px 14px',
                borderRadius: '9999px',
                background: 'rgba(168, 85, 247, 0.16)',
                color: '#e9d5ff',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Filter: {activeFilter} ×
            </button>
          )}
        </div>

        {/* Project Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '24px',
          }}
        >
          {visibleProjects.map((proj) => {
            const isArchOpen = expandedArchId === proj.id;
            const pipelineNodes = (proj.architecture_summary || '')
              .split('->')
              .map((s) => s.trim())
              .filter(Boolean);

            return (
              <article
                key={proj.id}
                className="glass-panel"
                style={{
                  padding: '26px',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cyan)',
                      }}
                    >
                      <FolderGit2 size={19} />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {proj.sandbox_slug && (
                        <span className="tech-pill tech-pill-emerald" style={{ fontSize: '0.7rem', padding: '3px 9px' }}>
                          Live Sandbox
                        </span>
                      )}
                      {proj.featured && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          <Star size={11} fill="#fbbf24" />
                          Flagship
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>
                    {proj.title}
                  </h3>
                  {proj.tagline && (
                    <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--cyan)', marginBottom: '12px' }}>
                      {proj.tagline}
                    </div>
                  )}

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '14px' }}>
                    <strong style={{ color: '#e2e8f0' }}>Problem Solved:</strong> {proj.problem_statement || proj.description}
                  </p>

                  {/* 3-Tab Under-the-Hood Inspector */}
                  <button
                    type="button"
                    onClick={() => toggleInspector(proj.id)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      color: '#cbd5e1',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '14px',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Layers size={14} color="var(--cyan)" />
                      Under-the-Hood Architecture &amp; API
                    </span>
                    {isArchOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>

                  {isArchOpen && (
                    <div
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(7, 10, 18, 0.9)',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                        marginBottom: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                        {[
                          { key: 'flow', label: 'Data Flow' },
                          { key: 'api', label: 'API Contract' },
                          { key: 'tradeoffs', label: 'Trade-offs' },
                        ].map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => setArchTab(t.key)}
                            style={{
                              flex: 1,
                              padding: '5px 8px',
                              borderRadius: '7px',
                              background: archTab === t.key ? 'rgba(0, 242, 254, 0.16)' : 'rgba(255,255,255,0.03)',
                              border: archTab === t.key ? '1px solid var(--cyan)' : '1px solid transparent',
                              color: archTab === t.key ? 'var(--cyan)' : 'var(--text-secondary)',
                              fontSize: '0.73rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>

                      {archTab === 'flow' && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                          {pipelineNodes.map((node, nIdx) => (
                            <React.Fragment key={nIdx}>
                              <span
                                style={{
                                  padding: '5px 9px',
                                  borderRadius: '8px',
                                  background: 'rgba(56, 189, 248, 0.1)',
                                  border: '1px solid rgba(56, 189, 248, 0.28)',
                                  fontSize: '0.74rem',
                                  color: '#e0f2fe',
                                  fontWeight: '600',
                                }}
                              >
                                {node}
                              </span>
                              {nIdx < pipelineNodes.length - 1 && <ArrowRight size={13} color="var(--cyan)" />}
                            </React.Fragment>
                          ))}
                        </div>
                      )}

                      {archTab === 'api' && (
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#a5f3fc', background: 'rgba(0,0,0,0.45)', padding: '9px', borderRadius: '8px', lineHeight: '1.5' }}>
                          {proj.api_contract_sample || 'REST endpoint configured via Django REST Framework.'}
                        </div>
                      )}

                      {archTab === 'tradeoffs' && (
                        <p style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
                          {proj.engineering_tradeoffs || 'Deterministic backend verification layer.'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Tech Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '20px' }}>
                    {Array.isArray(proj.technologies) &&
                      proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Action Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {proj.sandbox_slug && (
                      <button
                        type="button"
                        onClick={() => onOpenSandbox?.(proj.sandbox_slug)}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.8rem', borderRadius: '10px' }}
                      >
                        <Play size={13} />
                        <span>Launch Sandbox</span>
                      </button>
                    )}

                    {proj.github_url && (
                      <a
                        href={proj.github_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                        }}
                      >
                        <GithubIcon size={15} />
                        <span>{proj.has_exact_repo ? 'Repository' : 'GitHub Profile'}</span>
                      </a>
                    )}

                    {proj.live_url && (
                      <a
                        href={proj.live_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          color: 'var(--cyan)',
                          textDecoration: 'none',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                        }}
                      >
                        <ExternalLink size={14} />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>

                  {isAdminAuthenticated && (
                    <button
                      type="button"
                      onClick={() => onDeleteProject?.(proj.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'rgba(239, 68, 68, 0.14)',
                        border: '1px solid rgba(239, 68, 68, 0.35)',
                        color: '#f87171',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {visibleProjects.length === 0 && (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No projects match the filter &quot;{activeFilter}&quot;.{' '}
            <button
              type="button"
              onClick={() => onFilterChange?.('all')}
              style={{ color: 'var(--cyan)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Show all projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
