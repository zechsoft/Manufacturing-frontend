import { useState } from 'react';
import { 
  Home, 
  Settings, 
  LogOut, 
  User, 
  Store,
  ClipboardList,
  BarChart3,
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useAuthStore } from "../../store/authStore";
import { NavLink, useNavigate } from 'react-router-dom';

const StoresDashboard = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for stores dashboard
  const stats = [
    { label: 'Total Items', value: '1,245', icon: Package, color: 'blue' },
    { label: 'Items In Stock', value: '892', icon: TrendingUp, color: 'green' },
    { label: 'Low Stock Items', value: '23', icon: AlertTriangle, color: 'yellow' },
    { label: 'Out of Stock', value: '8', icon: TrendingDown, color: 'red' },
  ];

  const recentTransactions = [
    { id: 'TXN-2024-001', type: 'Stock In', item: 'Steel Rods (MS)', quantity: '500 pcs', date: '2024-12-10', status: 'Completed' },
    { id: 'TXN-2024-002', type: 'Stock Out', item: 'Aluminum Sheets', quantity: '250 pcs', date: '2024-12-09', status: 'Completed' },
    { id: 'TXN-2024-003', type: 'Stock In', item: 'Copper Wire', quantity: '1000 m', date: '2024-12-08', status: 'Processing' },
    { id: 'TXN-2024-004', type: 'Stock Out', item: 'Brass Fittings', quantity: '150 pcs', date: '2024-12-07', status: 'Completed' },
  ];

  const lowStockItems = [
    { name: 'Steel Bolts M12', current: 45, minimum: 100, unit: 'pcs' },
    { name: 'Aluminum Plates', current: 12, minimum: 50, unit: 'pcs' },
    { name: 'Copper Tubing', current: 85, minimum: 200, unit: 'm' },
    { name: 'Brass Nuts M10', current: 120, minimum: 500, unit: 'pcs' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'Stock In' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
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
          <p className="text-gray-400 text-sm">Stores Portal</p>
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
            to="/stores" 
            end
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink 
            to="/stores/inventory" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Store className="w-5 h-5 mr-3" />
            Inventory
          </NavLink>
          <NavLink 
            to="/stores/stock-in" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <TrendingUp className="w-5 h-5 mr-3" />
            Stock In
          </NavLink>
          <NavLink 
            to="/stores/stock-out" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <TrendingDown className="w-5 h-5 mr-3" />
            Stock Out
          </NavLink>
          <NavLink 
            to="/stores/reports" 
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Reports
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Stores Dashboard</h1>
          <p className="text-gray-600">Manage inventory and warehouse operations</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items, SKU, or transaction numbers..."
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
              red: 'bg-red-50 border-red-200 text-red-600',
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      TXN ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{txn.id}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(txn.type)}`}>
                          {txn.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{txn.item}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{txn.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Low Stock Alert</h2>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                      Low Stock
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current: <strong>{item.current} {item.unit}</strong></span>
                    <span className="text-gray-600">Min: <strong>{item.minimum} {item.unit}</strong></span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${(item.current / item.minimum) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoresDashboard;