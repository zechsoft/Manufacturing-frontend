import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Package, Users, TrendingUp, Plus, LogOut, ChevronLeft, ChevronRight, BarChart3 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

export default function PlanningLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    // Exact match for root planning page
    if (path === "/planning" && location.pathname === "/planning") {
      return true;
    }
    // For other paths, check if current path starts with the menu path
    if (path !== "/planning" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl z-40 transition-all duration-300`}
      >
        <div className="p-6">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between mb-8">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold">Planning Hub</h1>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="bg-blue-600 p-2 rounded-lg mx-auto">
                <Package className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Toggle Button - Separate from header */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-2 rounded-lg hover:bg-slate-700/50 transition-colors mb-6 flex items-center justify-center"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm text-slate-400">Collapse</span>
                <ChevronLeft className="h-5 w-5" />
              </div>
            )}
          </button>

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => navigate("/planning")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isActive("/planning")
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
              title={sidebarCollapsed ? "Purchase Orders" : undefined}
            >
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span className="font-medium">Purchase Orders</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/suppliers")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isActive("/planning/suppliers")
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
              title={sidebarCollapsed ? "Suppliers" : undefined}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Suppliers</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/analytics")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isActive("/planning/analytics")
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
              title={sidebarCollapsed ? "Analytics" : undefined}
            >
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/new-plan")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                isActive("/planning/new-plan")
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
              title={sidebarCollapsed ? "Planning" : undefined}
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Planning</span>}
              </div>
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content - Dynamic margin based on sidebar state */}
      <div 
        className={`transition-all duration-300 flex-1 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}