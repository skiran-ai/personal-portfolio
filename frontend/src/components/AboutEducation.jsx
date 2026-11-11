import React from 'react';
import { GraduationCap, MapPin, Cpu, Code2, Server, CheckCircle2 } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FALLBACK_PROFILE } from '../data/portfolioFallback';

export default function AboutEducation({ profile = FALLBACK_PROFILE }) {
  const [sectionRef, sectionVisible] = useScrollReveal();
  const pillars = profile?.engineering_pillars || FALLBACK_PROFILE.engineering_pillars;
  const allEdu = profile?.education || FALLBACK_PROFILE.education;
  const primaryEdu = allEdu.filter((e) => e.tier !== 'secondary');
  const secondaryEdu = allEdu.filter((e) => e.tier === 'secondary');

  const pillarIcons = [Server, Cpu, Code2];
  const pillarColors = ['var(--cyan)', '#c084fc', '#38bdf8'];

  return (
    <section id="about" className="section-pad">
      <div
        ref={sectionRef}
        className="container-shell"
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-index-pill">
            <Cpu size={14} color="var(--cyan)" />
            <span>01 // ENGINEERING APPROACH &amp; CREDENTIALS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.75rem)', fontWeight: '800', color: '#fff', marginBottom: '10px' }}>
            How I <span className="font-serif-accent" style={{ color: 'var(--cyan)', fontSize: '1.12em' }}>Build &amp; Ship</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.96rem' }}>
            Focused on verifiable backend systems, schema-safe AI workflows, and real full-stack execution rather than decorative claims.
          </p>
        </div>

        {/* 1. Engineering Pillars First */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {pillars.map((pillar, idx) => {
            const Icon = pillarIcons[idx % pillarIcons.length];
            const color = pillarColors[idx % pillarColors.length];
            return (
              <div
                key={pillar.id || idx}
                className="glass-panel"
                style={{ padding: '26px', display: 'flex', flexDirection: 'column', gap: '12px' }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `1px solid ${color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color,
                  }}
                >
                  <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>{pillar.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {pillar.summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* 2. Primary Technical & Degree Credentials */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: '20px',
            marginBottom: '20px',
          }}
        >
          {primaryEdu.map((edu, idx) => (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: idx === 0 ? 'rgba(0, 242, 254, 0.25)' : 'var(--border-subtle)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="tech-pill">{idx === 0 ? 'Professional Training' : 'Undergraduate Degree'}</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={13} />
                    {edu.period}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.18rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                  {edu.degree}
                </h3>
                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--cyan)', marginBottom: '8px' }}>
                  {edu.institution}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <MapPin size={13} />
                  <span>{edu.location}</span>
                </div>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                  {edu.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Compact Secondary Schooling Strip (No oversized cards for SSLC/HSS) */}
        {secondaryEdu.length > 0 && (
          <div
            className="glass-panel"
            style={{
              padding: '16px 22px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '14px',
              background: 'rgba(13, 19, 34, 0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              <GraduationCap size={16} color="var(--text-muted)" />
              <span>Earlier Schooling:</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              {secondaryEdu.map((edu, idx) => (
                <span key={idx}>
                  <strong style={{ color: '#e2e8f0' }}>{edu.degree}</strong> — {edu.institution} ({edu.location})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
