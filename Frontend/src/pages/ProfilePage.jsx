import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';
import { medicalService } from '../services/api';
import { 
  User, Mail, MapPin, Calendar, Settings, Sliders, 
  Moon, Sun, Save, RotateCcw, LogOut, ChevronRight, Shield, X, Phone
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    age: '22',
    gender: 'male',
    location: 'India',
    emergencyContact: 'Not provided'
  });
  const [loading, setLoading] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [prompts, setPrompts] = useState({
    clinicalAgent: "You are a clinical assessment agent. Your goal is to analyze symptoms and provide a potential diagnosis...",
    actionAgent: "You are an action agent. Your goal is to provide actionable advice, cures, and preventive measures based on the diagnosis...",
    chatAgent: "You are a friendly medical chat assistant. Help the user with their general medical queries..."
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await medicalService.getCurrentUser();
        setUserData(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // If unauthorized, redirect to login
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    
    // Theme check
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    // Load prompts
    const savedPrompts = localStorage.getItem('agent_prompts');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    await medicalService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const saveConfig = () => {
    localStorage.setItem('agent_prompts', JSON.stringify(prompts));
    alert('Configuration saved successfully!');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Information', icon: User, color: 'text-orange-500' },
    { id: 'preferences', label: 'Preferences', icon: Settings, color: 'text-blue-500' },
    { id: 'config', label: 'Configuration', icon: Sliders, color: 'text-emerald-500' },
    { id: 'logout', label: 'Logout', icon: LogOut, color: 'text-red-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard label="Full Name" value={userData.name} icon={User} />
              <InfoCard label="Email Address" value={userData.email} icon={Mail} />
              <InfoCard label="Age" value={userData.age} icon={Calendar} />
              <InfoCard label="Gender" value={userData.gender} icon={Shield} />
              <InfoCard label="Emergency Contact" value={userData.emergencyContact} icon={Phone} />
              <InfoCard label="Location" value={userData.location} icon={MapPin} className="md:col-span-2" />
            </div>
          </div>
        );
      case 'preferences':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Preferences</h3>
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-blue-500'} shadow-sm`}>
                  {isDarkMode ? <Moon size={24} /> : <Sun size={24} />}
                </div>
                <div>
                  <p className="font-bold text-lg text-slate-800 dark:text-white">Appearance</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Switch between light and dark theme</p>
                </div>
              </div>
              <button 
                onClick={toggleTheme}
                className={`w-16 h-9 rounded-full transition-all duration-300 relative ${isDarkMode ? 'bg-orange-500' : 'bg-slate-200'}`}
              >
                <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow-md transition-all duration-300 ${isDarkMode ? 'left-8' : 'left-1'}`} />
              </button>
            </div>
          </div>
        );
      case 'config':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Agent Configuration</h3>
              <Button onClick={saveConfig} className="!py-2">
                <Save size={18} /> Save
              </Button>
            </div>
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <PromptEditor 
                label="Clinical Agent Prompt" 
                value={prompts.clinicalAgent} 
                onChange={(val) => setPrompts({ ...prompts, clinicalAgent: val })}
              />
              <PromptEditor 
                label="Action Agent Prompt" 
                value={prompts.actionAgent} 
                onChange={(val) => setPrompts({ ...prompts, actionAgent: val })}
              />
              <PromptEditor 
                label="Chat Agent Prompt" 
                value={prompts.chatAgent} 
                onChange={(val) => setPrompts({ ...prompts, chatAgent: val })}
              />
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
              <LogOut size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Ready to logout?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-xs">
              You'll need to sign in again to access your medical assistant.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setActiveTab('personal')}>Cancel</Button>
              <Button variant="danger" onClick={handleLogout}>Confirm Logout</Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-12 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sidebar */}
          <div className="lg:col-span-4 flex">
            <div className="w-full bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 bg-gradient-to-tr from-orange-500 to-orange-400 rounded-[2rem] flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-orange-200 dark:shadow-none mb-4 rotate-3 hover:rotate-0 transition-transform duration-300">
                  {userData.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white capitalize">{userData.name}</h2>
              </div>
              
              <div className="space-y-3 flex-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group ${
                      activeTab === tab.id 
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg scale-[1.02]' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={20} className={activeTab === tab.id ? '' : tab.color} />
                      <span className="font-bold">{tab.label}</span>
                    </div>
                    <ChevronRight size={18} className={`transition-transform duration-300 ${activeTab === tab.id ? 'translate-x-1' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8 flex relative">
            {/* Close Button Outside Card */}
            <button 
              onClick={() => navigate('/home')}
              className="absolute -top-10 -right-2 p-2 text-slate-400 hover:text-orange-500 transition-all duration-300"
            >
              <X size={28} />
            </button>

            <Card className="w-full p-10 min-h-[600px] flex flex-col dark:bg-slate-900 dark:border-slate-800 shadow-xl relative">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                  <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing your medical data...</p>
                </div>
              ) : renderContent()}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, icon: Icon, className = '' }) => (
  <div className={`p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl ${className}`}>
    <div className="flex items-center gap-3 text-slate-400 mb-2">
      <Icon size={16} />
      <span className="text-[10px] uppercase tracking-widest font-black">{label}</span>
    </div>
    <p className="text-lg font-bold text-slate-800 dark:text-white">{value}</p>
  </div>
);

const PromptEditor = ({ label, value, onChange }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between px-1">
      <label className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-tight">{label}</label>
      <span className="text-[10px] font-mono text-slate-400">{value.length} chars</span>
    </div>
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-sm text-slate-600 dark:text-slate-300 font-mono leading-relaxed resize-none"
    />
  </div>
);

export default ProfilePage;
