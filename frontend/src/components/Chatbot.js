import React, { useState, useRef } from 'react';
import { FaComments, FaTimes, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import api from '../utils/api';

const Chatbot = ({ username, seoReport }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

 
  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: `Hello ${username}! I am Twinkle. What can I do for you?`
        }
      ]);
    }
  };

 
  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const payload = { message: input };
      if (seoReport) payload.seo_report = JSON.stringify(seoReport);
      const res = await api.post('/chatbot', payload);
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: res.data.reply }
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: 'bot', text: 'Sorry, Twinkle is having trouble responding right now.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 9999 }}>
      {!open && (
        <button
          onClick={handleOpen}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: 65,
            height: 65,
            boxShadow: '0 8px 32px rgba(102,126,234,0.3), 0 4px 16px rgba(102,126,234,0.2), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            transform: 'translateZ(0)',
            '&:hover': {
              transform: 'translateY(-4px) scale(1.05)',
              boxShadow: '0 12px 40px rgba(102,126,234,0.4), 0 6px 20px rgba(102,126,234,0.3), inset 0 1px 0 rgba(255,255,255,0.3)'
            },
            '&:active': {
              transform: 'translateY(-2px) scale(1.02)',
              boxShadow: '0 6px 24px rgba(102,126,234,0.35), 0 3px 12px rgba(102,126,234,0.25), inset 0 1px 0 rgba(255,255,255,0.2)'
            }
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-4px) scale(1.05)';
            e.target.style.boxShadow = '0 12px 40px rgba(102,126,234,0.4), 0 6px 20px rgba(102,126,234,0.3), inset 0 1px 0 rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateZ(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(102,126,234,0.3), 0 4px 16px rgba(102,126,234,0.2), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseDown={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.02)';
            e.target.style.boxShadow = '0 6px 24px rgba(102,126,234,0.35), 0 3px 12px rgba(102,126,234,0.25), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseUp={(e) => {
            e.target.style.transform = 'translateY(-4px) scale(1.05)';
            e.target.style.boxShadow = '0 12px 40px rgba(102,126,234,0.4), 0 6px 20px rgba(102,126,234,0.3), inset 0 1px 0 rgba(255,255,255,0.3)';
          }}
          aria-label="Open Twinkle chatbot"
        >
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 50%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }} />
          <FaComments style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            zIndex: 1,
            position: 'relative'
          }} />
        </button>
      )}
      {open && (
        <div
          style={{
            width: 380,
            height: 600,
            background: 'white',
            borderRadius: 20,
            boxShadow: '0 12px 40px rgba(102,126,234,0.25), 0 6px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(102,126,234,0.1)'
          }}
        >
          {}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '18px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }}>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '16px' }}>
              <FaRobot style={{ marginRight: 10, fontSize: '18px' }} /> Twinkle
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer', padding: '4px' }}
              aria-label="Close Twinkle chatbot"
            >
              <FaTimes />
            </button>
          </div>
          {}
          <div style={{ flex: 1, padding: 20, overflowY: 'auto', background: '#f8f9fa', maxHeight: '400px' }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 16
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e0e7ff',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    borderRadius: 16,
                    padding: '12px 16px',
                    fontSize: 15,
                    lineHeight: '1.4',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(102,126,234,0.08)' : '0 1px 3px rgba(0,0,0,0.1)',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                >
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', marginLeft: 6, color: '#667eea', fontSize: 15, padding: '8px 0' }}>
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
          {}
          <form onSubmit={handleSend} style={{ display: 'flex', padding: 16, borderTop: '1px solid #e5e7eb', background: '#fff', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              style={{
                flex: 1,
                border: '1px solid #e1e5e9',
                outline: 'none',
                fontSize: 15,
                padding: '12px 16px',
                borderRadius: 12,
                background: '#f9fafb',
                marginRight: 12,
                transition: 'all 0.2s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e1e5e9';
                e.target.style.background = '#f9fafb';
              }}
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '0 20px',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 48,
                transition: 'all 0.2s ease'
              }}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </button>
          </form>
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
    </div>
  );
};

export default Chatbot;
