import React from 'react';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  Users,
  ClipboardList,
  Factory,
  CheckCircle,
  Archive,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Calendar,
  TrendingUp,
  BarChart3,
  User as UserIcon,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { User } from '../store/types/User';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onToggle, 
  activeItem, 
  onItemClick,
  user,
  onLogout 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (activeItem) {
      return activeItem === path;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string, itemName: string) => {
    navigate(path);
    if (onItemClick) {
      onItemClick(itemName);
    }
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/', itemName: 'dashboard' },
    ];

    const roleBasedItems: Record<User['role'], typeof commonItems> = {
      admin: [
        ...commonItems,
        { icon: Users, label: 'Users', path: '/admin/users', itemName: 'users' },
        { icon: Users, label: 'Customers', path: '/admin/customers', itemName: 'customers' },
        { icon: FileText, label: 'Orders', path: '/admin/orders', itemName: 'orders' },
        // { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        // { icon: ClipboardList, label: 'Planning', path: '/planning', itemName: 'planning' },
        // { icon: Factory, label: 'Production', path: '/production', itemName: 'production' },
        // { icon: CheckCircle, label: 'Quality', path: '/quality', itemName: 'quality' },
        // { icon: Archive, label: 'Material', path: '/material', itemName: 'material' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      engineer: [
        ...commonItems,
        { icon: FileText, label: 'Documents', path: '/engineer/documents', itemName: 'documents' },
        { icon: Package, label: 'Parts', path: '/engineer/parts', itemName: 'parts' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      planning: [
        ...commonItems,
        { icon: ClipboardList, label: 'Purchase Orders', path: '/planning', itemName: 'planning' },
        { icon: Users, label: 'Suppliers', path: '/planning/suppliers', itemName: 'suppliers' },
        { icon: BarChart3, label: 'Analytics', path: '/planning/analytics', itemName: 'analytics' },
        { icon: FileText, label: 'Planning', path: '/planning/new-plan', itemName: 'new-plan' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      production: [
        ...commonItems,
        { icon: Factory, label: 'Dashboard', path: '/production', itemName: 'production' },
        { icon: ClipboardList, label: 'Orders', path: '/production/orders', itemName: 'orders' },
        { icon: Calendar, label: 'Schedule', path: '/production/schedule', itemName: 'schedule' },
        { icon: Package, label: 'Machines', path: '/production/machines', itemName: 'machines' },
        { icon: Users, label: 'Operators', path: '/production/operators', itemName: 'operators' },
        { icon: TrendingUp, label: 'Reports', path: '/production/reports', itemName: 'reports' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      quality: [
        ...commonItems,
        { icon: CheckCircle, label: 'Dashboard', path: '/quality', itemName: 'quality' },
        { icon: ClipboardList, label: 'Inspections', path: '/quality/inspections', itemName: 'inspections' },
        { icon: FileText, label: 'QC Reports', path: '/quality/reports', itemName: 'reports' },
        { icon: Factory, label: 'Non-Compliance', path: '/quality/ncr', itemName: 'ncr' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      material: [
        ...commonItems,
        { icon: Archive, label: 'Material', path: '/material', itemName: 'material' },
        { icon: ShoppingCart, label: 'Inventory', path: '/inventory', itemName: 'inventory' },
        { icon: Package, label: 'Suppliers', path: '/material/suppliers', itemName: 'suppliers' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
      user: [
        ...commonItems,
        { icon: FileText, label: 'My Orders', path: '/orders', itemName: 'orders' },
        { icon: Package, label: 'Products', path: '/products', itemName: 'products' },
        { icon: UserIcon, label: 'Profile', path: '/profile', itemName: 'profile' },
        { icon: Settings, label: 'Settings', path: '/settings', itemName: 'settings' },
      ],
    };

    return roleBasedItems[user?.role || 'user'];
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-50`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-800 flex-shrink-0">
        {isOpen && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ManuFacture
          </h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <div className="p-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Scrollable with invisible scrollbar */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path, item.itemName)}
              className={`w-full flex items-center ${
                isOpen ? 'px-4' : 'justify-center px-2'
              } py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                  : 'hover:bg-gray-800'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="ml-3 text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-800 flex-shrink-0">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${
            isOpen ? 'px-4' : 'justify-center px-2'
          } py-3 rounded-lg hover:bg-red-600/20 text-red-400 hover:text-red-300 transition-all duration-200`}
          title={!isOpen ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
