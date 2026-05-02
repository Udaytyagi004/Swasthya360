import React, { useState } from 'react';
import SymptomForm from '../components/SymptomForm';
import AssistantChat from '../components/AssistantChat';
import { medicalService } from '../services/api';
import { Card, Button } from '../components/UI';
import { AlertCircle, MessageSquare, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [view, setView] = useState('symptoms'); // 'symptoms' or 'chat'
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your Swasthya AI assistant. How can I help you today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleProcessQuery = async (queryData) => {
    setLoading(true);
    setError(null);
    
    // Switch to chat view when checking symptoms
    setView('chat');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: queryData.query }]);

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        ...queryData,
        context: {
          age: parseInt(userData.age) || 22,
          gender: userData.gender || 'male',
          location: userData.location || 'India'
        }
      };

      const response = await medicalService.processQuery(payload);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.reasoning || 'I have analyzed your symptoms.',
        diagnosis: response.diagnosis,
        confidence: response.confidence,
        risk_level: response.risk_level,
        preventive_measures: response.preventive_measures,
        suggested_cure: response.suggested_cure,
        emergency_triggered: response.emergency_triggered
      }]);

      if (response.emergency_triggered) {
        alert('EMERGENCY ALERT: High risk detected. Please seek immediate medical attention.');
      }

    } catch (err) {
      setError('Failed to connect to the medical engine. Please try again.');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error processing your request. Please try again in a moment.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleChatMessage = (text) => {
    handleProcessQuery({ query: text });
  };

  return (
    <div className="min-h-screen pt-[140px] pb-4 px-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
      {/* Toggle Button - Fixed at top right */}
      <div className="fixed top-[110px] right-10 z-50">
        <button 
          onClick={() => setView(view === 'symptoms' ? 'chat' : 'symptoms')}
          className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-500 transition-all text-slate-700 dark:text-slate-200 font-semibold group"
        >
          {view === 'symptoms' ? (
            <>
              Go to Chat <MessageSquare size={20} className="group-hover:text-orange-500 transition-colors" />
            </>
          ) : (
            <>
              Check Symptoms <Activity size={20} className="group-hover:text-orange-500 transition-colors" />
            </>
          )}
        </button>
      </div>

      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">
        <AnimatePresence mode="wait">
          {view === 'symptoms' ? (
            <motion.div
              key="symptoms"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-h-0"
            >
              <SymptomForm onSubmit={handleProcessQuery} />
              {error && (
                <Card className="mt-4 p-4 border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 flex items-center gap-3 text-red-700 dark:text-red-400">
                  <AlertCircle size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 min-h-0"
            >
              <AssistantChat 
                messages={messages} 
                onSendMessage={handleChatMessage} 
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
