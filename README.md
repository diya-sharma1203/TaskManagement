# Team Task Manager

A full-stack, cleanly structured Team Task Manager web application built using React, Express, MongoDB, and TypeScript. 

This project is configured as an orchestrated monorepo, allowing you to run and deploy both the backend API and frontend client as a **single, unified service** or run them separately for local development.

---

## Project Structure

- `/server`: Node.js, Express, TypeScript, and MongoDB (Mongoose) API.
- `/client`: React, Vite, TypeScript, and Tailwind CSS client application.
- `/package.json`: Orchestration scripts for monorepo installs, builds, and serving.

---

## Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally or a cloud URI)

### 1. Download Dependencies
In the root directory, run the following command to automatically install all dependencies for both the frontend and backend:
```bash
npm install
```

### 2. Configure Environment Variables

#### Backend (`/server/.env`)
Create `/server/.env` based on `/server/.env.example`:
```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=your_secret_key_here
```

#### Frontend (`/client/.env`)
For local development, create `/client/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```
*(In production/deployment, no environment variables are needed on the frontend because it dynamically falls back to relative `/api` calls on the same host).*

---

## Running the Application Locally

### Option A: Separated Development Mode (Recommended for code editing)
Run backend and frontend separately to enjoy Vite's Hot Module Replacement (HMR):

1. **Start Backend**:
   ```bash
   cd server
   npm run dev
   ```
2. **Start Frontend** (in a separate terminal):
   ```bash
   cd client
   npm run dev
   ```

### Option B: Single-Service Production Mode (Same as Deployed)
To test the single-service build locally:
1. Build both client and server:
   ```bash
   npm run build
   ```
2. Start the Express server serving both systems:
   ```bash
   npm start
   ```
3. Open your browser to `http://localhost:5001`. The frontend is fully served by the backend!

---

## Deployment (Railway Single-Service)

You can host this entire full-stack app on Railway's **Free Tier** as a single service.

### Configuration Settings
1. Create a new service on Railway connected to your GitHub repository.
2. Under **Settings** -> **General**:
   - Ensure the **Root Directory** setting is **empty** (`/`).
   - Railway will automatically detect the root `package.json`, install all subfolder dependencies via the postinstall script, compile the code via `npm run build`, and boot the app using `npm start`.
3. Under **Variables**, add the following backend environment variables:
   - `MONGODB_URI`: *Your MongoDB connection string (Atlas cluster or a Railway MongoDB database instance)*
   - `JWT_SECRET`: *A secure random string (e.g. `prod_secret_token_18423984`)*
   - `NODE_ENV`: `production`
4. Under **Settings** -> **Environment**, click **Generate Domain**. Your application is live!
