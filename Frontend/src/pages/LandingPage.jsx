import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '../components/UI';
import { Stethoscope, Shield, Zap, MessageSquare, Heart, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-orange-50 dark:bg-orange-900/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold text-sm mb-6 uppercase tracking-wider">
              Next-Gen Medical Assistance
            </span>
            <h1 className="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8">
              Your Personal AI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                Medical Guardian
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience the future of healthcare with Swasthya360. Get instant symptom diagnosis, 
              personalized medical advice, and emergency alerts—all powered by advanced AI agents.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isLoggedIn ? "/home" : "/signup"}>
                <Button className="px-10 py-4 text-lg">
                  {isLoggedIn ? 'Go to Assistant' : 'Get Started Free'}
                  <ChevronRight size={20} />
                </Button>
              </Link>
              {!isLoggedIn && (
                <Link to="/login">
                  <Button variant="outline" className="px-10 py-4 text-lg">
                    Try Demo
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features for Your Health</h2>
            <p className="text-slate-500 dark:text-slate-400">Comprehensive medical support at your fingertips.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap className="text-orange-500" />}
              title="Instant Diagnosis"
              description="Input your symptoms and get accurate AI-driven analysis of potential conditions and prevention."
            />
            <FeatureCard 
              icon={<MessageSquare className="text-blue-500" />}
              title="Expert AI Chat"
              description="Consult with specialized medical agents for your queries with context-aware responses."
            />
            <FeatureCard 
              icon={<Shield className="text-emerald-500" />}
              title="Emergency Alerts"
              description="Real-time detection of critical symptoms with automated emergency alerts and instructions."
            />
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-[2rem] p-12 lg:p-20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4">99.9% Accuracy</h2>
              <p className="text-slate-400">Driven by world-class medical LLMs and agentic workflows.</p>
            </div>
            <div className="h-px w-full md:w-px md:h-20 bg-slate-700" />
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-bold mb-4">24/7 Support</h2>
              <p className="text-slate-400">Your health doesn't sleep, and neither does your assistant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">Swasthya360</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">© 2026 Swasthya360 AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Terms</a>
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card className="p-10 hover:-translate-y-2 transition-all duration-300 dark:bg-slate-900 dark:border-slate-800">
    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
  </Card>
);

export default LandingPage;
