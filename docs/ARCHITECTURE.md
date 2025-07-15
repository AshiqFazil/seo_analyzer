# System Architecture

## Overview
The SEO Analyzer is a full-stack web application built with Flask (backend) and React (frontend), powered by Google Gemini AI for intelligent SEO analysis and chatbot functionality.

## Architecture Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   Flask Backend │    │  Google Gemini  │
│                 │    │                 │    │      API        │
│  - Login/       |    |                 |    |                 |
|   Dashboard     |◄──►│  - REST API     │◄──►│  - SEO Analysis │
│  - SEOResults   │    │  - JWT Auth     │    │  - Chatbot      │
│  - Chatbot UI   │    │  - SQLite DB    │    │  - Token Usage  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌─────────────────┐
                       │   SQLite DB     │
                       │                 │
                       │  - Users        │
                       │  - Analyses     │
                       │  - Local Storage│
                       └─────────────────┘
```

## Component Architecture

### Frontend (React)
```
frontend/src/
├── components/
│   ├── Login.js          # User authentication and registration
│   ├── Dashboard.js      # Main application interface
│   ├── SEOResults.js     # SEO analysis results display
│   └── Chatbot.js        # AI chatbot interface
├── utils/
│   └── api.js           # API communication utilities
├── App.js               # Main React application
└── App.css              # Global styles and animations
```

### Backend (Flask)
```
backend/
├── app.py               # Main Flask application with routes
├── database.py          # SQLite database models and setup
├── seo_analyzer.py      # Core SEO analysis logic
├── gemini_integration.py # Gemini AI for SEO suggestions
├── gemini_chatbot.py    # AI chatbot implementation
├── requirements.txt     # Python dependencies
└── instance/           # SQLite database files
```

## Data Flow

### 1. User Authentication Flow
```
Login Form → React (Login.js) → API Call → Flask (app.py) → SQLite DB → JWT Token → Local Storage
```

### 2. SEO Analysis Flow
```
URL Input → Dashboard.js → API Call → app.py → seo_analyzer.py → gemini_integration.py → SQLite DB → SEOResults.js
```

### 3. Chatbot Flow
```
Chat Input → Chatbot.js → API Call → app.py → gemini_chatbot.py → Gemini API → Response → Chatbot.js
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Analyses Table
```sql
CREATE TABLE analyses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    url VARCHAR(500) NOT NULL,
    seo_score INTEGER,
    analysis_data TEXT,  -- JSON string
    ai_suggestions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

### Chat History Storage
Chat history is stored locally in the browser using localStorage for each user. This provides:
- **User-specific storage**: Each user's chat history is isolated
- **Persistent sessions**: Chat history persists across browser sessions
- **No server storage**: Reduces database complexity and storage requirements
- **Privacy**: Chat data stays on the user's device

**LocalStorage Structure:**
```javascript
// Key format: chat_history_${username}
// Value: JSON array of chat objects
[
  {
    id: "timestamp",
    name: "Chat name",
    messages: [
      { sender: "user", text: "message" },
      { sender: "bot", text: "response" }
    ],
    createdAt: "ISO date string"
  }
]
```

## Security Architecture

### Authentication
- **JWT Tokens**: Stateless authentication with JSON Web Tokens
- **Password Hashing**: Secure password storage using bcrypt
- **Session Management**: Automatic token refresh and expiry

### API Security
- **CORS**: Cross-origin resource sharing configuration
- **Input Validation**: Request data sanitization and validation
- **Rate Limiting**: API call limits to prevent abuse

### Data Protection
- **Environment Variables**: Sensitive data stored in .env files
- **API Key Management**: Separate keys for different services
- **Database Security**: SQL injection prevention with SQLAlchemy

## AI Integration

### Gemini AI Usage
- **SEO Analysis**: Content analysis and recommendations
- **Chatbot**: Intelligent responses with context awareness
- **Token Tracking**: Usage monitoring and cost control

### AI Models
- **Gemini 1.5 Flash**: Fast, efficient responses for chatbot
- **Gemini 1.5 Pro**: Detailed analysis for SEO recommendations

## Performance Considerations

### Frontend Optimization
- **Component Lazy Loading**: Code splitting for better performance
- **State Management**: Efficient React state updates
- **API Caching**: Client-side caching of responses

### Backend Optimization
- **Database Indexing**: Optimized queries for user data
- **Connection Pooling**: Efficient database connections
- **Error Handling**: Graceful error recovery

### Scalability
- **Stateless Design**: Easy horizontal scaling
- **Modular Architecture**: Independent component scaling
- **API Versioning**: Future-proof API design

## Deployment Architecture

### Development Environment
```
Local Machine:
├── React Dev Server (Port 3000)
├── Flask Dev Server (Port 5000)
└── SQLite Database (Local file)
```

### Production Environment
```
Web Server:
├── Nginx/Apache (Reverse proxy)
├── Gunicorn (WSGI server)
├── Flask Application
└── PostgreSQL/MySQL (Production DB)
```

## Monitoring and Logging

### Application Monitoring
- **Error Tracking**: Exception handling and logging
- **Performance Metrics**: Response time monitoring
- **User Analytics**: Usage pattern tracking

### AI Usage Monitoring
- **Token Usage**: Track Gemini API consumption
- **Cost Management**: Monitor API costs
- **Rate Limiting**: Prevent quota exhaustion

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Detailed SEO metrics
- **Multi-language Support**: Internationalization
- **Mobile App**: React Native version

### Technical Improvements
- **Microservices**: Service-oriented architecture
- **Containerization**: Docker deployment
- **CI/CD Pipeline**: Automated testing and deployment
- **Cloud Integration**: AWS/Azure deployment options 