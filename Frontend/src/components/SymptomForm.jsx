import React, { useState } from 'react';
import { Card, Button, Input } from './UI';
import { Calendar, Clock, RefreshCcw, Search, Activity, ChevronDown } from 'lucide-react';

const COMMON_SYMPTOMS = [
  'Fever', 'Cough', 'Headache', 'Sore throat', 'Nausea',
  'Vomiting', 'Diarrhea', 'Chest pain', 'Shortness of breath',
  'Dizziness', 'Rash'
];

const SymptomForm = ({ onSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [onset, setOnset] = useState('');
  const [severity, setSeverity] = useState(3);

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom) 
        : [...prev, symptom]
    );
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setOtherSymptoms('');
    setDuration('');
    setOnset('');
    setSeverity(3);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const symptoms = [...selectedSymptoms];
    if (otherSymptoms.trim()) symptoms.push(otherSymptoms.trim());
    
    onSubmit({
      query: `I have ${symptoms.join(', ')} for ${duration}`,
      symptoms: symptoms,
      severity: severity,
      duration: duration
    });
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden max-w-4xl mx-auto border-slate-200 dark:border-slate-800">
      {/* Header - Fixed */}
      <div className="p-6 pb-2 border-b border-slate-50 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tell us about your symptoms</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Select symptoms, specify duration and severity.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Chips Section */}
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-3">Select Your Symptoms</label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>
          
          {/* Severity and Duration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                Severity <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <Activity size={18} />
                </div>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value))}
                  className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 dark:text-slate-200 appearance-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Search size={14} className="rotate-90" /> {/* Using Search as a pseudo-chevron or I can import ChevronDown */}
                </div>
              </div>
            </div>
            <Input
              label="Duration"
              placeholder="e.g., 2 days"
              icon={Clock}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>

          <Input
            label="Other Symptoms (Optional)"
            placeholder="e.g., headache, mild cough"
            value={otherSymptoms}
            onChange={(e) => setOtherSymptoms(e.target.value)}
          />
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <Button variant="outline" onClick={handleReset} className="px-8">
            <RefreshCcw size={18} />
            Reset
          </Button>
          <Button type="submit" className="px-10 py-3 text-lg">
            Check
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SymptomForm;
