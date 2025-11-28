import { useAuthStore } from "../store/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../layout/Sidebar";

const AdminPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true); // Start with sidebar open
  const [activeTab, setActiveTab] = useState("dashboard");

  // Toggle sidebar open/close
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Redirect non-admin users and unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [user, isAuthenticated, navigate]);

  // Loading state while checking authentication
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <p className="text-white text-lg">Verifying admin privileges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        activeItem={activeTab}
        onItemClick={setActiveTab}
        user={user}
        onLogout={logout}
      />

      {/* Main Content - Dynamic margin based on sidebar state */}
      <div 
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        <main className="p-6 lg:p-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome back, {user.name}! 👋
            </h1>
            <div className="text-gray-700 space-y-4">
              <p className="text-lg">You are logged in as an admin</p>
              <p>
                Role:{" "}
                <span className="font-semibold capitalize">{user.role}</span>
              </p>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Admin Controls
                </h2>
                <p className="text-gray-600">
                  Use the sidebar to navigate through different admin sections.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;