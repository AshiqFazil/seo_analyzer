import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEOResults from './SEOResults';
import api from '../utils/api';
import Chatbot from './Chatbot';

const Dashboard = ({ user, onLogout }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showRecentAnalyses, setShowRecentAnalyses] = useState(false);

  const quickAnalyzeSites = [
    { name: 'Google India', url: 'https://google.co.in', icon: 'https://google.co.in/favicon.ico' },
    { name: 'GitHub', url: 'https://github.com', icon: 'https://github.com/favicon.ico' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'https://stackoverflow.com/favicon.ico' },
    { name: 'Amazon India', url: 'https://amazon.in', icon: 'https://amazon.in/favicon.ico' },
    { name: 'Reddit', url: 'https://reddit.com', icon: 'https://reddit.com/favicon.ico' },
    { name: 'YouTube', url: 'https://youtube.com', icon: 'https://youtube.com/favicon.ico' }
  ];

  useEffect(() => {
    loadRecentAnalyses();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light'); // Always set to light
  }, []);

  const loadRecentAnalyses = async () => {
    try {
      const response = await api.get('/history');
      setRecentAnalyses(response.data);
    } catch (error) {
      console.error('Failed to load recent analyses:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post('/analyze', { url: url.trim() });
      setResults(response.data);
      loadRecentAnalyses();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to analyze the URL');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAnalyze = async (siteUrl) => {
    setUrl(siteUrl);
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post('/analyze', { url: siteUrl });
      setResults(response.data);
      loadRecentAnalyses();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to analyze the URL');
    } finally {
      setLoading(false);
    }
  };

  const handleReanalyze = async (analysisUrl) => {
    setUrl(analysisUrl);
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await api.post('/analyze', { url: analysisUrl });
      setResults(response.data);
      loadRecentAnalyses();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to analyze the URL');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!results) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>SEO Analysis Report - ${results.url}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #667eea; padding-bottom: 20px; }
            .score { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
            .section { margin: 25px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
            .metric { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
            .metric strong { color: #333; }
            .progress-bar { width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; margin-top: 5px; }
            .progress-fill { height: 100%; border-radius: 4px; transition: width 1s ease; }
            .good { background: #10b981; }
            .warning { background: #f59e0b; }
            .poor { background: #ef4444; }
            .details { font-size: 0.9rem; color: #666; margin-top: 5px; }
            .summary { background: #667eea; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .recommendations { background: #f0f9ff; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>SEO Analysis Report</h1>
            <p><strong>URL:</strong> ${results.url}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="summary">
            <h2>Overall Performance</h2>
            <div class="score">${results.seo_score}/100</div>
            <p>${results.seo_score >= 80 ? 'Excellent SEO performance!' : results.seo_score >= 60 ? 'Good SEO with room for improvement' : 'Needs significant SEO optimization'}</p>
          </div>
          
          <div class="section">
            <h2>Title Tag Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.title?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.title?.score >= 80 ? 'good' : results.title?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.title?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>Content:</strong> "${results.title?.text || 'Not found'}"
              <div class="details">Length: ${results.title?.length || 0} characters (Optimal: 50-60)</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Meta Description Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.meta_description?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.meta_description?.score >= 80 ? 'good' : results.meta_description?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.meta_description?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>Content:</strong> "${results.meta_description?.text || 'Not found'}"
              <div class="details">Length: ${results.meta_description?.length || 0} characters (Optimal: 150-160)</div>
            </div>
          </div>
          
          <div class="section">
            <h2>Heading Structure Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.headings?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.headings?.score >= 80 ? 'good' : results.headings?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.headings?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>H1 Count:</strong> ${results.headings?.h1_count || 0} (Should be 1)
            </div>
            <div class="metric">
              <strong>H2 Count:</strong> ${results.headings?.structure?.h2?.length || 0}
            </div>
            <div class="metric">
              <strong>Proper Structure:</strong> ${results.headings?.proper_structure ? 'Yes' : 'No'}
            </div>
          </div>
          
          <div class="section">
            <h2>Content Quality Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.content?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.content?.score >= 80 ? 'good' : results.content?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.content?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>Word Count:</strong> ${results.content?.word_count || 0} words
            </div>
            <div class="metric">
              <strong>Adequate Length:</strong> ${results.content?.adequate_length ? 'Yes' : 'No'}
            </div>
            <div class="metric">
              <strong>Readability Score:</strong> ${Math.round(results.readability?.flesch_reading_ease || 0)} (Flesch Reading Ease)
            </div>
          </div>
          
          <div class="section">
            <h2>Image Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.images?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.images?.score >= 80 ? 'good' : results.images?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.images?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>Image Count:</strong> ${results.images?.count || 0}
            </div>
            <div class="metric">
              <strong>Images with Alt Text:</strong> ${results.images?.with_alt || 0}/${results.images?.count || 0}
            </div>
          </div>
          
          <div class="section">
            <h2>Link Analysis</h2>
            <div class="metric">
              <strong>Score:</strong> ${results.links?.score || 0}/100
              <div class="progress-bar">
                <div class="progress-fill ${results.links?.score >= 80 ? 'good' : results.links?.score >= 60 ? 'warning' : 'poor'}" style="width: ${results.links?.score || 0}%"></div>
              </div>
            </div>
            <div class="metric">
              <strong>Total Links:</strong> ${results.links?.count || 0}
            </div>
            <div class="metric">
              <strong>Internal Links:</strong> ${results.links?.internal || 0}
            </div>
            <div class="metric">
              <strong>External Links:</strong> ${results.links?.external || 0}
            </div>
          </div>
          
          <div class="recommendations">
            <h2>Key Recommendations</h2>
            <ul>
              ${results.seo_score < 80 ? '<li>Optimize title tag length (50-60 characters)</li>' : ''}
              ${results.meta_description?.score < 80 ? '<li>Improve meta description (150-160 characters)</li>' : ''}
              ${results.headings?.h1_count !== 1 ? '<li>Ensure exactly one H1 tag per page</li>' : ''}
              ${results.content?.word_count < 300 ? '<li>Increase content length for better SEO</li>' : ''}
              ${results.images?.with_alt < results.images?.count ? '<li>Add alt text to all images</li>' : ''}
              <li>Regularly monitor and update your SEO strategy</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 40px; color: #666; font-size: 0.9rem;">
            <p>Generated by SEO Analyzer Pro - AI-Powered SEO Analysis Tool</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
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
    <div className="dashboard" style={{ 
      minHeight: '100vh',
      background: 'var(--primary-gradient)',
      position: 'relative'  
    }}>
      {}
      <Chatbot username={user.username} seoReport={results} />
      <header className="dashboard-header">
        <div className="header-content">
          <motion.div 
            className="logo"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <path d="M20 20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M8 8L12 12" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                <path d="M8 20L12 16" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                <path d="M20 8L16 12" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.8"/>
                <path d="M12 14L14 16L16 12" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>SEO Analyzer Pro</span>
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
          style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-xl)',
            padding: '40px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)'
          }}
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
                  <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                    <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                    <path d="M20 20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M8 8L12 12" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M8 20L12 16" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M20 8L16 12" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                    <circle cx="14" cy="14" r="3" fill="currentColor" opacity="0.8"/>
                    <path d="M12 14L14 16L16 12" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Analyze SEO
                </>
              )}
            </button>
          </form>

          <div className="quick-analyze-section">
            <h4 style={{ color: '#333', marginBottom: '15px', fontSize: '1.1rem' }}>
              <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
              Quick Analyze Popular Sites
            </h4>
            <div className="quick-analyze-grid">
              {quickAnalyzeSites.map((site, index) => (
                <motion.button
                  key={site.name}
                  onClick={() => handleQuickAnalyze(site.url)}
                  className="quick-analyze-btn"
                  disabled={loading}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="site-icon"><img src={site.icon} alt={site.name} style={{ width: '20px', height: '20px' }} /></span>
                  <span className="site-name">{site.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

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

        <motion.section 
          className="recent-analyses-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            background: 'var(--bg-primary)',
            borderRadius: 'var(--border-radius-xl)',
            padding: '40px',
            marginBottom: '30px',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 className="section-title">
              <i className="fas fa-history" style={{ marginRight: '10px', color: '#667eea' }}></i>
              Recent Analyses
            </h2>
            <button 
              onClick={() => setShowRecentAnalyses(!showRecentAnalyses)}
              className="toggle-btn"
              style={{
                background: 'var(--primary-gradient)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'all var(--transition-normal)'
              }}
            >
              <i className={`fas fa-chevron-${showRecentAnalyses ? 'up' : 'down'}`} style={{ marginRight: '5px' }}></i>
              {showRecentAnalyses ? 'Hide' : 'Show'} Recent
            </button>
          </div>
          
          {showRecentAnalyses && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 }
              }}
              style={{ overflow: 'hidden' }}
            >
              {loadingHistory ? (
                <motion.div 
                  style={{ textAlign: 'center', padding: '40px', color: '#666' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                  <p>Loading recent analyses...</p>
                </motion.div>
              ) : recentAnalyses.length > 0 ? (
                <motion.div 
                  className="recent-analyses-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {recentAnalyses.map((analysis, index) => (
                    <motion.div
                      key={analysis.id}
                      className="recent-analysis-card"
                      initial={{ opacity: 0, x: -20, y: 10 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      transition={{ 
                        delay: 0.4 + index * 0.1,
                        duration: 0.4,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="analysis-header">
                        <h4 className="analysis-url">{analysis.url}</h4>
                        <div className="analysis-score" style={{ color: analysis.seo_score >= 80 ? '#10b981' : analysis.seo_score >= 60 ? '#f59e0b' : '#ef4444' }}>
                          {analysis.seo_score}/100
                        </div>
                      </div>
                      <div className="analysis-date">{analysis.created_at}</div>
                      <button 
                        onClick={() => handleReanalyze(analysis.url)}
                        className="reanalyze-btn"
                        disabled={loading}
                      >
                        <i className="fas fa-refresh" style={{ marginRight: '5px' }}></i>
                        Reanalyze
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  style={{ textAlign: 'center', padding: '40px', color: '#666' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <i className="fas fa-chart-line" style={{ fontSize: '3rem', marginBottom: '15px', opacity: 0.5 }}></i>
                  <p>No recent analyses yet. Start by analyzing a website above!</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.section>

        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ marginTop: '30px' }}
          >
            <div className="export-buttons" style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button onClick={exportToPDF} className="export-btn pdf-btn">
                <i className="fas fa-file-pdf" style={{ marginRight: '8px' }}></i>
                Download Report
              </button>
            </div>
            <SEOResults results={results} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;