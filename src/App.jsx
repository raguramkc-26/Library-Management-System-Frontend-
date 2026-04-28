import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import UserDashboard from "./pages/user/UserDashboard";
import Books from "./pages/user/Books";
import Profile from "./pages/user/Profile";
import Notifications from "./pages/user/Notifications";
import BorrowedBooks from "./pages/user/BorrowedBooks";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AddBook from "./pages/admin/AddBook";
import EditBook from "./pages/admin/EditBook";
import BookDetails from "./pages/common/BookDetails";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: localStorage.getItem("token")
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/login" replace />,
  },

  // PUBLIC
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  // BOOK DETAILS (protected)
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/book/:id", element: <BookDetails /> },
    ],
  },

  // USER
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "books", element: <Books /> },
          { path: "profile", element: <Profile /> },
          { path: "borrowed", element: <BorrowedBooks /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  // ADMIN
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <AdminUsers /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "add-book", element: <AddBook /> },
          { path: "edit-book/:id", element: <EditBook /> },
        ],
      },
    ],
  },

  // 404
  {
    path: "*",
    element: (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-600">
          404 | Page Not Found
        </h1>
      </div>
    ),
  },
]);

const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ErrorBoundary>
  );
};

export default App;