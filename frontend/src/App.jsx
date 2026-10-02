import React, { useState, useEffect, useRef } from 'react';
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

const API_BASE = 'http://127.0.0.1:8000/api';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState('add');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isJarvisOpen, setIsJarvisOpen] = useState(false);
  const [isJarvisSpeaking, setIsJarvisSpeaking] = useState(false);

  const hasAutoSpokenRef = useRef(false);
  const activeUtteranceRef = useRef(null);

  // Dynamic time-based greeting: Good morning, Good afternoon, Good evening, Good night
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return "Good morning";
    } else if (hour >= 12 && hour < 17) {
      return "Good afternoon";
    } else if (hour >= 17 && hour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const getHeroIntroSpeech = () => {
    const greeting = getTimeGreeting();
    return (
      `${greeting}! I am Jarvis, personal AI assistant to Suryakiran P J. ` +
      `Suryakiran is a Software Engineer and AI-Integrated Python Django Full Stack Developer. ` +
      `He specializes in architecting high-performance Django backends, reactive modern user interfaces, and autonomous agentic AI integrations. ` +
      `Feel free to explore his coursework, review his skills, download his ATS-friendly resume, or check out his featured projects.`
    );
  };

  // Fetch real projects from Django backend
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects/`);
      const data = await res.json();
      if (data.status === 'success') {
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.warn("Could not reach Django API, running in client-safe mode:", err);
    }
  };

  // Voice narration using Web Speech API with Chromium garbage-collection protection
  const handlePlayVoice = (textToSpeak, forceRestart = true) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    const text = textToSpeak || getHeroIntroSpeech();

    try {
      // If already speaking and not forcing restart, do not interrupt
      if (!forceRestart && isJarvisSpeaking) {
        return;
      }

      window.speechSynthesis.cancel(); // Reset any stalled speech queue

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Select high quality English voice
      const assignVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const preferredVoice = voices.find(v =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Mark') || v.name.includes('George') || v.name.includes('Alex') || v.name.includes('Samantha') || v.name.includes('Microsoft'))
          ) || voices.find(v => v.lang.startsWith('en'));

          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
        }
      };

      assignVoice();

      utterance.onstart = () => {
        setIsJarvisSpeaking(true);
        hasAutoSpokenRef.current = true;
      };

      utterance.onend = () => {
        setIsJarvisSpeaking(false);
        activeUtteranceRef.current = null;
        window.__jarvisUtterance = null;
      };

      utterance.onerror = (e) => {
        console.warn("Jarvis speech notice:", e);
        setIsJarvisSpeaking(false);
        activeUtteranceRef.current = null;
        window.__jarvisUtterance = null;
        if (e.error === 'not-allowed' || e.error === 'interrupted') {
          // If browser blocked speech prior to user interaction, allow first interaction to trigger
          hasAutoSpokenRef.current = false;
        }
      };

      // Retain strong reference on ref and window so Chromium V8 does not GC mid-speech
      activeUtteranceRef.current = utterance;
      window.__jarvisUtterance = utterance;

      window.speechSynthesis.speak(utterance);

      // In case Chromium starts paused, trigger resume immediately
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch (err) {
      console.warn("Speech synthesis trigger note:", err);
      setIsJarvisSpeaking(false);
    }
  };

  const handleStopVoice = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsJarvisSpeaking(false);
    hasAutoSpokenRef.current = true; // User intentionally stopped, do not auto-restart
  };

  // Auto-play Jarvis hero speech ONE TIME whenever portfolio opens
  useEffect(() => {
    fetchProjects();

    const triggerAutoSpeech = () => {
      if (hasAutoSpokenRef.current) return;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        handlePlayVoice(getHeroIntroSpeech(), false);
      }
    };

    // 1. Immediate attempt on page open (250ms)
    const autoTimer = setTimeout(() => {
      triggerAutoSpeech();
    }, 250);

    // 2. Also trigger when voices finish loading asynchronously
    const handleVoicesChanged = () => {
      if (!hasAutoSpokenRef.current) {
        triggerAutoSpeech();
      }
    };
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    }

    // 3. User interaction fallback (strictly ONE-TIME click, tap, or keypress anywhere on page)
    // NOTE: 'mousemove' and 'scroll' are explicitly omitted so cursor movement never cancels or stutters speech!
    const handleFirstUserInteraction = () => {
      if (!hasAutoSpokenRef.current) {
        triggerAutoSpeech();
      }
      cleanupGestureListeners();
    };

    const gestureEvents = ['click', 'touchstart', 'pointerdown', 'keydown'];
    const cleanupGestureListeners = () => {
      gestureEvents.forEach(evt => {
        window.removeEventListener(evt, handleFirstUserInteraction);
      });
    };

    gestureEvents.forEach(evt => {
      window.addEventListener(evt, handleFirstUserInteraction, { passive: true, once: true });
    });

    // 4. Chrome keep-alive: prevent speech from pausing prematurely during long narration
    const keepAlive = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.resume();
      }
    }, 4000);

    return () => {
      clearTimeout(autoTimer);
      clearInterval(keepAlive);
      cleanupGestureListeners();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      }
    };
  }, []);

  const handleOpenAdmin = (tab = 'add') => {
    setAdminInitialTab(tab);
    setIsAdminOpen(true);
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project from the database?")) return;

    try {
      const res = await fetch(`${API_BASE}/projects/${projectId}/`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.status === 'success') {
        fetchProjects();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* 3D WebGL Three.js Background with 3D Scrolling Animation */}
      <ThreeCanvas />

      {/* Main Content Layout */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar
          onOpenAdmin={() => handleOpenAdmin('add')}
          onOpenResume={() => setIsResumeOpen(true)}
          onToggleJarvis={() => setIsJarvisOpen(!isJarvisOpen)}
          isJarvisSpeaking={isJarvisSpeaking}
        />

        <main>
          <Hero
            onOpenAdmin={() => handleOpenAdmin('add')}
            onOpenResume={() => setIsResumeOpen(true)}
            onToggleJarvis={() => setIsJarvisOpen(true)}
            isJarvisSpeaking={isJarvisSpeaking}
            onPlayJarvisVoice={() => handlePlayVoice(getHeroIntroSpeech(), true)}
            onStopJarvisVoice={handleStopVoice}
            timeGreeting={getTimeGreeting()}
          />

          <AboutEducation />

          <Skills />

          <Projects
            projects={projects}
            onOpenAdmin={handleOpenAdmin}
            onDeleteProject={handleDeleteProject}
            isAdminLoggedIn={true}
          />

          <Contact />
        </main>

        <Footer
          onOpenAdmin={() => handleOpenAdmin('add')}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </div>

      {/* Embedded Admin Dashboard (Modal within portfolio) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProjectCreated={fetchProjects}
        projects={projects}
        onDeleteProject={handleDeleteProject}
        initialTab={adminInitialTab}
      />

      {/* ATS Resume & CV Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Agentic AI Assistant: Jarvis */}
      <JarvisAssistant
        isOpen={isJarvisOpen}
        onClose={() => setIsJarvisOpen(!isJarvisOpen)}
        onOpenResume={() => setIsResumeOpen(true)}
        isSpeaking={isJarvisSpeaking}
        onPlayVoice={(text) => handlePlayVoice(text, true)}
        onStopVoice={handleStopVoice}
        introText={getHeroIntroSpeech()}
        timeGreeting={getTimeGreeting()}
      />
    </div>
  );
}
