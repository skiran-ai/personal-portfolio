import React from 'react';
import { Layers, Database, Cpu, Globe, Terminal, ArrowUpRight } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import { FALLBACK_PROFILE } from '../data/portfolioFallback';

const CATEGORY_META = [
  { icon: Terminal, color: 'var(--cyan)' },
  { icon: Cpu, color: '#c084fc' },
  { icon: Globe, color: '#38bdf8' },
  { icon: Database, color: '#10b981' },
];

export default function Skills({ profile = FALLBACK_PROFILE, onSelectEvidence }) {
  const [revealRef, isVisible] = useScrollReveal();
  const categories = profile?.skill_matrix || FALLBACK_PROFILE.skill_matrix;

  const handleEvidenceClick = (evidenceLabel) => {
    if (onSelectEvidence) {
      onSelectEvidence(evidenceLabel);
    }
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="skills" className="section-pad">
      <div
        ref={revealRef}
        className="container-shell"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
          transition: 'opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div className="section-index-pill" style={{ borderColor: 'rgba(168, 85, 247, 0.28)', color: '#c084fc', background: 'rgba(168, 85, 247, 0.08)' }}>
            <Layers size={14} color="#c084fc" />
            <span>02 // EVIDENCE-BACKED COMPETENCIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3.3vw, 2.75rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Tech Stack &amp; <span className="font-serif-accent" style={{ color: '#c084fc', fontSize: '1.12em' }}>Proof Matrix</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.96rem' }}>
            Zero arbitrary percentage bars. Every capability below links directly to the system or sandbox where it is implemented.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '22px',
          }}
        >
          {categories.map((cat, idx) => {
            const meta = CATEGORY_META[idx % CATEGORY_META.length];
            const Icon = meta.icon;
            return (
              <div key={cat.category || idx} className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '11px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${meta.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: meta.color,
                    }}
                  >
                    <Icon size={19} />
                  </div>
                  <h3 style={{ fontSize: '1.08rem', fontWeight: '700', color: '#fff' }}>{cat.category}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cat.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      style={{
                        padding: '12px 14px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: '700', color: '#f8fafc' }}>{skill.name}</span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            background: skill.tier === 'Core' ? 'rgba(0, 242, 254, 0.14)' : 'rgba(148, 163, 184, 0.14)',
                            color: skill.tier === 'Core' ? 'var(--cyan)' : '#cbd5e1',
                          }}
                        >
                          {skill.tier}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.45', marginBottom: '10px' }}>
                        {skill.note}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skill.evidence?.map((ev, eIdx) => (
                          <button
                            key={eIdx}
                            type="button"
                            onClick={() => handleEvidenceClick(ev)}
                            title={`Inspect ${ev} in Projects`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '3px 9px',
                              borderRadius: '8px',
                              background: 'rgba(0, 242, 254, 0.07)',
                              border: '1px solid rgba(0, 242, 254, 0.22)',
                              color: 'var(--cyan)',
                              fontSize: '0.72rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                          >
                            <span>{ev}</span>
                            <ArrowUpRight size={11} />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
