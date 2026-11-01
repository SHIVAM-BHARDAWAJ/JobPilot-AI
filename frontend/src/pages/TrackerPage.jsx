import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  PlusCircle,
  Building,
  Calendar,
  DollarSign,
  ExternalLink,
  Trash2,
  Edit2,
  RefreshCw,
  Clock,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useJobs } from '../context/JobContext';
import ApplicationModal from '../components/ApplicationModal';

const COLUMNS = [
  { id: 'Saved', title: 'Saved / Wishlist', color: 'border-slate-700 bg-slate-900/40 text-slate-300' },
  { id: 'Applied', title: 'Applied', color: 'border-blue-500/30 bg-blue-950/20 text-blue-400' },
  { id: 'Assessment', title: 'Online Assessment', color: 'border-purple-500/30 bg-purple-950/20 text-purple-400' },
  { id: 'Interview', title: 'Interviewing', color: 'border-amber-500/30 bg-amber-950/20 text-amber-400' },
  { id: 'Selected', title: 'Selected / Offer 🎉', color: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' },
  { id: 'Rejected', title: 'Rejected', color: 'border-rose-500/30 bg-rose-950/20 text-rose-400' },
];

export default function TrackerPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { openApplicationModal, showNotification } = useJobs();

  const loadApplications = async () => {
    setLoading(true);
    try {
      const data = await api.getApplications();
      setApplications(data.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await api.updateApplication(appId, { status: newStatus });
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
      showNotification(`Moved to ${newStatus}`);
    } catch (err) {
      showNotification('Failed to update status', 'error');
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Are you sure you want to delete this tracked application?')) return;
    try {
      await api.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a.id !== appId));
      showNotification('Application deleted');
    } catch (err) {
      showNotification('Failed to delete application', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <ApplicationModal onApplicationSaved={loadApplications} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            <span>Job Application Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kanban stage management from initial bookmark to official offer
          </p>
        </div>

        <button
          onClick={() => openApplicationModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
          <span>Loading application stages...</span>
        </div>
      ) : (
        /* Kanban Columns Container */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const colApps = applications.filter((a) => a.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-[#111827] rounded-2xl border border-slate-800 p-3 min-w-[240px] flex flex-col max-h-[80vh]"
              >
                {/* Column Header */}
                <div className={`p-2.5 rounded-xl border mb-3 flex items-center justify-between ${col.color}`}>
                  <span className="text-xs font-bold">{col.title}</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900/60">
                    {colApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {colApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">
                            {app.job_title}
                          </p>
                          <p className="text-[11px] font-semibold text-blue-400 mt-0.5">
                            {app.company}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                          <button
                            onClick={() => openApplicationModal(app)}
                            className="p-1 text-slate-400 hover:text-white rounded transition"
                            title="Edit application"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-1 text-slate-400 hover:text-rose-400 rounded transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {app.location && (
                        <p className="text-[10px] text-slate-400 truncate">
                          📍 {app.location}
                        </p>
                      )}

                      {app.salary_range && (
                        <p className="text-[10px] text-emerald-400 font-medium">
                          💰 {app.salary_range}
                        </p>
                      )}

                      {app.notes && (
                        <p className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded-lg line-clamp-2 italic border border-slate-800/80">
                          "{app.notes}"
                        </p>
                      )}

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{app.applied_date || 'Recent'}</span>

                        {/* Status Mover Dropdown */}
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="bg-slate-800 text-slate-300 rounded px-1.5 py-0.5 border border-slate-700 text-[10px] focus:outline-none"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              → {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

                  {colApps.length === 0 && (
                    <div className="p-4 text-center text-[11px] text-slate-600 border border-dashed border-slate-800 rounded-xl">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
