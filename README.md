<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue.svg" alt="Python">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/Flask-2.3+-000000.svg" alt="Flask">
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4.svg" alt="Gemini AI">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</div>

<div align="center">
  <h1>🚀 SEO Analyzer with AI Chatbot</h1>
  <p><strong>Comprehensive SEO analysis tool powered by Google Gemini AI</strong></p>
  
  [![GitHub stars](https://img.shields.io/github/stars/yourusername/seo_analyzer?style=social)](https://github.com/yourusername/seo_analyzer)
  [![GitHub forks](https://img.shields.io/github/forks/yourusername/seo_analyzer?style=social)](https://github.com/yourusername/seo_analyzer)
  [![GitHub issues](https://img.shields.io/github/issues/yourusername/seo_analyzer)](https://github.com/yourusername/seo_analyzer/issues)
  [![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/seo_analyzer)](https://github.com/yourusername/seo_analyzer/pulls)
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

### 🔐 Security & User Management
- **JWT Authentication** - Secure user registration and login
- **Session Management** - Automatic token handling and expiry
- **API Key Protection** - Environment variables for secure API management
- **Database Storage** - SQLite database for user data and analysis history

### 📱 User Experience
- **Responsive Design** - Works perfectly on desktop and mobile
- **Modern UI/UX** - Clean, intuitive interface with smooth animations
- **Real-time Updates** - Live feedback and progress indicators
- **Cross-platform** - Works on Windows, macOS, and Linux

---

## 🛠️ Tech Stack

### Backend
<div align="center">
  <img src="https://img.shields.io/badge/Python-3.8+-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Flask-2.3+-000000?logo=flask" alt="Flask">
  <img src="https://img.shields.io/badge/SQLAlchemy-ORM-29A4D3?logo=sqlalchemy" alt="SQLAlchemy">
  <img src="https://img.shields.io/badge/BeautifulSoup-4.12-FF6B6B?logo=beautifulsoup" alt="BeautifulSoup">
  <img src="https://img.shields.io/badge/spaCy-NLP-09A3D5?logo=spacy" alt="spaCy">
  <img src="https://img.shields.io/badge/NLTK-NLP-FF6B6B?logo=nltk" alt="NLTK">
</div>

### Frontend
<div align="center">
  <img src="https://img.shields.io/badge/React-18.0+-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Axios-HTTP-5A29E4?logo=axios" alt="Axios">
  <img src="https://img.shields.io/badge/Chart.js-Visualization-FF6384?logo=chartjs" alt="Chart.js">
</div>

### AI & APIs
<div align="center">
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?logo=google" alt="Google Gemini">
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?logo=jsonwebtokens" alt="JWT">
</div>

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

# Run the setup script
./start_app.bat  # Windows
# OR
./start_app.sh   # Linux/Mac
```

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
3. Get instant, formatted responses
4. Receive actionable advice

### Example Questions
- "How do I optimize title tags?"
- "What are the best SEO practices?"
- "How can I improve my meta descriptions?"
- "Tell me about mobile SEO"

---

## 🏗️ Project Structure

```
seo_analyzer/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── gemini_integration.py  # SEO AI suggestions
│   ├── gemini_chatbot.py     # AI chatbot
│   ├── database.py           # Database models
│   ├── seo_analyzer.py       # SEO analysis logic
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html         # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js       # Authentication
│   │   │   ├── Dashboard.js   # Main interface
│   │   │   ├── SEOResults.js  # Analysis results
│   │   │   └── Chatbot.js    # AI chat interface
│   │   ├── utils/
│   │   │   └── api.js         # API utilities
│   │   ├── App.js             # Main React app
│   │   └── App.css            # Global styles
│   └── package.json           # Node dependencies
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
    <a href="https://github.com/yourusername/seo_analyzer/issues">Report Bug</a>
    ·
    <a href="https://github.com/yourusername/seo_analyzer/issues">Request Feature</a>
    ·
    <a href="https://github.com/yourusername/seo_analyzer">View on GitHub</a>
  </p>
</div>

