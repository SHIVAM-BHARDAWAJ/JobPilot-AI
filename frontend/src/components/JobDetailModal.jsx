import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  Share2,
  Sparkles,
  FileText
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';

export default function JobDetailModal() {
  const { selectedJob, detailModalOpen, closeJobDetails, isSaved, toggleSave, openApplicationModal, showNotification } = useJobs();
  const { profile } = useAuth();

  if (!detailModalOpen || !selectedJob) return null;

  const saved = isSaved(selectedJob.id);

  // Match score calculation
  const userSkills = profile?.skills || [];
  const jobSkills = selectedJob.skills || [];
  const matchingSkills = jobSkills.filter((s) =>
    userSkills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const matchPercentage =
    jobSkills.length > 0 ? Math.round((matchingSkills.length / jobSkills.length) * 100) : 75;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    showNotification('Job link copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={closeJobDetails}
      />

      <div className="relative w-full max-w-3xl bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 bg-[#111827]/80 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700/80 p-2.5 flex items-center justify-center shrink-0 shadow-inner">
              {selectedJob.company_logo ? (
                <img
                  src={selectedJob.company_logo}
                  alt={selectedJob.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-full h-full items-center justify-center text-slate-400 font-bold text-xl"
                style={{ display: selectedJob.company_logo ? 'none' : 'flex' }}
              >
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-blue-400">
                  {selectedJob.company}
                </span>
                {selectedJob.is_live ? (
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
                  {selectedJob.posted_date || 'Recently active'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {selectedJob.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {selectedJob.location}
                </span>
                <span className="text-slate-600">•</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                  {selectedJob.experience_level || 'All Levels'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                  {selectedJob.job_type || 'Full-time'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium">
                  {selectedJob.workplace_type || 'Hybrid'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={closeJobDetails}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Match Score Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-slate-900 border border-blue-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Skill Match Score: {matchPercentage}%
                </p>
                <p className="text-xs text-slate-400">
                  {matchingSkills.length} of {jobSkills.length} required skills found in your profile
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                closeJobDetails();
                openApplicationModal(selectedJob);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl transition"
            >
              Add to Tracker
            </button>
          </div>

          {/* Job Overview & Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              About the Opportunity
            </h4>
            <div className="text-sm text-slate-300 leading-relaxed space-y-3 bg-[#111827] p-4 rounded-2xl border border-slate-800">
              <p>{selectedJob.description}</p>
            </div>
          </div>

          {/* Key Responsibilities */}
          {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Key Responsibilities
              </h4>
              <ul className="space-y-2 bg-[#111827] p-4 rounded-2xl border border-slate-800 text-sm text-slate-300">
                {selectedJob.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Qualifications & Requirements */}
          {selectedJob.qualifications && selectedJob.qualifications.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Eligibility & Qualifications
              </h4>
              <ul className="space-y-2 bg-[#111827] p-4 rounded-2xl border border-slate-800 text-sm text-slate-300">
                {selectedJob.qualifications.map((qual, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Skills */}
          {selectedJob.skills && selectedJob.skills.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Required Technical & Soft Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, idx) => {
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

          {/* Provenance & Source Information */}
          <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div>
              <span className="text-slate-500">Source: </span>
              <span className="text-slate-300 font-medium">{selectedJob.source || 'Verified Portal'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Data Origin: </span>
              {selectedJob.is_live ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Crawl ({selectedJob.data_badge || 'Live Portal'})
                </span>
              ) : (
                <span className="text-amber-400 font-semibold">
                  Local Repository ({selectedJob.data_badge || 'Demo Data'})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-5 border-t border-slate-800 bg-[#111827] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSave(selectedJob)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                saved
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500/50'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
              <span>{saved ? 'Saved' : 'Save Job'}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
              title="Share job"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                closeJobDetails();
                openApplicationModal(selectedJob);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
            >
              Track Application
            </button>

            <a
              href={selectedJob.apply_url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-500/25 transition"
            >
              <span>Apply on Company Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
