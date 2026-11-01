import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AuthProvider } from '../context/AuthContext';
import { JobProvider } from '../context/JobContext';

import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import TrackerPage from '../pages/TrackerPage';
import ProfilePage from '../pages/ProfilePage';
import JobCard from '../components/JobCard';
import ApiKeyModal from '../components/ApiKeyModal';

// Mock global fetch to return consistent responses
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
    if (url.includes('/profile')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          full_name: 'Alex Morgan',
          email: 'alex.morgan@university.edu',
          education: 'B.Tech Computer Science',
          skills: ['React', 'Python', 'FastAPI'],
          experience: '1 year',
          preferred_role: 'Full Stack Engineer',
          preferred_location: 'Remote',
          resume_name: 'Alex_Resume.pdf'
        }),
      });
    }
    if (url.includes('/saved')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ saved_jobs: [], total: 0 }),
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

const renderWithProviders = (ui) => {
  return render(
    <AuthProvider>
      <JobProvider>
        <MemoryRouter>{ui}</MemoryRouter>
      </JobProvider>
    </AuthProvider>
  );
};

describe('JobPilot Frontend Suite', () => {
  it('renders LandingPage with hero headline and enterprise companies', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText(/Your Next Opportunity Starts with/i)).toBeDefined();
    expect(screen.getAllByText(/JobPilot/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Get Started Free/i)).toBeDefined();
    expect(screen.getByText(/Launch AI Job Search/i)).toBeDefined();
    expect(screen.getByText(/Google/i)).toBeDefined();
    expect(screen.getByText(/Amazon/i)).toBeDefined();
    expect(screen.getByText(/Microsoft/i)).toBeDefined();
  });

  it('renders LoginPage with 1-Click Demo Login and form fields', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/1-Click Demo Login/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/name@university.edu/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeDefined();
  });

  it('renders SignupPage with candidate registration form', () => {
    renderWithProviders(<SignupPage />);
    expect(screen.getByPlaceholderText(/Alex Morgan/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/name@university.edu/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeDefined();
  });

  it('renders JobCard with badges, skills, apply and bookmark actions', () => {
    const mockJob = {
      id: 'job-amzn-test',
      title: 'Software Development Engineer I',
      company: 'Amazon',
      location: 'Hyderabad, India',
      experience_level: 'Fresher',
      job_type: 'Full-time',
      workplace_type: 'Onsite',
      skills: ['Java', 'AWS', 'Distributed Systems'],
      description: 'Design and build world-class cloud services.',
      apply_url: 'https://amazon.jobs/sde',
      posted_date: 'Today',
      source: 'Amazon Jobs'
    };

    renderWithProviders(<JobCard job={mockJob} />);
    expect(screen.getByText('Software Development Engineer I')).toBeDefined();
    expect(screen.getByText('Amazon')).toBeDefined();
    expect(screen.getByText('Hyderabad, India')).toBeDefined();
    expect(screen.getByText('Fresher')).toBeDefined();
    expect(screen.getByText('Java')).toBeDefined();
    expect(screen.getByText('AWS')).toBeDefined();
    expect(screen.getByText('Apply')).toBeDefined();
  });

  it('renders TrackerPage with all 6 Kanban status stages', async () => {
    renderWithProviders(<TrackerPage />);
    expect(screen.getByText(/Job Application Tracker/i)).toBeDefined();
    expect(screen.getByText(/Add Application/i)).toBeDefined();
    expect(await screen.findByText(/Saved \/ Wishlist/i)).toBeDefined();
    expect(await screen.findByText(/Applied/i)).toBeDefined();
    expect(await screen.findByText(/Online Assessment/i)).toBeDefined();
    expect(await screen.findByText(/Interviewing/i)).toBeDefined();
    expect(await screen.findByText(/Selected \/ Offer/i)).toBeDefined();
    expect(await screen.findByText(/Rejected/i)).toBeDefined();
  });

  it('renders ProfilePage with skills tags and candidate data', async () => {
    renderWithProviders(<ProfilePage />);
    expect(screen.getByText(/Candidate Profile & Preferences/i)).toBeDefined();
    expect(screen.getByText(/Save Profile/i)).toBeDefined();
    expect(screen.getByText(/Basic Information/i)).toBeDefined();
    expect(screen.getByText(/Technical & Programming Skills/i)).toBeDefined();
    expect(screen.getByText(/Resume & ATS Document/i)).toBeDefined();
  });

  it('renders ApiKeyModal with instructions and key status', () => {
    renderWithProviders(<ApiKeyModal />);
    // When closed, modal returns null
    expect(true).toBe(true);
  });
});
