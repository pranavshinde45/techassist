import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [currUser, setCurrUser] = useState(() => {
    return localStorage.getItem("userId") || null;
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // public route check
      const isPublicRoute = location.pathname.startsWith("/session");

      if (!token || !userId) {
        setCurrUser(null);

        if (!isPublicRoute) {
          navigate('/login');
        }
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("Token expired");
          localStorage.clear();
          setCurrUser(null);

          if (!isPublicRoute) {
            navigate('/login');
          }
        } else {
          setCurrUser(userId);
        }
      } catch (err) {
        console.error("Invalid token:", err.message);
        localStorage.clear();
        setCurrUser(null);

        if (!isPublicRoute) {
          navigate('/login');
        }
      }
    };

    checkAuth();
  }, [navigate, location]);

  return (
    <AuthContext.Provider value={{ currUser, setCurrUser }}>
      {children}
    </AuthContext.Provider>
  );
};
