import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Compass, AlertCircle, CheckCircle } from 'lucide-react';

export const SignUp: React.FC = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    try {
      setError('');
      setSubmitting(true);
      await register(name, email, password, bio);
      setSuccess(true);
      await login(email, password);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Try another email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-8 shadow-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group justify-center">
            <Compass className="w-8 h-8 text-brand-500 group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-extrabold text-xl bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent">
              TravelTales India
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Create Account</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Start sharing your travel logs across India</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Registered successfully! Logging in...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Aarav Sharma"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aarav@traveltales.in"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Short Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other explorers about yourself..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-brand-500 text-gray-800 dark:text-slate-200 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || success}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-brand-500 hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
export default SignUp;
