import { type ReactNode, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DefaultPage";
import AdminPage from "./pages/AdminPage";
import LoadingSpinner from "./components/LoadingSpinner";
import AdminLayout from "./layout/AdminLayout";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import EngineerDashboard from "./pages/Engineer/EngineerDashboard";
import EngineerHome from "./pages/Engineer/EngineerHome";
import DocumentsPage from "./pages/Engineer/DocumentsPage";
import PartsPage from "./pages/Engineer/PartsPage";
import MaterialDashboard from "./pages/Material/MaterialDashboard";
import CustomerModel from "./pages/CustomerModel";
import DocumentUpload from "./components/DocumentUpload";
import PlanningDashboard from "./pages/Planning/PlanningDashboard";
import PlanningPage from "./pages/Planning/PlanningPage";
import PlanningLayout from "./pages/Planning/PlanningLayout";
import OrdersDashboard from './pages/Orders/OrdersDashboard';
import QualityDashboard from "./pages/Quality/QualityDashboard";

// Add this temporarily in your auth store or App.tsx
console.log('Environment variables:', {
  REACT_APP_API_URL: import.meta.env.VITE_API_URL,
  MODE: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  all: import.meta.env
});
// Error fallback component for invalid roles or auth issues
const InvalidRolePage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900">
    <div className="text-center text-white">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Access Issue</h1>
      <p className="text-gray-300 mb-4">
        There seems to be an issue with your account. Please try logging in again.
      </p>
      <button 
        onClick={() => {
          // Clear everything and force a fresh login
          sessionStorage.clear();
          useAuthStore.getState().logout().finally(() => {
            window.location.href = '/login';
          });
        }}
        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Login Again
      </button>
    </div>
  </div>
);

// Fixed RoleBasedDashboard with proper safeguards
const RoleBasedDashboard = ({ role, user }: { role: string; user: any }) => {
  console.log('RoleBasedDashboard rendering with role:', role, 'user:', user?.email);
  
  // Handle the case where user is missing or role is empty
  if (!user || !role) {
    console.log('Missing user or role data, showing invalid role page');
    return <InvalidRolePage />;
  }

  // Direct return based on role
  switch (role) {
    case "admin":
      return <AdminPage />;
    case "engineer":
      return <Navigate to="/engineer" replace />;
    case "material":
      return <MaterialDashboard />;
    case "planning":
      return <PlanningDashboard />;
    case "purchase":
      return <PurchaseDashboard />;  
    case "logistics":
      return <LogisticsDashboard />;
    case "quality":
      return <QualityDashboard />;
    case "user":
      return <DashboardPage />;
    default:
      console.log('Invalid role:', role, 'showing error page');
      return <InvalidRolePage />;
  }
};

// Protected route wrapper with better validation
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();
  
  console.log('ProtectedRoute:', { isAuthenticated, isCheckingAuth, hasUser: !!user });

  if (isCheckingAuth) return <LoadingSpinner />;
  
  // Check both authentication AND user data
  if (!isAuthenticated || !user) {
    console.log('Not authenticated or missing user data, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin route wrapper
interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) return <LoadingSpinner />;
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// Redirect authenticated users away from auth pages
interface RedirectAuthenticatedUserProps {
  children: ReactNode;
}

const RedirectAuthenticatedUser = ({ children }: RedirectAuthenticatedUserProps) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

  console.log('RedirectAuthenticatedUser:', { isAuthenticated, isCheckingAuth, hasUser: !!user });

  // Wait for auth check to complete
  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  // Only redirect if both authenticated AND have user data
  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  // Show children (login/signup pages) if not properly authenticated
  return <>{children}</>;
};

// Separate component to handle initial auth check
const AuthChecker = ({ children }: { children: ReactNode }) => {
  const { isCheckingAuth } = useAuthStore();

  useEffect(() => {
    console.log('AuthChecker: Starting initial auth check');
    useAuthStore.getState().checkAuth();
  }, []);

  if (isCheckingAuth) {
    console.log('AuthChecker: Still checking auth, showing loading');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  console.log('AuthChecker: Auth check complete, rendering app');
  return <>{children}</>;
};

const App = () => {
  const { user } = useAuthStore();
  
  console.log('App rendering with user:', user?.email, 'role:', user?.role);

  return (
    <AuthChecker>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
        <Routes>
          {/* Main dashboard and admin routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleBasedDashboard role={user?.role || ""} user={user} />
              </ProtectedRoute>
            }
          />
          
          {/* Admin section with layout */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="customers" element={<CustomerModel />} />
            <Route index element={<AdminPage />} />
            <Route path="orders" element={<OrdersDashboard />} />
          </Route>

          {/* Auth pages */}
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          {/* Document Upload */}
          <Route path="/upload-doc" element={<DocumentUpload />} />
          <Route path="/orders" element={<OrdersDashboard />} />

          {/* Engineers Subpages */}
          <Route
              path="/engineer"
              element={
                  <ProtectedRoute>
                  <EngineerDashboard />
                </ProtectedRoute>
             }
          >
            <Route path="documents" element={<DocumentsPage />} />
            <Route index element={<EngineerHome />} /> 
            <Route path="parts" element={<PartsPage />} /> 
            {/* Later you can add more, e.g. */}
            {/* <Route path="profile" element={<EngineerProfile />} /> */}
          </Route>

          <Route
            path="/quality"
            element={
              <ProtectedRoute>
                <QualityDashboard />
              </ProtectedRoute>
            }
          />

 
          <Route
            path="/planning"
            element={
              <ProtectedRoute>
                <PlanningLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PlanningDashboard />} />
            <Route path="new-plan" element={<PlanningPage />} />
            {/* you can add suppliers, analytics routes here as well */}
          </Route>


          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </div>
    </AuthChecker>
  );
};

export default App;