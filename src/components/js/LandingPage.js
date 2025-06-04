import React, { useContext } from 'react';
import { ThemeContext } from '../../themeContext';
import '../css/LandingPage.css';

function LandingPage({ showWelcomeMessage }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="landing-page-container">
      <div className="landing-theme-toggle">
        <button 
          onClick={toggleTheme} 
          className="landing-theme-btn" 
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
      <div className="landing-content">
        <div className="landing-logo">🚀</div>
        <h1 className="landing-brand">Ai-DN</h1>
        {showWelcomeMessage && <p className="landing-welcome-docs">Welcome to TM documentation</p>}
        <p className="landing-welcome">Ask me anything to get started!</p>
      </div>
    </div>
  );
}

export default LandingPage;