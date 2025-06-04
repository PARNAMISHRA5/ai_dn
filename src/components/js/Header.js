import React, { useState, useContext, useEffect, useRef } from "react";
import { ThemeContext } from "../../themeContext";
import "../css/Header.css";
import logo from '../../assets/image.png'

function Header({ username, onNewSession, onGoHome }) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome();
    }
  };

  const handleNewSession = () => {
    if (onNewSession) {
      onNewSession();
    }
    setDropdownOpen(false);
  };

  const handleGoToHome = () => {
    if (onGoHome) {
      onGoHome();
    }
    setDropdownOpen(false);
  };

  return (
    <nav className="header-navbar">
      <div className="header-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="Logo" className="logo-icon" />
        <span className="brand-text">AI-DN</span>
      </div>

      <div className="header-actions">
        <button onClick={handleNewSession} className="new-session-btn" title="Start new chat session">
          <span>+ New Chat</span>
        </button>
        <div className="user-menu-container" ref={dropdownRef}>
          <span className="greeting d-none d-md-inline" onClick={() => setDropdownOpen(!isDropdownOpen)} style={{ cursor: 'pointer' }}>
            Hello, {username} <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
          </span>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleNewSession}>
                <span className="dropdown-icon">💬</span>
                New Chat Session
              </button>
              <button className="dropdown-item" onClick={handleGoToHome}>
                <span className="dropdown-icon">🏠</span>
                Go to Home
              </button>
              <button className="dropdown-item" onClick={() => { toggleTheme(); setDropdownOpen(false); }}>
                <span className="dropdown-icon">{theme === "dark" ? "🌙" : "☀️"}</span>
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          )}
        </div>
        <button onClick={toggleTheme} className="theme-toggle-btn" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          aria-label="Toggle dark/light mode"
        >
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}

export default Header;