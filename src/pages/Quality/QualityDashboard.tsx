import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  Home,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function QualityDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const menuItem = (key: string, icon: any, label: string) => (
    <button
      onClick={() => setActive(key)}
      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active === key
          ? "bg-blue-600/20 text-blue-300 border-l-4 border-blue-500"
          : "text-slate-400 hover:bg-slate-700/50"
      }`}
      title={sidebarCollapsed ? label : undefined}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!sidebarCollapsed && <span>{label}</span>}
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-gradient-to-b from-slate-800 to-slate-900 text-white fixed top-0 left-0 h-full shadow-2xl flex flex-col justify-between transition-all duration-300 z-40`}
      >
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="text-xl font-bold">Quality Portal</div>
              )}
              {sidebarCollapsed && (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mx-auto">
                  <ClipboardCheck size={20} />
                </div>
              )}
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-2 hover:bg-slate-700/50 transition-colors flex items-center justify-center mt-4"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <div className="flex items-center justify-between w-full px-4">
                <span className="text-sm text-slate-400">Collapse</span>
                <ChevronLeft className="h-5 w-5" />
              </div>
            )}
          </button>

          {/* Navigation */}
          <nav className="mt-6 space-y-2 px-3">
            {menuItem("dashboard", <Home size={20} />, "Dashboard")}
            {menuItem(
              "inspections",
              <ClipboardCheck size={20} />,
              "Inspections"
            )}
            {menuItem("reports", <FileText size={20} />, "QC Reports")}
            {menuItem("ncr", <AlertTriangle size={20} />, "Non-Compliance")}
            {menuItem("settings", <Settings size={20} />, "Settings")}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg transition-all"
            title={sidebarCollapsed ? "Logout" : undefined}
          >
            <LogOut size={18} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content - Dynamic margin based on sidebar state */}
      <main
        className={`${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } p-10 w-full transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, Quality Team! 🎯
            </h1>
            <p className="text-gray-600">
              You are logged in as a <b>Quality Engineer</b>.
            </p>
          </div>

          {/* Page Content based on active tab */}
          {active === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Today's Inspections
                    </h3>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ClipboardCheck className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">0</p>
                  <p className="text-slate-500 text-sm mt-2">Pending review</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Pending NCRs
                    </h3>
                    <div className="p-3 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-red-500">0</p>
                  <p className="text-slate-500 text-sm mt-2">
                    Requires attention
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">
                      Approved Reports
                    </h3>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">0</p>
                  <p className="text-slate-500 text-sm mt-2">This month</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Recent Activity
                </h3>
                <div className="text-center py-12">
                  <ClipboardCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">No recent activity to display</p>
                </div>
              </div>
            </div>
          )}

          {active === "inspections" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Inspection Records
              </h2>
              <div className="text-center py-12">
                <ClipboardCheck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No inspection records found</p>
              </div>
            </div>
          )}

          {active === "reports" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                QC Reports Section
              </h2>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No QC reports available</p>
              </div>
            </div>
          )}

          {active === "ncr" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Non-Compliance Tracking
              </h2>
              <div className="text-center py-12">
                <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">
                  No non-compliance records found
                </p>
              </div>
            </div>
          )}

          {active === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Settings
              </h2>
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    General Settings
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Configure your quality dashboard preferences
                  </p>
                </div>
                <div className="text-center py-8">
                  <Settings className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600">Settings panel coming soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}