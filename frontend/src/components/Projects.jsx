import React from 'react';
import { FolderGit2, ExternalLink, PlusCircle, Sparkles, Terminal, Layers, Star } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import useScrollReveal from '../hooks/useScrollReveal';

export default function Projects({ projects, onOpenAdmin, onDeleteProject, isAdminLoggedIn }) {
  const [revealRef, isVisible] = useScrollReveal();
  return (
    <section id="projects" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)', position: 'relative', zIndex: 10 }}>
      <div
        ref={revealRef}
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 14px',
            borderRadius: '20px',
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            marginBottom: '12px'
          }}>
            <FolderGit2 size={15} color="var(--cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--cyan)' }}>PORTFOLIO SHOWCASE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Featured <span className="gradient-text-cyan">Projects</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '0.98rem' }}>
            Live dynamic portfolio driven by Python Django API backend. Authentically managed via the integrated Admin Console.
          </p>
        </div>

        {/* Dynamic Project Display: No Fake Projects */}
        {projects.length === 0 ? (
          <div
            className="glass-panel"
            style={{
              padding: '60px 30px',
              textAlign: 'center',
              maxWidth: '720px',
              margin: '0 auto',
              border: '1px dashed rgba(0, 242, 254, 0.4)',
              background: 'linear-gradient(180deg, rgba(14, 20, 36, 0.8) 0%, rgba(7, 9, 14, 0.95) 100%)'
            }}
          >
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan)',
              margin: '0 auto 24px auto',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.2)'
            }}>
              <Terminal size={30} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
              Zero Fake Projects — Pure Authenticity
            </h3>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '28px', maxWidth: '520px', margin: '0 auto 28px auto' }}>
              In accordance with strict professional standards, placeholder mock projects have been omitted.
              Projects are loaded live from the Django REST API. Use the integrated Admin Dashboard to publish verified projects in real time!
            </p>

            <button
              onClick={() => onOpenAdmin('add')}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '1rem', cursor: 'pointer' }}
            >
              <PlusCircle size={18} />
              <span>Launch Admin Dashboard to Add Project</span>
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '28px',
              marginBottom: '40px'
            }}>
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-panel"
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.borderColor = 'var(--cyan)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Top Bar with Featured badge */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(0, 242, 254, 0.1)',
                        border: '1px solid rgba(0, 242, 254, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--cyan)'
                      }}>
                        <FolderGit2 size={20} />
                      </div>

                      {proj.featured && (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '12px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.3)'
                        }}>
                          <Star size={12} fill="#fbbf24" />
                          Featured
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }}>
                      {proj.title}
                    </h3>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                      {proj.description}
                    </p>

                    {/* Tech Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                      {Array.isArray(proj.technologies) && proj.technologies.map((tech, tIdx) => (
                        <span key={tIdx} className="tech-pill">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Links */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)'
                  }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {proj.github_url && (
                        <a
                          href={proj.github_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View GitHub Repository"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--text-primary)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'color 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                        >
                          <GithubIcon size={16} />
                          <span>Code</span>
                        </a>
                      )}

                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noreferrer"
                          title="View Live Demo"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: 'var(--cyan)',
                            textDecoration: 'none',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>

                    {isAdminLoggedIn && (
                      <button
                        onClick={() => onDeleteProject(proj.id)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.12)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#f87171',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add from Projects Section */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => onOpenAdmin('add')}
                className="btn-secondary btn-admin"
                style={{ cursor: 'pointer' }}
              >
                <PlusCircle size={16} />
                <span>Add More Projects via Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
