import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(true);

  // Check if token has expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp < currentTime; // Compare token expiry with current time
    } catch (error) {
      return true; // If there's an error decoding the token, consider it expired
    }
  };

  // Check token expiry on load
  const checkTokenExpiry = () => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      if (isTokenExpired(storedToken)) {
        logout(); // Token expired, log the user out
      } else {
        setIsAuthenticated(true);
        setToken(storedToken);
        setUser(JSON.parse(storedUser)); // Set user from localStorage
      }
    } else {
      logout(); // No token or user found, log the user out
    }

    setLoading(false); // Once the check is complete, stop loading
  };

  // UseEffect to run the token expiry check on initial load
  useEffect(() => {
    checkTokenExpiry();
  }, []);

  // Login function for normal users (OTP-based)
  const login = (authToken, userData) => {
    console.log('login', authToken, userData);
    setToken(authToken);
    setUser({ ...userData, role: 'user' });
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify({ ...userData, role: 'user' }));
    setIsAuthenticated(true);
  };

  // Login function for admin (username/password-based)
  const adminLogin = (authToken, adminData) => {
    setIsAuthenticated(true);
    setToken(authToken);
    setUser({ ...adminData, role: 'admin' });
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('user', JSON.stringify({ ...adminData, role: 'admin' }));
  };

  // Logout function (common for both admin and normal users)
  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        loading,
        login,
        adminLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
