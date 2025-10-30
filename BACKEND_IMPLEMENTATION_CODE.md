# Complete Backend Implementation Code

This file contains the complete, ready-to-use code for all Python files needed for the InvenGadu backend.

## File Structure

```
inven_gadu_backend/
├── config.py
├── tools.py
├── inven_agent.py
├── main.py
├── requirements.txt
└── .env.example
```

---

## 1. config.py

```python
from pydantic_settings import BaseSettings
from typing import Optional, List

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
    cors_origins: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8081",
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

---

## 2. tools.py

```python
from langchain.tools import Tool
from typing import Optional
import requests
from config import settings
import json

class SpringBootTools:
    """Tools that interact with Spring Boot backend API"""
    
    def __init__(self, auth_token: Optional[str] = None):
        self.backend_url = settings.backend_url
        self.timeout = settings.backend_timeout
        self.auth_token = auth_token
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if auth_token:
            self.headers["Authorization"] = f"Bearer {auth_token}"
    
    def _make_request(self, method: str, endpoint: str, **kwargs) -> dict:
        """Make HTTP request to Spring Boot backend"""
        url = f"{self.backend_url}{endpoint}"
        try:
            response = requests.request(
                method=method,
                url=url,
                headers=self.headers,
                timeout=self.timeout,
                **kwargs
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.Timeout:
            return {"error": "Request timeout. Backend is not responding."}
        except requests.exceptions.ConnectionError:
            return {"error": "Cannot connect to backend. Ensure Spring Boot is running."}
        except requests.exceptions.HTTPError as e:
            return {"error": f"HTTP error: {e.response.status_code} - {e.response.text}"}
        except Exception as e:
            return {"error": f"Unexpected error: {str(e)}"}
    
    def get_inventory(self, query: str) -> str:
        """
        Get current inventory levels for all products.
        Use this when asked about stock levels, inventory status, or product availability.
        """
        result = self._make_request("GET", "/inventory/current")
        if "error" in result:
            return f"Error fetching inventory: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            inventory = result["data"]
            if isinstance(inventory, list):
                formatted = "\n".join([
                    f"Product ID: {item.get('productId', 'N/A')}, "
                    f"Product: {item.get('productName', 'N/A')}, "
                    f"Stock: {item.get('availableQuantity', 0)}, "
                    f"Reserved: {item.get('reservedQuantity', 0)}"
                    for item in inventory[:20]
                ])
                return f"Current inventory ({len(inventory)} items):\n{formatted}"
        return json.dumps(result, indent=2)
    
    def get_low_stock(self, query: str) -> str:
        """
        Get items that are low on stock.
        Use this when asked about low stock items, items needing restocking, or products running out.
        """
        result = self._make_request("GET", "/inventory/low-stock")
        if "error" in result:
            return f"Error fetching low stock items: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            items = result["data"]
            if isinstance(items, list):
                if len(items) == 0:
                    return "No items are currently low on stock. All products have sufficient inventory."
                formatted = "\n".join([
                    f"Product: {item.get('productName', 'N/A')} (ID: {item.get('productId', 'N/A')}), "
                    f"Current Stock: {item.get('availableQuantity', 0)}, "
                    f"Minimum Required: {item.get('minimumStockLevel', 'N/A')}"
                    for item in items
                ])
                return f"Low stock items ({len(items)} items):\n{formatted}"
        return json.dumps(result, indent=2)
    
    def get_out_of_stock(self, query: str) -> str:
        """
        Get items that are out of stock.
        Use this when asked about out of stock items or products with zero inventory.
        """
        result = self._make_request("GET", "/inventory/out-of-stock")
        if "error" in result:
            return f"Error fetching out of stock items: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            items = result["data"]
            if isinstance(items, list):
                if len(items) == 0:
                    return "Great news! No items are currently out of stock."
                formatted = "\n".join([
                    f"Product: {item.get('productName', 'N/A')} (ID: {item.get('productId', 'N/A')})"
                    for item in items
                ])
                return f"Out of stock items ({len(items)} items):\n{formatted}"
        return json.dumps(result, indent=2)
    
    def get_inventory_stats(self, query: str) -> str:
        """
        Get inventory statistics and summary.
        Use this when asked about inventory overview, summary, statistics, or general inventory status.
        """
        result = self._make_request("GET", "/inventory/stats")
        if "error" in result:
            return f"Error fetching inventory stats: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            stats = result["data"]
            formatted = f"""
Inventory Statistics:
- Total Products: {stats.get('totalProducts', 'N/A')}
- Total Stock Value: {stats.get('totalStockValue', 'N/A')}
- Low Stock Items: {stats.get('lowStockCount', 'N/A')}
- Out of Stock Items: {stats.get('outOfStockCount', 'N/A')}
- Total Available Quantity: {stats.get('totalAvailableQuantity', 'N/A')}
- Total Reserved Quantity: {stats.get('totalReservedQuantity', 'N/A')}
"""
            return formatted.strip()
        return json.dumps(result, indent=2)
    
    def search_products(self, query: str) -> str:
        """
        Search for products by name or code.
        Use this when asked to find, search, or look up specific products.
        Input should be the search term.
        """
        result = self._make_request(
            "GET",
            "/products/search",
            params={"searchTerm": query}
        )
        if "error" in result:
            return f"Error searching products: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            products = result["data"]
            if isinstance(products, list):
                if len(products) == 0:
                    return f"No products found matching '{query}'"
                formatted = "\n".join([
                    f"Product: {p.get('name', 'N/A')} (Code: {p.get('code', 'N/A')}, ID: {p.get('id', 'N/A')}), "
                    f"Price: {p.get('price', 'N/A')}, "
                    f"Category: {p.get('category', 'N/A')}"
                    for p in products[:10]
                ])
                return f"Products found ({len(products)} total):\n{formatted}"
        return json.dumps(result, indent=2)
    
    def get_product_by_id(self, product_id: str) -> str:
        """
        Get detailed information about a specific product by ID.
        Use this when asked about a specific product.
        Input should be the product ID number.
        """
        try:
            pid = int(product_id.strip())
        except ValueError:
            return f"Invalid product ID: {product_id}. Please provide a numeric ID."
        
        result = self._make_request("GET", f"/products/{pid}")
        if "error" in result:
            return f"Error fetching product: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            product = result["data"]
            formatted = f"""
Product Details:
- Name: {product.get('name', 'N/A')}
- Code: {product.get('code', 'N/A')}
- ID: {product.get('id', 'N/A')}
- Price: {product.get('price', 'N/A')}
- Category: {product.get('category', 'N/A')}
- Description: {product.get('description', 'N/A')}
"""
            return formatted.strip()
        return json.dumps(result, indent=2)
    
    def get_stock_discrepancies(self, query: str) -> str:
        """
        Get inventory discrepancies - differences between expected and actual stock.
        Use this when asked about discrepancies, stock differences, or inventory issues.
        """
        result = self._make_request("GET", "/inventory/discrepancies")
        if "error" in result:
            return f"Error fetching discrepancies: {result['error']}"
        
        if isinstance(result, dict) and "data" in result:
            discrepancies = result["data"]
            if isinstance(discrepancies, list):
                if len(discrepancies) == 0:
                    return "No inventory discrepancies found. All stock levels match expected values."
                formatted = "\n".join([
                    f"Product: {d.get('productName', 'N/A')}, "
                    f"Expected: {d.get('expectedQuantity', 'N/A')}, "
                    f"Actual: {d.get('actualQuantity', 'N/A')}, "
                    f"Difference: {d.get('difference', 'N/A')}"
                    for d in discrepancies
                ])
                return f"Stock discrepancies ({len(discrepancies)} items):\n{formatted}"
        return json.dumps(result, indent=2)
    
    def get_tools(self) -> list:
        """Return list of LangChain tools"""
        return [
            Tool(
                name="get_inventory",
                func=self.get_inventory,
                description="Get current inventory levels for all products. Use when asked about stock levels, inventory status, or product availability. Input can be any query about inventory."
            ),
            Tool(
                name="get_low_stock",
                func=self.get_low_stock,
                description="Get items that are low on stock. Use when asked about low stock items, items needing restocking, or products running out. Input can be any query about low stock."
            ),
            Tool(
                name="get_out_of_stock",
                func=self.get_out_of_stock,
                description="Get items that are completely out of stock (zero inventory). Use when asked about out of stock items or products with no inventory. Input can be any query about out of stock items."
            ),
            Tool(
                name="get_inventory_stats",
                func=self.get_inventory_stats,
                description="Get inventory statistics and summary including total products, stock value, low stock count, etc. Use when asked about inventory overview, summary, statistics, or general inventory status. Input can be any query about stats or summary."
            ),
            Tool(
                name="search_products",
                func=self.search_products,
                description="Search for products by name or code. Use when asked to find, search, or look up specific products. Input should be the search term (product name or code)."
            ),
            Tool(
                name="get_product_by_id",
                func=self.get_product_by_id,
                description="Get detailed information about a specific product by its ID number. Use when asked about a specific product by ID. Input should be the product ID number as a string."
            ),
            Tool(
                name="get_stock_discrepancies",
                func=self.get_stock_discrepancies,
                description="Get inventory discrepancies - differences between expected and actual stock levels. Use when asked about discrepancies, stock differences, or inventory issues. Input can be any query about discrepancies."
            )
        ]
```

---

## 3. inven_agent.py

```python
from langchain_community.llms import Ollama
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from tools import SpringBootTools
from config import settings
from typing import Optional, Dict
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InvenGaduAgent:
    """
    LangChain agent that uses Ollama and Spring Boot tools
    to answer inventory-related questions.
    """
    
    def __init__(self, auth_token: Optional[str] = None):
        # Initialize Ollama LLM
        self.llm = Ollama(
            base_url=settings.ollama_base_url,
            model=settings.ollama_model,
            temperature=0.7
        )
        
        # Initialize tools
        self.tools_instance = SpringBootTools(auth_token=auth_token)
        self.tools = self.tools_instance.get_tools()
        
        # Initialize memory for conversation context
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="output"
        )
        
        # Initialize agent
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
            memory=self.memory,
            verbose=True,
            handle_parsing_errors=True,
            max_iterations=5,
            return_intermediate_steps=False
        )
        
        # System prompt for the agent
        self.system_prompt = """You are InvenGadu, a helpful AI assistant for inventory management.
        Your role is to help users understand their inventory, stock levels, products, and related information.
        
        Guidelines:
        - Be friendly and professional
        - Provide clear and concise answers
        - When showing data, format it in a readable way
        - If you don't know something, say so politely
        - Use the available tools to fetch real-time data from the inventory system
        - Summarize large datasets instead of listing everything
        - Always verify information using the tools before responding
        
        You have access to the following capabilities:
        - View current inventory levels
        - Check low stock and out of stock items
        - Get inventory statistics and summaries
        - Search for products
        - View product details
        - Check stock discrepancies
        
        Remember: Always use the appropriate tool to get real-time data before answering questions."""
    
    async def process_message(
        self,
        message: str,
        conversation_id: Optional[str] = None
    ) -> Dict[str, any]:
        """
        Process a user message and return a response.
        
        Args:
            message: User's message/question
            conversation_id: Optional conversation ID for tracking
            
        Returns:
            Dictionary with message, conversation_id, and metadata
        """
        try:
            # Add system context to the message
            full_message = f"{self.system_prompt}\n\nUser: {message}\nAssistant:"
            
            # Run the agent
            logger.info(f"Processing message: {message[:100]}...")
            response = self.agent.run(input=full_message)
            
            # Clean up the response
            if response:
                response = response.replace(self.system_prompt, "").strip()
                if response.startswith("Assistant:"):
                    response = response.replace("Assistant:", "").strip()
            
            logger.info(f"Agent response generated successfully")
            
            return {
                "message": response or "I apologize, but I couldn't generate a response. Please try rephrasing your question.",
                "conversation_id": conversation_id or "default",
                "metadata": {
                    "model": settings.ollama_model,
                    "tools_used": True
                }
            }
            
        except Exception as e:
            logger.error(f"Error processing message: {str(e)}", exc_info=True)
            return {
                "message": f"I apologize, but I encountered an error while processing your request: {str(e)}. Please try again or rephrase your question.",
                "conversation_id": conversation_id,
                "metadata": {
                    "error": str(e),
                    "model": settings.ollama_model
                }
            }
    
    def start_new_conversation(self):
        """Start a new conversation by clearing memory"""
        self.memory.clear()
        logger.info("Conversation memory cleared")
    
    def set_auth_token(self, token: str):
        """Update authentication token for API calls"""
        self.tools_instance.auth_token = token
        if token:
            self.tools_instance.headers["Authorization"] = f"Bearer {token}"
        logger.info("Authentication token updated")
