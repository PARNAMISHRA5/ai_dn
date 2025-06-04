import React, { useState } from "react";
import "../css/MessageInput.css";

function MessageInput({ onSendMessage }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior
      handleSend();
    }
    // Shift+Enter will allow new line (default textarea behavior)
  };

  return (
    <div className="message-input-bar">
      <textarea
        className="message-input"
        placeholder="Type your message… (Shift+Enter for new line)"
        value={input}
        onChange={e => {
          setInput(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = (e.target.scrollHeight) + 'px';
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        style={{fontFamily: 'Montserrat, Helvetica, Arial, sans-serif', resize: 'none', minHeight: '2.1rem', maxHeight: '9.2rem'}}
      />
      <div className="version-dropdown-container">
        <select className="version-select" defaultValue="4.1">
          <option value="4.1">Claude 4.1</option>
          <option value="4.2">Claude 4.2</option>
          <option value="4.3">Claude 4.3</option>
        </select>
        <div className="version-dropdown-icon">▼</div>
      </div>
      <button
        className="send-btn"
        onClick={handleSend}
        disabled={!input.trim()}
        aria-label="Send"
        style={{fontFamily: 'Montserrat, Helvetica, Arial, sans-serif'}}
      >
        <span className="send-icon">➤</span>
      </button>
    </div>
  );
}
export default MessageInput;