import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      // ✅ if it's a session route, skip auth check completely
      if (location.pathname.startsWith("/session/")) {
        return;
      }

      if (!token || !userId) {
        if (location.pathname !== "/login" && location.pathname !== "/signup") {
          navigate("/login");
        }
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.clear();
          setCurrUser(null);
          navigate("/login");
        } else {
          setCurrUser(userId);

         
          if (
            location.pathname === "/login" ||
            location.pathname === "/signup"
          ) {
            navigate("/");
          }
        }
      } catch (err) {
        localStorage.clear();
        setCurrUser(null);
        navigate("/login");
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
