import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIN
  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // LOAD USER ON APP START
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getMe();
        setUser(res.data.user);

      } catch (err) {
        console.error("Auth Error:", err);

          localStorage.removeItem("token");
          setUser(null);
        } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);