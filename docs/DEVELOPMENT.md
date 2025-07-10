# Development Guide

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git
- VS Code (recommended) or your preferred IDE

### Development Environment Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/seo_analyzer.git
cd seo_analyzer
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

4. **Environment Configuration**
```bash
# Create .env file in backend directory
cd backend
cp .env.example .env  # If example exists
# Or create manually:
echo "SECRET_KEY=your-secret-key-here" > .env
echo "GEMINI_API_KEY=your-gemini-api-key-here" >> .env
echo "GEMINI_API_KEY2=your-second-gemini-api-key-here" >> .env
```

## Development Workflow

### 1. Starting Development Servers

**Backend (Terminal 1):**
```bash
cd backend
python app.py
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

### 2. Git Workflow

**Create a new feature branch:**
```bash
git checkout -b feature/your-feature-name
```

**Make changes and commit:**
```bash
git add .
git commit -m "feat: add new feature description"
```

**Push to remote:**
```bash
git push origin feature/your-feature-name
```

**Create Pull Request:**
- Go to GitHub repository
- Click "Compare & pull request"
- Add description of changes
- Request review if working with team

### 3. Code Standards

#### Python (Backend)
- **PEP 8**: Follow Python style guide
- **Type Hints**: Use type annotations
- **Docstrings**: Document functions and classes
- **Error Handling**: Use try-except blocks appropriately

**Example:**
```python
from typing import Dict, Optional
import logging

def analyze_seo(url: str) -> Dict[str, any]:
    """
    Analyze SEO metrics for a given URL.
    
    Args:
        url (str): The URL to analyze
        
    Returns:
        Dict[str, any]: SEO analysis results
        
    Raises:
        ValueError: If URL is invalid
        ConnectionError: If website is unreachable
    """
    try:
        # Implementation here
        pass
    except Exception as e:
        logging.error(f"SEO analysis failed for {url}: {e}")
        raise
```

#### JavaScript/React (Frontend)
- **ESLint**: Follow ESLint rules
- **Prettier**: Use Prettier for formatting
- **Component Structure**: Use functional components with hooks
- **Prop Types**: Use PropTypes or TypeScript

**Example:**
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SEOResults = ({ analysis, onRefresh }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Side effects here
  }, [analysis]);
  
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="seo-results">
      {/* JSX here */}
    </div>
  );
};

SEOResults.propTypes = {
  analysis: PropTypes.object.isRequired,
  onRefresh: PropTypes.func.isRequired
};

export default SEOResults;
```

### 4. Testing

#### Backend Testing
```bash
cd backend
python -m pytest tests/
```

**Test Structure:**
```
backend/
├── tests/
│   ├── test_app.py
│   ├── test_seo_analyzer.py
│   └── test_gemini_integration.py
```

#### Frontend Testing
```bash
cd frontend
npm test
```

**Test Structure:**
```
frontend/src/
├── __tests__/
│   ├── components/
│   └── utils/
```

### 5. Database Management

#### Creating Migrations
```bash
cd backend
flask db migrate -m "Add new table"
flask db upgrade
```

#### Database Reset (Development)
```bash
cd backend
rm instance/seo_analyzer.db
python app.py  # This will recreate the database
```

### 6. API Development

#### Adding New Endpoints
1. **Define route in `app.py`:**
```python
@app.route('/api/new-endpoint', methods=['POST'])
@jwt_required()
def new_endpoint():
    try:
        data = request.get_json()
        # Implementation
        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400
```

2. **Update API documentation in `docs/API.md`**

3. **Add frontend integration in `utils/api.js`**

### 7. AI Integration

#### Adding New Gemini Features
1. **Update `gemini_integration.py`:**
```python
def new_ai_feature(prompt: str) -> str:
    """New AI feature implementation."""
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logging.error(f"AI feature failed: {e}")
        raise
```

2. **Add token tracking:**
```python
def track_tokens(response):
    """Track token usage for cost monitoring."""
    # Implementation
    pass
```

### 8. Error Handling

#### Backend Error Handling
```python
from flask import jsonify
import logging

@app.errorhandler(Exception)
def handle_exception(e):
    logging.error(f"Unhandled exception: {e}")
    return jsonify({
        'error': 'Internal server error',
        'message': 'An unexpected error occurred'
    }), 500
```

#### Frontend Error Handling
```javascript
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    console.error('API Error:', error.response.data);
    setError(error.response.data.message);
  } else if (error.request) {
    // Network error
    console.error('Network Error:', error.request);
    setError('Network error. Please check your connection.');
  } else {
    // Other error
    console.error('Error:', error.message);
    setError('An unexpected error occurred.');
  }
};
```

### 9. Performance Optimization

#### Backend Optimization
- **Database Queries**: Use SQLAlchemy efficiently
- **Caching**: Implement Redis for frequently accessed data
- **Async Operations**: Use asyncio for I/O operations

#### Frontend Optimization
- **Code Splitting**: Use React.lazy() for component loading
- **Memoization**: Use React.memo() and useMemo()
- **Bundle Optimization**: Analyze bundle size with webpack-bundle-analyzer

### 10. Security Best Practices

#### Backend Security
- **Input Validation**: Validate all user inputs
- **SQL Injection**: Use parameterized queries
- **XSS Prevention**: Sanitize user inputs
- **CORS**: Configure CORS properly

#### Frontend Security
- **XSS Prevention**: Use React's built-in XSS protection
- **API Key Security**: Never expose API keys in frontend
- **HTTPS**: Use HTTPS in production

### 11. Deployment Preparation

#### Environment Variables
```bash
# Production .env
SECRET_KEY=your-production-secret-key
GEMINI_API_KEY=your-production-api-key
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host/db
```

#### Build Process
```bash
# Frontend build
cd frontend
npm run build

# Backend preparation
cd backend
pip freeze > requirements.txt
```

### 12. Monitoring and Debugging

#### Logging
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

#### Debug Mode
```bash
# Backend debug
export FLASK_ENV=development
export FLASK_DEBUG=1

# Frontend debug
npm start  # Already in development mode
```

## Contributing Guidelines

### Pull Request Process
1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request**

### Commit Message Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Review Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No security vulnerabilities
- [ ] Performance impact considered

## Troubleshooting

### Common Issues

#### Backend Issues
- **Import Errors**: Check virtual environment activation
- **Database Errors**: Verify database file permissions
- **API Key Issues**: Check .env file configuration

#### Frontend Issues
- **Build Errors**: Clear node_modules and reinstall
- **API Connection**: Check backend server is running
- **CORS Errors**: Verify backend CORS configuration

#### AI Integration Issues
- **Token Limits**: Monitor API usage
- **Rate Limiting**: Implement exponential backoff
- **Response Errors**: Handle AI API failures gracefully 