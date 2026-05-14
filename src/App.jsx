import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import UserPage from "./pages/UserPage";
import TicketPage from "./pages/TicketPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import {useGlobal} from "./context/AppContext";

function ProtectedRoute({children}) {
  const {isLoggedIn, authLoading} = useGlobal();
  if (authLoading) return null;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({children}) {
  const {isAdmin, authLoading} = useGlobal();
  if (authLoading) return null;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ticket"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserPage />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
