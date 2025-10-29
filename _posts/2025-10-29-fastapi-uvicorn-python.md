---
layout: post
title: "⚡ FastAPI with Uvicorn: Building High-Performance Python APIs"
date: 2025-10-29 14:00:00 +0000
categories: [Python, API, FastAPI, Web Development, Tutorial]
tags: [FastAPI, Uvicorn, ASGI, Python, REST API, async, performance]
description: "Complete guide to building fast, modern APIs with FastAPI and Uvicorn. Learn how to create production-ready Python web services with automatic documentation and async support."
excerpt: "Discover FastAPI and Uvicorn - the powerful duo for building high-performance Python APIs. This guide covers setup, routing, validation, and deployment."
---

# FastAPI with Uvicorn: Building High-Performance Python APIs

FastAPI is a modern, fast web framework for building APIs with Python. Combined with Uvicorn, an ASGI web server, you can create production-ready applications with minimal boilerplate and excellent performance.

## What is FastAPI?

FastAPI is a web framework for building APIs with Python that:
- **Is fast** - Performance comparable to Node.js and Go
- **Requires minimal code** - Reduces bugs and development time
- **Is standards-based** - Built on OpenAPI and JSON Schema
- **Provides automatic docs** - Swagger UI and ReDoc included
- **Supports async** - Native async/await support

## What is Uvicorn?

Uvicorn is an ASGI web server implementation for Python that:
- **Handles concurrent requests** - Efficiently manages multiple connections
- **Supports async frameworks** - Works seamlessly with async Python code
- **Is lightweight** - Minimal overhead for production deployments
- **Is production-ready** - Used by major Python web frameworks

## Prerequisites

- Python 3.7+
- pip (Python package manager)
- Basic understanding of REST APIs
- Familiarity with async/await in Python

## Installation

```bash
# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install FastAPI and Uvicorn
pip install fastapi uvicorn[standard]
```

The `[standard]` extras installs additional dependencies for HTTP/2 and SSL support.

## Your First FastAPI Application

Create a file called `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "query": q}
```

Run the server with Uvicorn:

```bash
uvicorn main:app --reload
```

Visit http://localhost:8000 in your browser. Your API is live!

### Automatic Documentation

FastAPI automatically generates interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Core Concepts

### Path Parameters

Path parameters are part of the URL path:

```python
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}
```

Access: `GET /users/123`

### Query Parameters

Query parameters come after the `?` in the URL:

```python
@app.get("/search/")
async def search(q: str, skip: int = 0, limit: int = 10):
    return {"query": q, "skip": skip, "limit": limit}
```

Access: `GET /search/?q=python&skip=0&limit=20`

### Request Bodies

Accept JSON request bodies:

```python
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str = None
    price: float
    tax: float = None

@app.post("/items/")
async def create_item(item: Item):
    return item
```

Request:
```json
POST /items/
{
  "name": "Laptop",
  "description": "A powerful laptop",
  "price": 1299.99,
  "tax": 130.00
}
```

### Response Models

Define expected response format:

```python
from typing import List

class Item(BaseModel):
    id: int
    name: str
    price: float

@app.get("/items/", response_model=List[Item])
async def list_items():
    return [
        {"id": 1, "name": "Item 1", "price": 10.0},
        {"id": 2, "name": "Item 2", "price": 20.0}
    ]
```

### HTTP Methods

Support different HTTP methods:

```python
# GET - retrieve data
@app.get("/items/")
async def list_items():
    pass

# POST - create data
@app.post("/items/")
async def create_item(item: Item):
    pass

# PUT - update entire resource
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    pass

# PATCH - partial update
@app.patch("/items/{item_id}")
async def patch_item(item_id: int, item: ItemUpdate):
    pass

# DELETE - remove data
@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    pass
```

## Async and Performance

FastAPI supports native async/await for high-performance operations:

```python
import asyncio
import httpx

@app.get("/async-example/")
async def async_operation():
    # Non-blocking I/O operations
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.example.com/data")
    return response.json()
```

Benefits:
- Handle thousands of concurrent requests
- Efficient resource utilization
- Non-blocking I/O operations

## Data Validation

Pydantic provides automatic validation:

```python
from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    id: int
    name: str = Field(..., min_length=1, max_length=100)
    email: str
    age: Optional[int] = Field(None, ge=0, le=150)
    
    class Config:
        # Example data in documentation
        schema_extra = {
            "example": {
                "id": 1,
                "name": "John Doe",
                "email": "john@example.com",
                "age": 30
            }
        }
```

Validation features:
- Type checking
- String length constraints
- Number ranges
- Regex patterns
- Custom validators

## Error Handling

Return proper HTTP status codes and error messages:

```python
from fastapi import HTTPException, status

@app.get("/items/{item_id}")
async def read_item(item_id: int):
    if item_id not in items_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
            headers={"X-Error": "Item lookup failed"}
        )
    return items_db[item_id]
```

