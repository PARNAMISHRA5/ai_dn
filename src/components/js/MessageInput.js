import React, { useState, useEffect } from "react";
import "../css/MessageInput.css";

function MessageInput({ onSendMessage, disabled = false }) {
  const [input, setInput] = useState("");
  const [isReferencesOpen, setIsReferencesOpen] = useState(false);

  // Check if references sidebar is open by monitoring body class
  useEffect(() => {
    const checkReferencesState = () => {
      const hasReferencesClass = document.body.classList.contains('references-open');
      setIsReferencesOpen(hasReferencesClass);
    };

    // Check initially
    checkReferencesState();

    // Set up a mutation observer to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkReferencesState();
        }
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput("");
      // Reset textarea height to original size
      const textarea = document.querySelector('.message-input');
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = '2.1rem'; // Reset to minHeight
      }
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault(); // Prevent default Enter behavior
      handleSend();
    }
    // Shift+Enter will allow new line (default textarea behavior)
  };

  const handleInputChange = (e) => {
    if (!disabled) {
      setInput(e.target.value);
      // Auto-resize textarea
      e.target.style.height = 'auto';
      e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px'; // Max height limit
    }
  };

  return (
    <div className={`message-input-container${isReferencesOpen ? ' has-sidebar' : ''}`}>
      <div className={`message-input-bar ${disabled ? 'disabled' : ''}`}>
        <textarea
          className="message-input"
          placeholder={disabled ? "AI is responding..." : "Type your message…"}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
          style={{
            fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', 
            resize: 'none', 
            minHeight: '2.1rem', 
            maxHeight: '9.2rem'
          }}
        />
        <div className="version-dropdown-container">
          <select className="version-select" defaultValue="4.1" disabled={disabled}>
            <option value="4.1">version 4.1</option>
            <option value="4.2">version 4.2</option>
            <option value="4.3">version 4.3</option>
          </select>
          <div className="version-dropdown-icon">▼</div>
        </div>
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          aria-label="Send"
          style={{fontFamily: 'Montserrat, Helvetica, Arial, sans-serif'}}
        >
          <span className="send-icon">➤</span>
        </button>
      </div>
      <div className="input-disclaimer">
        {disabled ? "AI is generating a response..." : "AI can make mistakes. Please verify important information."}
      </div>
    </div>
  );
}

export default MessageInput;