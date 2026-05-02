import React, { useState, useRef, useEffect } from 'react';
import { Card, Button } from './UI';
import { Send, User, Bot, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

const AssistantChat = ({ messages, onSendMessage, loading }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-xl border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Medical Assistant</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active</span>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-950/30 scroll-smooth custom-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-orange-500 text-white'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] space-y-2`}>
              <div className={`px-5 py-3 rounded-2xl shadow-sm text-[15px] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-orange-50 dark:bg-orange-950/20 text-slate-800 dark:text-orange-200 rounded-tr-none' 
                  : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none'
              }`}>
                {msg.content}
              </div>

              {/* Special Result UI (Diagnosis/Risk) if present */}
              {msg.diagnosis && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  {/* Emergency Alert */}
                  {msg.emergency_triggered && (
                    <div className="bg-red-500 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse">
                      <AlertTriangle size={24} />
                      <div>
                        <p className="font-bold">IMMEDIATE ATTENTION REQUIRED</p>
                        <p className="text-xs opacity-90">This condition may be serious. Please contact emergency services.</p>
                      </div>
                    </div>
                  )}
 
                  {/* Primary Diagnosis */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black uppercase text-[10px] tracking-widest">
                        <ShieldCheck size={16} />
                        Clinical Assessment
                      </div>
                      {msg.confidence !== undefined && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500">
                          {Math.round(msg.confidence * 100)}% Match
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">{msg.diagnosis}</p>
                    {msg.confidence !== undefined && (
                      <div className="h-2 w-full bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
                          style={{ width: `${msg.confidence * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
 
                  {/* Secondary Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2">
                        <Activity size={14} />
                        Recommended Cure
                      </div>
                      <p className="text-blue-900 dark:text-blue-100 text-sm leading-relaxed">{msg.suggested_cure}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-black uppercase text-[10px] tracking-widest mb-2">
                        <AlertTriangle size={14} />
                        Risk Assessment
                      </div>
                      <p className="text-amber-900 dark:text-amber-100 text-sm font-bold">
                        {msg.risk_level || 'Standard Risk'}
                      </p>
                    </div>
                  </div>
 
                  {/* Prevention Card */}
                  {msg.preventive_measures && (
                    <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-widest mb-2">
                        <ShieldCheck size={14} />
                        Preventive Measures
                      </div>
                      {Array.isArray(msg.preventive_measures) ? (
                        <ul className="space-y-1.5 mt-2">
                          {msg.preventive_measures.map((measure, i) => (
                            <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300 text-sm">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                              <span>{measure}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{msg.preventive_measures}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700 rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-orange-500 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-transparent border-none focus:outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="rounded-xl h-12 w-12 !p-0 shadow-orange-200 dark:shadow-none"
          >
            <Send size={20} className={loading ? 'animate-pulse' : ''} />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AssistantChat;
