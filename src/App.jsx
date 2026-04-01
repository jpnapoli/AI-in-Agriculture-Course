import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import ExamPage from './pages/ExamPage';
import CourseOverviewPage from './pages/CourseOverviewPage';
import NoorChat from './components/NoorChat';
import { DashboardIcon, InformationIcon, CertificateIcon, SunIcon, MoonIcon, EcoIcon } from './components/CarbonIcons';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activePersona, setActivePersona] = useState(null); // Noor persona skin

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Always validate user against backend to handle DB resets
    const saved = localStorage.getItem('agri-ai-user');
    const email = saved ? JSON.parse(saved).email : 'learner@course.ai';
    const name = saved ? JSON.parse(saved).name : 'Learner';
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then(r => r.json())
      .then(data => {
        setUser(data);
        localStorage.setItem('agri-ai-user', JSON.stringify(data));
      })
      .catch(() => {
        // Offline fallback: use saved or generate temporary
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          const u = { id: 'user-' + Date.now(), name: 'Learner', email: 'learner@course.ai' };
          setUser(u);
          localStorage.setItem('agri-ai-user', JSON.stringify(u));
        }
      });
  }, []);

  const refreshProgress = async (overrideUser) => {
    const u = overrideUser || user;
    if (!u) return;
    try {
      const r = await fetch(`/api/users/${u.id}/progress`);
      const data = await r.json();
      setProgress(data);
    } catch (e) { console.error('refreshProgress error:', e); }
  };

  useEffect(() => { if (user) refreshProgress(); }, [user]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, progress, refreshProgress, activePersona, setActivePersona }}>
      {children}
    </AppContext.Provider>
  );
}

function TopNav() {
  const { theme, toggleTheme, progress } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const overallPct = progress?.overallPercentage || 0;

  return (
    <nav className="top-nav">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <EcoIcon size={24} color="var(--interactive-primary)" />
        <span>AI in Agriculture</span>
      </div>

      {/* Overall course progress bar */}
      <div className="nav-progress">
        <div className="nav-progress-bar">
          <div className="nav-progress-fill" style={{ width: `${overallPct}%` }} />
        </div>
        <span className="nav-progress-label">{overallPct}%</span>
      </div>

      <div className="nav-links">
        <div className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <InformationIcon size={16} /> Overview
        </div>
        <div className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => navigate('/dashboard')}>
          <DashboardIcon size={16} /> Dashboard
        </div>
        <div className={`nav-link ${location.pathname === '/exam' ? 'active' : ''}`} onClick={() => navigate('/exam')}>
          <CertificateIcon size={16} /> Final Exam
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === 'dark' ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="app-container">
          <TopNav />
          <Routes>
            <Route path="/" element={<CourseOverviewPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/lesson/:lessonId" element={<LessonPage />} />
            <Route path="/exam" element={<ExamPage />} />
          </Routes>
          <NoorChat />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
