import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authenticated, login, register } from "../endpoints/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthenticated = async () => {
    try {
      const success = await authenticated();
      setIsAuthenticated(success);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  const registerUser = async (username, email, password, confirmPassword) => {
    if (password === confirmPassword) {
      const success = await register(username, email, password);
      success.status_code === 201 ? navigate("/login") : navigate("/register");
    } else {
      alert("Passwords do not match.");
    }
  };

  useEffect(() => {
    getAuthenticated();
  }, [window.location.pathname]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, loginUser, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
