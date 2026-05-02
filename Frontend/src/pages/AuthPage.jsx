import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, Button } from '../components/UI';
import { Mail, Lock, User, MapPin, Calendar, Users, ArrowRight, Phone, X } from 'lucide-react';
import { medicalService } from '../services/api';

const AuthPage = ({ type = 'login' }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'male',
    location: '',
    emergencyContact: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (type === 'signup') {
        // Clean emergency contact (remove spaces, dashes, etc. to match backend regex)
        const cleanedContact = formData.emergencyContact.replace(/[\s\-\(\)]/g, '');
        
        const signupData = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          age: formData.age !== '' ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          location: formData.location || undefined,
          emergencyContact: cleanedContact
        };
        response = await medicalService.signup(signupData);
      } else {
        response = await medicalService.login({ 
          email: formData.email, 
          password: formData.password 
        });
      }
      
      const token = response.access_token || response.token || response.accessToken;
      const user = response.user || (type === 'login' ? null : formData);
      
      if (!token) {
        throw new Error('No authentication token received');
      }

      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      navigate('/home');
    } catch (error) {
      console.error('Auth Error:', error);
      const message = error.response?.data?.message || error.response?.data?.error || 'Auth failed. Please check your credentials.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-500">
      <Card className="w-full max-w-lg p-10 dark:bg-slate-900 dark:border-slate-800 shadow-2xl relative">
        <Link 
          to="/" 
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 group"
          aria-label="Back to landing page"
        >
          <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
        </Link>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            {type === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            {type === 'login' 
              ? 'Access your medical assistant and history' 
              : 'Join Swasthya for personalized medical assistance'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'signup' && (
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              icon={User}
              required
              value={formData.name}
              onChange={handleChange}
            />
          )}

          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            required
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            required
            value={formData.password}
            onChange={handleChange}
          />

          {type === 'signup' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Age"
                  name="age"
                  type="number"
                  placeholder="22"
                  icon={Calendar}
                  required
                  value={formData.age}
                  onChange={handleChange}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-slate-700 dark:text-slate-200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <Input
                label="Location"
                name="location"
                placeholder="India"
                icon={MapPin}
                required
                value={formData.location}
                onChange={handleChange}
              />

              <Input
                label="Emergency Contact"
                name="emergencyContact"
                placeholder="+1 234 567 890"
                icon={Phone}
                required
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </>
          )}

          <Button type="submit" fullWidth className="py-4 text-lg" disabled={loading}>
            {loading ? 'Processing...' : type === 'login' ? 'Sign In' : 'Sign Up'}
            {!loading && <ArrowRight size={20} />}
          </Button>
        </form>

        <div className="mt-8 text-center text-slate-600 dark:text-slate-400">
          {type === 'login' ? (
            <p>
              Don't have an account?{' '}
              <Link to="/signup" className="text-orange-600 font-bold hover:underline">Sign Up</Link>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 font-bold hover:underline">Sign In</Link>
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;
