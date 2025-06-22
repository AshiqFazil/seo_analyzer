import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      if (isLogin) {
        const response = await api.post('/login', {
          username: formData.username,
          password: formData.password
        });
        
        onLogin(response.data.token, response.data.user);
        setMessage({ text: 'Login successful!', type: 'success' });
      } else {
        await api.post('/register', formData);
        setMessage({ text: 'Registration successful! Please login.', type: 'success' });
        setIsLogin(true);
        setFormData({ username: '', email: '', password: '' });
      }
    } catch (error) {
      setMessage({ 
        text: error.response?.data?.error || 'An error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '' });
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <i className="fas fa-search" style={{ marginRight: '10px', color: '#667eea' }}></i>
            SEO Analyzer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </motion.p>
        </div>

        {message.text && (
          <motion.div 
            className={message.type === 'error' ? 'error-message' : 'success-message'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your username"
<<<<<<< HEAD
                autoComplete="new-username"
=======
              autoComplete="new-username"
>>>>>>> 8998309 (Fix: disable browser autofill again  on login form)
            />
          </motion.div>

          {!isLogin && (
            <motion.div 
              className="form-group"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </motion.div>
          )}

          <motion.div 
            className="form-group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
              placeholder="Enter your password"
<<<<<<< HEAD
=======
              autoComplete="new-password"
>>>>>>> 8998309 (Fix: disable browser autofill again  on login form)
              
            />
          </motion.div>

          <motion.button
            type="submit"
            className="auth-button"
            disabled={loading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              <span>
                <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`} style={{ marginRight: '8px' }}></i>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </motion.button>
        </form>

        <motion.div 
          className="auth-toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={toggleMode}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
