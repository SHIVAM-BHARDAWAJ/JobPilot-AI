import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotModal, setForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { login } = useAuth();
  const { showNotification } = useJobs();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(email || 'alex.morgan@university.edu', password);
    showNotification('Welcome back to JobPilot!');
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login('alex.morgan@university.edu', 'demo123');
    showNotification('Logged in with Demo Student Account!');
    navigate('/dashboard');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotModal(false);
    showNotification(`Password reset instructions sent to ${resetEmail || 'your email'}!`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-2xl font-extrabold text-white tracking-tight">
              JobPilot
            </span>
          </Link>
          <p className="text-xs text-slate-400">
            Sign in to your autonomous career assistant account
          </p>
        </div>

        {/* Login Card */}
        <div className="p-7 rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl space-y-5">
          {/* Quick Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>1-Click Demo Login (Candidate Profile)</span>
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">
              Or sign in with email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => setForgotModal(true)}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-400 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Reset Password</h3>
            <p className="text-xs text-slate-400">
              Enter your registered email and we'll send a password recovery token.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-3 text-xs">
              <input
                type="email"
                required
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModal(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                >
                  Send Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
