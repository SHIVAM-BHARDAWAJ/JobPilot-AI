import React from 'react';
import {
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  ExternalLink,
  PlusCircle,
  Eye,
  CheckCircle2,
  Building2,
  Sparkles
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export default function JobCard({ job }) {
  const { isSaved, toggleSave, openJobDetails, openApplicationModal } = useJobs();
  const saved = isSaved(job.id);

  // Badge colors
  const getExpBadge = (exp) => {
    switch (exp?.toLowerCase()) {
      case 'internship':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'fresher':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'senior':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getWorkplaceBadge = (mode) => {
    switch (mode?.toLowerCase()) {
      case 'remote':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/20';
      case 'hybrid':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      default:
        return 'bg-slate-700/30 text-slate-300 border-slate-700/50';
    }
  };

  return (
    <div className="group relative bg-[#111827] hover:bg-[#131c31] border border-slate-800/80 hover:border-blue-500/40 rounded-2xl p-5 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-blue-900/10 flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3">
            {/* Company Logo / Fallback */}
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/70 p-2 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {job.company_logo ? (
                <img
                  src={job.company_logo}
                  alt={job.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full items-center justify-center text-slate-400 font-bold text-base"
                style={{ display: job.company_logo ? 'none' : 'flex' }}
              >
                <Building2 className="w-6 h-6 text-slate-400" />
              </div>
            </div>

            {/* Title & Company */}
            <div>
              <h3
                onClick={() => openJobDetails(job)}
                className="text-base font-semibold text-white group-hover:text-blue-400 cursor-pointer transition line-clamp-1"
                title={job.title}
              >
                {job.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <span className="text-sm font-medium text-slate-300">
                  {job.company}
                </span>
                {job.is_live ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE SEARCH</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300/90 border border-amber-500/30 flex items-center gap-1">
                    <span>DEMO DATA</span>
                  </span>
                )}
                {job.source && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 flex items-center gap-1 border border-slate-700/50">
                    <Sparkles className="w-2.5 h-2.5 text-blue-400" />
                    {job.source}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleSave(job)}
            className={`p-2 rounded-xl border transition shrink-0 ${
              saved
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/50 shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800/80'
            }`}
            title={saved ? 'Remove bookmark' : 'Bookmark job'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Location & Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1 text-slate-400 mr-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate max-w-[170px]">{job.location}</span>
          </div>

          {job.experience_level && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium border text-[11px] ${getExpBadge(
                job.experience_level
              )}`}
            >
              {job.experience_level}
            </span>
          )}

          {job.job_type && (
            <span className="px-2 py-0.5 rounded-full font-medium bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              {job.job_type}
            </span>
          )}

          {job.workplace_type && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium border text-[11px] ${getWorkplaceBadge(
                job.workplace_type
              )}`}
            >
              {job.workplace_type}
            </span>
          )}
        </div>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {job.description ||
            `Explore opportunities at ${job.company}. Click view details for responsibilities and eligibility criteria.`}
        </p>

        {/* Skills Chips */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {job.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-400 text-[11px]">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>{job.posted_date || 'Recently active'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Add to Tracker Shortcut */}
          <button
            onClick={() => openApplicationModal(job)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
            title="Track application"
          >
            <PlusCircle className="w-4 h-4" />
          </button>

          {/* View Details */}
          <button
            onClick={() => openJobDetails(job)}
            className="px-2.5 py-1 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg font-medium transition"
          >
            Details
          </button>

          {/* Apply Now */}
          <a
            href={job.apply_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-sm shadow-blue-500/20 transition"
          >
            <span>Apply</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
