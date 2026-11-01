import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, ArrowRight, RefreshCw, Briefcase } from 'lucide-react';
import { api } from '../services/api';
import JobCard from '../components/JobCard';
import { useJobs } from '../context/JobContext';

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { savedJobIds } = useJobs();

  const loadSaved = async () => {
    setLoading(true);
    try {
      const data = await api.getSavedJobs();
      setSavedJobs(data.saved_jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, [savedJobIds]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-indigo-400" />
            <span>Saved Jobs & Bookmarks</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Keep track of interesting positions to tailor your resume and apply
          </p>
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {savedJobs.length} Bookmarked
        </span>
      </div>

      {loading ? (
        <div className="py-16 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Loading your bookmarks...</span>
        </div>
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#111827] border border-slate-800 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No saved jobs yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              Browse job openings or run AI search, then click the bookmark icon on any job card to save it here.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Roles</span>
          </Link>
        </div>
      )}
    </div>
  );
}
