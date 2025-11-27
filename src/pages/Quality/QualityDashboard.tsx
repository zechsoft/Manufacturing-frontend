import React, { useState } from "react";
import { useAuthStore } from "../../store/authStore";


import {
  Home,
  FileText,
  ClipboardCheck,
  AlertTriangle,
  LogOut,
  Settings,
} from "lucide-react";

export default function QualityDashboard() {
  const [active, setActive] = useState("dashboard");

  const { logout } = useAuthStore();

    const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
    };


  const menuItem = (key: string, icon: any, label: string) => (
    <button
      onClick={() => setActive(key)}
      className={`w-full text-left flex items-center gap-3 px-5 py-3 rounded-lg transition-all ${
        active === key
          ? "bg-blue-600 text-white"
          : "text-gray-300 hover:bg-gray-800"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white fixed top-0 left-0 h-full shadow-xl flex flex-col justify-between">
        
        <div>
          <div className="p-6 text-2xl font-bold border-b border-gray-700">
            Quality Portal
          </div>

          <nav className="mt-6 space-y-2 px-3">
            {menuItem("dashboard", <Home size={20} />, "Dashboard")}
            {menuItem(
              "inspections",
              <ClipboardCheck size={20} />,
              "Inspections"
            )}
            {menuItem(
              "reports",
              <FileText size={20} />,
              "QC Reports"
            )}
            {menuItem(
              "ncr",
              <AlertTriangle size={20} />,
              "Non-Compliance"
            )}
            {menuItem(
              "settings",
              <Settings size={20} />,
              "Settings"
            )}
          </nav>
        </div>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
            >
            <LogOut size={18} />
            Logout
        </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-10 w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, Quality Team! 🎯
        </h1>
        <p className="text-gray-600 mb-6">
          You are logged in as a <b>Quality Engineer</b>.
        </p>

        {/* Page Content based on active tab */}
        {active === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Today’s Inspections</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Pending NCRs</h3>
              <p className="text-3xl font-bold text-red-500">0</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-lg font-semibold mb-2">Approved Reports</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>
        )}

        {active === "inspections" && (
          <h2 className="text-xl font-semibold mt-10">Inspection Records</h2>
        )}
        {active === "reports" && (
          <h2 className="text-xl font-semibold mt-10">QC Reports Section</h2>
        )}
        {active === "ncr" && (
          <h2 className="text-xl font-semibold mt-10">Non-Compliance Tracking</h2>
        )}
        {active === "settings" && (
          <h2 className="text-xl font-semibold mt-10">Settings</h2>
        )}
      </main>
    </div>
  );
}
