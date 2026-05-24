# Avidus Interactive RBAC Task Management

## Live Deployment

### Frontend (Vercel)
https://avidus-interactive-project.vercel.app/

### Backend API (Render)
https://avidus-interactive-project.onrender.com

---

# Overview

A full-stack MERN task management application with JWT authentication, Role-Based Access Control (RBAC), admin management tools, activity logging, and analytics.

The application supports two user roles:

- **User** → Create, view, update, and delete only their own tasks
- **Admin** → Manage users, monitor all tasks, delete any task, view activity logs, and access analytics

---

# Features

## Authentication & Security

- JWT Authentication
- Secure Login & Registration
- Password hashing using bcryptjs
- Protected API routes
- Persistent authentication state

## Role-Based Access Control (RBAC)

- Separate Admin and User roles
- Admin-only protected routes
- User-specific task access
- Middleware-based authorization

## Task Management

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- User-specific task ownership

## Admin Dashboard

- View all users
- Activate/Deactivate users
- Delete users
- View all tasks
- Delete any task
- View system activity logs
- View analytics dashboard

## Activity Logging

Tracks:

- User login
- Task creation
- Task updates
- Task deletion
- Admin actions

## Analytics

Admin analytics include:

- Total users
- Total tasks
- Completed tasks
- Pending tasks

## Frontend Features

- React + Vite frontend
- Protected routes
- Responsive UI
- Admin navigation system
- Axios API integration

---

# Tech Stack

## Frontend

- React.js
- Vite
- React Router DOM
- Axios
- Context API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

# Project Structure

```text
backend/
  src/
    app.js
    server.js
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/

frontend/
  src/
    api/
    components/
    context/
    pages/
```

---

# Backend API Routes

## Authentication Routes

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

## Task Routes

```text
POST   /api/v1/tasks
GET    /api/v1/tasks
PUT    /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

## Admin Routes

```text
GET    /api/v1/admin/users
DELETE /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id/status
GET    /api/v1/admin/tasks
DELETE /api/v1/admin/tasks/:id
GET    /api/v1/admin/logs
GET    /api/v1/admin/analytics
```

---

# Local Development Setup

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB (Local) OR MongoDB Atlas

---

# Backend Setup

## Step 1 — Navigate to Backend

```bash
cd backend
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Create Environment File

Create a `.env` file inside backend:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/avidus_rbac
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

## Step 4 — Start Backend Server

```bash
npm run dev
```

Backend Local URL:

```text
http://localhost:5000
```

---

# Frontend Setup

## Step 1 — Navigate to Frontend

```bash
cd frontend
```

## Step 2 — Install Dependencies

```bash
npm install
```

## Step 3 — Create Environment File

Create a `.env` file inside frontend:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

## Step 4 — Start Frontend

```bash
npm run dev
```

Frontend Local URL:

```text
http://localhost:5173
```

---

# Production Environment Variables

## Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

## Frontend (.env)

```env
VITE_API_URL=https://avidus-interactive-project.onrender.com/api/v1
```

---

# Admin Access

To access the Admin Dashboard:

1. Register a new account
2. Select the `Admin` role during registration

Admin dashboard includes:

- Analytics dashboard
- User management
- Task monitoring
- Activity logs

---

# Analytics Dashboard

The admin analytics endpoint provides:

- Total users
- Total tasks
- Completed tasks
- Pending tasks

---

# Development Note

The backend includes a temporary in-memory database fallback for local testing.

Run backend with memory database:

```bash
USE_MEMORY_DB=true npm run dev
```

This mode is useful for testing without MongoDB, but data resets after server restart.

---

# Deployment

## Frontend Deployment (Vercel)

https://avidus-interactive-project.vercel.app/

## Backend Deployment (Render)

https://avidus-interactive-project.onrender.com

## Database

MongoDB Atlas

---

# Future Improvements

- Email notifications
- Task deadlines & reminders
- Team collaboration
- File attachments
- Dark mode
- Pagination & filtering
- Docker support
- CI/CD pipelines
- Swagger API documentation

---

# Author

Developed by Madhurima Kumari
