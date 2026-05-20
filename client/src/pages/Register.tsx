import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-hot-toast';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'member'>('member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Successfully registered!');
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed. Try a different email.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to collaborate with your team
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <label htmlFor="full-name" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Full Name
            </label>
            <input
              id="full-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm mt-1"
              placeholder="Alex Johnson"
            />
          </div>
          <div>
            <label htmlFor="email-address" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Email Address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 placeholder-gray-400 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm mt-1"
              placeholder="•••••••• (Min 6 characters)"
            />
          </div>
          <div>
            <label htmlFor="role" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Workplace Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'member')}
              className="relative block w-full rounded-lg border border-gray-300 px-3 py-2.5 bg-white text-gray-900 focus:z-10 focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm mt-1"
            >
              <option value="member">Team Member (view tasks, update status)</option>
              <option value="admin">Admin (full manage, create projects & tasks)</option>
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
