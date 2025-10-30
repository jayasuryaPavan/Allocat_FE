# InvenGadu Chat Integration Guide

## Overview

InvenGadu is an AI-powered chat assistant integrated into your Allocat ERP application. It uses LangChain and Ollama to provide intelligent inventory management assistance.

## Architecture

```
Frontend (Vue.js)
    ↓
InvenGadu Chat Component
    ↓
InvenGadu API Service (http://localhost:8000)
    ↓
LangChain + Ollama (Llama3)
    ↓
Spring Boot Backend (http://localhost:8080/api)
    ↓
PostgreSQL Database
```

## Frontend Setup (✅ Already Complete)

The frontend integration is complete and includes:

1. **Chat Component** (`src/components/InvenGaduChat.vue`)
   - Floating chat widget
   - Quick suggestions
   - Message history
   - Keyboard shortcuts (Cmd/Ctrl+K to toggle)

2. **API Service** (`src/core/services/invenGaduApi.ts`)
   - Handles communication with LangChain backend
   - Conversation management
   - Error handling

3. **Types** (`src/core/types/chat.ts`)
   - TypeScript interfaces for chat messages

## Backend Setup (LangChain + Ollama)

### Step 1: Install Ollama

1. Download from https://ollama.com
2. Install and run:
   ```bash
   ollama run llama3
   ```

### Step 2: Install Python Dependencies

Create a Python virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install langchain langchain-community fastapi uvicorn requests python-dotenv
```

### Step 3: Create LangChain Backend

Create a new directory `inven_gadu_backend` next to your frontend:

```
inven_gadu_backend/
├── main.py           # FastAPI endpoint
├── inven_agent.py    # LangChain logic
├── .env              # Configuration
└── requirements.txt  # Python dependencies
```

**requirements.txt:**
```txt
langchain==0.1.0
langchain-community==0.0.10
fastapi==0.104.1
uvicorn==0.24.0
requests==2.31.0
python-dotenv==1.0.0
ollama==0.1.0
```

**main.py:**
```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from inven_agent import InvenGaduAgent
import os

app = FastAPI(title="InvenGadu API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agent
agent = InvenGaduAgent(
    backend_url=os.getenv("BACKEND_URL", "http://localhost:8080/api")
)

class ChatRequest(BaseModel):
    message: str
    conversation_id: str = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: str = None
    metadata: dict = None

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        response = await agent.process_message(
            request.message,
            request.conversation_id
        )
        return ChatResponse(
            message=response["message"],
            conversation_id=response.get("conversation_id"),
            metadata=response.get("metadata")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**inven_agent.py:**
```python
from langchain_community.llms import Ollama
from langchain.tools import Tool
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
import requests
import os

class InvenGaduAgent:
    def __init__(self, backend_url: str):
        self.backend_url = backend_url
        self.llm = Ollama(model="llama3")
        self.memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        
        # Define tools that can interact with your Spring Boot backend
        tools = [
            Tool(
                name="get_inventory",
                func=self.get_inventory,
                description="Get current inventory levels. Use this when asked about stock, inventory, or product availability."
            ),
            Tool(
                name="get_low_stock",
                func=self.get_low_stock,
                description="Get items that are low on stock. Use when asked about low stock, restocking, or items running out."
            ),
            Tool(
                name="get_inventory_stats",
                func=self.get_inventory_stats,
                description="Get inventory statistics and summary. Use when asked about inventory overview, stats, or summary."
            ),
            Tool(
                name="search_products",
                func=self.search_products,
                description="Search for products by name or code. Use when asked to find or search for specific products."
            )
        ]
        
        self.agent = initialize_agent(
            tools,
            self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True
        )
    
    def get_inventory(self, query: str) -> str:
        """Get current inventory"""
        try:
            response = requests.get(f"{self.backend_url}/inventory/current")
            if response.status_code == 200:
                data = response.json()
                return f"Inventory data: {data}"
            return "Unable to fetch inventory at this time."
        except Exception as e:
            return f"Error fetching inventory: {str(e)}"
    
    def get_low_stock(self, query: str) -> str:
        """Get low stock items"""
        try:
            response = requests.get(f"{self.backend_url}/inventory/low-stock")
            if response.status_code == 200:
                data = response.json()
                return f"Low stock items: {data}"
            return "Unable to fetch low stock items."
        except Exception as e:
            return f"Error fetching low stock: {str(e)}"
    
    def get_inventory_stats(self, query: str) -> str:
        """Get inventory statistics"""
        try:
            response = requests.get(f"{self.backend_url}/inventory/stats")
            if response.status_code == 200:
                data = response.json()
                return f"Inventory stats: {data}"
            return "Unable to fetch inventory stats."
        except Exception as e:
            return f"Error fetching stats: {str(e)}"
    
    def search_products(self, query: str) -> str:
        """Search products"""
        try:
            response = requests.get(
                f"{self.backend_url}/products/search",
                params={"searchTerm": query}
            )
            if response.status_code == 200:
                data = response.json()
                return f"Products found: {data}"
            return "Unable to search products."
        except Exception as e:
            return f"Error searching products: {str(e)}"
    
    async def process_message(self, message: str, conversation_id: str = None):
        """Process a user message and return response"""
        try:
            # Add authentication header if needed
            headers = {}
            # You can add Bearer token from your frontend session here
            
            response = self.agent.run(message)
            
            return {
                "message": response,
                "conversation_id": conversation_id or "default",
                "metadata": {}
            }
        except Exception as e:
            return {
                "message": f"I apologize, but I encountered an error: {str(e)}",
                "conversation_id": conversation_id,
                "metadata": {}
            }
```

**.env:**
```env
BACKEND_URL=http://localhost:8080/api
OLLAMA_BASE_URL=http://localhost:11434
```

### Step 4: Run the Backend

```bash
cd inven_gadu_backend
uvicorn main:app --reload --port 8000
```

## Configuration

### Frontend Environment Variable

The frontend will use `http://localhost:8000` by default. To change this, create a `.env` file in your frontend root:

```env
VITE_INVEN_GADU_API_URL=http://localhost:8000
```

## Usage

1. **Start Ollama**: Ensure Ollama is running with `ollama run llama3`
2. **Start LangChain Backend**: Run `uvicorn main:app --reload --port 8000`
3. **Start Spring Boot**: Ensure your Spring Boot backend is running on port 8080
4. **Start Frontend**: Run `npm run dev`
5. **Open Chat**: Click the floating chat button (bottom-right) or press `Cmd/Ctrl+K`

## Features

- ✅ Natural language queries about inventory
- ✅ Conversation context awareness
- ✅ Quick suggestion buttons
- ✅ Dark mode support
- ✅ Mobile responsive
- ✅ Keyboard shortcuts
- ✅ Error handling and user feedback

## Example Queries

- "Show me low stock items"
- "What products need restocking?"
- "Give me an inventory summary"
- "Search for products containing 'laptop'"
- "What are the current inventory levels?"

## Troubleshooting

### Chat not connecting
- Ensure the LangChain backend is running on port 8000
- Check browser console for errors
- Verify CORS settings in `main.py`

### Ollama errors
- Ensure Ollama is installed and running
- Verify model is downloaded: `ollama list`
- Check Ollama service: `ollama serve`

### Backend connection errors
- Verify Spring Boot backend is running on port 8080
- Check `BACKEND_URL` in `.env` file
- Ensure authentication tokens are properly handled

## Next Steps

1. Add authentication token forwarding from frontend to LangChain backend
2. Implement conversation persistence
3. Add more tools for inventory operations (update stock, create orders, etc.)
4. Enhance UI with voice input support
5. Add analytics and conversation history

