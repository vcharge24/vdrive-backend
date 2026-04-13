import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AdminPortal from "./portals/admin/AdminPortal";
import MerchantPortal from "./portals/merchant/MerchantPortal";
import LoginPage from "./pages/LoginPage";
import ActivateAccountPage from "./pages/ActivateAccountPage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate" element={<ActivateAccountPage />} />
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/merchant/*"
        element={
          <ProtectedRoute>
            <MerchantPortal />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
