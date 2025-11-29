import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Mail,
  Phone,
  Building2,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'engineer' | 'user' | 'planning' | 'production' | 'quality' | 'material';
  companyName?: string;
  customerId?: string;
  createdAt: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  companyName?: string;
  customerId?: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    companyName: '',
    customerId: '',
  });

  const API_BASE_URL = 'https://manufacturing-frontend-rose.vercel.app/api';

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-purple-100 text-purple-800' },
    { value: 'engineer', label: 'Engineer', color: 'bg-blue-100 text-blue-800' },
    { value: 'planning', label: 'Planning', color: 'bg-green-100 text-green-800' },
    { value: 'production', label: 'Production', color: 'bg-orange-100 text-orange-800' },
    { value: 'quality', label: 'Quality', color: 'bg-pink-100 text-pink-800' },
    { value: 'material', label: 'Material', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'user', label: 'User', color: 'bg-gray-100 text-gray-800' },
  ];

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Create User
  const handleCreateUser = () => {
    setModalType('create');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      companyName: '',
      customerId: '',
    });
    setShowModal(true);
  };

  // Handle Edit User
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalType('edit');
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      companyName: user.companyName || '',
      customerId: user.customerId || '',
    });
    setShowModal(true);
  };

  // Handle View User
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setModalType('view');
    setShowModal(true);
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        setError(null);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    if (modalType === 'create' && !formData.password) {
      setError('Password is required for new users');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const url = modalType === 'create' 
        ? `${API_BASE_URL}/auth/signup`
        : `${API_BASE_URL}/auth/users/${selectedUser?._id}`;

      const response = await fetch(url, {
        method: modalType === 'create' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setShowModal(false);
        await fetchUsers();
      } else {
        setError(data.message || 'Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setError('Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Get role badge
  const getRoleBadge = (role: string) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo ? roleInfo : { label: role, color: 'bg-gray-100 text-gray-800' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">User Management</h2>
        <p className="text-slate-600">Manage system users and their roles</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-slate-800">{users.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Admins</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Engineers</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => u.role === 'engineer').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Other Roles</p>
              <p className="text-2xl font-bold text-slate-800">
                {users.filter(u => !['admin', 'engineer'].includes(u.role)).length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>

            <button
              onClick={handleCreateUser}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Name</th>
                <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                <th className="text-left p-4 font-semibold text-slate-700">Role</th>
                <th className="text-left p-4 font-semibold text-slate-700">Company</th>
                <th className="text-left p-4 font-semibold text-slate-700">Joined</th>
                <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleBadge = getRoleBadge(user.role);
                return (
                  <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600">{user.companyName || '-'}</td>
                    <td className="p-4 text-slate-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View User"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {modalType === 'create' ? 'Create New User' : 
                   modalType === 'edit' ? 'Edit User' : 'View User Details'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {modalType === 'view' && selectedUser ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-800">{selectedUser.name}</h4>
                      <p className="text-slate-600">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(selectedUser.role).color}`}>
                        {getRoleBadge(selectedUser.role).label}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                      <p className="text-slate-900">{selectedUser.companyName || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Customer ID</label>
                      <p className="text-slate-900">{selectedUser.customerId || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Joined Date</label>
                      <p className="text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password {modalType === 'create' && <span className="text-red-500">*</span>}
                      {modalType === 'edit' && <span className="text-slate-500 text-xs">(Leave blank to keep current)</span>}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={modalType === 'create'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>{role.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Customer ID</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.customerId}
                      onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            {modalType !== 'view' && (
              <div className="p-6 border-t border-slate-200 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>{modalType === 'create' ? 'Create User' : 'Update User'}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
