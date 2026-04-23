import { createContext, useContext, useEffect, useState } from "react";
import instance from "../instances/instance";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await instance.get("/auth/getMe");
        const userData = res.data?.user;
        console.log("GETME RESPONSE:", res,data);
        console.log("EXTRACTED USER:", userData);
        setUser(userData || null); 
      } catch (err) {
        console.log("GETME ERROR:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
  console.log("AUTH USER:", user);
}, [user]);

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