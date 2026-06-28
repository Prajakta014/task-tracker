# TaskFlow — MERN Task Tracker

A full-stack Task Tracker built with **MongoDB, Express.js, React.js, Node.js (MERN Stack)**.

---

## Features

- ✅ Create, Read, Update, Delete tasks (Full CRUD)
- 🔍 Search tasks by title/description
- 🎯 Filter by status & priority
- 🔃 Sort by date, title, priority, due date
- 📊 Stats dashboard (total, pending, in-progress, completed)
- 📱 Fully responsive UI
- ⚡ Dynamic updates without page refresh
- 🏷️ Tags support
- 📅 Due date with overdue warnings
- 🗑️ Bulk clear completed tasks
- ✔️ Form validation (frontend + backend)
- 🌐 REST API with proper error handling

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, React Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (via Mongoose) |
| Styling | Custom CSS with CSS Variables |
| Notifications | React Hot Toast |
| Icons | React Icons (Feather) |

---

## Project Structure

```
task-tracker/
├── backend/
│   ├── models/
│   │   └── Task.js          # Mongoose schema
│   ├── routes/
│   │   └── taskRoutes.js    # REST API routes
│   ├── server.js            # Express server
│   ├── .env.example         # Environment variables template
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.js
    │   │   ├── StatsBar.js
    │   │   ├── FilterBar.js
    │   │   ├── TaskCard.js
    │   │   ├── TaskList.js
    │   │   └── TaskForm.js
    │   ├── context/
    │   │   └── TaskContext.js  # Global state management
    │   ├── pages/
    │   │   └── Dashboard.js
    │   ├── utils/
    │   │   └── api.js          # Axios API utility
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

---

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free) OR local MongoDB

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd task-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tasktracker?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

> 📝 Get your MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm start
```

App opens at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (supports ?status, ?priority, ?search, ?sortBy, ?sortOrder) |
| GET | `/api/tasks/stats` | Get task statistics |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Quick status update |
| DELETE | `/api/tasks/:id` | Delete single task |
| DELETE | `/api/tasks` | Delete all completed tasks |

---

## Deployment

### Backend — Render.com (Free)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - Root directory: `backend`
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `MONGODB_URI` → your MongoDB Atlas URI
   - `FRONTEND_URL` → your Vercel frontend URL
   - `NODE_ENV` → `production`

### Frontend — Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect your GitHub repo
3. Set:
   - Root directory: `frontend`
   - Framework: Create React App
4. Add environment variable:
   - `REACT_APP_API_URL` → your Render backend URL + `/api`
   - Example: `https://task-tracker-api.onrender.com/api`

---

## Environment Variables Summary

### Backend `.env`
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

### Frontend `.env`
```
REACT_APP_API_URL=your_backend_url/api
```

---

Made with ❤️ — MERN Stack Task Tracker
