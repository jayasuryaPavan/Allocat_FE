# InvenGadu Backend Implementation Guide

## Overview

This document provides detailed instructions for implementing the InvenGadu AI chat backend that connects the Vue.js frontend to your Spring Boot inventory management system using LangChain and Ollama.

## Architecture Overview

```
Frontend (Vue.js)
    ↓ HTTP POST /chat
LangChain Backend (FastAPI - Port 8000)
    ↓ LangChain Agent + Ollama (Llama3)
    ↓ HTTP Requests
Spring Boot Backend (Port 8080)
    ↓ Database Queries
PostgreSQL Database
```

## Prerequisites

- Python 3.9+ installed
- Ollama installed and running (https://ollama.com)
- Llama3 model downloaded
- Access to Spring Boot backend API endpoints
- Understanding of FastAPI and LangChain

---

## Step 1: Install Ollama and Download Model

### 1.1 Install Ollama

**Windows:**
1. Download installer from https://ollama.com/download
2. Run the installer
3. Verify installation: Open PowerShell and run `ollama --version`

**macOS/Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### 1.2 Download Llama3 Model

```bash 
ollama pull llama3
```

**Verify the model is downloaded:**
```bash
ollama list
```

You should see `llama3` in the list.

### 1.3 Test Ollama

```bash
ollama run llama3
```

Type a test message and verify it responds. Type `/bye` to exit.

---

## Step 2: Create Python Backend Project

### 2.1 Project Structure

Create a new directory structure:

```
inven_gadu_backend/
├── main.py              # FastAPI application
├── inven_agent.py       # LangChain agent logic
├── tools.py             # API tools for Spring Boot
├── config.py            # Configuration management
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
├── .env.example         # Example environment file
└── README.md            # Backend-specific README
```

### 2.2 Create Virtual Environment

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### 2.3 Install Dependencies

Create `requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
langchain==0.1.0
langchain-community==0.0.10
langchain-core==0.1.0
requests==2.31.0
python-dotenv==1.0.0
pydantic==2.5.0
pydantic-settings==2.1.0
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## Step 3: Implement Configuration Module

Create `config.py`:

```python
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Backend API Configuration
    backend_url: str = "http://localhost:8080/api"
    backend_timeout: int = 30
    
    # Ollama Configuration
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3"
    
    # FastAPI Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_reload: bool = True
    
    # CORS Configuration
    cors_origins: list = [
        "http://localhost:5173",  # Vite default
        "http://localhost:3000",  # Alternative frontend port
        "http://localhost:8081",  # Alternative frontend port
    ]
    
    # Security (optional - for future authentication)
    api_key: Optional[str] = None
    
    # Conversation Settings
    max_conversation_history: int = 10
    enable_memory: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
```

Create `.env.example`:

```env
# Spring Boot Backend URL
BACKEND_URL=http://localhost:8080/api
BACKEND_TIMEOUT=30

# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3

# FastAPI Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional: API Key for authentication
API_KEY=

# Conversation Settings
MAX_CONVERSATION_HISTORY=10
ENABLE_MEMORY=true
```

Create `.env` (copy from `.env.example` and update values):

```env
BACKEND_URL=http://localhost:8080/api
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3
API_PORT=8000
```

---

## Step 4: Implement API Tools for Spring Boot

Create `tools.py` - This file contains all the tools that make HTTP requests to your Spring Boot backend. See the full implementation in the complete guide below.

---

## Step 5: Implement LangChain Agent

Create `inven_agent.py` - This file contains the LangChain agent initialization and message processing logic.

---

## Step 6: Implement FastAPI Application

Create `main.py` - This is the main FastAPI application with endpoints for `/health`, `/chat`, and `/chat/new`.

---

## Step 7: Required Spring Boot API Endpoints

Ensure your Spring Boot backend implements these endpoints correctly:

### 7.1 Required Endpoints

| Endpoint | Method | Description | Response Format |
|----------|--------|-------------|-----------------|
| `/api/inventory/current` | GET | Get all current inventory | `{success: true, data: Inventory[]}` |
| `/api/inventory/low-stock` | GET | Get low stock items | `{success: true, data: Inventory[]}` |
| `/api/inventory/out-of-stock` | GET | Get out of stock items | `{success: true, data: Inventory[]}` |
| `/api/inventory/stats` | GET | Get inventory statistics | `{success: true, data: InventoryStats}` |
| `/api/inventory/discrepancies` | GET | Get stock discrepancies | `{success: true, data: StockDiscrepancy[]}` |
| `/api/products/search?searchTerm=...` | GET | Search products | `{success: true, data: Product[]}` |
| `/api/products/{id}` | GET | Get product by ID | `{success: true, data: Product}` |

### 7.2 Response Format Example

All endpoints should return JSON in this format:

```json
{
  "success": true,
  "data": [...],
  "message": "Optional message",
  "errors": {}
}
```

### 7.3 Authentication

- If your Spring Boot API requires authentication:
  - Use Bearer token authentication
  - Token should be passed from frontend → LangChain backend → Spring Boot
  - Update `tools.py` to include Authorization header

### 7.4 Error Handling

- All endpoints should return proper HTTP status codes
- Error responses should include meaningful error messages
- Handle 401 (Unauthorized), 404 (Not Found), 500 (Internal Server Error)

---

## Step 8: Running the Backend

### 8.1 Start Ollama (if not running as service)

```bash
# Start Ollama server
ollama serve

# In another terminal, verify it's running
ollama list
```

### 8.2 Start LangChain Backend

```bash
# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Run the FastAPI server
python main.py

# Or using uvicorn directly:
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 8.3 Verify Backend is Running

1. Check health endpoint: `http://localhost:8000/health`
2. Should return: `{"status": "healthy", "ollama": "connected", ...}`

---

## Step 9: Testing

### 9.1 Test Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "ollama": "connected",
  "backend_url": "http://localhost:8080/api",
  "model": "llama3"
}
```

### 9.2 Test Chat Endpoint

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me low stock items",
    "conversation_id": "test-123"
  }'
```

