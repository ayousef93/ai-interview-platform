<h1 align="center">IntervuAI</h1>

<p align="center">
  <a href="https://nextjs.org">
    <img alt="Next.js" src="https://img.shields.io/badge/Frontend-Next.js_15-black?style=flat-square&logo=next.js" />
  </a>
  <a href="https://spring.io/projects/spring-boot">
    <img alt="Spring Boot" src="https://img.shields.io/badge/Backend-Spring_Boot_3-6DB33F?style=flat-square&logo=springboot&logoColor=white" />
  </a>
  <a href="https://www.oracle.com/java/">
    <img alt="Java" src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" />
  </a>
  <a href="https://maven.apache.org/">
    <img alt="Maven" src="https://img.shields.io/badge/Build-Maven-C71A36?style=flat-square&logo=apachemaven&logoColor=white" />
  </a>
  <a href="https://www.postgresql.org/">
    <img alt="PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL_16-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  </a>
  <a href="https://spring.io/projects/spring-security">
    <img alt="Spring Security" src="https://img.shields.io/badge/Security-Spring_Security-6DB33F?style=flat-square&logo=springsecurity&logoColor=white" />
  </a>
  <a href="https://flywaydb.org/">
    <img alt="Flyway" src="https://img.shields.io/badge/Migrations-Flyway-CC0200?style=flat-square&logo=flyway&logoColor=white" />
  </a>
  <a href="https://ollama.com/">
    <img alt="Ollama" src="https://img.shields.io/badge/AI-Ollama_Qwen3-000000?style=flat-square" />
  </a>
</p>

AI-powered interview practice platform. Candidates pick a role and level, answer timed questions, and receive structured feedback from a local or cloud AI model.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS, TypeScript |
| Backend | Spring Boot 3.3, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16 (Flyway migrations) |
| Auth | HttpOnly JWT cookies |
| AI (default) | Ollama — `qwen3:8b` (runs locally) |
| AI (optional) | OpenAI `gpt-4.1-mini` |
| API docs | Swagger UI — `/swagger-ui.html` |

---

## Project structure

```
ai-interview-platform/
├── frontend/          # Next.js app
└── backend/           # Spring Boot API
    └── docker-compose.yml   # PostgreSQL container
```

---

## Quick start

### 1. Database

```bash
cd backend
docker compose up -d
```

### 2. AI model (Ollama — default)

```bash
# Install: https://ollama.com
ollama pull qwen3:8b
ollama serve          # runs on http://localhost:11434
```

### 3. Backend

```bash
cd backend
./mvnw spring-boot:run
# API → http://localhost:8081
# Swagger → http://localhost:8081/swagger-ui.html
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
# App → http://localhost:3000
```

---

## Environment variables

All variables have defaults for local development. Override them in production.

### Backend

| Variable | Default | Description |
|---|---|---|
| `DB_URL` | `jdbc:postgresql://localhost:5432/interview_ai_db` | PostgreSQL connection URL |
| `DB_USERNAME` | `interview_ai` | Database user |
| `DB_PASSWORD` | `InterviewAI@123` | Database password |
| `JWT_SECRET` | *(insecure default)* | **Change in production** — 256-bit secret |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime (24 h) |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | CORS allowed origin |
| `AI_PROVIDER` | `ollama` | `ollama` or `openai` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `qwen3:8b` | Ollama model name |
| `OPENAI_API_KEY` | — | Required when `AI_PROVIDER=openai` |

### Frontend

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

---

## Using OpenAI instead of Ollama

Set two environment variables before starting the backend:

```bash
export AI_PROVIDER=openai
export OPENAI_API_KEY=sk-...
```

---

## Features

- Role-specific interview sessions (Frontend, Backend, Full Stack, Data Science, PM, DevOps)
- Seniority levels: Junior → Staff
- Interview types: Behavioral, Technical, System Design, Mixed
- Per-question timer and answer submission
- AI feedback: score, strengths, weaknesses, improved answer, recommendations
- Dashboard with session history and skill tracking
- Secure cookie-based authentication

---

## API modules

| Module | Responsibility |
|---|---|
| `auth` | Register, login, logout, current user |
| `interview` | Create sessions, fetch questions, dashboard |
| `answer` | Submit answers with time tracking |
| `feedback` | Retrieve AI-generated feedback per answer |
| `user` | User profile |
