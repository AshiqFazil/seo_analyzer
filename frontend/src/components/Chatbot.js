import React, { useState, useRef, useEffect } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaSmile, FaPlus, FaTrash, FaHistory } from 'react-icons/fa';
import api from '../utils/api';

const Chatbot = ({ username, seoReport }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const messagesEndRef = useRef(null);

  
  useEffect(() => {
    const savedHistory = localStorage.getItem(`chat_history_${username}`);
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setChatHistory(history || []);
        
        if (history && history.length > 0) {
          const mostRecentChat = history[history.length - 1];
          setCurrentChatId(mostRecentChat.id);
          setMessages(mostRecentChat.messages || []);
        } else {
          createNewChat();
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        setChatHistory([]);
        createNewChat();
      }
    } else {
      setChatHistory([]);
      createNewChat();
    }
  }, [username]);

  
  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      localStorage.setItem(`chat_history_${username}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, username]);

  
  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const generateChatName = (messages) => {
    if (!messages || messages.length === 0) return 'New Chat';
    
    
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (!firstUserMessage) return 'New Chat';
    
    const text = firstUserMessage.text;
    
    const shortName = text.length > 30 ? text.substring(0, 30) + '...' : text;
    return shortName;
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      name: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    setChatHistory(prev => [...(prev || []), newChat]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setShowSidebar(false);
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages || []);
      setShowSidebar(false);
    }
  };

  const deleteChat = (chatId) => {
    setChatHistory(prev => (prev || []).filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      
      createNewChat();
    }
  };

  const updateCurrentChat = (newMessages) => {
    setChatHistory(prev => 
      (prev || []).map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: newMessages,
              name: generateChatName(newMessages)
            }
          : chat
      )
    );
  };

  const handleOpen = () => {
    setIsAnimating(true);
    setOpen(true);
    
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 50);
    
    
    if (!messages || messages.length === 0) {
      
      const welcomeText = "Hi, I'm Twinkle, your AI SEO assistant. How can I help you today?";
      const welcomeMsg = { sender: 'bot', text: '', isTyping: true };
      setMessages([welcomeMsg]);
      updateCurrentChat([welcomeMsg]);
      
      
      setTimeout(() => {
        typeResponse(welcomeText, (text) => {
          setMessages([{ sender: 'bot', text, isTyping: false }]);
          updateCurrentChat([{ sender: 'bot', text, isTyping: false }]);
        });
      }, 300); 
    }
  };

  const handleClose = () => {
    setIsAnimating(true);
    
    
    setTimeout(() => {
      setOpen(false);
      setIsAnimating(false);
    }, 200); 
  };

  const typeResponse = async (response, setTypingMessage) => {
    const words = response.split(' ');
    let typedText = '';
    
    for (let i = 0; i < words.length; i++) {
      typedText += (i > 0 ? ' ' : '') + words[i];
      setTypingMessage(typedText);
      
      
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    
    return typedText;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    const newMessages = [...(messages || []), userMsg];
    setMessages(newMessages);
    updateCurrentChat(newMessages);
    setInput('');
    setLoading(true);
    setShowEmojiPicker(false);
    
    try {
      const payload = { message: input };
      if (seoReport) payload.seo_report = JSON.stringify(seoReport);
      const res = await api.post('/chatbot', payload);
      
      
      const typingMsg = { sender: 'bot', text: '', isTyping: true };
      const messagesWithTyping = [...newMessages, typingMsg];
      setMessages(messagesWithTyping);
      updateCurrentChat(messagesWithTyping);
      
      
      const finalResponse = await typeResponse(res.data.reply, (text) => {
        const updatedMessages = messagesWithTyping.map((msg, idx) => 
          idx === messagesWithTyping.length - 1 && msg.isTyping 
            ? { ...msg, text, isTyping: false }
            : msg
        );
        setMessages(updatedMessages);
        updateCurrentChat(updatedMessages);
      });
      
      
      const finalMessages = messagesWithTyping.map((msg, idx) => 
        idx === messagesWithTyping.length - 1 && msg.isTyping 
          ? { ...msg, text: finalResponse, isTyping: false }
          : msg
      );
      setMessages(finalMessages);
      updateCurrentChat(finalMessages);
      
    } catch (err) {
      const errorMessage = { sender: 'bot', text: 'Sorry, Twinkle is having trouble responding right now.' };
      const messagesWithError = [...newMessages, errorMessage];
      setMessages(messagesWithError);
      updateCurrentChat(messagesWithError);
    } finally {
      setLoading(false);
    }
  };

  const addEmoji = (emoji) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = [
    '😊', '😂', '🤔', '👍', '👎', '❤️', '💡', '🎯', '📈', '📉',
    '🔍', '⚡', '💪', '🎉', '🔥', '💯', '✅', '❌', '⚠️', '💬'
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            position: 'fixed',
            bottom: 40,
            right: 40,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 65,
            height: 65,
            boxShadow: '0 8px 32px rgba(102,126,234,0.3), 0 4px 16px rgba(102,126,234,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 9999
          }}
          aria-label="Open Twinkle chatbot"
        >
          <FaComments />
        </button>
      )}
      
      {open && (
        <div
          style={{
            position: 'fixed',
            top: isAnimating ? 'calc(100vh - 40px)' : '50%',
            left: isAnimating ? 'calc(100vw - 40px)' : '50%',
            transform: isAnimating 
              ? 'translate(-50%, -50%) scale(0.1)' 
              : 'translate(-50%, -50%) scale(1)',
            width: '80vw',
            height: '80vh',
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            display: 'flex',
            zIndex: 10000,
            overflow: 'hidden',
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            opacity: isAnimating ? 0 : 1
          }}
        >
          {}
          <div style={{
            width: showSidebar ? '300px' : '0px',
            background: '#f8f9fa',
            borderRight: '1px solid #e5e7eb',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e5e7eb',
              background: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px'
              }}>
                <h3 style={{ margin: 0, color: '#333', fontSize: '16px' }}>
                  <FaHistory style={{ marginRight: '8px' }} />
                  Chat History
                </h3>
                <button
                  onClick={createNewChat}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FaPlus size={12} />
                  New Chat
                </button>
              </div>
            </div>

            {}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px'
            }}>
              {(chatHistory || []).map((chat) => (
                <div
                  key={chat.id}
                  style={{
                    padding: '12px',
                    margin: '4px 0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: currentChatId === chat.id ? '#e0e7ff' : 'transparent',
                    border: currentChatId === chat.id ? '1px solid #667eea' : '1px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => loadChat(chat.id)}
                  onMouseEnter={(e) => {
                    if (currentChatId !== chat.id) {
                      e.target.style.background = '#f0f0f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentChatId !== chat.id) {
                      e.target.style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {chat.name}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '2px',
                        fontSize: '12px',
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = 1}
                      onMouseLeave={(e) => e.target.style.opacity = 0.7}
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '4px'
                  }}>
                    {formatDate(chat.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'white'
          }}>
            {}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #8b5cf6 100%)',
              color: 'white',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 2px 12px rgba(102,126,234,0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px'
              }}>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    fontSize: '16px',
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.2)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  <FaHistory />
                </button>
                <span style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  fontWeight: '700', 
                  fontSize: '20px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <FaRobot style={{ 
                    marginRight: '14px', 
                    fontSize: '24px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} /> 
                  Twinkle
                </span>
              </div>
              <button
                onClick={handleClose}
                style={{ 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', 
                  fontSize: '20px', 
                  cursor: 'pointer', 
                  padding: '10px',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.1)';
                  e.target.style.transform = 'scale(1)';
                }}
                aria-label="Close Twinkle chatbot"
              >
                <FaTimes />
              </button>
            </div>

            {}
            <div style={{ 
              flex: 1, 
              padding: '24px', 
              overflowY: 'auto', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative'
            }}>
              {}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.25,
                pointerEvents: 'none',
                zIndex: 0
              }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <FaRobot style={{ 
                    fontSize: '160px', 
                    color: '#667eea',
                    marginBottom: '16px',
                    filter: 'drop-shadow(0 4px 8px rgba(102,126,234,0.3))'
                  }} />
                  <div style={{
                    fontSize: '28px',
                    color: '#667eea',
                    fontWeight: '700',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    textShadow: '0 2px 4px rgba(102,126,234,0.2)',
                    marginBottom: '8px'
                  }}>
                    Meet Twinkle
                  </div>
                  <div style={{
                    fontSize: '18px',
                    color: '#8b5cf6',
                    fontWeight: '500',
                    textAlign: 'center',
                    lineHeight: '1.4',
                    opacity: 0.8
                  }}>
                    Your AI SEO Assistant
                  </div>
                </div>
              </div>
              
              {}
              <div style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '100%',
                      marginBottom: '8px'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        background: msg.sender === 'user' 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                        color: msg.sender === 'user' ? 'white' : '#1f2937',
                        borderRadius: 20,
                        padding: '16px 20px',
                        fontSize: 15,
                        lineHeight: '1.6',
                        boxShadow: msg.sender === 'user' 
                          ? '0 4px 12px rgba(102,126,234,0.25)' 
                          : '0 2px 8px rgba(0,0,0,0.08)',
                        wordWrap: 'break-word',
                        position: 'relative',
                        border: msg.sender === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
                      {msg.isTyping && (
                        <span style={{ 
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          background: '#667eea',
                          borderRadius: '50%',
                          marginLeft: '8px',
                          animation: 'blink 1.4s infinite both'
                        }}></span>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginLeft: 6, 
                    color: '#667eea', 
                    fontSize: 15, 
                    padding: '8px 0' 
                  }}>
                    <FaRobot style={{ marginRight: 8, fontSize: '16px' }} />
                    <span>
                      <span className="typing-indicator">
                        Twinkle is typing
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                      </span>
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {}
            <div style={{ 
              padding: '24px', 
              borderTop: '1px solid rgba(0,0,0,0.08)', 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative',
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
            }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '14px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your message..."
                    style={{
                      width: '100%',
                      border: '2px solid #e2e8f0',
                      outline: 'none',
                      fontSize: 15,
                      padding: '16px 20px',
                      borderRadius: 16,
                      background: '#ffffff',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.15)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                    disabled={loading}
                    autoFocus
                  />
                  
                  {}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      fontSize: 18,
                      cursor: 'pointer',
                      color: '#667eea',
                      padding: '4px'
                    }}
                    disabled={loading}
                  >
                    <FaSmile />
                  </button>
                </div>
                
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 16,
                    padding: '16px 20px',
                    fontSize: 16,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 52,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102,126,234,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102,126,234,0.3)';
                  }}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                >
                  <FaPaperPlane />
                </button>
              </form>

              {}
              {showEmojiPicker && (
                <div style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '20px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '8px',
                  maxWidth: '300px',
                  zIndex: 10001
                }}>
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => addEmoji(emoji)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '6px',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {}
      <style>{`
        .typing-indicator .dot {
          animation: blink 1.4s infinite both;
          font-weight: bold;
        }
        .typing-indicator .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-indicator .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
