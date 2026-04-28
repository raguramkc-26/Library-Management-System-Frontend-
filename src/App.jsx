import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookDetails from "./pages/common/BookDetails";
import Profile from "./pages/user/Profile";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import PaymentHistory from "./pages/user/PaymentHistory";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import EditBook from "./pages/admin/EditBook";
import AdminUsers from "./pages/admin/AdminUsers";
import Notifications from "./pages/user/Notifications";
import Books from "./pages/user/Books";
import AdminReviews from "./pages/admin/AdminReviews";
import AddBook from "./pages/admin/AddBook";
import ErrorBoundary from "./components/ErrorBoundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: localStorage.getItem("token")
      ? <Navigate to="/dashboard" replace />
      : <Navigate to="/login" replace />,
    errorElement: <ErrorBoundary />,
  },

  /* PUBLIC ROUTES */
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },

  /* PROTECTED COMMON */
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/book/:id",
        element: <BookDetails />,
      },
    ],
  },

  /* USER AREA */
  {
    path: "/dashboard",
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true, element: <UserDashboard /> },
          { path: "books", element: <Books /> },
          { path: "profile", element: <Profile /> },
          { path: "borrowed", element: <PaymentHistory /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  /* ADMIN AREA */
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
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

  /* 404 */
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

/* APP */

const App = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </ErrorBoundary>
  );
};

export default App;