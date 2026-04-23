import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookDetails from "./pages/BookDetails";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashBoardLayout";
import PaymentHistory from "./pages/PaymentHistory";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import EditBook from "./pages/EditBook";
import AdminUsers from "./pages/AdminUsers";
import Notifications from "./pages/Notifications";
import Books from "./pages/Books";
import AdminReviews from "./pages/AdminReviews";
import AddBook from "./pages/AddBook";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" /> },

  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  { path: "/book/:id", element: <BookDetails /> },

  // USER AREA
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
          { path: "payments", element: <PaymentHistory /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
    ],
  },

  // ADMIN AREA
  {
    element: <AdminRoute />,
    children: [
      {
        path: "/admin",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="dashboard" /> },
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "reviews", element: <AdminReviews /> },
          { path: "users", element: <AdminUsers /> },

          { path: "add-book", element: <AddBook /> },
          { path: "edit-book/:id", element: <EditBook />}
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;