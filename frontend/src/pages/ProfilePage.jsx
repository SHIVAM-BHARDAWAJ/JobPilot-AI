import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  MapPin,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  X,
  FileText,
  Save,
  RefreshCw,
  Plus
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const { showNotification } = useJobs();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    education: '',
    experience: '',
    preferred_role: '',
    preferred_location: '',
    skills: [],
    resume_name: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        education: profile.education || '',
        experience: profile.experience || '',
        preferred_role: profile.preferred_role || '',
        preferred_location: profile.preferred_location || '',
        skills: profile.skills || [],
        resume_name: profile.resume_name || '',
      });
    }
  }, [profile]);

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const skillTrimmed = newSkill.trim();
    if (skillTrimmed && !formData.skills.includes(skillTrimmed)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillTrimmed],
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skillToRemove),
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(formData);
      await refreshProfile();
      showNotification('Profile updated successfully!');
    } catch (err) {
      showNotification('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    try {
      const res = await api.uploadResume(file);
      setFormData((prev) => ({
        ...prev,
        resume_name: res.filename,
        skills: Array.from(new Set([...prev.skills, ...(res.detected_skills || [])])),
      }));
      await refreshProfile();
      showNotification(`Resume "${res.filename}" uploaded & skills auto-extracted!`);
    } catch (err) {
      showNotification('Resume upload failed', 'error');
    } finally {
      setUploadingResume(false);
    }
  };

  const popularSkills = [
    'Python', 'React', 'FastAPI', 'JavaScript', 'TypeScript',
    'Machine Learning', 'Docker', 'AWS', 'Node.js', 'SQL', 'Git', 'C++'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <User className="w-6 h-6 text-blue-400" />
            <span>Candidate Profile & Preferences</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Used by JobPilot to compute skill match scores and filter automated recommendations
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30 disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Personal Details Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Basic Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                College / Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) =>
                  setFormData({ ...formData, education: e.target.value })
                }
                placeholder="e.g. B.Tech Computer Science (2025)"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Current Experience Level
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: e.target.value })
                }
                placeholder="e.g. Student / Fresher / 1 yr internship"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Preferences Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span>Target Role Preferences</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Target Role / Job Title
              </label>
              <input
                type="text"
                value={formData.preferred_role}
                onChange={(e) =>
                  setFormData({ ...formData, preferred_role: e.target.value })
                }
                placeholder="e.g. Full Stack Developer, AI Intern"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Preferred Locations / Work Mode
              </label>
              <input
                type="text"
                value={formData.preferred_location}
                onChange={(e) =>
                  setFormData({ ...formData, preferred_location: e.target.value })
                }
                placeholder="e.g. Remote / Bengaluru / Hyderabad"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Technical & Programming Skills</span>
            </h2>
            <span className="text-xs text-slate-400">
              {formData.skills.length} skills listed
            </span>
          </div>

          {/* Add skill input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              placeholder="Type a skill and hit Enter or Add..."
              className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Current Skills Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="pt-2">
            <p className="text-[11px] text-slate-400 mb-1.5">Quick add suggestions:</p>
            <div className="flex flex-wrap gap-1.5">
              {popularSkills.filter(s => !formData.skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      skills: [...prev.skills, skill]
                    }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Resume Upload Card */}
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-md space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Resume & ATS Document</span>
          </h2>

          <div className="p-6 border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl bg-slate-900/60 text-center transition group">
            <UploadCloud className="w-10 h-10 text-slate-500 group-hover:text-blue-400 mx-auto mb-2 transition" />
            <p className="text-xs font-semibold text-slate-200">
              {formData.resume_name ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Active Resume: {formData.resume_name}
                </span>
              ) : (
                'Upload your PDF / Word Resume'
              )}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              JobPilot automatically parses technical keywords and updates your matched skills.
            </p>

            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold cursor-pointer border border-slate-700 transition">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploadingResume}
                className="hidden"
              />
              <span>{uploadingResume ? 'Analyzing Resume...' : 'Select File'}</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
