# API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All API endpoints require JWT authentication except for `/register` and `/login`.

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### Authentication

#### POST /register
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

#### POST /login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt-token-string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

### SEO Analysis

#### POST /analyze
Analyze a website for SEO metrics.

**Request Body:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "seo_score": 85,
  "analysis": {
    "title": "Page Title",
    "meta_description": "Page description",
    "headings": ["H1", "H2", "H3"],
    "images": 5,
    "links": 10,
    "word_count": 500
  },
  "ai_suggestions": "AI-generated SEO recommendations...",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Chatbot

#### POST /api/chatbot
Send a message to the Twinkle chatbot.

**Request Body:**
```json
{
  "message": "How can I improve my SEO?",
  "seo_report": "Optional SEO analysis context"
}
```

**Response:**
```json
{
  "response": "AI-generated response with HTML formatting",
  "tokens_used": 150
}
```

### User Data

#### GET /api/history
Get user's analysis history.

**Response:**
```json
{
  "analyses": [
    {
      "id": 1,
      "url": "https://example.com",
      "seo_score": 85,
      "created_at": "2024-01-01 12:00:00"
    }
  ]
}
```

#### GET /history
Get user's analysis history.

**Response:**
```json
{
  "analyses": [
    {
      "id": 1,
      "url": "https://example.com",
      "seo_score": 85,
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "message": "Detailed error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "Please login to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "The requested resource was not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting
- API calls are limited to 100 requests per hour per user
- Chatbot messages are limited to 50 messages per hour per user

## Token Usage
- Each chatbot interaction tracks token usage
- Token usage is displayed in the response
- Monitor usage to stay within API limits 