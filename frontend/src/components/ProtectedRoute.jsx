import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Usage:
// <Route element={<ProtectedRoute />}><Route path="/profile" element={<Profile />} /></Route>
// <Route element={<ProtectedRoute adminOnly />}><Route path="/admin" element={<AdminPanel />} /></Route>
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
