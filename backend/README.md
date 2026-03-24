# Backend Setup

FastAPI backend for SUMMS.

## Prerequisites
- Python 3.x

## Installation

1. Navigate to the backend folder:
```bash
   cd backend
```

2. Create a virtual environment:
```bash
   python3 -m venv fapivenv
```

3. Activate it:
```bash
   # Mac/Linux/WSL
   source fapivenv/bin/activate

   # Windows
   fapivenv\Scripts\activate
```

4. Install dependencies:
```bash
   pip install -r requirements.txt
```

## Running the Server
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

