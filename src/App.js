import React, { useState, useEffect } from "react";
import { ThemeProvider, ThemeContext } from "./themeContext";
import Header from "./components/js/Header";
import ChatWindow from "./components/js/ChatWindow";
import MessageInput from "./components/js/MessageInput";
import LandingPage from "./components/js/LandingPage";
import "./components/css/App.css";
// import ThreeJSBackground from "../src/components/js/Three";


function App() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });

  const [chatActive, setChatActive] = useState(() => {
    const saved = localStorage.getItem("chatActive");
    return saved === "true";
  });

  const [streamingMsg, setStreamingMsg] = useState("");
  const [streamingWords, setStreamingWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const username = "DN";
  const initialMessages = [];


  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatActive", chatActive.toString());
  }, [chatActive]);

  const handleNewSession = () => {
    const greetingMsg = {
      id: Date.now(),
      text: "Hello, how can I help?",
      sender: "bot",
      timestamp: Date.now(),
    };

    setMessages([greetingMsg]);      
    setStreamingWords([]);          
    setStreamingMsg("");            
    setChatActive(true);         
    setIsLoading(false);           

    localStorage.setItem("chatMessages", JSON.stringify([greetingMsg]));
    localStorage.setItem("chatActive", "true");
  };



  const handleGoHome = () => {
    setChatActive(false);
    setMessages(initialMessages);
    setStreamingWords([]);
    setStreamingMsg("");
    setIsLoading(false);
    localStorage.removeItem("chatMessages");
    localStorage.removeItem("chatActive");
  };

  const handleFeedback = (msgId, feedback) => {
    console.log(`Feedback for message ${msgId}:`, feedback);
  };

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

    setIsLoading(true);

    const thinkingTime = 1200 + Math.random() * 1800;

    setTimeout(() => {
      setIsLoading(false);

      const botText = generateMockResponse(text);
      const words = botText.split(/(\s+)/);
      let idx = 0;

      setStreamingMsg("");
      setStreamingWords([]);

      const streamNextWord = () => {
        if (idx < words.length) {
          setStreamingWords((prev) => [...prev, words[idx]]);
          idx++;
          const wordDelay = 40 + Math.random() * 80;
          setTimeout(streamNextWord, wordDelay);
        } else {
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
