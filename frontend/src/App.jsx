import React, { useState, useEffect, useRef, useCallback } from 'react';
import ThreeCanvas from './components/ThreeCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutEducation from './components/AboutEducation';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ResumeModal from './components/ResumeModal';
import JarvisAssistant from './components/JarvisAssistant';
import ProjectSandboxModal from './components/ProjectSandboxModal';
import CommandPalette from './components/CommandPalette';
import { API_BASE } from './config/api';
import { FALLBACK_GITHUB_SUMMARY, FALLBACK_PROFILE, FALLBACK_PROJECTS } from './data/portfolioFallback';

const ADMIN_TOKEN_KEY = 'portfolio_admin_token';

const parseJsonSafe = async (res) => {
  const ct = res.headers?.get('content-type') || '';
  if (!res.ok || !ct.includes('application/json')) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const formatAgo = (iso) => {
  if (!iso) return 'recent';
  const diffHours = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 3600000));
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

export default function App() {
  const [profile, setProfile] = useState(FALLBACK_PROFILE);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [githubSummary, setGithubSummary] = useState(FALLBACK_GITHUB_SUMMARY);
  const [apiHealth, setApiHealth] = useState(null);
  const [projectFilter, setProjectFilter] = useState('all');

  const [adminToken, setAdminToken] = useState(() =>
    typeof window !== 'undefined' ? window.sessionStorage.getItem(ADMIN_TOKEN_KEY) || '' : ''
  );
  const [isAdminOpen, setIsAdminOpen] = useState(() =>
    typeof window !== 'undefined' && (window.location.pathname === '/admin' || window.location.hash === '#admin')
  );
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJarvisOpen, setIsJarvisOpen] = useState(false);
  const [jarvisTab, setJarvisTab] = useState('chat');
  const [activeSandboxSlug, setActiveSandboxSlug] = useState(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);

  const activeUtteranceRef = useRef(null);

  const getHeroBriefSpeech = () =>
    'Hello! Suryakiran P J is an AI-Integrated Full Stack and Forward Deployed Engineer specializing in Python, Django REST Framework, React, and schema-grounded Gemini AI systems. Feel free to test his FinSight, PayMatch, and FinSim live sandboxes or run the Job Description fit analyzer.';

  const fetchPortfolioData = useCallback(async () => {
    let loadedGithub = false;
    try {
      const [projRes, profRes, healthRes, ghRes] = await Promise.allSettled([
        fetch(`${API_BASE}/projects/`),
        fetch(`${API_BASE}/profile/`),
        fetch(`${API_BASE}/health/`),
        fetch(`${API_BASE}/github/summary/`),
      ]);

      if (projRes.status === 'fulfilled') {
        const data = await parseJsonSafe(projRes.value);
        if (data?.status === 'success' && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      }

      if (profRes.status === 'fulfilled') {
        const data = await parseJsonSafe(profRes.value);
        if (data?.status === 'success' && data.profile) {
          setProfile(data.profile);
        }
      }

      if (healthRes.status === 'fulfilled') {
        const data = await parseJsonSafe(healthRes.value);
        if (data) setApiHealth(data);
      }

      if (ghRes.status === 'fulfilled') {
        const data = await parseJsonSafe(ghRes.value);
        if (data?.status === 'success') {
          setGithubSummary(data);
          loadedGithub = true;
        }
      }
    } catch {
      // Static edge fallback already initialized
    }

    if (!loadedGithub) {
      try {
        const [uRes, rRes] = await Promise.all([
          fetch('https://api.github.com/users/skiran-ai'),
          fetch('https://api.github.com/users/skiran-ai/repos?sort=pushed&per_page=4'),
        ]);
        if (uRes.ok && rRes.ok) {
          const user = await uRes.json();
          const repos = await rRes.json();
          if (Array.isArray(repos)) {
            setGithubSummary({
              source: 'github_live',
              username: user.login || 'skiran-ai',
              profile_url: user.html_url || 'https://github.com/skiran-ai',
              public_repos: user.public_repos ?? repos.length,
              last_push_ago: formatAgo(repos[0]?.pushed_at),
              repos: repos.map((repo) => ({
                name: repo.name,
                full_name: repo.full_name,
                url: repo.html_url,
                description: repo.description || '',
                language: repo.language || 'Code',
                stars: repo.stargazers_count || 0,
                pushed_ago: formatAgo(repo.pushed_at),
              })),
            });
          }
        }
      } catch {
        // Keep FALLBACK_GITHUB_SUMMARY when offline
      }
    }
  }, []);

  useEffect(() => {
    let active = true;
    const init = async () => {
      await fetchPortfolioData();
      if (!active || !adminToken) return;
      try {
        const res = await fetch(`${API_BASE}/auth/verify/`, {
          headers: { Authorization: `Bearer ${adminToken}` },
        });
        if (active && !res.ok) {
          window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          setAdminToken('');
        }
      } catch {
        // Offline: keep token until next API verification
      }
    };
    init();

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
      } else if (e.key === 'Escape') {
        setIsPaletteOpen(false);
        setActiveSandboxSlug(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      active = false;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchPortfolioData, adminToken]);

  // Opt-in voice narration ONLY when user clicks Play / Listen
  const handlePlayVoice = (textToSpeak) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const text = textToSpeak || getHeroBriefSpeech();

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google'))) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setIsJarvisSpeaking(true);
      utterance.onend = () => {
        setIsJarvisSpeaking(false);
        activeUtteranceRef.current = null;
      };
      utterance.onerror = () => {
        setIsJarvisSpeaking(false);
        activeUtteranceRef.current = null;
      };

      activeUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsJarvisSpeaking(false);
    }
  };

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsJarvisSpeaking(false);
  };

  const handleLoginSuccess = (token) => {
    window.sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    setAdminToken(token);
  };

  const handleLogout = () => {
    window.sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken('');
  };

  const handleDeleteProject = async (projectId) => {
    if (!adminToken || !window.confirm('Delete this project from the database?')) return;
    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        fetchPortfolioData();
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const openJarvisWithTab = (tab = 'chat') => {
    setJarvisTab(tab);
    setIsJarvisOpen(true);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <ThreeCanvas />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar
          onOpenResume={() => setIsResumeOpen(true)}
          onToggleJarvis={() => setIsJarvisOpen((prev) => !prev)}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
          isJarvisSpeaking={isJarvisSpeaking}
          apiHealth={apiHealth}
        />

        <main>
          <Hero
            onOpenResume={() => setIsResumeOpen(true)}
            onOpenJarvis={openJarvisWithTab}
            isJarvisSpeaking={isJarvisSpeaking}
            onPlayJarvisVoice={() => handlePlayVoice(getHeroBriefSpeech())}
            onStopJarvisVoice={handleStopVoice}
          />

          <AboutEducation profile={profile} />

          <Skills
            profile={profile}
            onSelectEvidence={(evidenceName) => setProjectFilter(evidenceName)}
          />

          <Projects
            projects={projects}
            githubSummary={githubSummary}
            onOpenSandbox={(slug) => setActiveSandboxSlug(slug)}
            onDeleteProject={handleDeleteProject}
            isAdminAuthenticated={Boolean(adminToken)}
            activeFilter={projectFilter}
            onFilterChange={setProjectFilter}
          />

          <Contact onOpenJarvis={openJarvisWithTab} />
        </main>

        <Footer
          onOpenResume={() => setIsResumeOpen(true)}
          onOpenCommandPalette={() => setIsPaletteOpen(true)}
          apiHealth={apiHealth}
        />
      </div>

      <ProjectSandboxModal
        key={activeSandboxSlug || 'closed'}
        sandboxSlug={activeSandboxSlug}
        onClose={() => setActiveSandboxSlug(null)}
      />

      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onOpenSandbox={(slug) => setActiveSandboxSlug(slug)}
        onOpenJarvis={openJarvisWithTab}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProjectsChanged={fetchPortfolioData}
        projects={projects}
        onDeleteProject={handleDeleteProject}
        adminToken={adminToken}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />

      <JarvisAssistant
        isOpen={isJarvisOpen}
        initialTab={jarvisTab}
        onClose={() => setIsJarvisOpen((prev) => !prev)}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenSandbox={(slug) => setActiveSandboxSlug(slug)}
        isSpeaking={isJarvisSpeaking}
        onPlayVoice={handlePlayVoice}
        onStopVoice={handleStopVoice}
        apiHealth={apiHealth}
      />
    </div>
  );
}
