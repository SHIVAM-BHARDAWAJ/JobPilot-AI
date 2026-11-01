import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Building, Calendar, DollarSign, FileText, Globe } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { api } from '../services/api';

const STATUS_OPTIONS = [
  { value: 'Saved', label: 'Saved', color: 'text-slate-400' },
  { value: 'Applied', label: 'Applied', color: 'text-blue-400' },
  { value: 'Assessment', label: 'Assessment', color: 'text-purple-400' },
  { value: 'Interview', label: 'Interview', color: 'text-amber-400' },
  { value: 'Selected', label: 'Selected / Offer', color: 'text-emerald-400' },
  { value: 'Rejected', label: 'Rejected', color: 'text-rose-400' },
];

export default function ApplicationModal({ onApplicationSaved }) {
  const { appModalOpen, appModalJob, closeApplicationModal, showNotification } = useJobs();

  const [formData, setFormData] = useState({
    company: '',
    job_title: '',
    location: '',
    apply_url: '',
    status: 'Saved',
    applied_date: new Date().toISOString().split('T')[0],
    salary_range: '',
    notes: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (appModalJob) {
      setFormData({
        company: appModalJob.company || '',
        job_title: appModalJob.title || appModalJob.job_title || '',
        location: appModalJob.location || '',
        apply_url: appModalJob.apply_url || '',
        status: appModalJob.status || 'Applied',
        applied_date: appModalJob.applied_date || new Date().toISOString().split('T')[0],
        salary_range: appModalJob.salary_range || '',
        notes: appModalJob.notes || `Applied via ${appModalJob.company} Careers`,
      });
    } else {
      setFormData({
        company: '',
        job_title: '',
        location: '',
        apply_url: '',
        status: 'Applied',
        applied_date: new Date().toISOString().split('T')[0],
        salary_range: '',
        notes: '',
      });
    }
  }, [appModalJob, appModalOpen]);

  if (!appModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company.trim() || !formData.job_title.trim()) {
      showNotification('Company name and job title are required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (appModalJob && appModalJob.id && appModalJob.id.startsWith('app-')) {
        // Update existing application
        await api.updateApplication(appModalJob.id, formData);
        showNotification('Application updated successfully');
      } else {
        // Create new application
        await api.createApplication({
          job_id: appModalJob?.id || null,
          ...formData,
        });
        showNotification('Added to Application Tracker');
      }

      if (onApplicationSaved) {
        onApplicationSaved();
      }
      closeApplicationModal();
    } catch (err) {
      showNotification('Failed to save application', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={closeApplicationModal} />

      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {appModalJob?.id?.startsWith('app-')
                  ? 'Update Application'
                  : 'Track New Application'}
              </h3>
              <p className="text-xs text-slate-400">
                Organize and monitor interview stages
              </p>
            </div>
          </div>

          <button
            onClick={closeApplicationModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  placeholder="e.g. Google, Amazon"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                placeholder="e.g. SDE 1, Frontend Intern"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status & Applied Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Stage / Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Date Applied
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="date"
                  value={formData.applied_date}
                  onChange={(e) =>
                    setFormData({ ...formData, applied_date: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g. Bengaluru / Remote"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Expected Salary / Stipend
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) =>
                    setFormData({ ...formData, salary_range: e.target.value })
                  }
                  placeholder="e.g. ₹1,00,000 / month"
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Apply URL */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Application / Portal URL
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
              <input
                type="url"
                value={formData.apply_url}
                onChange={(e) =>
                  setFormData({ ...formData, apply_url: e.target.value })
                }
                placeholder="https://company.com/careers/job-id"
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              Interview Notes & Reminders
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="e.g. Referral from alumni. Coding test scheduled on Thursday. Need to review Graph algorithms."
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={closeApplicationModal}
              className="px-4 py-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
