import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [savedJobIds, setSavedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [appModalJob, setAppModalJob] = useState(null);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const refreshSystemStatus = useCallback(async () => {
    try {
      const data = await api.getStatus();
      setSystemStatus(data);
    } catch (e) {
      console.error('Failed to get status:', e);
    }
  }, []);

  const refreshSavedJobs = useCallback(async () => {
    try {
      const res = await api.getSavedJobs();
      if (res && res.saved_jobs) {
        setSavedJobIds(new Set(res.saved_jobs.map((j) => j.id)));
      }
    } catch (e) {
      console.error('Failed to refresh saved jobs:', e);
    }
  }, []);

  useEffect(() => {
    refreshSystemStatus();
    refreshSavedJobs();
  }, [refreshSystemStatus, refreshSavedJobs]);

  const toggleSave = async (job) => {
    try {
      const res = await api.toggleSaveJob(job.id);
      setSavedJobIds((prev) => {
        const next = new Set(prev);
        if (res.is_saved) {
          next.add(job.id);
        } else {
          next.delete(job.id);
        }
        return next;
      });
      showNotification(res.message, res.is_saved ? 'success' : 'info');
      return res.is_saved;
    } catch (e) {
      showNotification('Failed to update saved job status', 'error');
      return false;
    }
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setDetailModalOpen(true);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
    setDetailModalOpen(false);
  };

  const openApplicationModal = (job = null) => {
    setAppModalJob(job);
    setAppModalOpen(true);
  };

  const closeApplicationModal = () => {
    setAppModalJob(null);
    setAppModalOpen(false);
  };

  return (
    <JobContext.Provider
      value={{
        savedJobIds,
        isSaved: (id) => savedJobIds.has(id),
        toggleSave,
        selectedJob,
        detailModalOpen,
        openJobDetails,
        closeJobDetails,
        appModalOpen,
        appModalJob,
        openApplicationModal,
        closeApplicationModal,
        apiKeyModalOpen,
        setApiKeyModalOpen,
        systemStatus,
        refreshSystemStatus,
        notification,
        showNotification,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
