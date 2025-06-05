import React, { useState } from "react";
import { ThemeProvider, ThemeContext } from "./themeContext";
import Header from "./components/js/Header";
import ChatWindow from "./components/js/ChatWindow";
import MessageInput from "./components/js/MessageInput";
import LandingPage from "./components/js/LandingPage";
import "./components/css/App.css";
// import ThreeJSBackground from "../src/components/js/Three";

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: Date.now() },
  ]);
  const [streamingMsg, setStreamingMsg] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [streamingWords, setStreamingWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const username = "DN"; 

  const initialMessages = [
    { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: Date.now() },
  ];

  const handleNewSession = () => {
    setMessages(initialMessages);
    setStreamingWords([]);
    setChatActive(false);
    setIsLoading(false);
  };

  const handleGoHome = () => {
    setChatActive(false);
    setMessages(initialMessages);
    setStreamingWords([]);
    setStreamingMsg("");
    setIsLoading(false);
  };

  // Feedback handler (can be expanded to store feedback)
  const handleFeedback = (msgId, feedback) => {
    // For demo: just log it. In production, send to backend.
    console.log(`Feedback for message ${msgId}:`, feedback);
  };

  // Mock responses for different types of queries
  const generateMockResponse = (userText) => {
    const responses = [
      "Thank you for your question about " + userText.toLowerCase() + ". Let me provide you with a comprehensive answer.",
      "I understand you're asking about " + userText.toLowerCase() + ". Here's what I can tell you based on the available information.",
      "That's an interesting question regarding " + userText.toLowerCase() + ". Allow me to explain this in detail.",
      "I'd be happy to help you with " + userText.toLowerCase() + ". Let me break this down for you step by step.",
      "Great question! Regarding " + userText.toLowerCase() + ", there are several important aspects to consider.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

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

    // Start loading state
    setIsLoading(true);
    
    // Simulate API thinking time (1-3 seconds like real AI)
    const thinkingTime = 1200 + Math.random() * 1800;
    
    setTimeout(() => {
      setIsLoading(false);
      
      // Generate a more realistic response
      const botText = generateMockResponse(text);
      const words = botText.split(/(\s+)/); // keep spaces for natural flow
      let idx = 0;
      setStreamingMsg("");
      setStreamingWords([]);
      
      const streamNextWord = () => {
        if (idx < words.length) {
          setStreamingWords((prev) => [...prev, words[idx]]);
          idx++;
          // Variable timing for more natural feel (40-120ms per word)
          const wordDelay = 40 + Math.random() * 80;
          setTimeout(streamNextWord, wordDelay);
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
      
      // Start streaming immediately after loading
      streamNextWord();
    }, thinkingTime);
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
                      isLoading={isLoading}
                    />
                    <MessageInput onSendMessage={handleSendMessage} disabled={isLoading || streamingWords.length > 0} />
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