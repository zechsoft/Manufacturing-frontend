import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Package, Users, TrendingUp, Plus } from "lucide-react";

export default function PlanningLayout() {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 to-blue-50">

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl transition-all duration-300`}>
        <div className="p-6">

          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            {!sidebarCollapsed && <h1 className="text-xl font-bold">Planning Hub</h1>}
          </div>

          <nav className="space-y-2">

            <button
              onClick={() => navigate("/planning")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5" />
                {!sidebarCollapsed && <span>Purchase Orders</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/suppliers")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                {!sidebarCollapsed && <span>Suppliers</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/analytics")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </div>
            </button>

            <button
              onClick={() => navigate("/planning/new-plan")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5" />
                {!sidebarCollapsed && <span>Planning</span>}
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}
