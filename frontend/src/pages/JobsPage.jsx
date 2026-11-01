import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, RefreshCw, Building2 } from 'lucide-react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedExp, setSelectedExp] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const list = await api.getCompanies();
        setCompanies(list);
      } catch (e) {
        console.error(e);
      }
    };
    loadCompanies();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await api.getJobs({
        q: searchTerm,
        company: selectedCompany === 'all' ? '' : selectedCompany,
        experience_level: selectedExp === 'all' ? '' : selectedExp,
        job_type: selectedType === 'all' ? '' : selectedType,
        workplace_type: selectedMode === 'all' ? '' : selectedMode,
      });
      setJobs(data.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [selectedCompany, selectedExp, selectedType, selectedMode]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadJobs();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Briefcase className="w-6 h-6 text-blue-400" />
            <span>Job Listings Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified opportunities from top global technology leaders
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
          {jobs.length} Verified Roles Active
        </span>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by keyword (e.g. SDE, React, Cloud, AI)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-sm shadow-blue-600/30 shrink-0"
          >
            Filter
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Companies</option>
            {companies.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Experience Levels</option>
            <option value="Internship">Internship</option>
            <option value="Fresher">Fresher / Graduate</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Work Modes</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
          <span>Updating directory...</span>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
          No job openings match the selected filters.
        </div>
      )}
    </div>
  );
}
