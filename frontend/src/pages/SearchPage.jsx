import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Building2,
  MapPin,
  Briefcase,
  Filter,
  Bot,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  ExternalLink,
  Key,
  X,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/JobCard';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const { systemStatus, setApiKeyModalOpen, showNotification } = useJobs();

  // Search form fields
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [company, setCompany] = useState(searchParams.get('company') || 'all');
  const [location, setLocation] = useState('all');
  const [experienceLevel, setExperienceLevel] = useState('all');
  const [jobType, setJobType] = useState('all');
  const [workplaceType, setWorkplaceType] = useState('all');
  const [useLiveAgent, setUseLiveAgent] = useState(true);

  // Companies list
  const [companies, setCompanies] = useState([]);

  // Results & States
  const [jobs, setJobs] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchLogs, setSearchLogs] = useState([]);
  const [searchMeta, setSearchMeta] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');

  // Load supported companies on mount
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const list = await api.getCompanies();
        setCompanies(list);
      } catch (e) {
        console.error('Failed to load companies:', e);
      }
    };
    loadCompanies();
  }, []);

  // Initial search trigger or when URL searchParams update
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const compParam = searchParams.get('company') || 'all';
    if (qParam || compParam !== 'all') {
      setQuery(qParam);
      setCompany(compParam);
    }
    executeSearch(qParam, compParam);
  }, [searchParams]);

  const executeSearch = async (targetQuery = query, targetCompany = company) => {
    setSearching(true);
    setApiError(null);
    setSearchLogs([
      `Initializing search request at ${new Date().toLocaleTimeString()}...`,
      `Target parameters: query="${targetQuery || 'All'}", company="${targetCompany}"`,
      `Connecting to JobPilot TinyFish gateway endpoint...`
    ]);

    try {
      const response = await api.searchLive({
        query: targetQuery,
        company: targetCompany === 'all' ? '' : targetCompany,
        location: location === 'all' ? '' : location,
        experience_level: experienceLevel === 'all' ? '' : experienceLevel,
        job_type: jobType === 'all' ? '' : jobType,
        workplace_type: workplaceType === 'all' ? '' : workplaceType,
        use_live_agent: useLiveAgent,
      });

      setJobs(response.jobs || []);
      setSearchMeta({
        source: response.source,
        total: response.total_found,
        duration: response.duration_seconds,
        api_status: response.api_status,
        message: response.message,
        is_live: response.is_live,
        search_mode: response.search_mode,
        agent_status: response.agent_status,
        agent_error_detail: response.agent_error_detail,
        jobs_extracted_count: response.jobs_extracted_count,
        target_portal_url: response.target_portal_url,
        company_target: response.company_target,
        query_used: response.query_used,
      });

      if (response.agent_logs && response.agent_logs.length > 0) {
        setSearchLogs(response.agent_logs);
      }

      if (response.api_status === 'expired_key_warning' && !response.is_live) {
        setApiError('The TinyFish API key is invalid or expired. Results retrieved from JobPilot verified demo repository.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setApiError(err.message || 'Search failed. Please check backend connection.');
      // Attempt fallback to local jobs
      try {
        const fallback = await api.getJobs({ q: targetQuery, company: targetCompany });
        setJobs(fallback.jobs || []);
        setSearchMeta({
          source: 'JobPilot Verified Index (Local Fallback)',
          total: fallback.jobs?.length || 0,
          duration: 0,
          api_status: 'error',
          message: err.message,
          is_live: false,
          search_mode: 'DEMO_DATA',
          agent_status: 'FAILED',
          agent_error_detail: err.message,
          jobs_extracted_count: 0,
        });
      } catch (fbErr) {
        setJobs([]);
      }
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeSearch();
  };

  const handleClearFilters = () => {
    setQuery('');
    setCompany('all');
    setLocation('all');
    setExperienceLevel('all');
    setJobType('all');
    setWorkplaceType('all');
    executeSearch('', 'all');
  };

  // Sorted jobs
  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortOrder === 'company') {
      return a.company.localeCompare(b.company);
    }
    if (sortOrder === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0; // default newest
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span>AI Job Search & Live Discovery</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Powered by TinyFish Autonomous Web Agents navigating real company career pages
          </p>
        </div>

        <button
          onClick={() => setApiKeyModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-xs font-semibold text-cyan-300 transition"
        >
          <Key className="w-3.5 h-3.5" />
          <span>API Key Settings</span>
        </button>
      </div>

      {/* Main Search Controls Box */}
      <form
        onSubmit={handleSubmit}
        className="p-5 sm:p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl space-y-4"
      >
        {/* Search Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Query input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title or skill (e.g. SDE Intern, Python, React)..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Company Dropdown */}
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">All Supported Companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.category})
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 appearance-none"
            >
              <option value="all">Any Location</option>
              <option value="Bengaluru">Bengaluru, India</option>
              <option value="Hyderabad">Hyderabad, India</option>
              <option value="Noida">Noida / Delhi NCR</option>
              <option value="Pune">Pune / Mumbai</option>
              <option value="Remote">Remote Only</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Experience level */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Experience Level
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="Internship">Internship (Summer / Off-Campus)</option>
              <option value="Fresher">Fresher / Graduate (0-1 yrs)</option>
              <option value="Mid-Level">Mid-Level (2-5 yrs)</option>
              <option value="Senior">Senior / Lead (5+ yrs)</option>
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Job Type
            </label>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          {/* Workplace Type */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Workplace Mode
            </label>
            <select
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </div>
        </div>

        {/* Live Agent Toggle & Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useLiveAgent}
              onChange={(e) => setUseLiveAgent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-900 border-slate-700"
            />
            <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              Enable TinyFish Autonomous Browser Agent (Real-time Scraping)
            </span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={searching}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
            >
              {searching ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Agent Working...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search Opportunities</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Search Status & Extraction Provenance Banner */}
      {searchMeta && !searching && (
        <div
          className={`p-5 rounded-2xl border transition-all duration-200 ${
            searchMeta.is_live
              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#111827] border-emerald-500/40 shadow-lg shadow-emerald-950/20'
              : 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-[#111827] border-amber-500/40 shadow-lg shadow-amber-950/20'
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                {searchMeta.is_live ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE SEARCH ACTIVE</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>DEMO DATA (Verified Repository Fallback)</span>
                  </span>
                )}

                <span className="text-xs text-slate-300">
                  Agent Status:{' '}
                  <span
                    className={`font-mono font-bold ${
                      searchMeta.is_live ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {searchMeta.agent_status || 'COMPLETED'}
                  </span>
                </span>

                <span className="text-slate-600">•</span>

                <span className="text-xs text-slate-300">
                  Extracted:{' '}
                  <span className="font-bold text-white">
                    {searchMeta.jobs_extracted_count || searchMeta.total} roles
                  </span>
                </span>
              </div>

              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  Source: <strong className="text-slate-200 font-medium">{searchMeta.source}</strong>
                </span>
                {searchMeta.company_target && (
                  <>
                    <span>•</span>
                    <span>
                      Company:{' '}
                      <strong className="text-slate-200 font-medium">
                        {searchMeta.company_target}
                      </strong>
                    </span>
                  </>
                )}
                <span>•</span>
                <span>
                  Execution: <strong className="text-slate-200 font-medium">{searchMeta.duration}s</strong>
                </span>
              </div>

              {/* Informative provenance reassurance */}
              {searchMeta.is_live ? (
                <p className="text-[11px] text-emerald-300/85 pt-1">
                  ✓ Verified real-time extraction. All roles below were dynamically extracted from the official career portal with verified direct apply links.
                </p>
              ) : (
                <p className="text-[11px] text-amber-300/90 pt-1">
                  {searchMeta.agent_error_detail ||
                    'Live agent search paused (TinyFish API key expired or invalid). Showing verified offline repository results. Fallback data is never presented as live.'}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              {searchMeta.target_portal_url && (
                <a
                  href={searchMeta.target_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
                  title="Visit official career portal"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Portal</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => executeSearch()}
                disabled={searching}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${searching ? 'animate-spin' : ''}`} />
                <span>Retry Live Agent</span>
              </button>

              {!searchMeta.is_live && (
                <button
                  type="button"
                  onClick={() => setApiKeyModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-semibold text-amber-200 transition"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Update Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Warning Notice if Key is Expired */}
      {apiError && !searchMeta && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs text-amber-300">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">{apiError}</p>
              <p className="text-[11px] text-amber-400/80 mt-0.5">
                JobPilot automatically displayed verified opportunities from our local index. 
                You can add an active key anytime in settings.
              </p>
            </div>
          </div>
          <button
            onClick={() => setApiKeyModalOpen(true)}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 rounded-lg text-amber-200 font-semibold text-[11px] shrink-0"
          >
            Update Key
          </button>
        </div>
      )}

      {/* Real-time Agent Progress Console / Terminal */}
      {searching && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-bold text-white font-mono">
                TinyFish Autonomous Agent Console
              </span>
            </div>
            <span className="text-[11px] text-cyan-400 font-mono animate-pulse">
              ● Live Browser Agent Running
            </span>
          </div>

          <div className="p-3 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 space-y-1.5 max-h-36 overflow-y-auto border border-slate-900">
            {searchLogs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">
                <span className="text-cyan-500">&gt;</span> {log}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Discovered Opportunities</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">
              {sortedJobs.length} roles
            </span>
          </h2>
          {searchMeta && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              Source: <span className="text-slate-300 font-medium">{searchMeta.source}</span> • Execution time: {searchMeta.duration}s
            </p>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Sort by:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="company">Company (A-Z)</option>
            <option value="title">Role Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {sortedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : !searching ? (
        <div className="p-12 rounded-3xl bg-[#111827] border border-slate-800 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No job openings found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, selecting "All Supported Companies", or clearing location filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/20"
          >
            Reset Filters
          </button>
        </div>
      ) : null}
    </div>
  );
}
