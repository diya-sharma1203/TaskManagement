import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import SingleProject from './pages/SingleProject';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import NotFound from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default entry redirects to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Authentication Pages (guest only) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Dashboard/Workspace Pages (auth required) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<SingleProject />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/team" element={<Team />} />
            <Route path="/404" element={<NotFound />} />
          </Route>

          {/* Wildcard Route */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #f3f4f6',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
          }
        }} 
      />
    </AuthProvider>
  );
};
export default App;
