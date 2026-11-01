import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Bookmark,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Share2,
  Sparkles,
  FileText,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSave, openApplicationModal, showNotification } = useJobs();
  const { profile } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getJobById(id);
        setJob(data);
      } catch (err) {
        setError(err.message || 'Job opportunity not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
        <span>Loading opportunity specifications...</span>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="p-8 max-w-md mx-auto text-center space-y-4 rounded-3xl bg-[#111827] border border-slate-800">
        <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Job Not Found</h2>
        <p className="text-xs text-slate-400">{error || 'This opportunity may have expired or been removed.'}</p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold transition hover:bg-blue-500"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Job Listings</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(job.id);
  const userSkills = profile?.skills || [];
  const jobSkills = job.skills || [];
  const matchingSkills = jobSkills.filter((s) =>
    userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const matchPercentage =
    jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 75;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showNotification('Direct job link copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-[#111827] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden space-y-6 p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 p-2.5 flex items-center justify-center shrink-0 shadow-inner">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full items-center justify-center text-slate-400 font-bold text-xl"
                style={{ display: job.company_logo ? 'none' : 'flex' }}
              >
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-blue-400">
                  {job.company}
                </span>
                {job.is_live ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE SEARCH</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/30 flex items-center gap-1">
                    <span>DEMO DATA</span>
                  </span>
                )}
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {job.posted_date || 'Recently active'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {job.experience_level || 'All Levels'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {job.job_type || 'Full-time'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                  {job.workplace_type || 'Hybrid'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleSave(job)}
              className={`p-2.5 rounded-xl border transition ${
                saved
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title={saved ? 'Remove bookmark' : 'Bookmark job'}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition border border-slate-700"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Skill Match Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Skill Match Score: {matchPercentage}%
              </p>
              <p className="text-xs text-slate-400">
                {matchingSkills.length} of {jobSkills.length} required skills matched in your candidate profile
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openApplicationModal(job)}
              className="px-4 py-2 text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl transition"
            >
              Add to Tracker
            </button>
            <a
              href={job.apply_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 transition"
            >
              <span>Apply on Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* About Opportunity */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Job Description</span>
          </h2>
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300 leading-relaxed">
            {job.description}
          </div>
        </div>

        {/* Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Key Responsibilities
            </h2>
            <ul className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
              {job.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Qualifications */}
        {job.qualifications && job.qualifications.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Qualifications & Eligibility
            </h2>
            <ul className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-sm text-slate-300">
              {job.qualifications.map((qual, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                  <span>{qual}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Required Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, idx) => {
                const hasSkill = userSkills.some(
                  (us) => us.toLowerCase() === skill.toLowerCase()
                );
                return (
                  <span
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 ${
                      hasSkill
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {hasSkill && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer info & Provenance */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <span>Verified Source: </span>
              <span className="text-white font-medium">{job.source || 'Verified Portal'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Status: </span>
              {job.is_live ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Crawled ({job.data_badge || 'Live Portal'})
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  Demo Catalog ({job.data_badge || 'Offline Index'})
                </span>
              )}
            </div>
          </div>
          <a
            href={job.apply_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            <span>Open Direct Company Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
