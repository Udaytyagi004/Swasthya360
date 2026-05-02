import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, User, Bell, LogOut } from 'lucide-react';
import { Button } from './UI';

const Navbar = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLoggedIn = localStorage.getItem('token'); // Mock auth check

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 dark:shadow-none group-hover:rotate-12 transition-transform duration-300">
            <Stethoscope size={24} />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent">
            Swasthya360
          </span>
        </Link>

        {!isAuthPage && (
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-orange-500 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
                </button>
                <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm active:scale-95">
                  <User size={20} />
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
