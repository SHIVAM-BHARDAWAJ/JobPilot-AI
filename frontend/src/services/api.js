
/**
 * JobPilot API Client
 * Supports local development through Vite proxy
 * and production deployment through Render/Vercel.
 */

const DEFAULT_TIMEOUT_MS = 45000;

/**
 * Resolves the backend API base URL.
 *
 * Local development:
 * /api
 *
 * Production:
 * https://jobpilot-ai-i3z2.onrender.com/api
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (!envUrl || typeof envUrl !== "string" || !envUrl.trim()) {
    return "/api";
  }

  const clean = envUrl.trim().replace(/\/+$/, "");

  return clean.endsWith("/api") ? clean : `${clean}/api`;
}

/**
 * Builds API URLs without duplicate /api prefixes.
 */
export function buildApiUrl(endpoint) {
  const base = getApiBaseUrl();

  let path = String(endpoint || "").trim();

  // Remove leading slashes.
  path = path.replace(/^\/+/, "");

  // Remove an existing API prefix if present.
  if (path === "api") {
    path = "";
  } else if (path.startsWith("api/")) {
    path = path.substring(4);
  }

  return path ? `${base}/${path}` : base;
}

/**
 * Centralized fetch wrapper.
 */
async function request(
  endpoint,
  options = {},
  timeoutMs = DEFAULT_TIMEOUT_MS
) {
  const url = buildApiUrl(endpoint);

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorDetail = `HTTP ${response.status} (${response.statusText})`;

      try {
        const errorData = await response.json();

        errorDetail =
          errorData.detail ||
          errorData.message ||
          errorDetail;
      } catch {
        // Keep the default HTTP error message.
      }

      throw new Error(errorDetail);
    }

    // Handle responses without a body.
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await response.json();
    }

    const text = await response.text();

    return text || null;

  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(
        `Request timed out after ${timeoutMs / 1000}s. ` +
        "The Render backend may be waking up from sleep. Please retry."
      );

      console.error(`API Timeout on ${endpoint}:`, timeoutError);

      throw timeoutError;
    }

    console.error(`API Error on ${endpoint}:`, error);

    throw error;

  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * JobPilot API endpoints.
 */
export const api = {

  // Base URL and Health
  getBaseUrl: getApiBaseUrl,

  getHealth: () => request("/health"),

  getStatus: () => request("/status"),

  updateApiKey: (apiKey) =>
    request("/status/key", {
      method: "POST",
      body: JSON.stringify({
        api_key: apiKey,
      }),
    }),

  // Companies
  getCompanies: () => request("/companies"),

  // Dashboard Stats
  getDashboardStats: () => request("/dashboard/stats"),

  // Jobs
  getJobs: (params = {}) => {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, val]) => {
      if (
        val !== undefined &&
        val !== null &&
        val !== "" &&
        val !== "all"
      ) {
        searchParams.append(key, val);
      }
    });

    const query = searchParams.toString();

    return request(
      `/jobs${query ? `?${query}` : ""}`
    );
  },

  getJobById: (id) =>
    request(`/jobs/${id}`),

  getSavedJobs: () =>
    request("/jobs/saved"),

  toggleSaveJob: (jobId) =>
    request(`/jobs/${jobId}/save`, {
      method: "POST",
    }),

  // Live TinyFish AI Agent Search
  searchLive: (searchPayload) =>
    request("/search/live", {
      method: "POST",
      body: JSON.stringify(searchPayload),
    }),

  // Application Tracker
  getApplications: () =>
    request("/applications"),

  createApplication: (data) =>
    request("/applications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateApplication: (id, data) =>
    request(`/applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  deleteApplication: (id) =>
    request(`/applications/${id}`, {
      method: "DELETE",
    }),

  // Profile
  getProfile: () =>
    request("/profile"),

  updateProfile: (data) =>
    request("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Resume Upload
  uploadResume: async (file) => {
    const formData = new FormData();

    formData.append("file", file);

    const url = buildApiUrl("/profile/resume");

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorDetail = `Upload failed (HTTP ${response.status})`;

        try {
          const errorData = await response.json();

          errorDetail =
            errorData.detail ||
            errorDetail;
        } catch {
          // Keep default error message.
        }

        throw new Error(errorDetail);
      }

      return await response.json();

    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "Resume upload timed out. Please retry."
        );
      }

      throw error;

    } finally {
      clearTimeout(timeoutId);
    }
  },
};
