import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Bell,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  User,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const { systemStatus, setApiKeyModalOpen } = useJobs();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const isConfigured = systemStatus?.tinyfish?.configured;

  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
              <Compass className="w-5 h-5 text-white transform group-hover:rotate-45 transition duration-300" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                JobPilot
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  AI
                </span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block -mt-1">
                Your AI Career Assistant
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search roles, skills, or companies (e.g. Google, React, AI)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 text-sm text-slate-200 placeholder-slate-500 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500/80 focus:ring-1 focus:ring-blue-500/80 transition"
            />
          </form>
        </div>

        {/* Right Actions: TinyFish Status, Notifications, User Menu */}
        <div className="flex items-center gap-3">
          {/* TinyFish Agent Status Badge */}
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              isConfigured
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title="Click to view or update TinyFish API Key"
          >
            <Cpu className="w-3.5 h-3.5 animate-pulse" />
            <span>TinyFish:</span>
            <span className="font-semibold">
              {isConfigured ? 'Ready' : 'Setup Key'}
            </span>
            {isConfigured ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          {/* User Profile Dropdown or Auth Buttons */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/80 transition text-left"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold overflow-hidden border border-slate-700">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="hidden lg:block text-xs">
                  <div className="font-medium text-slate-200 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-tight truncate max-w-[120px]">
                    {user.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/50 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition"
                    >
                      <User className="w-4 h-4 text-blue-400" />
                      <span>User Profile & Resume</span>
                    </Link>
                    <Link
                      to="/tracker"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>Application Tracker</span>
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        setApiKeyModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 transition text-left"
                    >
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span>TinyFish Settings</span>
                    </button>
                    <div className="border-t border-slate-800 my-1"></div>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-500/30 transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
