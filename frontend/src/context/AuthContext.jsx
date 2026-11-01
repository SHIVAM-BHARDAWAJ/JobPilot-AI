import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jobpilot_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default logged in user for demo & immediate seamless review
    return {
      id: 'default_user',
      name: 'Alex Morgan',
      email: 'alex.morgan@university.edu',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Student / Aspiring SDE',
    };
  });

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to load profile from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('jobpilot_user', JSON.stringify(user));
      fetchProfile();
    } else {
      localStorage.removeItem('jobpilot_user');
      setLoading(false);
    }
  }, [user]);

  const login = (email, password) => {
    // Demo login simulator
    const newUser = {
      id: 'default_user',
      name: email.split('@')[0].replace('.', ' ') || 'Job Seeker',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Software Engineer Candidate',
    };
    setUser(newUser);
    return true;
  };

  const signup = (name, email, password) => {
    const newUser = {
      id: 'default_user',
      name: name,
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'Job Seeker',
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        signup,
        logout,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
