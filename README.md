# Avidus Interactive RBAC Task Management

A full-stack MERN task management application with JWT authentication, role-based access control, admin management tools, activity logging, and analytics.

The project supports two roles:

- **User**: create, view, update, and delete only their own tasks.
- **Admin**: manage users, monitor all tasks, delete any task, view activity logs, and access system analytics.

## Features

- JWT authentication for login, registration, and protected sessions
- Password hashing with bcrypt
- Role-based API authorization for `Admin` and `User`
- Protected task APIs scoped to the logged-in user
- Admin APIs for users, tasks, logs, and analytics
- Activity logging for login, task creation, task updates, and task deletion
- React + Vite frontend with protected routes
- Admin-only navigation and dashboard pages
- Responsive UI for task and admin workflows

## Tech Stack

**Frontend**

- React.js
- Vite
- React Router
- Axios

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Project Structure

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

## Backend API Routes

### Auth

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Tasks

```text
POST   /api/v1/tasks
GET    /api/v1/tasks
PUT    /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
```

### Admin

```text
GET    /api/v1/admin/users
DELETE /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id/status
GET    /api/v1/admin/tasks
DELETE /api/v1/admin/tasks/:id
GET    /api/v1/admin/logs
GET    /api/v1/admin/analytics
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from `.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/avidus_rbac
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file from `.env.example` if needed:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Admin Access

Register a new account and select the `Admin` role to access the admin dashboard.

Admin pages include:

- Analytics dashboard
- User management
- Task monitoring
- Activity logs

## Analytics

The admin analytics endpoint returns:

- Total users
- Total tasks
- Completed tasks
- Pending tasks

## Development Note

The backend includes a temporary in-memory database fallback for local testing when MongoDB is unavailable:

```bash
USE_MEMORY_DB=true npm run dev
```

This mode is useful for quick testing, but data resets when the backend restarts. For real usage, configure MongoDB through `MONGO_URI`.
