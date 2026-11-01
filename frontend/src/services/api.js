const API_BASE = '/api';

/**
 * Fetch wrapper with error handling and JSON parsing
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorDetail = `HTTP ${response.status} error`;
      try {
        const errorData = await response.json();
        errorDetail = errorData.detail || errorData.message || errorDetail;
      } catch (e) {
        // Fallback to text if not json
      }
      throw new Error(errorDetail);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // System & Health
  getHealth: () => request('/health'),
  getStatus: () => request('/status'),
  updateApiKey: (apiKey) => request('/status/key', {
    method: 'POST',
    body: JSON.stringify({ api_key: apiKey }),
  }),

  // Companies
  getCompanies: () => request('/companies'),

  // Dashboard Stats
  getDashboardStats: () => request('/dashboard/stats'),

  // Jobs
  getJobs: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        searchParams.append(key, val);
      }
    });
    const qs = searchParams.toString();
    return request(`/jobs${qs ? `?${qs}` : ''}`);
  },

  getJobById: (id) => request(`/jobs/${id}`),

  getSavedJobs: () => request('/jobs/saved'),

  toggleSaveJob: (jobId) => request(`/jobs/${jobId}/save`, {
    method: 'POST',
  }),

  // Live TinyFish AI Agent Search
  searchLive: (searchPayload) => request('/search/live', {
    method: 'POST',
    body: JSON.stringify(searchPayload),
  }),

  // Application Tracker
  getApplications: () => request('/applications'),

  createApplication: (data) => request('/applications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateApplication: (id, data) => request(`/applications/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  deleteApplication: (id) => request(`/applications/${id}`, {
    method: 'DELETE',
  }),

  // Profile
  getProfile: () => request('/profile'),

  updateProfile: (data) => request('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/profile/resume`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to upload resume');
    }
    return await response.json();
  },
};
