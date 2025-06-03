import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // { name, email, role }
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // Check if token expired using stored expiry timestamp
  const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return false;
    return Date.now() > Number(expiry);
  };

  // Logout clears state and localStorage, then navigates to login
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate('/login');
  };

  // On mount and token change, fetch user info if token valid
  useEffect(() => {
    async function fetchUser() {
      if (!token || isTokenExpired()) {
        logout();
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [token]);

  // Auto logout every minute if token expired
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logout();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
