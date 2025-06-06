import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEOResults from './SEOResults';
import api from '../utils/api';

const Dashboard = ({ user, onLogout }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post('/analyze', { url: url.trim() });
      setResults(response.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to analyze the URL');
    } finally {
      setLoading(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <i className="fas fa-chart-line" style={{ marginRight: '10px' }}></i>
            SEO Analyzer
          </motion.div>
          
          <motion.div 
            className="user-info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span>
              <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
              Welcome, {user.username}!
            </span>
            <button onClick={onLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
              Logout
            </button>
          </motion.div>
        </div>
      </header>

      <main className="dashboard-content">
        <motion.section 
          className="analysis-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="section-title">
            <i className="fas fa-search" style={{ marginRight: '10px', color: '#667eea' }}></i>
            Analyze Your Website
          </h2>
          
          <form onSubmit={handleAnalyze} className="url-input-container">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., https://example.com)"
              className="url-input"
              required
            />
            <button 
              type="submit" 
              className="analyze-btn"
              disabled={loading || !isValidUrl(url)}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket" style={{ marginRight: '8px' }}></i>
                  Analyze SEO
                </>
              )}
            </button>
          </form>

          {error && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }}></i>
              {error}
            </motion.div>
          )}

          <div className="tips-section" style={{ marginTop: '20px', padding: '20px', background: '#f8f9fa', borderRadius: '10px' }}>
            <h4 style={{ color: '#333', marginBottom: '10px' }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#ffc107' }}></i>
              Quick Tips:
            </h4>
            <ul style={{ color: '#666', lineHeight: '1.6' }}>
              <li>• Make sure to include the full URL</li>
              <li>• The website should be publicly accessible</li>
              <li>• Analysis may take 10-30 seconds depending on page size</li>
              <li>• We'll check title tags, meta descriptions, headings, and more!</li>
            </ul>
          </div>
        </motion.section>

        {results && <SEOResults results={results} />}
      </main>
    </div>
  );
};

export default Dashboard;