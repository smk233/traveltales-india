import React from 'react';
import { Compass, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Compass className="w-6 h-6 text-brand-500" />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-600 to-rose-500 bg-clip-text text-transparent">
              TravelTales India
            </span>
          </div>

          <div className="flex gap-6 text-sm text-gray-500 dark:text-slate-400">
            <Link to="/destinations" className="hover:text-brand-500 transition-colors">
              Destinations
            </Link>
            <a href="#" className="hover:text-brand-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-brand-500 transition-colors">
              Terms of Use
            </a>
          </div>

          <div className="flex items-center gap-4 text-gray-500 dark:text-slate-400">
            <span className="text-xs flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> in India
            </span>
            <div className="flex gap-3">
              <a href="#" className="p-1.5 hover:text-brand-500 transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="p-1.5 hover:text-brand-500 transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} TravelTales India. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
