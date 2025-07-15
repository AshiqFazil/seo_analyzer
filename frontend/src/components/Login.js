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
    <div className="clean-auth-container">
      {}
      <div className="moving-gradient-background">
        <div className="gradient-layer layer-1"></div>
        <div className="gradient-layer layer-2"></div>
        <div className="gradient-layer layer-3"></div>
      </div>

      {}
      <div className="background-designs">
        <div className="design-element element-1"></div>
        <div className="design-element element-2"></div>
        <div className="design-element element-3"></div>
        <div className="design-element element-4"></div>
        <div className="design-element element-5"></div>
        <div className="design-element element-6"></div>
      </div>

      {}
      <div className="background-media">
        <div className="background-overlay"></div>
      </div>

      {}
      <div className="floating-elements">
        <motion.div 
          className="floating-circle circle-1"
          animate={{
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="floating-circle circle-2"
          animate={{
            y: [0, 25, 0],
            scale: [1, 0.8, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="floating-circle circle-3"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        {}
        <motion.div 
          className="animated-line line-1"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="animated-line line-2"
          animate={{
            scaleX: [0, 1, 0],
            opacity: [0, 0.4, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <motion.div 
        className="clean-auth-card"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="clean-auth-header">
          <motion.div
            className="clean-logo-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="clean-logo-icon">
              <img src={require('../assets/Logo.png')} alt="SEO Analyzer Logo" className="logo-img" />
            </div>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="clean-title"
          >
            SEO Analyzer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="clean-subtitle"
          >
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </motion.p>
        </div>

        {message.text && (
          <motion.div 
            className={`clean-message ${message.type === 'error' ? 'error' : 'success'}`}
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
          >
            {message.text}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="clean-auth-form" autoComplete="off">
          <motion.div 
            className="clean-form-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.label 
              htmlFor="username"
              className="clean-label"
            >
              Username
            </motion.label>
            <motion.div className="clean-input-container">
            <motion.input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
                className="clean-input"
              required
              placeholder="Enter your username"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
              <div className="clean-input-border"></div>
            </motion.div>
          </motion.div>

          {!isLogin && (
            <div className="clean-form-group">
              <label htmlFor="email" className="clean-label">
                Email
              </label>
              <div className="clean-input-container">
                <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                  className="clean-input"
                required
                placeholder="Enter your email"
              />
                <div className="clean-input-border"></div>
              </div>
            </div>
          )}

          <motion.div 
            className="clean-form-group"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: isLogin ? 0.8 : 0.7, duration: 0.6 }}
          >
            <motion.label 
              htmlFor="password"
              className="clean-label"
            >
              Password
            </motion.label>
            <motion.div className="clean-input-container">
            <motion.input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
                className="clean-input"
              required
              placeholder="Enter your password"
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            />
              <div className="clean-input-border"></div>
            </motion.div>
          </motion.div>

          <motion.button
            type="submit"
            className="unique-auth-button"
            disabled={loading}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: isLogin ? 0.9 : 0.8, duration: 0.6 }}
            whileHover={{ 
              scale: 1.08,
              rotate: [0, -2, 2, 0],
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.92 }}
          >
            {loading ? (
              <span className="unique-button-content">
                <motion.div
                  className="unique-loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </span>
            ) : (
              <span className="unique-button-content">
                <svg className="unique-button-icon" viewBox="0 0 24 24" fill="none">
                  {isLogin ? (
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  )}
                </svg>
                {isLogin ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </motion.button>
        </form>

        <motion.div 
          className="clean-auth-toggle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <span className="clean-toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <motion.button 
            type="button" 
            onClick={toggleMode}
            className="clean-toggle-button"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 1, -1, 0],
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;