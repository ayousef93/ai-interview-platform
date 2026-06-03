# interview-ai-backend

Production-ready Spring Boot backend for an AI Interview Preparation Platform.

## Stack

- Java 21
- Spring Boot 3
- Maven
- PostgreSQL 16
- Spring Data JPA
- Spring Security
- JWT in HttpOnly cookies
- BCrypt password hashing
- Flyway migrations
- Swagger/OpenAPI
- OpenAI integration with `WebClient`

## Run Locally

Use your local PostgreSQL on `localhost:5432`.

Create the database if it does not exist:

```bash
createdb interview_ai_db
```

Run the API:

```bash
./mvnw spring-boot:run
```

The API runs on:

```text
http://localhost:8081
```

Swagger UI:

```text
http://localhost:8081/swagger-ui.html
```

## Environment

Default database settings:

```text
DB_URL=jdbc:postgresql://localhost:5432/interview_ai_db
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Override them when needed:

```bash
export DB_URL=jdbc:postgresql://localhost:5432/interview_ai_db
export DB_USERNAME=your_user
export DB_PASSWORD=your_password
```

## AI Provider

The backend defaults to local Ollama:

```text
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:8b
```

Make sure Ollama is running and the model exists:

```bash
ollama list
ollama pull qwen3:8b
```

If you install a coder model later, point the backend at it:

```bash
export OLLAMA_MODEL=qwen2.5-coder:latest
```

You can still use OpenAI by switching provider:

```bash
export AI_PROVIDER=openai
export OPENAI_API_KEY=your_api_key
```

If the selected AI provider fails, the service falls back to mock questions and feedback.

## Cookie Auth

Login and register set an HttpOnly cookie named `access_token`.

The frontend must call the API with:

```ts
credentials: "include"
```

No JWT is returned in response bodies.

## Required APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

POST /api/interviews
GET  /api/interviews
GET  /api/interviews/{id}

GET  /api/interviews/{id}/questions

POST /api/answers
GET  /api/feedback/{answerId}

GET  /api/dashboard
```

## Notes

- CORS allows `http://localhost:3000` with credentials.
- Flyway owns the schema and JPA uses `ddl-auto: validate`.
- `GET /api/interviews/dashboard` is also available as a frontend-friendly alias.
- `docker-compose.yml` is optional and only provided if you want an isolated Postgres later.
