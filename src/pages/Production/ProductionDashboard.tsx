import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  Factory,
  ClipboardList,
  Package,
  PlayCircle,
  PauseCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Clock,
} from "lucide-react";

interface ProductionOrder {
  id: string;
  orderNumber: string;
  partNumber: string;
  quantity: number;
  completed: number;
  status: 'pending' | 'in-progress' | 'paused' | 'completed';
  machine: string;
  operator: string;
  startDate: string;
  dueDate: string;
}

export default function ProductionDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  // Mock data - Replace with actual API calls
  const [productionOrders] = useState<ProductionOrder[]>([
    {
      id: "1",
      orderNumber: "PO-2025-001",
      partNumber: "PART-12345",
      quantity: 100,
      completed: 75,
      status: "in-progress",
      machine: "CNC-01",
      operator: "John Doe",
      startDate: "2025-01-15",
      dueDate: "2025-01-20",
    },
    {
      id: "2",
      orderNumber: "PO-2025-002",
      partNumber: "PART-67890",
      quantity: 50,
      completed: 50,
      status: "completed",
      machine: "CNC-02",
      operator: "Jane Smith",
      startDate: "2025-01-10",
      dueDate: "2025-01-18",
    },
    {
      id: "3",
      orderNumber: "PO-2025-003",
      partNumber: "PART-54321",
      quantity: 200,
      completed: 0,
      status: "pending",
      machine: "CNC-03",
      operator: "Bob Wilson",
      startDate: "2025-01-20",
      dueDate: "2025-01-25",
    },
  ]);

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: <Clock className="h-3 w-3" /> },
      "in-progress": { color: "bg-blue-100 text-blue-800", icon: <PlayCircle className="h-3 w-3" /> },
      paused: { color: "bg-orange-100 text-orange-800", icon: <PauseCircle className="h-3 w-3" /> },
      completed: { color: "bg-green-100 text-green-800", icon: <CheckCircle className="h-3 w-3" /> },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const stats = {
    totalOrders: productionOrders.length,
    inProgress: productionOrders.filter(o => o.status === "in-progress").length,
    completed: productionOrders.filter(o => o.status === "completed").length,
    pending: productionOrders.filter(o => o.status === "pending").length,
    totalQuantity: productionOrders.reduce((sum, o) => sum + o.quantity, 0),
    completedQuantity: productionOrders.reduce((sum, o) => sum + o.completed, 0),
  };

  const efficiency = stats.totalQuantity > 0 
    ? Math.round((stats.completedQuantity / stats.totalQuantity) * 100) 
    : 0;

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
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Factory className="h-6 w-6" />
                  </div>
                  <div className="text-xl font-bold">Production Hub</div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="bg-blue-600 p-2 rounded-lg mx-auto">
                  <Factory className="h-6 w-6" />
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
            {menuItem("dashboard", <Factory size={20} />, "Dashboard")}
            {menuItem("orders", <ClipboardList size={20} />, "Production Orders")}
            {menuItem("schedule", <Calendar size={20} />, "Schedule")}
            {menuItem("machines", <Package size={20} />, "Machines")}
            {menuItem("operators", <Users size={20} />, "Operators")}
            {menuItem("reports", <TrendingUp size={20} />, "Reports")}
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
              Welcome to Production! 🏭
            </h1>
            <p className="text-gray-600">
              You are logged in as a <b>Production Manager</b>.
            </p>
          </div>

          {/* Dashboard Content */}
          {active === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Total Orders</h3>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <ClipboardList className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
                  <p className="text-slate-500 text-sm mt-2">Active production orders</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">In Progress</h3>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <PlayCircle className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.inProgress}</p>
                  <p className="text-slate-500 text-sm mt-2">Currently running</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Completed</h3>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
                  <p className="text-slate-500 text-sm mt-2">Orders finished</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Efficiency</h3>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-orange-600">{efficiency}%</p>
                  <p className="text-slate-500 text-sm mt-2">Overall production rate</p>
                </div>
              </div>

              {/* Production Overview Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Production Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-700">Completed</span>
                      </div>
                      <span className="font-semibold text-slate-900">{stats.completed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-700">In Progress</span>
                      </div>
                      <span className="font-semibold text-slate-900">{stats.inProgress}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-slate-700">Pending</span>
                      </div>
                      <span className="font-semibold text-slate-900">{stats.pending}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">
                    Quantity Overview
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Total Quantity</span>
                        <span className="font-semibold text-slate-900">{stats.totalQuantity}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: "100%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Completed</span>
                        <span className="font-semibold text-slate-900">{stats.completedQuantity}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-slate-700">Remaining</span>
                        <span className="font-semibold text-slate-900">
                          {stats.totalQuantity - stats.completedQuantity}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{ width: `${100 - efficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Production Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Recent Production Orders
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Order Number
                        </th>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Part Number
                        </th>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Progress
                        </th>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Machine
                        </th>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Operator
                        </th>
                        <th className="text-left p-3 text-sm font-semibold text-slate-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionOrders.map((order) => {
                        const progress = (order.completed / order.quantity) * 100;
                        const statusBadge = getStatusBadge(order.status);
                        return (
                          <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="p-3 text-sm font-medium text-slate-800">
                              {order.orderNumber}
                            </td>
                            <td className="p-3 text-sm text-slate-600">{order.partNumber}</td>
                            <td className="p-3 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-slate-200 rounded-full h-2 max-w-[100px]">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-slate-700 text-xs font-medium">
                                  {order.completed}/{order.quantity}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-sm text-slate-600">{order.machine}</td>
                            <td className="p-3 text-sm text-slate-600">{order.operator}</td>
                            <td className="p-3">
                              <span
                                className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}
                              >
                                {statusBadge.icon}
                                <span className="capitalize">{order.status.replace('-', ' ')}</span>
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Production Orders Page */}
          {active === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Production Orders Management
              </h2>
              <div className="text-center py-12">
                <ClipboardList className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Production orders management coming soon</p>
              </div>
            </div>
          )}

          {/* Schedule Page */}
          {active === "schedule" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Production Schedule
              </h2>
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Production schedule coming soon</p>
              </div>
            </div>
          )}

          {/* Machines Page */}
          {active === "machines" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Machine Management
              </h2>
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Machine management coming soon</p>
              </div>
            </div>
          )}

          {/* Operators Page */}
          {active === "operators" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Operator Management
              </h2>
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Operator management coming soon</p>
              </div>
            </div>
          )}

          {/* Reports Page */}
          {active === "reports" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">
                Production Reports
              </h2>
              <div className="text-center py-12">
                <TrendingUp className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">Production reports coming soon</p>
              </div>
            </div>
          )}

          {/* Settings Page */}
          {active === "settings" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="font-semibold text-slate-800 mb-2">General Settings</h3>
                  <p className="text-slate-600 text-sm">
                    Configure your production dashboard preferences
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