import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Parvadesh', email: 'parvadeshmsd@gmail.com', username: 'parvadesh', role: 'ADMIN', status: 'ACTIVE', bio: 'Platform Lead Administrator' };
  });

  const [token, setToken] = useState(() => localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lms_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('lms_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('lms_token', token);
    } else {
      localStorage.removeItem('lms_token');
    }
  }, [token]);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.login(email, password, role);
      setCurrentUser(data.user);
      setToken(data.token);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role, bio) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.register(name, email, password, role, bio);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userRole: currentUser?.role || null,
        token,
        loading,
        error,
        setError,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
