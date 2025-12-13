import { useState } from 'react';
import { 
  Home, 
  Settings, 
  LogOut, 
  User, 
  Package,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from "../../store/authStore";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NpdDashboard = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isPartsOpen, setIsPartsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* Company Watermark - More Visible */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 opacity-10">
        <div className="text-[12rem] font-bold text-gray-500 transform rotate-[-45deg] select-none">
          COMPANY
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0 z-10">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">ManuFacture</h1>
          <p className="text-gray-400 text-sm">NPD Portal</p>
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
            to="/npd" 
            end
            className={({isActive}) => 
              `flex items-center p-4 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
            }
          >
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>

          {/* Parts Management with Submenu */}
          <div>
            <button
              onClick={() => setIsPartsOpen(!isPartsOpen)}
              className="flex items-center justify-between w-full p-4 hover:bg-gray-700"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 mr-3" />
                Parts Management
              </div>
              {isPartsOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {isPartsOpen && (
              <div className="bg-gray-900">
                <NavLink 
                  to="/npd/master" 
                  className={({isActive}) => 
                    `flex items-center pl-12 pr-4 py-3 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                  }
                >
                  Master
                </NavLink>
                <NavLink 
                  to="/npd/planning" 
                  className={({isActive}) => 
                    `flex items-center pl-12 pr-4 py-3 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                  }
                >
                  Planning
                </NavLink>
                <NavLink 
                  to="/npd/bill-of-material" 
                  className={({isActive}) => 
                    `flex items-center pl-12 pr-4 py-3 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                  }
                >
                  Bill of Material
                </NavLink>
                <NavLink 
                  to="/npd/process" 
                  className={({isActive}) => 
                    `flex items-center pl-12 pr-4 py-3 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                  }
                >
                  Process
                </NavLink>
                <NavLink 
                  to="/npd/item-process" 
                  className={({isActive}) => 
                    `flex items-center pl-12 pr-4 py-3 text-sm ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`
                  }
                >
                  Item Process
                </NavLink>
              </div>
            )}
          </div>

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
      <div className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen overflow-auto relative z-5">
        <Outlet />
      </div>
    </div>
  );
};

export default NpdDashboard;