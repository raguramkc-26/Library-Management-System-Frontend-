import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user || user.role !== "admin") {
  return <Navigate to="/dashboard" />;
  }
  return children;
};

export default AdminRoute;