Common status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Middleware

Add middleware to process requests/responses:

```python
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)

# Custom middleware
@app.middleware("http")
async def add_process_time_header(request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## Complete Example: Todo API

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI(title="Todo API", version="1.0.0")

class TodoCreate(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class Todo(TodoCreate):
    id: str

# In-memory database (use a real database in production)
todos_db: dict = {}

@app.get("/todos/", response_model=List[Todo])
async def list_todos():
    """Get all todos"""
    return list(todos_db.values())

@app.post("/todos/", response_model=Todo, status_code=status.HTTP_201_CREATED)
async def create_todo(todo: TodoCreate):
    """Create a new todo"""
    todo_id = str(uuid.uuid4())
    new_todo = Todo(id=todo_id, **todo.dict())
    todos_db[todo_id] = new_todo
    return new_todo

@app.get("/todos/{todo_id}", response_model=Todo)
async def get_todo(todo_id: str):
    """Get a specific todo"""
    if todo_id not in todos_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    return todos_db[todo_id]

@app.put("/todos/{todo_id}", response_model=Todo)
async def update_todo(todo_id: str, todo: TodoCreate):
    """Update a todo"""
    if todo_id not in todos_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    updated_todo = Todo(id=todo_id, **todo.dict())
    todos_db[todo_id] = updated_todo
    return updated_todo

@app.delete("/todos/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: str):
    """Delete a todo"""
    if todo_id not in todos_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found"
        )
    del todos_db[todo_id]
```

## Deployment with Uvicorn

### Development Mode

```bash
uvicorn main:app --reload
```

### Production Mode

```bash
# Single worker
uvicorn main:app --host 0.0.0.0 --port 8000

# Multiple workers (use gunicorn)
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

Production settings:
- `--host 0.0.0.0` - Listen on all network interfaces
- `--port 8000` - Run on port 8000
- `--workers 4` - Run multiple worker processes
- `--log-level info` - Set logging level

### Environment Variables

```bash
# Create .env file
DATABASE_URL=postgresql://user:password@localhost/dbname
SECRET_KEY=your-secret-key

# Load in Python
from dotenv import load_dotenv
import os

load_dotenv()
database_url = os.getenv("DATABASE_URL")
```

## Best Practices

### 1. Use Type Hints

Type hints improve code quality and enable automatic validation:

```python
from typing import Optional, List

@app.get("/items/")
async def list_items(skip: int = 0, limit: int = 10) -> List[Item]:
    pass
```

### 2. Organize with Routers

Split endpoints into modular routers:

```python
from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
async def list_items():
    pass

@router.post("/")
async def create_item(item: Item):
    pass

# Include in main app
app.include_router(router)
```

### 3. Add API Documentation

```python
app = FastAPI(
    title="My API",
    description="An awesome API",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    docs_url="/api/v1/docs",
    redoc_url="/api/v1/redoc"
)
```

### 4. Handle Dependencies

```python
from fastapi import Depends

async def get_query_param(q: Optional[str] = None):
    return q

@app.get("/items/")
async def read_items(query: str = Depends(get_query_param)):
    pass
```

### 5. Add Security

```python
from fastapi.security import HTTPBearer, HTTPAuthCredentials

security = HTTPBearer()

@app.get("/secure/")
async def secure_endpoint(credentials: HTTPAuthCredentials = Depends(security)):
    return {"token": credentials.credentials}
```

## Testing FastAPI Apps

```python
from fastapi.testclient import TestClient

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, FastAPI!"}

def test_create_item():
    response = client.post("/items/", json={"name": "Test", "price": 10.0})
    assert response.status_code == 201
```

## Common Integrations

### Database Integration

```bash
pip install sqlalchemy
```

### Authentication

```bash
pip install python-jose
pip install passlib
pip install python-multipart
```

### API Documentation

FastAPI automatically generates docs, but you can customize:
- Swagger UI at `/docs`
- ReDoc at `/redoc`
- OpenAPI JSON at `/openapi.json`

## Performance Tips

1. **Use async endpoints** - For I/O-heavy operations
2. **Run multiple workers** - Use gunicorn with Uvicorn workers
3. **Cache responses** - Reduce database queries
4. **Use CDN** - Cache static assets
5. **Monitor with tools** - Track performance metrics

## Resources

- [FastAPI Official Documentation](https://fastapi.tiangolo.com/)
- [Uvicorn Documentation](https://www.uvicorn.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Python ASGI Spec](https://asgi.readthedocs.io/)

## Conclusion

FastAPI with Uvicorn provides a powerful foundation for building modern, high-performance Python APIs. With automatic documentation, type validation, and async support, you can create robust applications quickly.

Start with simple endpoints, leverage FastAPI's validation system, and scale with async operations for maximum performance.

Happy API building! 🚀
