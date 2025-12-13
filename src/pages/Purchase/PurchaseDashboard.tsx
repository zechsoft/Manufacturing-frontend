import { useState } from 'react';
import { 
  Home, 
  Settings, 
  LogOut, 
  User, 
  ShoppingCart,
  Users,
  Archive,
  BarChart3,
  Package,
  Search,
  Filter
} from 'lucide-react';
import { useAuthStore } from "../../store/authStore";
import { NavLink, useNavigate } from 'react-router-dom';

const PurchaseDashboard = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for purchase dashboard
  const stats = [
    { label: 'Total Purchase Orders', value: '248', icon: ShoppingCart, color: 'blue' },
    { label: 'Active Vendors', value: '56', icon: Users, color: 'green' },
    { label: 'Pending Approvals', value: '12', icon: Archive, color: 'yellow' },
    { label: 'Total Spend (₹)', value: '₹45.2L', icon: BarChart3, color: 'purple' },
  ];

  const recentOrders = [
    { id: 'PO-2024-001', vendor: 'ABC Suppliers', amount: '₹1,25,000', status: 'Pending', date: '2024-12-10' },
    { id: 'PO-2024-002', vendor: 'XYZ Materials', amount: '₹85,000', status: 'Approved', date: '2024-12-09' },
    { id: 'PO-2024-003', vendor: 'Steel Corp', amount: '₹2,15,000', status: 'Processing', date: '2024-12-08' },
    { id: 'PO-2024-004', vendor: 'Metal Works', amount: '₹95,500', status: 'Delivered', date: '2024-12-07' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Company Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-5">
        <div className="text-9xl font-bold text-gray-400 transform rotate-[-45deg]">
          COMPANY LOGO
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0 z-10">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">ManuFacture</h1>
          <p className="text-gray-400 text-sm">Purchase Portal</p>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-semibold">
                {user?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400 uppercase">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          <NavLink 
            to="/purchase" 
            end
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/purchase/orders" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <ShoppingCart className="w-5 h-5 mr-3" />
            Purchase Orders
          </NavLink>
          <NavLink 
            to="/purchase/vendors" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Users className="w-5 h-5 mr-3" />
            Vendors
          </NavLink>
          <NavLink 
            to="/purchase/inventory" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Archive className="w-5 h-5 mr-3" />
            Inventory
          </NavLink>
          <NavLink 
            to="/purchase/analytics" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Analytics
          </NavLink>
          <NavLink 
            to="/products" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Package className="w-5 h-5 mr-3" />
            Products
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <User className="w-5 h-5 mr-3" />
            Profile
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </NavLink>
          <button 
            onClick={handleLogout}
            className="flex items-center p-4 hover:bg-gray-700 w-full text-left"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6 relative z-5">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Dashboard</h1>
          <p className="text-gray-600">Manage purchasing operations and vendor relationships</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products, vendors, or PO numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorMap: Record<string, string> = {
              blue: 'bg-blue-50 border-blue-200 text-blue-600',
              green: 'bg-green-50 border-green-200 text-green-600',
              yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
              purple: 'bg-purple-50 border-purple-200 text-purple-600',
            };

            return (
              <div
                key={index}
                className={`${colorMap[stat.color]} border rounded-lg p-6 shadow-sm hover:shadow-md transition-all`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-8 h-8" />
                  <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                </div>
                <h3 className="text-sm font-medium text-gray-700">{stat.label}</h3>
              </div>
            );
          })}
        </div>

        {/* Recent Purchase Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Purchase Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.vendor}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{order.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashboard;