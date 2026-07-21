import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user_session");

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (err) {
          console.error("Parse Error:", err);
        }
      }

      if (token) {
        try {
          const response = await authService.getMe();
          const serverUser = response?.user || response?.data?.user || response?.account || response;
          
          let validUser = serverUser;
          if (savedUser) {
            try {
              validUser = { ...JSON.parse(savedUser), ...serverUser };
            } catch (e) {
              console.error('Gagal parsing session data:', e);
            }
          }

          setUser(validUser);
          localStorage.setItem("user_session", JSON.stringify(validUser));
        } catch (err) {
          console.error("Auth Error (Token Invalid/Expired):", err);
          setUser(null);
          localStorage.removeItem("user_session");
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user_session", JSON.stringify(userData));
    if (token) localStorage.setItem("token", token);
  };

  const updateUser = (newUserData) => {
  setUser(newUserData); 
  localStorage.setItem("user_session", JSON.stringify(newUserData)); 
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_session");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);