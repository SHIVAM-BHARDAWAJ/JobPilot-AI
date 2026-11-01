import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import { JobProvider } from '../context/JobContext';

import LandingPage from '../pages/LandingPage';
import DashboardPage from '../pages/DashboardPage';
import SearchPage from '../pages/SearchPage';
import JobsPage from '../pages/JobsPage';
import JobDetailPage from '../pages/JobDetailPage';
import SavedJobsPage from '../pages/SavedJobsPage';
import TrackerPage from '../pages/TrackerPage';
import ProfilePage from '../pages/ProfilePage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes('/status')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          tinyfish: { configured: true, masked_key: 'sk-••••••••', status: 'configured' },
          database: { status: 'connected', total_jobs: 12 }
        }),
      });
    }
    if (url.includes('/dashboard/stats')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          total_jobs_discovered: 12,
          jobs_matching_skills: 5,
          new_jobs_today: 4,
          saved_jobs_count: 2,
          recent_jobs: [],
          application_breakdown: {},
          recent_activity: []
        }),
      });
    }
    if (url.includes('/companies')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          { id: 'google', name: 'Google', category: 'Tech', careers_url: 'https://google.com' },
          { id: 'amazon', name: 'Amazon', category: 'Cloud', careers_url: 'https://amazon.jobs' }
        ]),
      });
    }
    if (url.includes('/jobs/job-amzn-01')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 'job-amzn-01',
          title: 'Software Development Engineer I (SDE 1)',
          company: 'Amazon',
          location: 'Hyderabad, India',
          experience_level: 'Fresher',
          job_type: 'Full-time',
          workplace_type: 'Onsite',
          skills: ['Java', 'AWS'],
          description: 'Build high scale cloud infrastructure.',
          responsibilities: ['Write clean Java code'],
          qualifications: ['B.Tech in CS'],
          apply_url: 'https://amazon.jobs/sde',
          posted_date: 'Today'
        }),
      });
    }
    if (url.includes('/jobs/saved')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ saved_jobs: [], total: 0 }),
      });
    }
    if (url.includes('/jobs')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ jobs: [], total: 0 }),
      });
    }
    if (url.includes('/profile')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          full_name: 'Alex Morgan',
          email: 'alex@edu.in',
          skills: ['React', 'Python']
        }),
      });
    }
    if (url.includes('/applications')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ applications: [], total: 0 }),
      });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
  });
});

const renderRoute = (initialPath) => {
  return render(
    <AuthProvider>
      <JobProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/saved" element={<SavedJobsPage />} />
            <Route path="/tracker" element={<TrackerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MemoryRouter>
      </JobProvider>
    </AuthProvider>
  );
};

describe('JobPilot Full Router & Page Mount Verification', () => {
  it('navigates to /dashboard and mounts DashboardPage', async () => {
    renderRoute('/dashboard');
    expect(await screen.findByText(/Welcome back/i)).toBeDefined();
    expect(screen.getByText(/Total Discovered/i)).toBeDefined();
  });

  it('navigates to /search and mounts SearchPage', async () => {
    renderRoute('/search');
    expect(screen.getByText(/AI Job Search & Live Discovery/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Job title or skill/i)).toBeDefined();
  });

  it('navigates to /jobs and mounts JobsPage', async () => {
    renderRoute('/jobs');
    expect(screen.getByText(/Job Listings Directory/i)).toBeDefined();
  });

  it('navigates to /jobs/:id and mounts JobDetailPage', async () => {
    renderRoute('/jobs/job-amzn-01');
    expect(await screen.findByText(/Software Development Engineer I \(SDE 1\)/i)).toBeDefined();
    expect(screen.getByText(/Key Responsibilities/i)).toBeDefined();
    expect(screen.getByText(/Apply on Portal/i)).toBeDefined();
  });

  it('navigates to /saved and mounts SavedJobsPage', async () => {
    renderRoute('/saved');
    expect(screen.getByText(/Saved Jobs & Bookmarks/i)).toBeDefined();
  });

  it('navigates to /profile and mounts ProfilePage', async () => {
    renderRoute('/profile');
    expect(screen.getByText(/Candidate Profile & Preferences/i)).toBeDefined();
  });

  it('redirects unknown path * to /', async () => {
    renderRoute('/random-non-existent-page');
    expect(await screen.findByText(/Your Next Opportunity Starts with/i)).toBeDefined();
  });
});
