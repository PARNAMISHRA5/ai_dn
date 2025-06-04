import React, { useState } from "react";
import { ThemeProvider, ThemeContext } from "./themeContext";
import Header from "./components/js/Header";
import ChatWindow from "./components/js/ChatWindow";
import MessageInput from "./components/js/MessageInput";
import LandingPage from "./components/js/LandingPage";
import "./components/css/App.css";

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: Date.now() },
  ]);
  const [streamingMsg, setStreamingMsg] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [streamingWords, setStreamingWords] = useState([]);
  const username = "DN"; // Replace with auth logic if needed

  const initialMessages = [
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: Date.now() },
  ];

  const handleNewSession = () => {
    setMessages(initialMessages);
    setStreamingWords([]);
    setChatActive(false);
  };

  const handleGoHome = () => {
    setChatActive(false);
    setMessages(initialMessages);
    setStreamingWords([]);
    setStreamingMsg("");
  };

  // Feedback handler (can be expanded to store feedback)
  const handleFeedback = (msgId, feedback) => {
    // For demo: just log it. In production, send to backend.
    console.log(`Feedback for message ${msgId}:`, feedback);
  };

  // Streaming/scrolling word-by-word bot response
  const handleSendMessage = (text) => {
    if (!chatActive) setChatActive(true);
    if (!text.trim()) return;
    const now = Date.now();
    const userMsg = {
      id: now,
      text,
      sender: "user",
      timestamp: now,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Mock streaming bot response (word-by-word)
    const botText = `You said: "${text}"`;
    const words = botText.split(/(\s+)/); // keep spaces for natural flow
    let idx = 0;
    setStreamingMsg("");
    setStreamingWords([]);
    const streamNextWord = () => {
      if (idx < words.length) {
        setStreamingWords((prev) => [...prev, words[idx]]);
        idx++;
        setTimeout(streamNextWord, 80 + Math.random() * 60);
      } else {
        // When done, add to messages and clear streaming
        const botNow = Date.now();
        setMessages((prev) => [
          ...prev,
          {
            id: botNow,
            text: botText,
            sender: "bot",
            timestamp: botNow,
          },
        ]);
        setStreamingMsg("");
        setStreamingWords([]);
      }
    };
    setTimeout(streamNextWord, 420); // Simulate thinking delay
  };

  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <div className="background-fade-container">
            <div className={`app-container ${theme} ${!chatActive ? 'layout-landing' : 'layout-chat'}`}>
              {!chatActive ? (
                <div className="landing-layout">
                  <LandingPage showWelcomeMessage={!chatActive} />
                  <div className="landing-input-container">
                    <MessageInput onSendMessage={handleSendMessage} />
                  </div>
                </div>
              ) : (
                <>
                  <Header 
                    username={username} 
                    onNewSession={handleNewSession} 
                    onGoHome={handleGoHome}
                  />
                  <div className="chat-main">
                    <ChatWindow 
                      messages={messages} 
                      streamingWords={streamingWords} 
                      onFeedback={handleFeedback} 
                    />
                    <MessageInput onSendMessage={handleSendMessage} />
                  </div>
                </>
              )}
            </div>
          </div>  
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  );
}

export default App;