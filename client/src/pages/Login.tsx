import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to manage your team's tasks
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="email-address" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm mt-1"
              placeholder="name@company.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm mt-1"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Login;
