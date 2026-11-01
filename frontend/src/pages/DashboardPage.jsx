import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Bookmark,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  ExternalLink,
  PlusCircle,
  Building2,
  RefreshCw,
  Cpu,
  Layers,
  Activity
} from 'lucide-react';
import { api } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { systemStatus, setApiKeyModalOpen, openApplicationModal } = useJobs();
  const { user, profile } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quickQuery, setQuickQuery] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const isTinyFishReady = systemStatus?.tinyfish?.configured;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/20 to-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career Assistant Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name || 'Explorer'}! 👋
          </h1>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            JobPilot is monitoring {stats?.total_jobs_discovered || 12} live job openings across 10 top technology firms. 
            Run TinyFish agents to discover newly opened internships and fresh grad roles.
          </p>

          {/* Quick Search inside banner */}
          <form onSubmit={handleQuickSearch} className="mt-5 flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={quickQuery}
                onChange={(e) => setQuickQuery(e.target.value)}
                placeholder="Search by role or skill (e.g. SDE Intern, Python)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 text-xs text-white placeholder-slate-400 rounded-xl border border-slate-700/80 focus:outline-none focus:border-blue-500 transition shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-blue-600/30 shrink-0"
            >
              Search
            </button>
          </form>
        </div>

        {/* TinyFish Agent Quick Status Card */}
        <div className="relative z-10 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm w-full md:w-72 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">TinyFish Engine</span>
            </div>
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isTinyFishReady ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            {isTinyFishReady
              ? 'Autonomous web scraping key is verified and operational.'
              : 'Add your TinyFish API key to enable live web scrapers.'}
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="flex-1 text-center py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-md shadow-blue-600/20"
            >
              Run Agent
            </Link>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
              title="Configure Key"
            >
              <Cpu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Jobs */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Discovered
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">
            {loading ? '-' : stats?.total_jobs_discovered || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-medium">Verified roles</span>
            <span>across top portals</span>
          </p>
        </div>

        {/* Jobs Matching User Skills */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Skill Matches
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-purple-400">
            {loading ? '-' : stats?.jobs_matching_skills || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-purple-300 font-medium">Matches your</span>
            <Link to="/profile" className="text-blue-400 hover:underline">profile skills</Link>
          </p>
        </div>

        {/* New Jobs Today */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              New Jobs Today
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400">
            {loading ? '-' : stats?.new_jobs_today || 4}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            <span className="text-emerald-400 font-medium">Active openings</span> posted recently
          </p>
        </div>

        {/* Saved Jobs */}
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Saved Jobs
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-cyan-400">
            {loading ? '-' : stats?.saved_jobs_count || 0}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            <Link to="/saved" className="text-cyan-400 hover:underline font-medium">
              View saved bookmarks →
            </Link>
          </p>
        </div>
      </div>

      {/* Main Content Layout: Recent Jobs & Sidebar Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Opportunities */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Recent Opportunities</span>
                <span className="text-xs font-normal text-slate-400">
                  (Fortune 500 & Top Unicorns)
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Extracted directly from official company careers portals
              </p>
            </div>

            <Link
              to="/jobs"
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              <span>Loading discovered opportunities...</span>
            </div>
          ) : stats?.recent_jobs && stats.recent_jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.recent_jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-900 text-center border border-slate-800 text-slate-400 text-xs">
              No jobs discovered yet. Run a search to populate opportunities!
            </div>
          )}
        </div>

        {/* Right 1 Col: Tracker Overview & Search Activity */}
        <div className="space-y-6">
          {/* Tracker Overview Card */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Application Pipeline</span>
              </h3>
              <Link
                to="/tracker"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Board →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-base font-extrabold text-blue-400">
                  {stats?.application_breakdown?.Applied || 1}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Applied</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-base font-extrabold text-amber-400">
                  {stats?.application_breakdown?.Interview || 1}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Interview</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <p className="text-base font-extrabold text-purple-400">
                  {stats?.application_breakdown?.Assessment || 1}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Assessment</p>
              </div>
            </div>

            <button
              onClick={() => openApplicationModal()}
              className="mt-4 w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Custom Application</span>
            </button>
          </div>

          {/* Search Activity Feed */}
          <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Search Activity Feed</span>
            </h3>

            {stats?.recent_activity && stats.recent_activity.length > 0 ? (
              <div className="space-y-3">
                {stats.recent_activity.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-slate-200">{act.query}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {act.company} • {act.source || 'Verified Portals'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                      {act.results_count} found
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No search logs yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
