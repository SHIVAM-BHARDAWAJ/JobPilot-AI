import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Search,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Building2,
  ExternalLink,
  ChevronRight,
  Code2
} from 'lucide-react';
import { useJobs } from '../context/JobContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setApiKeyModalOpen } = useJobs();

  const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', tag: 'Cloud & AI' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', tag: 'Copilot & Azure' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', tag: 'AWS & SDE' },
    { name: 'Adobe', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Adobe_Corporate_Horizontal_Red_HEX.svg', tag: 'Creative AI' },
    { name: 'Deloitte', logo: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Deloitte.svg', tag: 'Consulting' },
    { name: 'Flipkart', logo: 'https://upload.wikimedia.org/wikipedia/en/7/7a/Flipkart_logo.svg', tag: 'E-Commerce' },
    { name: 'Infosys', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg', tag: 'Enterprise IT' },
    { name: 'TCS', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg', tag: 'Global Services' },
    { name: 'Wipro', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg', tag: 'NextGen Tech' },
    { name: 'Accenture', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg', tag: 'Strategy & AI' },
  ];

  const features = [
    {
      icon: Bot,
      color: 'from-blue-600 to-cyan-500',
      title: 'Autonomous Web Agents',
      desc: 'Powered by TinyFish browser agents that bypass bot gates to extract live postings directly from corporate career portals.',
    },
    {
      icon: Sparkles,
      color: 'from-purple-600 to-indigo-500',
      title: 'AI Resume Matching',
      desc: 'Smart algorithm compares your technical skills, projects, and certifications directly with job requirements for tailored match scores.',
    },
    {
      icon: ShieldCheck,
      color: 'from-emerald-600 to-teal-500',
      title: 'Application Pipeline Tracker',
      desc: 'Visual Kanban board with 6 stages from Saved to Offer, enabling you to never lose track of interview dates or feedback.',
    },
    {
      icon: Cpu,
      color: 'from-amber-600 to-orange-500',
      title: 'Zero-Stale Opportunity Index',
      desc: 'Our engine parses raw application deadlines and postings directly from the source DOM, ensuring active and verified openings.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-blue-600/15 via-indigo-600/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-slate-300 shadow-xl mb-6 hover:border-blue-500/50 transition">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>JobPilot 2.0 with TinyFish Autonomous Web Agents</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          Your Next Opportunity Starts with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            JobPilot.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The premier AI career assistant for students, freshers, and professionals. 
          Discover verified roles across Fortune 500 career portals in seconds using autonomous AI agents.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition transform hover:-translate-y-0.5"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/search"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Launch AI Job Search</span>
          </Link>
        </div>

        {/* Interactive Stats Banner */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-white">10,000+</p>
            <p className="text-xs text-slate-400 mt-1">Discovered Openings</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-400">98.4%</p>
            <p className="text-xs text-slate-400 mt-1">Extraction Precision</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">10+</p>
            <p className="text-xs text-slate-400 mt-1">Top Tech Enterprises</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">&lt; 3s</p>
            <p className="text-xs text-slate-400 mt-1">Smart Search Query</p>
          </div>
        </div>
      </section>

      {/* Supported Companies Section */}
      <section className="py-12 border-y border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Supported Enterprise Portals
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Autonomous scraping across top technology employers
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {companies.map((c) => (
              <button
                key={c.name}
                onClick={() => navigate(`/search?company=${encodeURIComponent(c.name)}`)}
                className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/50 transition flex flex-col items-center justify-center text-center group"
              >
                <div className="w-10 h-10 mb-2 flex items-center justify-center p-1.5 bg-slate-800 rounded-xl group-hover:scale-105 transition">
                  <img src={c.logo} alt={c.name} className="max-h-full max-w-full object-contain" />
                </div>
                <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition">
                  {c.name}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">{c.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Intelligent Discovery
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            Engineered like a modern AI powerhouse
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Everything you need to discover, match, and organize your dream career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#111827] border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-5 shadow-lg`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Step-by-Step Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
            How JobPilot powers your job hunt
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center mb-4 text-sm border border-blue-500/30">
              1
            </div>
            <h3 className="text-base font-bold text-white mb-2">Set Your Role & Criteria</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target specific roles like Software Engineering Intern, SDE 1, or Data Analyst across preferred cities or remote setups.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 font-bold flex items-center justify-center mb-4 text-sm border border-cyan-500/30">
              2
            </div>
            <h3 className="text-base font-bold text-white mb-2">TinyFish AI Scrapes the Web</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous browser agents traverse corporate career portals, extracting requirements, eligibility, deadlines, and direct apply links.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center mb-4 text-sm border border-indigo-500/30">
              3
            </div>
            <h3 className="text-base font-bold text-white mb-2">Track & Land Offers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Save jobs, apply directly on official portals, and monitor your interview stages on our interactive Kanban application board.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-blue-900/30 to-slate-900 border border-blue-500/30 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to supercharge your career?
          </h2>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto">
            Join students and professionals using JobPilot to land internships and full-time roles at top tier technology companies.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition"
            >
              Open Dashboard
            </Link>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition"
            >
              Configure TinyFish Key
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">JobPilot AI</span>
              <p className="text-[11px] text-slate-500">Autonomous Career Discovery Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link to="/search" className="hover:text-white transition">AI Job Search</Link>
            <Link to="/jobs" className="hover:text-white transition">Directory</Link>
            <Link to="/tracker" className="hover:text-white transition">Application Tracker</Link>
            <Link to="/profile" className="hover:text-white transition">Profile & Resume</Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2026 JobPilot • Built with TinyFish AI, FastAPI & React
          </div>
        </div>
      </footer>
    </div>
  );
}
