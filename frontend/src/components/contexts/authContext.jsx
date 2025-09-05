import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currUser, setCurrUser] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem("role")
          setCurrUser(null);
          navigate('/login');
        } else {
          setCurrUser(userId);
        }
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem("role")
        setCurrUser(null);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
};
