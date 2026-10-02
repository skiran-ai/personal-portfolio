import React from 'react';
import { GraduationCap, Award, BookOpen, MapPin, Cpu, Code2, Server } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

export default function AboutEducation() {
  const [sectionRef, sectionVisible] = useScrollReveal();
  const [bannerRef, bannerVisible] = useScrollReveal({ threshold: 0.1 });
  const educationList = [
    {
      degree: "Python Django Full Stack Developer",
      institution: "Avodha",
      location: "Vyttila, Ernakulam, Kerala",
      type: "Professional Certification (6 Months)",
      period: "Pursuing (Month 5 of 6 • 1 Mo Remaining)",
      note: "Intensive 6-month hands-on immersion in Python 3, Django architecture, Django REST Framework (DRF), database engineering, and end-to-end web deployment.",
      tag: "Specialization",
      accent: "var(--cyan)",
      icon: Code2
    },
    {
      degree: "B.Sc Computer Science",
      institution: "KMM",
      location: "Thrikkakara, Ernakulam, Kerala",
      type: "Undergraduate Degree",
      period: "Course Completed",
      note: "Coursework completed with specialization in Computer Science fundamentals, Software Architecture, Database Engineering, and Object-Oriented Programming.",
      tag: "Degree",
      accent: "#38bdf8",
      icon: GraduationCap
    },
    {
      degree: "Higher Secondary Education (HSS)",
      institution: "Sahodaran Memorial Higher Secondary School",
      location: "Cherai, Ernakulam, Kerala",
      type: "Higher Secondary",
      period: "Completed",
      note: "Academic focus on Computer Science, Mathematics, and Analytical Problem Solving.",
      tag: "HSS",
      accent: "#a855f7",
      icon: BookOpen
    },
    {
      degree: "Secondary School Leaving Certificate (SSLC)",
      institution: "Rama Varma Union High School",
      location: "Cherai, Ernakulam, Kerala",
      type: "High School",
      period: "Completed",
      note: "Foundational schooling with high distinction in Mathematics and Science subjects.",
      tag: "SSLC",
      accent: "#fbbf24",
      icon: Award
    }
  ];

  return (
    <section id="about" style={{ padding: 'clamp(60px, 8vw, 100px) clamp(16px, 4vw, 24px)', position: 'relative', zIndex: 10 }}>
      <div
        ref={sectionRef}
        style={{
          opacity: sectionVisible ? 1 : 0,
          transform: sectionVisible ? 'translateY(0)' : 'translateY(36px)',
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
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
            <GraduationCap size={15} color="var(--cyan)" />
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--cyan)' }}>ACADEMIC & BACKGROUND</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
            Education & <span className="gradient-text-cyan">Profile</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.98rem' }}>
            Verified academic milestones and the engineering discipline driving my full-stack and AI development.
          </p>
        </div>

        {/* Grid: Education & Certification Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
          gap: '24px',
          marginBottom: '50px'
        }}>
          {educationList.map((edu, idx) => {
            const IconComponent = edu.icon || GraduationCap;
            return (
            <div
              key={idx}
              className="glass-panel"
              style={{
                padding: '28px',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, border-color 0.3s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = edu.accent;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${edu.accent}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: edu.accent
                  }}>
                    <IconComponent size={22} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: `${edu.accent}18`,
                    color: edu.accent,
                    border: `1px solid ${edu.accent}40`
                  }}>
                    {edu.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                  {edu.degree}
                </h3>

                <div style={{ fontSize: '1.05rem', fontWeight: '600', color: edu.accent, marginBottom: '8px' }}>
                  {edu.institution}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <MapPin size={14} color="var(--text-muted)" />
                  <span>{edu.location}</span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {edu.note}
                </p>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status</span>
                <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                  {edu.period}
                </span>
              </div>
            </div>
            );
          })}
        </div>

        {/* Engineering Highlights Banner */}
        <div
          ref={bannerRef}
          className="glass-panel"
          style={{
            padding: 'clamp(20px, 4vw, 36px)',
            background: 'linear-gradient(135deg, rgba(14, 20, 36, 0.85) 0%, rgba(20, 29, 52, 0.65) 100%)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
            gap: 'clamp(20px, 3vw, 30px)',
            opacity: bannerVisible ? 1 : 0,
            transform: bannerVisible ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan)',
              flexShrink: 0
            }}>
              <Server size={22} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>
                Robust Django Architecture
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.6' }}>
                Engineering secure REST APIs, ORM database query optimizations, and seamless middleware integration.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc',
              flexShrink: 0
            }}>
              <Cpu size={22} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>
                Agentic AI Integration
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.6' }}>
                Connecting autonomous agents like Jarvis with speech synthesis, NLP intent resolution, and LLM backends.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              flexShrink: 0
            }}>
              <Code2 size={22} />
            </div>
            <div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: '700', marginBottom: '6px' }}>
                Reactive Frontend & 3D Web
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.86rem', lineHeight: '1.6' }}>
                Building smooth user experiences in React with Three.js WebGL canvas animations and intuitive design.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
