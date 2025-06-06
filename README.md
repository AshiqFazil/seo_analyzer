backend virtual environment --> python app.py
frontend --> npm start



# SEO Analyzer Web Application

## Overview

The **SEO Analyzer** is a comprehensive full-stack web application that enables users to analyze websites for SEO performance. It provides detailed SEO scores, suggestions, and insights through automated scraping, natural language processing, and AI-powered recommendations. Users can sign up and log in securely, then submit URLs to get actionable SEO feedback.

---

## Features

* User authentication with JWT tokens for secure access.
* Scrapes key SEO elements such as meta tags, headings, and image alt texts.
* Analyzes content readability, keyword usage, and site structure.
* Generates AI-powered SEO suggestions using Google Gemini API.
* Interactive dashboard showing SEO scores, breakdowns, and visual charts.
* Automatic token management and session expiry handling.
* Responsive and user-friendly React frontend.

---

## Technologies Used

### Backend

* **Python 3.x** — Core programming language.
* **Flask** — Backend API framework.
* **Flask-CORS** — Enables cross-origin resource sharing.
* **Flask-JWT-Extended** — Handles JWT-based authentication.
* **SQLAlchemy** — ORM for database interactions.
* **BeautifulSoup** — Parses HTML for scraping SEO elements.
* **spaCy, NLTK, TextStat** — NLP libraries for analyzing text content.
* **Google Gemini API** — Provides AI-generated SEO suggestions.
* **SQLite** — Lightweight database for user and session management.

### Frontend

* **React** — Frontend library for building UI.
* **Axios** — HTTP client for API calls.
* **React Router** — Navigation between pages (Login, Dashboard, Results).
* **Chart.js (or similar)** — For displaying data visualizations and pie charts.
* **CSS Modules / Styled Components** — Styling for components.

---

## Project Structure

### Backend

```
backend/
├── app.py                 # Main Flask app and API route definitions
├── auth.py                # Authentication endpoints (signup/login)
├── models.py              # Database models (e.g., User)
├── seo_analyzer.py        # SEO scraping and analysis logic
├── gemini_integration.py  # Google Gemini API calls for AI suggestions
├── database.py            # Database initialization and setup
├── requirements.txt       # Backend dependencies
```

### Frontend

```
frontend/
├── public/
│   └── index.html         # HTML entry point
├── src/
│   ├── Components/
│   │   ├── Login.js       # Login form and authentication logic
│   │   ├── Dashboard.js   # URL input and summary display
│   │   └── SEOResults.js  # SEO analysis results and suggestions
│   ├── utils/
│   │   └── api.js         # Axios instance with token management
│   ├── App.js             # Main React app with routing
│   ├── index.js           # Root React DOM rendering
│   └── App.css            # Global styles
├── package.json           # Frontend dependencies
```

---

## How It Works

1. **User Authentication:**
   Users sign up or log in. JWT tokens are stored locally and sent with API requests to maintain secure sessions.

2. **URL Submission:**
   Authenticated users enter a URL to analyze.

3. **SEO Scraping & Analysis:**
   The backend scrapes the URL for SEO elements like titles, meta descriptions, headings, and image alt texts using BeautifulSoup. Text is analyzed for readability, keyword density, and structure using spaCy, NLTK, and TextStat. An overall SEO score is computed.

4. **AI Suggestions:**
   The scraped data and SEO analysis are sent to the Google Gemini API. The AI returns customized suggestions for SEO improvements (e.g., missing keywords, content enhancements).

5. **Results Display:**
   The frontend presents:

   * SEO score with detailed breakdowns.
   * AI-generated actionable suggestions.
   * Visual charts illustrating readability, keyword coverage, and other metrics.

6. **Session Management:**
   Axios interceptors append JWT tokens to all API requests automatically. On token expiration (401 responses), users are redirected to login.

---

## Future Enhancements

* Bulk URL analysis support.
* Export SEO reports in PDF/CSV formats.
* Deeper keyword strategy suggestions.
* Progressive Web App (PWA) capabilities.
* Additional SEO metrics like backlink and page speed analysis.

---

## License

This project is licensed under the MIT License.

