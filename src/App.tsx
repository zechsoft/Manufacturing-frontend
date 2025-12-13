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
import NpdDashboard from "./pages/Npd/NpdDashboard";
import NpdHome from "./pages/Npd/NpdHome";
import DocumentsPage from "./pages/Npd/DocumentsPage";
import MasterPage from "./pages/Npd/MasterPage";
import PlanningPage from "./pages/Npd/PlanningPage";
import BillOfMaterialPage from "./pages/Npd/BillOfMaterialPage";
import ProcessPage from "./pages/Npd/ProcessPage";
import ItemProcessPage from "./pages/Npd/ItemProcessPage";
import PurchaseDashboard from "./pages/Purchase/PurchaseDashboard";
import SalesDashboard from "./pages/Sales/SalesDashboard";
import StoresDashboard from "./pages/Stores/StoresDashboard";
import CustomerModel from "./pages/CustomerModel";
import DocumentUpload from "./components/DocumentUpload";
import PurchaseOrdersDashboard from "./pages/Planning/PurchaseOrdersDashboard";
import PlanningManagement from "./pages/Planning/PlanningManagement";
import PlanningLayout from "./pages/Planning/PlanningLayout";
import SuppliersPage from "./pages/Planning/SuppliersPage";
import AnalyticsPage from "./pages/Planning/AnalyticsPage";
import OrdersDashboard from './pages/Orders/OrdersDashboard';
import QualityDashboard from "./pages/Quality/QualityDashboard";
import ProductionDashboard from "./pages/Production/ProductionDashboard";
import UsersPage from "./pages/UsersPage";
import ProductsPage from "./pages/ProductsPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

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
  
  if (!user || !role) {
    console.log('Missing user or role data, showing invalid role page');
    return <InvalidRolePage />;
  }

  switch (role) {
    case "admin":
      return <AdminPage />;
    case "npd":
      return <Navigate to="/npd" replace />;
    case "purchase":
      return <Navigate to="/purchase" replace />;
    case "sales":
      return <Navigate to="/sales" replace />;
    case "stores":
      return <Navigate to="/stores" replace />;
    case "planning":
      return <Navigate to="/planning" replace />;
    case "production":
      return <Navigate to="/production" replace />;
    case "quality":
      return <Navigate to="/quality" replace />;
    case "user":
      return <DashboardPage />;
    default:
      console.log('Invalid role:', role, 'showing error page');
      return <InvalidRolePage />;
  }
};

// Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isCheckingAuth, user } = useAuthStore();
  
  console.log('ProtectedRoute:', { isAuthenticated, isCheckingAuth, hasUser: !!user });

  if (isCheckingAuth) return <LoadingSpinner />;
  
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

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Auth checker component
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
          {/* Main dashboard */}
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
            <Route index element={<AdminPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="customers" element={<CustomerModel />} />
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

          {/* Common Routes - Available to all authenticated users */}
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Document Upload */}
          <Route path="/upload-doc" element={<DocumentUpload />} />
          <Route path="/orders" element={<OrdersDashboard />} />

          {/* NPD Routes */}
          <Route
            path="/npd"
            element={
              <ProtectedRoute>
                <NpdDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<NpdHome />} /> 
            <Route path="master" element={<MasterPage />} />
            <Route path="planning" element={<PlanningPage />} />
            <Route path="bill-of-material" element={<BillOfMaterialPage />} />
            <Route path="process" element={<ProcessPage />} />
            <Route path="item-process" element={<ItemProcessPage />} />
            <Route path="documents" element={<DocumentsPage />} />
          </Route>

          {/* Quality Routes */}
          <Route
            path="/quality"
            element={
              <ProtectedRoute>
                <QualityDashboard />
              </ProtectedRoute>
            }
          />

          {/* Planning Routes */}
          <Route
            path="/planning"
            element={
              <ProtectedRoute>
                <PlanningLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PurchaseOrdersDashboard />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="new-plan" element={<PlanningManagement />} />
          </Route>

          {/* Production Routes */}
          <Route
            path="/production"
            element={
              <ProtectedRoute>
                <ProductionDashboard />
              </ProtectedRoute>
            }
          />

          {/* Purchase Routes */}
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <PurchaseDashboard />
              </ProtectedRoute>
            }
          />

          {/* Sales Routes */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute>
                <SalesDashboard />
              </ProtectedRoute>
            }
          />

          {/* Stores Routes */}
          <Route
            path="/stores"
            element={
              <ProtectedRoute>
                <StoresDashboard />
              </ProtectedRoute>
            }
          />

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