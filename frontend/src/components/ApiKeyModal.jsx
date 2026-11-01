import React, { useState, useEffect } from 'react';
import { X, Key, Shield, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, Bot } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { api } from '../services/api';

export default function ApiKeyModal() {
  const { apiKeyModalOpen, setApiKeyModalOpen, systemStatus, refreshSystemStatus, showNotification } = useJobs();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (apiKeyModalOpen) {
      setApiKeyInput('');
    }
  }, [apiKeyModalOpen]);

  if (!apiKeyModalOpen) return null;

  const isConfigured = systemStatus?.tinyfish?.configured;
  const maskedKey = systemStatus?.tinyfish?.masked_key;

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      showNotification('Please provide a valid TinyFish API key', 'error');
      return;
    }

    setSaving(true);
    try {
      await api.updateApiKey(apiKeyInput.trim());
      await refreshSystemStatus();
      showNotification('TinyFish API key updated successfully!', 'success');
      setApiKeyInput('');
    } catch (err) {
      showNotification(err.message || 'Failed to update API key', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={() => setApiKeyModalOpen(false)} />

      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#111827]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                TinyFish AI Configuration
              </h3>
              <p className="text-xs text-slate-400">
                Autonomous Career Agent Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Key Status Banner */}
          <div
            className={`p-3.5 rounded-2xl border flex items-start gap-3 ${
              isConfigured
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}
          >
            {isConfigured ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {isConfigured ? 'API Key Configured' : 'API Key Missing'}
              </p>
              <p className="text-slate-300 mt-0.5 text-xs">
                {isConfigured
                  ? `Active key: ${maskedKey}. Your backend communicates securely with TinyFish agents.`
                  : 'Add your TinyFish API key below to enable autonomous browser agents.'}
              </p>
            </div>
          </div>

          {/* Form to update key */}
          <form onSubmit={handleSaveKey} className="space-y-3">
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                Enter / Update TinyFish API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-tinyfish-..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Keys are stored securely in backend memory and environment variables. Never sent to public repositories.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving || !apiKeyInput.trim()}
              className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition disabled:opacity-50 text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-600/20"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{saving ? 'Validating...' : 'Update TinyFish Key'}</span>
            </button>
          </form>

          {/* Setup Guide */}
          <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-2">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              How to get your free TinyFish credits:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Sign up at <span className="text-cyan-400 font-medium">tinyfish.ai/students</span> with school/college email for $35 free credits.</li>
              <li>Generate an API key in <span className="text-cyan-400 font-medium">agent.tinyfish.ai/api-keys</span>.</li>
              <li>Paste key here or set <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">TINYFISH_API_KEY</code> in <code className="bg-slate-800 px-1 py-0.5 rounded text-cyan-300">backend/.env</code>.</li>
            </ol>
            <a
              href="https://agent.tinyfish.ai/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium text-[11px] pt-1"
            >
              <span>Open TinyFish Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#111827] flex justify-end">
          <button
            onClick={() => setApiKeyModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
