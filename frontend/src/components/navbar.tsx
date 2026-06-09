import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './theme-toggle';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Compass className="w-8 h-8 text-brand-500 group-hover:rotate-45 transition-transform duration-300" />
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent">
              TravelTales India
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/destinations"
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-brand-500 dark:text-slate-300 dark:hover:text-brand-500 transition-colors"
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>
            {user && (
              <Link
                to="/create-blog"
                className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-brand-500 dark:text-slate-300 dark:hover:text-brand-500 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Write a Tale
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="p-2 text-gray-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-500 transition-colors"
                    title="Admin Dashboard"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                  </Link>
                )}

                <Link
                  to={`/profile/${user._id}`}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-slate-200 hover:text-brand-500 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=placeholder'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-brand-500"
                  />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/signin"
                  className="text-sm font-bold text-gray-700 dark:text-slate-200 hover:text-brand-500 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
