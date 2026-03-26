# Task Manager

A full-stack task management application built for the Microchip Full Stack Software Engineer Exercise.

## Tech Stack

| Layer      | Technology                                              |
| ---------- | ------------------------------------------------------- |
| Frontend   | React 18, TypeScript, MUI, React Router, TanStack Query |
| Backend    | Node.js, Express, TypeScript, Zod                       |
| Database   | PostgreSQL 16 with Prisma ORM                           |
| Auth       | JWT (bcrypt + jsonwebtoken)                             |
| API Docs   | Swagger/OpenAPI (interactive at `/api-docs`)            |
| Infra      | Docker Compose                                          |

## Architecture

```
┌─────────────┐     ┌─────────────────────────────────────┐     ┌──────────────┐
│   Client    │     │              Server                 │     │  PostgreSQL  │
│  (React)    │────▶│  Routes → Controllers → Services    │────▶│   Database   │
│  Port 5173  │     │                          ↓          │     │  Port 5432   │
│             │◀────│              Repositories (Prisma)   │◀────│              │
└─────────────┘     └─────────────────────────────────────┘     └──────────────┘
                                  Port 3000
```

**Backend Layering:**
- **Routes** — Express routes with Zod validation middleware and Swagger annotations
- **Controllers** — HTTP layer: parse requests, call services, send responses
- **Services** — Business logic: auth, authorization, data transformations
- **Repositories** — Data access: Prisma queries with soft-delete filtering

## Quick Start (Docker)

Prerequisites: [Docker](https://docs.docker.com/get-docker/) and Docker Compose.

```bash
git clone <repo-url>
cd task-manager
docker compose up --build
```

This starts three containers:
- **PostgreSQL** on port 5432
- **API Server** on port 3000 (includes Swagger UI at `/api-docs`)
- **Client** on port 5173

Open **http://localhost:5173** to use the app.

## Local Development (without Docker)

Prerequisites: Node.js 22+, PostgreSQL 16+ running locally.

### 1. Database Setup

Create a PostgreSQL database named `taskmanager`, or start one via Docker:

```bash
docker run -d --name taskmanager-db -e POSTGRES_DB=taskmanager -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine
```

### 2. Server

```bash
cd server
cp ../.env.example .env    # Edit DATABASE_URL and JWT_SECRET if needed
npm install
npx prisma migrate dev     # Create tables
npx prisma db seed         # Load sample data
npm run dev                # Starts on http://localhost:3000
```

### 3. Client

```bash
cd client
npm install
npm run dev                # Starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:3000` automatically.

## Seed Data Credentials

| User            | Email                | Password      |
| --------------- | -------------------- | ------------- |
| Alice Johnson   | alice@example.com    | password123   |
| Bob Smith       | bob@example.com      | password123   |
| Charlie Brown   | charlie@example.com  | password123   |

The seed includes 18 tasks across all statuses (Todo, In Progress, Done), assigned to different users.

## API Documentation

Interactive Swagger UI is available at **http://localhost:3000/api-docs** when the server is running.

### Endpoints Summary

| Method | Endpoint                  | Auth     | Description                          |
| ------ | ------------------------- | -------- | ------------------------------------ |
| POST   | `/api/auth/register`      | No       | Create a new account                 |
| POST   | `/api/auth/login`         | No       | Login, returns JWT token             |
| GET    | `/api/auth/me`            | Bearer   | Get current user                     |
| GET    | `/api/tasks`              | Bearer   | List tasks (paginated, filterable)   |
| GET    | `/api/tasks/:id`          | Bearer   | Get a single task                    |
| POST   | `/api/tasks`              | Bearer   | Create a task                        |
| PUT    | `/api/tasks/:id`          | Bearer   | Update a task                        |
| DELETE | `/api/tasks/:id`          | Bearer   | Soft delete (creator only)           |
| GET    | `/api/users`              | Bearer   | List all users                       |
| GET    | `/api/health`             | No       | Health check                         |

### Query Parameters for `GET /api/tasks`

| Parameter   | Type   | Default | Description                     |
| ----------- | ------ | ------- | ------------------------------- |
| page        | number | 1       | Page number                     |
| limit       | number | 10      | Items per page (max 100)        |
| status      | string | —       | Filter: TODO, IN_PROGRESS, DONE |
| assigneeId  | UUID   | —       | Filter by assigned user          |

## Database Schema

### Users
- `id` (UUID, PK)
- `email` (unique)
- `password` (bcrypt hashed)
- `name`
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)

### Tasks
- `id` (UUID, PK)
- `title`, `description`, `status` (enum: TODO, IN_PROGRESS, DONE)
- `assigneeId` (FK → users), `createdById` (FK → users)
- `dueDate`
- `createdAt`, `updatedAt`, `deletedAt` (soft delete)
- Indexes on `status`, `assigneeId`, `deletedAt`

## Security

- Helmet.js for security headers
- CORS restricted to client origin
- Rate limiting: 10 req/min on auth, 100 req/min globally
- bcrypt password hashing (salt rounds = 10)
- JWT tokens expire after 24 hours
- Input validation on all endpoints via Zod
- Soft delete preserves data integrity

## Project Structure

```
task-manager/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios client + API functions
│   │   ├── components/     # Shared UI components
│   │   ├── contexts/       # Auth context (JWT state)
│   │   ├── hooks/          # React Query hooks
│   │   ├── pages/          # Page components
│   │   ├── schemas/        # Zod validation schemas
│   │   └── types/          # TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Sample data
│   ├── src/
│   │   ├── controllers/    # HTTP handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access (Prisma)
│   │   ├── middleware/      # Auth, validation, errors
│   │   ├── routes/         # Express routes + Swagger
│   │   ├── schemas/        # Zod request schemas
│   │   └── utils/          # AppError, logger
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```
