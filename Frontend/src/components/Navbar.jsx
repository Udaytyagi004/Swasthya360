import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, User, Bell, LogOut } from 'lucide-react';
import { Button } from './UI';

const Navbar = () => {
  const location = useLocation();
  const [notifications, setNotifications] = React.useState([]);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);
  const isLoggedIn = localStorage.getItem('token'); // Mock auth check

  React.useEffect(() => {
    const handleEmergency = (event) => {
      const newNotif = {
        id: Date.now(),
        message: event.detail?.message || 'Emergency alert triggered.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'emergency'
      };
      setNotifications(prev => [newNotif, ...prev]);
    };

    window.addEventListener('emergency-alert', handleEmergency);
    return () => window.removeEventListener('emergency-alert', handleEmergency);
  }, []);

  const clearNotifications = () => {
    setNotifications([]);
    setShowDropdown(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 z-[100]">
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
              <div className="flex items-center gap-4 relative">
                {/* Notification Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={`p-2 rounded-xl transition-all duration-300 relative ${
                      showDropdown ? 'bg-orange-50 text-orange-500' : 'text-slate-400 dark:text-slate-500 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Bell size={20} />
                    {notifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-12 right-0 w-80 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[100]">
                      <div className="p-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                        <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">Notifications</span>
                        {notifications.length > 0 && (
                          <button onClick={clearNotifications} className="text-[10px] font-bold text-orange-500 hover:underline uppercase">Clear All</button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                          notifications.map((notif) => (
                            <div key={notif.id} className="p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 flex items-center justify-center shrink-0">
                                  <Bell size={14} />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">{notif.message}</p>
                                  <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-10 text-center">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                              <Bell size={24} />
                            </div>
                            <p className="text-sm text-slate-400">No new notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

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
