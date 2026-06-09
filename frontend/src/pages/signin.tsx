import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Compass, AlertCircle } from 'lucide-react';

export const SignIn: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setError('');
      setSubmitting(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-8 shadow-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <Compass className="w-8 h-8 text-brand-500 group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-extrabold text-xl bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent">
              TravelTales India
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Welcome Back</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Sign in to share your travel tales</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@traveltales.in"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brand-500 hover:underline font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignIn;
