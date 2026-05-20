import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6 bg-white border border-gray-150 rounded-2xl shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-150 mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">404 - Page Not Found</h2>
      <p className="mt-2 text-sm text-gray-500 max-w-sm">
        The page you are looking for does not exist or has been relocated to another workspace area.
      </p>
      <div className="mt-6">
        <Link
          to="/dashboard"
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors shadow-sm inline-block"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
