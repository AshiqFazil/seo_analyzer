<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/Flask-2.3+-000000.svg" alt="Flask">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4.svg" alt="Gemini AI">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</div>

<div align="center">
  <h1>🚀 GenAI-Powered SEO Analyzer</h1>
  <p><strong>Comprehensive SEO analysis tool powered by Google Gemini AI</strong></p>
</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📖 Usage](#-usage)
- [🤖 AI Chatbot](#-ai-chatbot)
- [🏗️ Project Structure](#️-project-structure)
- [📚 Documentation](#-documentation)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔍 SEO Analysis
- **Comprehensive Website Analysis** - Scrape and analyze key SEO elements
- **Real-time Scoring** - Get instant SEO scores with detailed breakdowns
- **AI-Powered Suggestions** - Receive intelligent recommendations from Google Gemini
- **Visual Analytics** - Beautiful charts and metrics visualization

### 🤖 AI Chatbot Assistant
- **Twinkle Chatbot** - Intelligent SEO assistant powered by Gemini AI
- **Context-Aware Responses** - Understands your SEO reports and provides specific advice
- **Beautiful UI** - 3D styled chat interface with smooth animations
- **Formatted Responses** - HTML formatting with bold text and bullet points
- **Animated Typing** - Realistic typing animation for all responses

### 🔐 Security & User Management
- **JWT Authentication** - Secure user registration and login
- **Session Management** - Automatic token handling and expiry
- **API Key Protection** - Environment variables for secure API management
- **Database Storage** - SQLite database for user data and analysis history

### 🗄️ Data Management
- **User Accounts** - Secure user registration and profile management
- **Analysis History** - Store and retrieve previous SEO analyses
- **Data Persistence** - SQLite database for reliable data storage

### 📱 User Experience
- **Responsive Design** - Works perfectly on desktop and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Live feedback and progress indicators
- **Cross-platform** - Works on Windows, macOS, and Linux

---

## 🛠️ Tech Stack

### Backend
- **Python 3.8+** - Core programming language
- **Flask** - Web framework for API development
- **SQLAlchemy** - Database ORM and management
- **SQLite** - Lightweight database for data storage
- **BeautifulSoup** - HTML parsing and web scraping
- **spaCy & NLTK** - Natural language processing
- **Google Gemini API** - AI-powered analysis and suggestions

### Frontend
- **React 18.0+** - Modern UI library
- **fetch** - HTTP client for API communication
- **Chart.js** - Data visualization and analytics
- **CSS3** - Styling and animations

### AI & APIs
- **Google Gemini 1.5 Flash** - Advanced AI model for content generation
- **JWT Authentication** - Secure user session management
- **RESTful APIs** - Clean API architecture

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Google Gemini API key

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/seo_analyzer.git
cd seo_analyzer

---

## 🔧 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/seo_analyzer.git
cd seo_analyzer
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Environment Configuration
```bash
# Create .env file in backend directory
cd backend
touch .env  # Linux/Mac
# OR
echo. > .env  # Windows
```

---

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the `backend/` directory:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Gemini API Keys
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_API_KEY2=your-second-gemini-api-key-here

# Database
DATABASE_URL=sqlite:///seo_analyzer.db
```

### Getting API Keys
1. **Google Gemini API**: 
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Use one key for SEO analysis, another for chatbot

---

## 📖 Usage

### 1. Start the Application
```bash
# Backend (Terminal 1)
cd backend
python app.py

# Frontend (Terminal 2)
cd frontend
npm start
```

### 2. Access the Application
- Open your browser and go to `http://localhost:3000`
- Register a new account or login
- Enter a URL to analyze

### 3. Analyze Websites
- Enter any website URL
- Get comprehensive SEO analysis
- View detailed scores and suggestions
- Chat with AI assistant for advice

---

## 🤖 AI Chatbot

### Features
- **Intelligent Responses** - Powered by Google Gemini 1.5 Flash
- **SEO Expertise** - Specialized in SEO best practices
- **Context Awareness** - Understands your analysis reports
- **Beautiful Interface** - 3D styled chat with animations

### Usage
1. Click the chat icon in the bottom-right corner
2. Ask SEO-related questions
3. Get instant, animated responses
4. Receive actionable advice

### Example Questions
- "How do I optimize title tags?"
- "What are the best SEO practices?"
- "How can I improve my meta descriptions?"
- "Tell me about mobile SEO"

---

## 📚 Documentation

### Available Documentation
- **[API Documentation](docs/API.md)** - Complete API reference with endpoints, request/response formats, and error handling
- **[System Architecture](docs/ARCHITECTURE.md)** - Detailed system design, component architecture, and data flow diagrams
- **[Development Guide](docs/DEVELOPMENT.md)** - Development setup, coding standards, testing, and contribution guidelines

### Quick Links
- [API Endpoints](docs/API.md#endpoints) - All available API routes
- [Database Schema](docs/ARCHITECTURE.md#database-schema) - Database structure and relationships
- [Development Setup](docs/DEVELOPMENT.md#getting-started) - How to set up development environment
- [Contributing Guidelines](docs/DEVELOPMENT.md#contributing-guidelines) - How to contribute to the project

---

## 🏗️ Project Structure

```
seo_analyzer/
├── backend/
│   ├── app.py                 # Main Flask application with routes
│   ├── gemini_integration.py  # Gemini AI for SEO suggestions
│   ├── gemini_chatbot.py     # AI chatbot implementation
│   ├── database.py           # SQLite database models
│   ├── seo_analyzer.py       # Core SEO analysis logic
│   ├── requirements.txt       # Python dependencies
│   └── instance/             # SQLite database files
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # User authentication
│   │   │   ├── Dashboard.js   # Main application interface
│   │   │   ├── SEOResults.js  # SEO analysis results
│   │   │   └── Chatbot.js    # AI chatbot interface
│   │   ├── utils/
│   │   │   └── api.js         # API communication utilities
│   │   ├── App.js             # Main React application
│   │   └── App.css            # Global styles and animations
│   └── package.json           # Node.js dependencies
├── docs/                      # Documentation
│   ├── API.md                # API documentation
│   ├── ARCHITECTURE.md       # System architecture
│   ├── DEVELOPMENT.md        # Development guide
│   ├── USER_GUIDE.md         # User manual
│   └── DEPLOYMENT.md         # Production deployment guide
├── README.md                  # Project documentation
├── LICENSE                    # MIT License
└── start_app.bat             # Quick start script
```

---

## 🔒 Security

### API Key Protection
- ✅ Environment variables for sensitive data
- ✅ `.env` file excluded from git
- ✅ No hardcoded API keys in source code
- ✅ Secure JWT token handling

### Data Privacy
- ✅ Local SQLite database
- ✅ User data encryption
- ✅ Session management
- ✅ Secure authentication

---

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### How to Contribute
1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Setup
```bash
# Fork and clone
git clone https://github.com/yourusername/seo_analyzer.git
cd seo_analyzer

# Install dependencies
cd backend && pip install -r requirements.txt
cd ../frontend && npm install

# Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the SEO Analyzer Team</p>
  <p>
    <a href="#-features">Features</a>
    ·
    <a href="#-installation">Installation</a>
    ·
    <a href="#-usage">Usage</a>
  </p>
</div>

