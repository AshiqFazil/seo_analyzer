import React from 'react';
import { motion } from 'framer-motion';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SEOResults = ({ results }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusIcon = (score) => {
    if (score >= 80) return 'fas fa-check-circle status-good';
    if (score >= 60) return 'fas fa-exclamation-triangle status-warning';
    return 'fas fa-times-circle status-error';
  };

  const pieData = {
    labels: ['SEO Score', 'Needs Improvement'],
    datasets: [
      {
        data: [results.seo_score, 100 - results.seo_score],
        backgroundColor: [getScoreColor(results.seo_score), '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: ['Title', 'Meta Desc', 'Headings', 'Content', 'Images', 'Links'],
    datasets: [
      {
        label: 'SEO Scores',
        data: [
          results.title?.score || 0,
          results.meta_description?.score || 0,
          results.headings?.score || 0,
          results.content?.score || 0,
          results.images?.score || 0,
          results.links?.score || 0,
        ],
        backgroundColor: '#667eea',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <motion.div 
      className="results-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Overall Score */}
      <motion.div 
        className="seo-score-card"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="score-display" style={{ color: getScoreColor(results.seo_score) }}>
          {results.seo_score}/100
        </div>
        <div className="score-label">Overall SEO Score</div>
        <div style={{ marginTop: '20px', maxWidth: '200px', margin: '20px auto 0' }}>
          <Pie data={pieData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
        </div>
      </motion.div>

      {/* Detailed Analysis */}
      <div className="results-grid">
        {/* Title Analysis */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>
            <i className={getStatusIcon(results.title?.score || 0)}></i>
            Title Tag
          </h3>
          <p><strong>Content:</strong> {results.title?.text || 'Not found'}</p>
          <p><strong>Length:</strong> {results.title?.length || 0} characters</p>
          <p><strong>Score:</strong> {Math.round(results.title?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.title?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.title?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>

        {/* Meta Description */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>
            <i className={getStatusIcon(results.meta_description?.score || 0)}></i>
            Meta Description
          </h3>
          <p><strong>Content:</strong> {results.meta_description?.text || 'Not found'}</p>
          <p><strong>Length:</strong> {results.meta_description?.length || 0} characters</p>
          <p><strong>Score:</strong> {Math.round(results.meta_description?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.meta_description?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.meta_description?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>

        {/* Headings */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3>
            <i className={getStatusIcon(results.headings?.score || 0)}></i>
            Heading Structure
          </h3>
          <p><strong>H1 Count:</strong> {results.headings?.h1_count || 0}</p>
          <p><strong>H2 Count:</strong> {results.headings?.structure?.h2?.length || 0}</p>
          <p><strong>Proper Structure:</strong> {results.headings?.proper_structure ? 'Yes' : 'No'}</p>
          <p><strong>Score:</strong> {Math.round(results.headings?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.headings?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.headings?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>

        {/* Content Analysis */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3>
            <i className={getStatusIcon(results.content?.score || 0)}></i>
            Content Quality
          </h3>
          <p><strong>Word Count:</strong> {results.content?.word_count || 0}</p>
          <p><strong>Adequate Length:</strong> {results.content?.adequate_length ? 'Yes' : 'No'}</p>
          <p><strong>Readability Score:</strong> {Math.round(results.readability?.flesch_reading_ease || 0)}</p>
          <p><strong>Score:</strong> {Math.round(results.content?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.content?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.content?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>

        {/* Images */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3>
            <i className={getStatusIcon(results.images?.score || 0)}></i>
            Image Optimization
          </h3>
          <p><strong>Total Images:</strong> {results.images?.total_images || 0}</p>
          <p><strong>With Alt Text:</strong> {results.images?.images_with_alt || 0}</p>
          <p><strong>Alt Text Ratio:</strong> {Math.round((results.images?.alt_ratio || 0) * 100)}%</p>
          <p><strong>Score:</strong> {Math.round(results.images?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.images?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.images?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>

        {/* Links */}
        <motion.div 
          className="result-card"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3>
            <i className={getStatusIcon(results.links?.score || 0)}></i>
            Link Analysis
          </h3>
          <p><strong>Total Links:</strong> {results.links?.total_links || 0}</p>
          <p><strong>Internal Links:</strong> {results.links?.internal_links || 0}</p>
          <p><strong>External Links:</strong> {results.links?.external_links || 0}</p>
          <p><strong>Score:</strong> {Math.round(results.links?.score || 0)}/100</p>
          <div className="progress-bar" style={{ marginTop: '10px' }}>
            <div 
              style={{ 
                width: `${results.links?.score || 0}%`, 
                height: '8px', 
                backgroundColor: getScoreColor(results.links?.score || 0),
                borderRadius: '4px',
                transition: 'width 1s ease'
              }}
            ></div>
          </div>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div 
        className="analysis-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        style={{ marginTop: '30px' }}
      >
        <h2 className="section-title">
          <i className="fas fa-chart-bar" style={{ marginRight: '10px', color: '#667eea' }}></i>
          SEO Metrics Overview
        </h2>
        <div className="chart-container">
          <Bar data={barData} options={chartOptions} />
        </div>
      </motion.div>

      {/* AI Suggestions */}
      {results.ai_suggestions && (
        <motion.div 
          className="analysis-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          style={{ marginTop: '30px' }}
        >
          <h2 className="section-title">
            <i className="fas fa-robot" style={{ marginRight: '10px', color: '#667eea' }}></i>
            AI-Powered Suggestions
          </h2>
          
          {/* Priority Issues */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              <i className="fas fa-exclamation-circle" style={{ marginRight: '8px', color: '#ef4444' }}></i>
              Priority Issues
            </h3>
            <div className="results-grid">
              {results.ai_suggestions.priority_issues?.map((issue, index) => (
                <motion.div 
                  key={index}
                  className="result-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  style={{ 
                    borderLeft: `4px solid ${
                      issue.difficulty === 'easy' ? '#10b981' :
                      issue.difficulty === 'medium' ? '#f59e0b' : '#ef4444'
                    }`
                  }}
                >
                  <h4 style={{ color: '#333', marginBottom: '10px' }}>
                    <i className="fas fa-tools" style={{ marginRight: '8px' }}></i>
                    {issue.issue}
                  </h4>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>Recommendation:</strong> {issue.recommendation}
                  </p>
                  <p style={{ marginBottom: '8px' }}>
                    <strong>Expected Impact:</strong> {issue.impact}
                  </p>
                  <span 
                    style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: 
                        issue.difficulty === 'easy' ? '#10b981' :
                        issue.difficulty === 'medium' ? '#f59e0b' : '#ef4444'
                    }}
                  >
                    {issue.difficulty.toUpperCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Wins */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#333', marginBottom: '15px' }}>
              <i className="fas fa-zap" style={{ marginRight: '8px', color: '#10b981' }}></i>
              Quick Wins
            </h3>
            <div style={{ 
              background: '#f0f9ff', 
              padding: '20px', 
              borderRadius: '10px',
              border: '1px solid #e0f2fe'
            }}>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {results.ai_suggestions.quick_wins?.map((win, index) => (
                  <motion.li 
                    key={index}
                    style={{ 
                      padding: '8px 0', 
                      borderBottom: index < results.ai_suggestions.quick_wins.length - 1 ? '1px solid #e0f2fe' : 'none'
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                  >
                    <i className="fas fa-check" style={{ color: '#10b981', marginRight: '10px' }}></i>
                    {win}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overall Assessment */}
          <motion.div 
            style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '10px',
              borderLeft: '4px solid #667eea'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <h4 style={{ color: '#333', marginBottom: '10px' }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#667eea' }}></i>
              Overall Assessment
            </h4>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              {results.ai_suggestions.overall_assessment}
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Technical Details */}
      <motion.div 
        className="analysis-section"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        style={{ marginTop: '30px' }}
      >
        <h2 className="section-title">
          <i className="fas fa-code" style={{ marginRight: '10px', color: '#667eea' }}></i>
          Technical Details
        </h2>
        
        <div className="results-grid">
          <div className="result-card">
            <h4>Meta Tags</h4>
            <p>Viewport: {results.technical?.meta_viewport ? '✅ Present' : '❌ Missing'}</p>
            <p>Charset: {results.technical?.meta_charset ? '✅ Present' : '❌ Missing'}</p>
          </div>
          
          <div className="result-card">
            <h4>Readability</h4>
            <p>Flesch Reading Ease: {Math.round(results.readability?.flesch_reading_ease || 0)}</p>
            <p>Grade Level: {Math.round(results.readability?.flesch_kincaid_grade || 0)}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SEOResults;

       