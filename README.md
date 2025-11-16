# Website Analytics Backend

A scalable backend API built using **Node.js**, **Express**, and **Prisma ORM** with **PostgreSQL** for database and **Redis** for caching and rate limiting. This service enables seamless collection and analysis of analytics events from multiple websites or applications using API keys.

## 🚀 Features

- 🔑 **API Key Management**
  - Register applications and generate unique API keys
  - Revoke and regenerate API keys
  - API key expiration support

- 📊 **Analytics Data Collection**
  - Capture user events such as clicks, visits, and device details
  - Store metadata including browser, OS, and screen size
  - High-volume ingestion support with rate limiting

- 📈 **Analytics Retrieval**
  - Get event-based insights (counts, unique users, device usage)
  - Fetch user-level analytics with detailed event history

- 🛡 **Security**
  - API key authentication via headers
  - Rate limiting to prevent abuse

- 🧳 **Deploy-ready**
  - Dockerized application
  - Supports cloud platforms like Render, Railway, or AWS

---

## 📂 Project Structure

<pre> ```bash src/ ├── controllers/ ├── middleware/ ├── prisma/ ├── routes/ ├── app.js └── server.js prisma/ ├── schema.prisma └── migrations/ ``` </pre>


## 🛠️ Tech Stack

- Node.js (Express)
- Prisma ORM
- PostgreSQL
- Redis (Rate Limiting / Caching)
- Docker & Docker Compose

---

## 🧪 API Endpoints

### 🔐 API Key Management

| Method | Endpoint                   | Description                   |
|--------|----------------------------|-------------------------------|
| POST   | `/api/auth/register`       | Register app & generate key   |
| GET    | `/api/auth/api-key`        | Retrieve active API keys      |
| POST   | `/api/auth/revoke`         | Revoke an API key             |
| POST   | `/api/auth/regenerate`     | Regenerate a new API key      |

### 📊 Analytics

| Method | Endpoint                        | Description                         |
|--------|----------------------------------|-------------------------------------|
| POST   | `/api/analytics/collect`        | Submit analytics event              |
| GET    | `/api/analytics/event-summary`  | Event-based summarization           |
| GET    | `/api/analytics/user-stats`     | User-level stats & recent activity  |

---

## 📦 Installation

### Prerequisites

- Node.js: >= 18.x
- PostgreSQL: >= 14.x
- Redis: >= 6.x
- Docker (optional for production)

---

### Clone the Repository

```bash
git clone https://github.com/<your-username>/analytics-backend.git
cd analytics-backend
Configure Environment Variables
Create a .env file in the root directory:

env
Copy code
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/analytics"
REDIS_URL="redis://localhost:6379"
PORT=4000
Install Dependencies
bash
Copy code
npm install
Setup Database
Run Prisma migrations:

bash
Copy code
npx prisma migrate dev --name init
(Optional) Open Prisma Studio:

bash
Copy code
npx prisma studio
Start the Server
bash
Copy code
npm start
or start with auto-reload:

bash
Copy code
npm run dev
Server is now running at:

arduino
Copy code
http://localhost:4000
🐋 Docker Setup
To build and run using Docker:

bash
Copy code
docker-compose up --build
This will start:

App Server (4000)

PostgreSQL (5432)

Redis (6379)

📬 Testing the APIs
Use Postman Collection or cURL:

Register App
bash
Copy code
curl -X POST http://localhost:4000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"name": "Test App", "ownerEmail": "admin@example.com"}'
Submit Analytics Event
bash
Copy code
curl -X POST http://localhost:4000/api/analytics/collect \
-H "Content-Type: application/json" \
-H "x-api-key: <YOUR_API_KEY>" \
-d '{"event": "click", "url": "https://example.com", "timestamp": "2024-11-15T10:30:00Z"}'
🚀 Deployment
This app is designed for easy deployment on platforms such as:

Railway

Render

Heroku

Deployment Checklist:
Ensure the .env is configured on the platform

Define PORT environment variable

Run Prisma migration using:

bash
Copy code
npx prisma migrate deploy
Use Dockerfile for container-based deployment
