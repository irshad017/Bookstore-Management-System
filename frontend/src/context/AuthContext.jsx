import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { useNotification } from './NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error } = useNotification();

  useEffect(() => {
    const saved = localStorage.getItem('bookstore_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('bookstore_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const authData = {
        ...data.user,
        token: data.token,
      };
      setUser(authData);
      localStorage.setItem('bookstore_user', JSON.stringify(authData));
      success(`Welcome back, ${data.user.name}!`);
      return authData;
    } catch (err) {
      error(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      const authData = {
        ...data.user,
        token: data.token,
      };
      setUser(authData);
      localStorage.setItem('bookstore_user', JSON.stringify(authData));
      success('Account created successfully! Welcome to SkyBrisk Bookstore.');
      return authData;
    } catch (err) {
      error(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookstore_user');
    success('Logged out successfully.');
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      const updated = {
        ...data.user,
        token: data.token || user.token,
      };
      setUser(updated);
      localStorage.setItem('bookstore_user', JSON.stringify(updated));
      success('Profile updated successfully!');
      return updated;
    } catch (err) {
      error(err.message);
      throw err;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
