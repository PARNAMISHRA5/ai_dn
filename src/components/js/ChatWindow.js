import React, { useRef, useEffect, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../css/ChatWindow.css";

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function FeedbackButtons({ onFeedback }) {
  return (
    <span className="feedback-btns">
      <button className="thumb-btn up" title="Helpful" onClick={() => onFeedback('up')}>👍</button>
      <button className="thumb-btn down" title="Not helpful" onClick={() => onFeedback('down')}>👎</button>
    </span>
  );
}

function ChatWindow({ messages, streamingWords, onFeedback }) {
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, streamingWords]);

  return (
    <div className="chat-window" ref={chatRef}>
      <TransitionGroup>
        {messages.map((msg) => (
          <CSSTransition
            key={msg.id}
            timeout={260}
            classNames={
              msg.sender === "user"
                ? "bubble-user"
                : "bubble-bot"
            }
          >
            <div className={`message-item ${msg.sender === "user" ? "user-item" : "bot-item"}`}>
              {/* Move timestamp and AI tag outside and above the bubble */}
              <div className="bubble-meta">
                <span className="bubble-timestamp">{formatTime(msg.timestamp || msg.id)}</span>
                {msg.sender === "bot" && <span className="ai-tag" title="AI generated content may be incorrect">AI generated</span>}
              </div>
              <div className={`chat-bubble ${msg.sender === "user" ? "user" : "bot"}`}>
                <div className="bubble-content">{msg.text}</div>
              </div>
              {msg.sender === "bot" && (
                <div className="feedback-row-outer">
                  <FeedbackButtons onFeedback={(fb) => onFeedback && onFeedback(msg.id, fb)} />
                </div>
              )}
            </div>
          </CSSTransition>
        ))}
        {/* Streaming bot message (word-by-word animation) */}
        {Array.isArray(streamingWords) && streamingWords.length > 0 && (
          <CSSTransition key="streaming" timeout={260} classNames="bubble-bot">
            <div className="message-item bot-item">
              <div className="bubble-meta">
                <span className="bubble-timestamp">{formatTime(Date.now())}</span>
                <span className="ai-tag" title="AI generated content may be incorrect">AI generated</span>
              </div>
              <div className="chat-bubble bot streaming">
                <div className="bubble-content streaming-text">
                  {streamingWords.map((w, i) => (
                    <span key={i} className="streaming-word" style={{
                      opacity: 0,
                      animation: `fade-in-word 0.33s ${i * 0.07}s forwards`
                    }}>{w}</span>
                  ))}
                  <span className="blinking-cursor" />
                </div>
              </div>
            </div>
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
}

export default ChatWindow;