Expected response:
```json
{
  "message": "Here are the low stock items:\n...",
  "conversation_id": "test-123",
  "metadata": {
    "model": "llama3",
    "tools_used": true
  }
}
```

### 9.3 Test with Authentication

```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "message": "What is the inventory summary?",
    "conversation_id": "test-123"
  }'
```

---

## Step 10: Integration with Frontend

### 10.1 Frontend Configuration

The frontend is already configured to connect to `http://localhost:8000` by default.

To change the URL, create `.env` in frontend root:
```env
VITE_INVEN_GADU_API_URL=http://localhost:8000
```

### 10.2 Authentication Token Forwarding

To forward authentication tokens from frontend:

1. Update `src/core/services/invenGaduApi.ts` to include auth token
2. Update `main.py` to accept and forward tokens
3. Update `tools.py` to use forwarded tokens

---

## Step 11: Production Deployment Considerations

### 11.1 Environment Variables

- Use environment-specific `.env` files
- Never commit `.env` files to version control
- Use secrets management for production

### 11.2 Performance

- Consider connection pooling for API requests
- Implement caching for frequently accessed data
- Set appropriate timeouts
- Monitor Ollama memory usage

### 11.3 Security

- Implement rate limiting
- Add authentication/authorization
- Validate all inputs
- Sanitize outputs
- Use HTTPS in production

### 11.4 Monitoring

- Add logging for all requests
- Monitor agent performance
- Track error rates
- Set up alerts for service failures

---

## Troubleshooting

### Issue: Ollama connection failed

**Solution:**
- Ensure Ollama is running: `ollama serve`
- Check Ollama is accessible: `curl http://localhost:11434/api/tags`
- Verify model is downloaded: `ollama list`

### Issue: Spring Boot backend connection failed

**Solution:**
- Verify Spring Boot is running on port 8080
- Check `BACKEND_URL` in `.env` file
- Test endpoint manually: `curl http://localhost:8080/api/inventory/current`
- Check CORS settings in Spring Boot

### Issue: Agent returns errors

**Solution:**
- Check logs for detailed error messages
- Verify all required endpoints exist in Spring Boot
- Test endpoints individually
- Check API response format matches expected structure

### Issue: Slow responses

**Solution:**
- Reduce `max_iterations` in agent configuration
- Optimize Spring Boot endpoint queries
- Consider caching frequently accessed data
- Use a faster Ollama model or increase system resources

---

## Summary Checklist

- [ ] Ollama installed and Llama3 model downloaded
- [ ] Python virtual environment created and dependencies installed
- [ ] Configuration files created (`.env`, `config.py`)
- [ ] API tools implemented (`tools.py`)
- [ ] LangChain agent implemented (`inven_agent.py`)
- [ ] FastAPI application created (`main.py`)
- [ ] Spring Boot endpoints verified and accessible
- [ ] Health endpoint tested
- [ ] Chat endpoint tested
- [ ] Frontend integration verified
- [ ] Error handling tested
- [ ] Production deployment considerations reviewed

