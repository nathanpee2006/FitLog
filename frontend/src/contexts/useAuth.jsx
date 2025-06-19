import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  authenticated,
  login,
  register,
  logout,
  refreshToken,
} from "../endpoints/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated with valid access token
  const getAuthenticated = async () => {
    try {
      // if no 401 error, authenticate user
      const success = await authenticated();
      setIsAuthenticated(success);
    } catch (error) {
      // if 401 error, refresh access token
      if (error.response && error.response.status === 401) {
        try {
          const refreshed = await refreshToken();
          if (refreshed) {
            // authenticate user again
            const retrySuccess = await authenticated();
            setIsAuthenticated(retrySuccess);
          } else {
            // if refresh unsuccessful, unauthenticate
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        // Handle other errors not related to 401
        console.error(
          "Auth: Non-401 error during initial authentication:",
          error
        );
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (username, password) => {
    const success = await login(username, password);
    if (success) {
      setIsAuthenticated(true);
      navigate("/workouts");
    }
  };

  const logoutUser = async () => {
    await logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  const registerUser = async (username, email, password, confirmPassword) => {
    if (password === confirmPassword) {
      const success = await register(username, email, password);
      success.status_code === 201 ? navigate("/login") : navigate("/register");
    } else {
      alert("Passwords do not match.");
    }
  };

  // Everytime the url path changes, check if the user is authenticated (if they have a valid access token)
  useEffect(() => {
    getAuthenticated();
  }, [location.pathname]);

  // Nested components in the AuthContext.Provider can have access to context values and functions by calling useAuth()
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, loginUser, logoutUser, registerUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
