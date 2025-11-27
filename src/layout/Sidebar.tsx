import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
//import CustomerModel from '../pages/CustomerModel'
import type { User } from '../types/User';
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeItem: string;
  user:User;
  onLogout: () => void;
  onItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, activeItem, onItemClick }) => {
  const { user, logout } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'orders'   , label: 'Orders'   , icon: Receipt} // 👈 Added customer item
  
  ];

  const handleLogout = () => {
    logout();
  };

  const handleNavigation = (itemId: string) => {
    onItemClick(itemId);
    if (itemId === 'customers') {
      navigate('/admin/customers');  // Use the new admin route
    } else {
      navigate(`/admin/${itemId}`);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
        text-white z-50 transition-all duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
        w-72
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className={`flex items-center space-x-3 ${isCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="lg:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AdminPanel
                </h1>
              </div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className={`p-6 border-b border-slate-700 ${isCollapsed ? 'lg:px-3' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'lg:justify-center' : 'space-x-3'}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="lg:block">
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`
                    w-full flex items-center p-3 rounded-xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 scale-105'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105'
                    }
                    ${isCollapsed ? 'lg:justify-center lg:px-0' : 'space-x-3'}
                  `}
                >
                  <Icon className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
                  {!isCollapsed && (
                    <span className="font-medium lg:block">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className={`p-4 border-t border-slate-700 ${isCollapsed ? 'lg:px-3' : ''}`}>
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center p-3 rounded-xl text-slate-300 
              hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 hover:scale-105
              ${isCollapsed ? 'lg:justify-center lg:px-0' : 'space-x-3'}
            `}
          >
            <LogOut className={`${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} flex-shrink-0`} />
            {!isCollapsed && (
              <span className="font-medium lg:block">Logout</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-slate-900 text-white p-3 rounded-xl shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;