# Portfolio Chat Backend

Express + TypeScript backend for portfolio chat.

## Features

- `/api/chat` endpoint for frontend chat UI
- Retrieval from:
  - `public/llm.txt`
  - `src/data/**/*`
  - `backend/knowledge/cv/**/*`
  - `backend/knowledge/about/**/*`
- Cerebras chat completion integration

## Setup

```bash
cd backend
bun install
cp .env.example .env
# set CEREBRAS_API_KEY in .env
bun run dev
```

Server runs at `http://localhost:8787` by default.
