# Team Task Manager

A full-stack, cleanly structured Team Task Manager web application built using React, Express, MongoDB, and TypeScript. 

This project provides role-based authentication allowing Administrators to manage projects, assign members, and create tasks, while Team Members can view assigned items and update task statuses.

---

## Project Structure

The project is split into two primary folders:
- `/server`: Node.js, Express, TypeScript, and MongoDB (Mongoose) API.
- `/client`: React, Vite, TypeScript, and Tailwind CSS client application.

```text
/
 ┣ client/                # React Vite Frontend Application
 ┣ server/                # Express TypeScript Backend Server
 ┗ README.md              # Project setup and documentation
```

---

## Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (running locally, or a MongoDB Atlas cloud connection URI)

### 1. Configure the Server (.env)
Navigate to the `/server` directory:
```bash
cd server
```

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Open `.env` and set your variables:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager   # Or your MongoDB Atlas connection string
JWT_SECRET=your_secret_key_here
```

Install server dependencies:
```bash
npm install
```

### 2. Configure the Client (.env)
Navigate to the `/client` directory:
```bash
cd ../client
```

Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

Set your API URL in `.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

Install client dependencies:
```bash
npm install
```

---

## Running the Application Locally

You will need to open two terminal windows or run them in background processes.

### Start the Backend Server
From the `/server` folder:
```bash
npm run dev
```
The server will run at `http://localhost:5001`. A health check is available at `http://localhost:5001/health`.

### Start the Frontend Client
From the `/client` folder:
```bash
npm run dev
```
The client will run in development mode at `http://localhost:3000` (or `http://localhost:5173`).

---

## Deployment (Railway Ready)

This project is pre-configured and ready for deployment on **Railway**.

### Server Deployment Setup
1. Create a new service on Railway connected to your GitHub repository.
2. Set the root directory of the backend service to `server`.
3. Add the following environment variables:
   - `PORT=8080` (or leave empty, Railway injects it automatically)
   - `MONGODB_URI` (your MongoDB Atlas connection string, or spin up a MongoDB service on Railway and link the variable)
   - `JWT_SECRET` (a strong secret phrase)
4. Build and start commands are automatically resolved from `server/package.json` scripts:
   - Build command: `npm run build`
   - Start command: `npm run start`

### Client Deployment Setup
1. Create a new service on Railway for the frontend.
2. Set the root directory to `client`.
3. Add the environment variable:
   - `VITE_API_URL` (set to your deployed Server backend URL, e.g., `https://your-server-service.up.railway.app/api`)
4. Build and start commands:
   - Build command: `npm run build` (which transpiles TypeScript and runs `vite build`)
   - Start command: `npm run preview -- --port 3000` (or configure a static site handler)

---

## Core Features

- **JWT Authentication**: Password hashing using bcryptjs, JWT storage in client `localStorage` with automated token injection in headers using Axios interceptors.
- **Role-based Actions**:
  - **Admin**: Create projects, add/manage members, create tasks, assign tasks, delete projects/tasks.
  - **Member**: View assigned projects and tasks, modify task status only (`To Do` ➔ `In Progress` ➔ `Completed`).
- **Dashboard Summary**: Displays total tasks, completed, pending, and overdue tasks with visual circular progress indicators.
- **Search & Filters**: Search task records by text, filter by status or priority, and sort by due dates or importance.
- **Input Validation**: Form checks and server validations using `express-validator` returning descriptive error feedback.
