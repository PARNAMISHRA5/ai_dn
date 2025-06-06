// ChatWindow.js
import React, { useRef, useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../css/ChatWindow.css";

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function FeedbackButtons({ onFeedback, onShowReferences }) {
  return (
    <span className="feedback-btns">
      <button
        className="thumb-btn up"
        title="Helpful"
        onClick={() => onFeedback('up')}
      >
        👍
      </button>
      <button
        className="thumb-btn down"
        title="Not helpful"
        onClick={() => onFeedback('down')}
      >
        👎
      </button>
      <button
        className="references-btn"
        title="Show References"
        onClick={onShowReferences}
      >
        📜
      </button>
    </span>
  );
}

function ReferencesSidebar({ isOpen, onClose }) {
  const predefinedResponses = [
    {
      id: 1,
      title: "AI Capabilities Overview",
      content:
        "AI systems can process natural language, generate text, analyze data, and assist with various tasks. However, they have limitations and may produce inaccurate information.",
      source: "AI Knowledge Base v2.1",
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      content:
        "Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.",
      source: "ML Fundamentals Guide",
    },
    {
      id: 3,
      title: "Natural Language Processing",
      content:
        "NLP combines computational linguistics with statistical, machine learning, and deep learning models to help computers understand human language.",
      source: "NLP Research Papers 2024",
    },
    {
      id: 4,
      title: "Data Privacy Guidelines",
      content:
        "Always ensure user data is handled according to privacy regulations like GDPR and CCPA. Implement proper encryption and access controls.",
      source: "Privacy Compliance Manual",
    },
    {
      id: 5,
      title: "Ethical AI Principles",
      content:
        "AI systems should be fair, accountable, transparent, and designed to benefit humanity while minimizing potential harms.",
      source: "AI Ethics Framework 2024",
    },
  ];

  // Add body class when sidebar is open to shift the entire page
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('references-open');
    } else {
      document.body.classList.remove('references-open');
    }
    
    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('references-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="references-overlay" onClick={onClose}>
      <div className="references-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="references-header">
          <h3>References & Sources</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="references-content">
          {predefinedResponses.map((ref) => (
            <div key={ref.id} className="reference-item">
              <h4>{ref.title}</h4>
              <p>{ref.content}</p>
              <div className="reference-source">Source: {ref.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfessionalLoader() {
  return (
    <div className="message-item bot-item">
      <div className="bubble-meta">
        <span className="bubble-timestamp">{formatTime(Date.now())}</span>
        <span
          className="ai-tag"
          title="AI generated content may be incorrect"
        >
          AI generating
        </span>
      </div>
      <div className="chat-bubble bot loading">
        <div className="bubble-content">
          <div className="chat-loader">
            <div className="loader-dots">
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
              <div className="loader-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatWindow({ messages, streamingWords, onFeedback, isLoading, onNewChat }) {
  const chatRef = useRef(null);
  const [showReferences, setShowReferences] = useState(false);

  // Scroll to bottom when messages change or when loading/streaming
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streamingWords, isLoading]);

  // Scroll to top when new chat is started (messages array becomes empty)
  useEffect(() => {
    if (messages.length === 0 && chatRef.current) {
      chatRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  const handleShowReferences = () => {
    setShowReferences(true);
  };

  const handleCloseReferences = () => {
    setShowReferences(false);
  };

  return (
    <>
      {/* Remove the chat-container wrapper and has-sidebar class logic */}
      <div className="chat-window" ref={chatRef}>
        <TransitionGroup>
          {messages.map((msg) => (
            <CSSTransition
              key={msg.id}
              timeout={260}
              classNames={msg.sender === "user" ? "bubble-user" : "bubble-bot"}
            >
              <div
                className={`message-item ${
                  msg.sender === "user" ? "user-item" : "bot-item"
                }`}
              >
                <div className="bubble-meta">
                  <span className="bubble-timestamp">
                    {formatTime(msg.timestamp || msg.id)}
                  </span>
                  {msg.sender === "bot" && (
                    <span
                      className="ai-tag"
                      title="AI generated content may be incorrect"
                    >
                      AI generated
                    </span>
                  )}
                </div>
                <div
                  className={`chat-bubble ${
                    msg.sender === "user" ? "user" : "bot"
                  }`}
                >
                  <div className="bubble-content">{msg.text}</div>
                </div>
                {msg.sender === "bot" && (
                  <div className="bubble-feedback-row">
                    <FeedbackButtons
                      onFeedback={(fb) => onFeedback && onFeedback(msg.id, fb)}
                      onShowReferences={handleShowReferences}
                    />
                  </div>
                )}
              </div>
            </CSSTransition>
          ))}

          {isLoading && (
            <CSSTransition key="loading" timeout={160} classNames="bubble-bot">
              <ProfessionalLoader />
            </CSSTransition>
          )}

          {Array.isArray(streamingWords) &&
            streamingWords.length > 0 &&
            !isLoading && (
              <CSSTransition key="streaming" timeout={500} classNames="bubble-bot">
                <div className="message-item bot-item">
                  <div className="bubble-meta">
                    <span className="bubble-timestamp">
                      {formatTime(Date.now())}
                    </span>
                    <span
                      className="ai-tag"
                      title="AI generated content may be incorrect"
                    >
                      AI generating
                    </span>
                  </div>
                  <div className="chat-bubble bot streaming">
                    <div className="bubble-content streaming-text">
                      {streamingWords.map((w, i) => (
                        <span
                          key={i}
                          className="streaming-word"
                          style={{
                            opacity: 0,
                            animation: `fade-in-word 0.4s ${i * 0.05}s cubic-bezier(0.4, 0, 0.2, 1) forwards`,
                          }}
                        >
                          {w}
                        </span>
                      ))}
                      <span className="blinking-cursor" />
                    </div>
                  </div>
                </div>
              </CSSTransition>
            )}
        </TransitionGroup>
      </div>

      <ReferencesSidebar isOpen={showReferences} onClose={handleCloseReferences} />
    </>
  );
}

export default ChatWindow;