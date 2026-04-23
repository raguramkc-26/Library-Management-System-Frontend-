import { createContext, useContext, useEffect, useState } from "react";
import instance from "../instances/instance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AUTH USER:", user);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await instance.get("/auth/getMe");
        const userData = res.data?.data || res.data?.user || res.data;
        setUser(res?.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await instance.post("/auth/logout");
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);