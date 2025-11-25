import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = () => {
  const token = localStorage.getItem("authToken");

  if (token) {
    // User is logged in → redirect to dashboard
    return <Navigate to="/dashboard/smtp" replace />;
  }

  // No token → render the child route (login, signup, etc.)
  return <Outlet />;
};

export default GuestRoute;