```

---

## 4. main.py

```python
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from inven_agent import InvenGaduAgent
from config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="InvenGadu API",
    description="AI-powered inventory management assistant",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global agent instance (per conversation)
agents: dict[str, InvenGaduAgent] = {}

def get_agent(conversation_id: Optional[str] = None) -> InvenGaduAgent:
    """Get or create agent for a conversation"""
    if not conversation_id:
        conversation_id = "default"
    
    if conversation_id not in agents:
        agents[conversation_id] = InvenGaduAgent()
    
    return agents[conversation_id]

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    metadata: Optional[dict] = None

# Health Check Endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test Ollama connection
        from langchain_community.llms import Ollama
        llm = Ollama(base_url=settings.ollama_base_url, model=settings.ollama_model)
        llm("test")
        
        return {
            "status": "healthy",
            "ollama": "connected",
            "backend_url": settings.backend_url,
            "model": settings.ollama_model
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "error": str(e)
        }

# Chat Endpoint
@app.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    authorization: Optional[str] = Header(None)
):
    """
    Main chat endpoint for InvenGadu.
    
    Accepts a user message and returns an AI-generated response.
    """
    try:
        # Extract auth token if present
        auth_token = None
        if authorization and authorization.startswith("Bearer "):
            auth_token = authorization.replace("Bearer ", "")
        
        # Get or create agent for this conversation
        agent = get_agent(request.conversation_id)
        
        # Update auth token if provided
        if auth_token:
            agent.set_auth_token(auth_token)
        
        # Process the message
        response = await agent.process_message(
            message=request.message,
            conversation_id=request.conversation_id
        )
        
        return ChatResponse(
            message=response["message"],
            conversation_id=response.get("conversation_id"),
            metadata=response.get("metadata")
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process message: {str(e)}"
        )

# New Conversation Endpoint
@app.post("/chat/new")
async def new_conversation(conversation_id: Optional[str] = None):
    """Start a new conversation by clearing memory"""
    try:
        agent = get_agent(conversation_id or "default")
        agent.start_new_conversation()
        
        return {
            "success": True,
            "message": "New conversation started",
            "conversation_id": conversation_id or "default"
        }
    except Exception as e:
        logger.error(f"Error starting new conversation: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "InvenGadu API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "chat": "/chat",
            "new_conversation": "/chat/new"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.api_reload
    )
```

---

## 5. requirements.txt

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

---

## 6. .env.example

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

---

## Quick Start Commands

```bash
# 1. Create project directory
mkdir inven_gadu_backend
cd inven_gadu_backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cp .env.example .env
# Edit .env with your settings

# 5. Start Ollama (in separate terminal)
ollama serve

# 6. Start FastAPI server
python main.py
```

---

## Testing Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Chat endpoint
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Show me low stock items"}'

# With authentication
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "What is the inventory summary?"}'
```

