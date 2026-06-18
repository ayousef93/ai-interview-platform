<h1 align="center">InterviewAI</h1>

<p align="center">
  An AI-powered platform for practicing interviews and receiving structured feedback.
</p>

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
  <a href="https://www.postgresql.org/">
    <img alt="PostgreSQL" src="https://img.shields.io/badge/Database-PostgreSQL_16-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  </a>
  <a href="https://ollama.com/">
    <img alt="Ollama" src="https://img.shields.io/badge/AI-Ollama_Qwen3-000000?style=flat-square" />
  </a>
</p>

InterviewAI lets candidates choose an interview role, seniority level, and interview type. Candidates answer timed questions and receive AI-generated scores, strengths, weaknesses, recommendations, and improved answers.

## Features

- Role-specific interviews for Frontend, Backend, Full Stack, Data Science, Product Management, and DevOps
- Seniority levels from Junior to Staff
- Behavioral, technical, system design, and mixed interviews
- Timed questions and answer submission
- Structured AI feedback for every answer
- Dashboard with interview history and skill tracking
- Secure authentication using JWTs stored in HttpOnly cookies

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.3, Java 21, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16 with Flyway migrations |
| Authentication | JWT in HttpOnly cookies |
| Default AI provider | Ollama with `qwen3:8b` |
| Optional AI provider | OpenAI with `gpt-4.1-mini` |
| API documentation | Swagger UI |

## Project structure

```text
ai-interview-platform/
├── frontend/                 # Next.js web application
├── backend/                  # Spring Boot API
│   ├── docker-compose.yml    # Local PostgreSQL service
│   ├── mvnw                  # Maven wrapper
│   └── src/                  # Backend source code
└── README.md
```

## Prerequisites

Install the following before running the project:

- Node.js and npm
- Java 21
- Docker
- Ollama, unless you plan to use OpenAI instead

## Quick start

Run each service in a separate terminal.

### 1. Start PostgreSQL

```bash
cd backend
docker compose up -d
```

This starts PostgreSQL on `localhost:5432` with:

```text
Database: interview_ai_db
Username: postgres
Password: postgres
```

### 2. Start the AI model

Install [Ollama](https://ollama.com), then download and run the default model:

```bash
ollama pull qwen3:8b
ollama serve
```

Ollama runs at `http://localhost:11434`.

> If Ollama is already running as a background service, you do not need to run `ollama serve` again.

### 3. Start the backend

From the project root:

```bash
cd backend
DB_USERNAME=postgres DB_PASSWORD=postgres ./mvnw spring-boot:run
```

The backend will be available at:

- API: `http://localhost:8081`
- Swagger UI: `http://localhost:8081/swagger-ui.html`

The database tables are created and validated automatically through Flyway migrations.

### 4. Configure and start the frontend

Create `frontend/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081
```

Then start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment variables

The application includes defaults for local development. Environment variables should be set explicitly in production.

### Backend

| Variable | Default | Description |
| --- | --- | --- |
| `DB_URL` | `jdbc:postgresql://localhost:5432/interview_ai_db` | PostgreSQL connection URL |
| `DB_USERNAME` | `interview_ai` | PostgreSQL username |
| `DB_PASSWORD` | `InterviewAI@123` | PostgreSQL password |
| `JWT_SECRET` | Development-only value | Secret used to sign JWTs; replace it in production |
| `JWT_EXPIRATION_MS` | `86400000` | Token lifetime in milliseconds (24 hours) |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Allowed frontend origin for CORS |
| `AI_PROVIDER` | `ollama` | AI provider: `ollama` or `openai` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `qwen3:8b` | Ollama model name |
| `OPENAI_API_KEY` | None | Required when using OpenAI |

> The Docker Compose database uses `postgres` as both its username and password. Pass those values when starting the backend, as shown in the quick-start command.

### Frontend

| Variable | Local value | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8081` | Base URL of the backend API |

## Using OpenAI instead of Ollama

Set the provider and API key before starting the backend:

```bash
cd backend
AI_PROVIDER=openai \
OPENAI_API_KEY=your_api_key \
DB_USERNAME=postgres \
DB_PASSWORD=postgres \
./mvnw spring-boot:run
```

When OpenAI is enabled, Ollama does not need to be running.

## API modules

| Module | Responsibility |
| --- | --- |
| `auth` | Registration, login, logout, and current-user details |
| `interview` | Interview sessions, questions, and dashboard data |
| `answer` | Answer submission and time tracking |
| `feedback` | AI-generated feedback for submitted answers |
| `user` | User profile management |

## Stopping local services

Stop the frontend and backend with `Ctrl+C` in their terminals. Stop PostgreSQL with:

```bash
cd backend
docker compose down
```
