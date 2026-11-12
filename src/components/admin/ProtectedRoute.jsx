import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../api/auth";

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    // Alihkan ke halaman login jika token tidak ditemukan
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

