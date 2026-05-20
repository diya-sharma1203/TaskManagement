import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AuthLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-brand-50 via-white to-brand-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <Outlet />
      </div>
    </div>
  );
};
export default AuthLayout;
