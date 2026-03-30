import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ModulePage from './pages/ModulePage';
import LessonPage from './pages/LessonPage';
import ExamPage from './pages/ExamPage';
import CourseOverviewPage from './pages/CourseOverviewPage';
import NoorChat from './components/NoorChat';

export const AppContext = createContext();

function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem('agri-ai-user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      const u = { id: 'user-' + Date.now(), name: 'Learner', email: 'learner@course.ai' };
      fetch('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(u) })
        .then(r => r.json()).then(data => { setUser(data); localStorage.setItem('agri-ai-user', JSON.stringify(data)); })
        .catch(() => { setUser(u); localStorage.setItem('agri-ai-user', JSON.stringify(u)); });
    }
  }, []);

  const refreshProgress = async () => {
    if (!user) return;
    try {
      const r = await fetch(`/api/users/${user.id}/progress`);
      const data = await r.json();
      setProgress(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { if (user) refreshProgress(); }, [user]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, progress, refreshProgress }}>
      {children}
    </AppContext.Provider>
  );
}

function TopNav() {
  const { theme, toggleTheme } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="top-nav">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <img src="/images/icon-course.png" alt="AI in Agriculture" className="brand-icon-img" />
        <span>AI in Agriculture</span>
      </div>
      <div className="nav-links">
        <div className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} onClick={() => navigate('/')}>
          <span className="material-icons-round" style={{fontSize:16}}>dashboard</span> Dashboard
        </div>
        <div className={`nav-link ${location.pathname === '/overview' ? 'active' : ''}`} onClick={() => navigate('/overview')}>
          <span className="material-icons-round" style={{fontSize:16}}>info</span> Overview
        </div>
        <div className={`nav-link ${location.pathname === '/exam' ? 'active' : ''}`} onClick={() => navigate('/exam')}>
          <span className="material-icons-round" style={{fontSize:16}}>quiz</span> Final Exam
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          <span className="material-icons-round">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/overview" element={<CourseOverviewPage />} />
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
