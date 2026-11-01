import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Bookmark,
  CheckSquare,
  UserCheck,
  X,
  Bot,
  ExternalLink,
  Key,
  Compass
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export default function Sidebar({ isOpen, onClose }) {
  const { savedJobIds, setApiKeyModalOpen, systemStatus } = useJobs();

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/search',
      label: 'AI Job Search',
      icon: Sparkles,
      badge: 'Live',
      badgeColor: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    },
    {
      to: '/jobs',
      label: 'Job Listings',
      icon: Briefcase,
      badge: null,
    },
    {
      to: '/saved',
      label: 'Saved Jobs',
      icon: Bookmark,
      badge: savedJobIds.size > 0 ? savedJobIds.size : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300',
    },
    {
      to: '/tracker',
      label: 'Application Tracker',
      icon: CheckSquare,
      badge: null,
    },
    {
      to: '/profile',
      label: 'My Profile & Resume',
      icon: UserCheck,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 bg-[#0c1222] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-base">JobPilot</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Platform Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition group ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* TinyFish Agent Info Card */}
        <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white leading-tight">
                TinyFish Autonomous Agent
              </p>
              <p className="text-[10px] text-slate-400">
                {systemStatus?.tinyfish?.configured ? 'Active & Ready' : 'Key Setup Required'}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            AI browser agents navigate live company portals to extract unlisted and fresh openings.
          </p>
          <button
            onClick={() => {
              if (onClose) onClose();
              setApiKeyModalOpen(true);
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Manage TinyFish API</span>
          </button>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
          JobPilot AI • v1.0.0
        </div>
      </aside>
    </>
  );
}
