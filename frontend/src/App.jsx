import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider, useJobs } from './context/JobContext';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import JobDetailModal from './components/JobDetailModal';
import ApiKeyModal from './components/ApiKeyModal';
import ApplicationModal from './components/ApplicationModal';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import SavedJobsPage from './pages/SavedJobsPage';
import TrackerPage from './pages/TrackerPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function NotificationToast() {
  const { notification } = useJobs();
  if (!notification) return null;

  const bgStyles =
    notification.type === 'error'
      ? 'bg-rose-500/90 text-white border-rose-400'
      : notification.type === 'info'
      ? 'bg-blue-600/90 text-white border-blue-400'
      : 'bg-emerald-600/90 text-white border-emerald-400';

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`px-4 py-2.5 rounded-xl shadow-xl border text-xs font-semibold backdrop-blur-md ${bgStyles}`}
      >
        {notification.message}
      </div>
    </div>
  );
}

function AppContent() {
  return (
    <>
      <Routes>
        {/* Public Landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Dashboard & App Pages */}
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/search"
          element={
            <DashboardLayout>
              <SearchPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/jobs"
          element={
            <DashboardLayout>
              <JobsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/jobs/:id"
          element={
            <DashboardLayout>
              <JobDetailPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/saved"
          element={
            <DashboardLayout>
              <SavedJobsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tracker"
          element={
            <DashboardLayout>
              <TrackerPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <DashboardLayout>
              <ProfilePage />
            </DashboardLayout>
          }
        />

        {/* Fallback to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Modals & Notifications */}
      <JobDetailModal />
      <ApiKeyModal />
      <ApplicationModal />
      <NotificationToast />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <JobProvider>
        <Router>
          <AppContent />
        </Router>
      </JobProvider>
    </AuthProvider>
  );
}
