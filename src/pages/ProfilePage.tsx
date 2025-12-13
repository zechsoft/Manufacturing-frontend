import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Briefcase,
  ArrowLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const API_URL = "/api"; // Use proxy for all environments

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    companyName: '',
    department: '',
    location: '',
    bio: '',
    joinedDate: '',
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/users/profile`, {
          method: 'GET',
          credentials: 'include', // Important: This sends cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          setProfileData({
            name: data.user.name || '',
            email: data.user.email || '',
            phone: data.user.phone || '+91 9876543210',
            role: data.user.role || '',
            companyName: data.user.companyName || '',
            department: data.user.department || 'Manufacturing',
            location: data.user.location || 'Madurai, Tamil Nadu',
            bio: data.user.bio || 'Experienced manufacturing professional with a passion for quality and efficiency.',
            joinedDate: data.user.joinedDate || new Date().toISOString(),
          });
        } else {
          setError(data.message || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      setError('');
      const response = await fetch(`${API_URL}/users/profile`, {
        method: 'PUT',
        credentials: 'include', // Important: This sends cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          companyName: profileData.companyName,
          department: profileData.department,
          location: profileData.location,
          bio: profileData.bio,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
        alert('Failed to update profile: ' + data.message);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to update profile. Please try again.');
      alert('Failed to update profile: ' + error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  const getRoleBadge = (role: string) => {
    const roleConfig: Record<string, { color: string; label: string }> = {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Administrator' },
      engineer: { color: 'bg-blue-100 text-blue-800', label: 'Engineer' },
      planning: { color: 'bg-green-100 text-green-800', label: 'Planning Manager' },
      production: { color: 'bg-orange-100 text-orange-800', label: 'Production Manager' },
      quality: { color: 'bg-pink-100 text-pink-800', label: 'Quality Engineer' },
      material: { color: 'bg-yellow-100 text-yellow-800', label: 'Material Manager' },
      user: { color: 'bg-gray-100 text-gray-800', label: 'User' },
    };
    return roleConfig[role] || roleConfig.user;
  };

  const roleBadge = getRoleBadge(profileData.role);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h2>
        <p className="text-slate-600">Manage your personal information and preferences</p>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <Save className="h-5 w-5" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <X className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-1">{profileData.name}</h3>
              <p className="text-slate-600 mb-3">{profileData.email}</p>
              
              <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${roleBadge.color} mb-4`}>
                {roleBadge.label}
              </span>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center space-x-2 text-slate-600 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Joined {new Date(profileData.joinedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{profileData.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Mail className="h-5 w-5 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800 truncate">{profileData.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Phone className="h-5 w-5 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm font-medium text-slate-800">{profileData.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Building2 className="h-5 w-5 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm font-medium text-slate-800 truncate">{profileData.companyName}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-slate-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Department</p>
                  <p className="text-sm font-medium text-slate-800">{profileData.department}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Profile Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="font-semibold text-slate-800 mb-4">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-900 py-2">{profileData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-slate-900 py-2">{profileData.email}</p>
                    <p className="text-xs text-slate-500">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-900 py-2">{profileData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-900 py-2">{profileData.location}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Company Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-900 py-2">{profileData.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Department
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      />
                    ) : (
                      <p className="text-slate-900 py-2">{profileData.department}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Role
                    </label>
                    <div className="flex items-center space-x-3 py-2">
                      <Shield className="h-5 w-5 text-slate-600" />
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleBadge.color}`}>
                        {roleBadge.label}
                      </span>
                      <span className="text-xs text-slate-500">(Cannot be changed)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="pt-6 border-t border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-4">About</h4>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  ) : (
                    <p className="text-slate-900 py-2">{profileData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Orders Managed</p>
                  <p className="text-2xl font-bold text-slate-800">42</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Active Projects</p>
                  <p className="text-2xl font-bold text-slate-800">8</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm">Completion Rate</p>
                  <p className="text-2xl font-bold text-slate-800">95%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;