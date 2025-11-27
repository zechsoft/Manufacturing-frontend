import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/authStore';
import PlanningPage from "./PlanningPage"; 

import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  LogOut, 
  Search, 
  Filter,
  Building2,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  X,
  Save,
  AlertCircle,
  BarChart3,
} from 'lucide-react';

// Types
interface Company {
  _id: string;
  companyName: string;
  phone: string;
  email: string;
  address: string;
  partNumbers: PartNumber[];
  GST: string;
  PAN: string;
  TAN: string;
  commercialEmail: string;
  creditTerms: string;
  creditDays: number;
  customerId: string;
}

interface PartNumber {
  _id: string;
  partNumber: string;
}

interface Material {
  srNo: number;
  partNumber: { _id: string } | string;
  materialCode: string;
  materialDescriptionSpecification: string;
  HsnSacCode: string;
  quantity: number;
  deliverySchedule: string;
  unitPrice: number;
  freight: number;
  gst: number;
  isDelivered?: boolean;
  _id?: string;
}

interface PO {
  _id: string;
  poNumber: string;
  company: {
    _id: string;
    address?: string;
    companyName?: string;
  };
  poOrderNumber: string;
  poOrderDate: string;
  purchaseOrg: string;
  termsOfDelivery: string;
  paymentTerms: string;
  deliveryAddress: string;
  placeOfSupply: string;
  materials: Material[];
  netAmount: number;
  freightCharges: number;
  taxes: number;
  totalValue: number;
  isOpen: boolean;
  isCancelled: boolean;
  documents: any[];
}

interface POFormData {
  poNumber: string;
  company: string;
  poOrderNumber: string;
  poOrderDate: string;
  purchaseOrg: string;
  termsOfDelivery: string;
  paymentTerms: string;
  deliveryAddress: string;
  placeOfSupply: string;
  materials: Material[];
}

const PlanningDashboard: React.FC = () => {
  // State Management
  const [currentPage, setCurrentPage] = useState('purchase-orders');
  const [pos, setPOs] = useState<PO[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuthStore();
  const [formData, setFormData] = useState<POFormData>({
    poNumber: '',
    company: '',
    poOrderNumber: '',
    poOrderDate: '',
    purchaseOrg: '',
    termsOfDelivery: 'EXW-Factory',
    paymentTerms: '15 days credit from GRN date',
    deliveryAddress: '',
    placeOfSupply: '',
    materials: []
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  // API Helper Function
  const apiCall = async (url: string, options: RequestInit = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Fetch Companies
  const fetchCompanies = async () => {
    try {
      const response = await apiCall('/customers/');
      if (response.success && response.data) {
        setCompanies(response.data);
      }
    } catch (error) {
      setError('Failed to fetch companies');
      console.error('Error fetching companies:', error);
    }
  };

  // Fetch POs
  const fetchPOs = async () => {
    try {
      const data = await apiCall('/planning/po');
      if (Array.isArray(data)) {
        // Enrich PO data with company names
        const enrichedPOs = data.map(po => {
          const company = companies.find(c => c._id === po.company._id);
          return {
            ...po,
            company: {
              ...po.company,
              companyName: company?.companyName || 'Unknown Company'
            }
          };
        });
        setPOs(enrichedPOs);
      }
    } catch (error) {
      setError('Failed to fetch purchase orders');
      console.error('Error fetching POs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCompanies();
    };
    loadData();
  }, []);

  // Fetch POs after companies are loaded
  useEffect(() => {
    if (companies.length > 0) {
      fetchPOs();
    }
  }, [companies]);

  // Event Handlers
  const handleCreatePO = () => {
    setModalType('create');
    setFormData({
      poNumber: '',
      company: '',
      poOrderNumber: '',
      poOrderDate: '',
      purchaseOrg: '',
      termsOfDelivery: 'EXW-Factory',
      paymentTerms: '15 days credit from GRN date',
      deliveryAddress: '',
      placeOfSupply: '',
      materials: []
    });
    setShowModal(true);
  };

  const handleViewPO = (po: PO) => {
    setSelectedPO(po);
    setModalType('view');
    setShowModal(true);
  };

  const handleEditPO = (po: PO) => {
    setSelectedPO(po);
    setModalType('edit');
    setFormData({
      poNumber: po.poNumber,
      company: po.company._id,
      poOrderNumber: po.poOrderNumber,
      poOrderDate: new Date(po.poOrderDate).toISOString().split('T')[0],
      purchaseOrg: po.purchaseOrg,
      termsOfDelivery: po.termsOfDelivery,
      paymentTerms: po.paymentTerms,
      deliveryAddress: po.deliveryAddress,
      placeOfSupply: po.placeOfSupply,
      materials: po.materials.map(m => ({
        ...m,
        partNumber: typeof m.partNumber === 'object' ? m.partNumber._id : m.partNumber,
        deliverySchedule: new Date(m.deliverySchedule).toISOString().split('T')[0]
      }))
    });
    setShowModal(true);
  };

  const handleDeletePO = async (poId: string) => {
    if (window.confirm('Are you sure you want to delete this PO?')) {
      try {
        await apiCall(`/planning/po/${poId}`, { method: 'DELETE' });
        setPOs(pos.filter(po => po._id !== poId));
        setError(null);
      } catch (error) {
        setError('Failed to delete purchase order');
        console.error('Error deleting PO:', error);
      }
    }
  };

  const handleSubmitPO = async () => {
    if (formData.materials.length === 0) {
      setError('Please add at least one material');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      if (modalType === 'create') {
        await apiCall('/planning/po/', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else if (modalType === 'edit' && selectedPO) {
        await apiCall(`/planning/po/${selectedPO._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      await fetchPOs(); // Refresh the list
    } catch (error) {
      setError('Failed to save purchase order');
      console.error('Error saving PO:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();


  const addMaterial = () => {
    setFormData({
      ...formData,
      materials: [
        ...formData.materials,
        {
          srNo: (formData.materials.length + 1) * 10,
          partNumber: '',
          materialCode: '',
          materialDescriptionSpecification: '',
          HsnSacCode: '',
          quantity: 0,
          deliverySchedule: '',
          unitPrice: 0,
          freight: 0,
          gst: 18
        }
      ]
    });
  };

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index)
    });
  };

  const updateMaterial = (index: number, field: keyof Material, value: any) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setFormData({ ...formData, materials: updatedMaterials });
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    setError(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Optional: Redirect to login page or reload the application
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Logout failed. Please try again.');
    }
  };

  const filteredPOs = pos.filter(po =>
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    po.poOrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedCompany = () => companies.find(c => c._id === formData.company);
  const getAvailablePartNumbers = () => getSelectedCompany()?.partNumbers || [];

  // Error Component
  const ErrorAlert = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5" />
        <span>{message}</span>
      </div>
      <button onClick={onClose} className="text-red-500 hover:text-red-700">
        <X className="h-4 w-4" />
      </button>
    </div>
  );

  // Render different pages based on currentPage
  const renderPageContent = () => {
    switch (currentPage) {
      case 'suppliers':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Suppliers Management</h2>
              <p className="text-slate-600">Manage your supplier relationships and information</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">Company Name</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Customer ID</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Email</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Phone</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Credit Terms</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Part Numbers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800">{company.companyName}</td>
                        <td className="p-4 text-slate-600">{company.customerId}</td>
                        <td className="p-4 text-slate-600">{company.email}</td>
                        <td className="p-4 text-slate-600">{company.phone}</td>
                        <td className="p-4 text-slate-600">{company.creditTerms}</td>
                        <td className="p-4 text-slate-600">{company.partNumbers.length} parts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {companies.length === 0 && (
                  <div className="p-12 text-center">
                    <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No suppliers found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'planning-page':
        return <PlanningPage />;

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Analytics Dashboard</h2>
              <p className="text-slate-600">View insights and metrics for your purchase orders</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Total PO Value</h3>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-blue-600">₹{pos.reduce((sum, po) => sum + po.totalValue, 0).toLocaleString()}</p>
                <p className="text-slate-500 text-sm mt-2">Across {pos.length} purchase orders</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Average PO Value</h3>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-green-600">
                  ₹{pos.length > 0 ? Math.round(pos.reduce((sum, po) => sum + po.totalValue, 0) / pos.length).toLocaleString() : 0}
                </p>
                <p className="text-slate-500 text-sm mt-2">Per purchase order</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Active Suppliers</h3>
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-purple-600">{companies.length}</p>
                <p className="text-slate-500 text-sm mt-2">Total registered suppliers</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">PO Status Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Active POs</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-green-200 rounded-full h-3 w-20"></div>
                    <span className="text-slate-800 font-medium">{pos.filter(po => po.isOpen).length}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Closed POs</span>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-200 rounded-full h-3 w-12"></div>
                    <span className="text-slate-800 font-medium">{pos.filter(po => !po.isOpen).length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Purchase Order Management</h2>
              <p className="text-slate-600">Manage and track your purchase orders efficiently</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total POs</p>
                    <p className="text-2xl font-bold text-slate-800">{pos.length}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Active POs</p>
                    <p className="text-2xl font-bold text-slate-800">{pos.filter(po => po.isOpen).length}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Total Value</p>
                    <p className="text-2xl font-bold text-slate-800">₹{pos.reduce((sum, po) => sum + po.totalValue, 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm">Suppliers</p>
                    <p className="text-2xl font-bold text-slate-800">{companies.length}</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-purple-600" />
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
                      placeholder="Search purchase orders..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                  <button
                    onClick={handleCreatePO}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create PO</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PO Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-slate-700">PO Number</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Company</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Order Date</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Total Value</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                      <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPOs.map((po) => (
                      <tr key={po._id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-4 font-medium text-slate-800">{po.poNumber}</td>
                        <td className="p-4 text-slate-600">{po.company.companyName || 'Unknown Company'}</td>
                        <td className="p-4 text-slate-600">{new Date(po.poOrderDate).toLocaleDateString()}</td>
                        <td className="p-4 text-slate-600">₹{po.totalValue.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            po.isOpen ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {po.isOpen ? 'Active' : 'Closed'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewPO(po)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View PO"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEditPO(po)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                              title="Edit PO"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePO(po._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete PO"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredPOs.length === 0 && (
                  <div className="p-12 text-center">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No purchase orders found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-slate-800 to-slate-900 text-white shadow-2xl z-40 transition-all duration-300`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Package className="h-6 w-6" />
            </div>
            {!sidebarCollapsed && <h1 className="text-xl font-bold">Planning Hub</h1>}
          </div>
          
          <nav className="space-y-2">
            <button
              onClick={() => handleNavigation('purchase-orders')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'purchase-orders' 
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5" />
                {!sidebarCollapsed && <span className="font-medium">Purchase Orders</span>}
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('suppliers')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'suppliers' 
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5" />
                {!sidebarCollapsed && <span>Suppliers</span>}
              </div>
            </button>
            
            <button
              onClick={() => handleNavigation('analytics')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'analytics' 
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500' 
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5" />
                {!sidebarCollapsed && <span>Analytics</span>}
              </div>
            </button>

            <button
              onClick={() => handleNavigation('planning-page')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'planning-page'
                  ? 'bg-blue-600/20 text-blue-300 border-l-4 border-blue-500'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5" />
                {!sidebarCollapsed && <span>Planning</span>}
              </div>
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
          <button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <LogOut className="h-5 w-5" />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarCollapsed ? 'ml-16' : 'ml-64'} p-8 transition-all duration-300`}>
        {/* Error Display */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Page Content */}
        {renderPageContent()}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {modalType === 'create' ? 'Create Purchase Order' : 
                   modalType === 'edit' ? 'Edit Purchase Order' : 'View Purchase Order'}
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
              {modalType === 'view' && selectedPO ? (
                // View Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">PO Number</label>
                      <p className="text-slate-900 font-medium">{selectedPO.poNumber}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                      <p className="text-slate-900">{selectedPO.company.companyName || 'Unknown Company'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Order Date</label>
                      <p className="text-slate-900">{new Date(selectedPO.poOrderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Total Value</label>
                      <p className="text-slate-900 font-medium">₹{selectedPO.totalValue.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Org</label>
                      <p className="text-slate-900">{selectedPO.purchaseOrg}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Terms of Delivery</label>
                      <p className="text-slate-900">{selectedPO.termsOfDelivery}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
                      <p className="text-slate-900">{selectedPO.deliveryAddress}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Materials</label>
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Sr No</th>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Material Code</th>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Description</th>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Quantity</th>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Unit Price</th>
                            <th className="text-left p-3 text-sm font-medium text-slate-700">GST %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPO.materials.map((material, index) => (
                            <tr key={index} className="border-t border-slate-100">
                              <td className="p-3 text-sm">{material.srNo}</td>
                              <td className="p-3 text-sm">{material.materialCode}</td>
                              <td className="p-3 text-sm">{material.materialDescriptionSpecification}</td>
                              <td className="p-3 text-sm">{material.quantity}</td>
                              <td className="p-3 text-sm">₹{material.unitPrice}</td>
                              <td className="p-3 text-sm">{material.gst}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                // Create/Edit Mode
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        PO Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.poNumber}
                        onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      >
                        <option value="">Select Company</option>
                        {companies.map(company => (
                          <option key={company._id} value={company._id}>
                            {company.companyName}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        PO Order Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.poOrderNumber}
                        onChange={(e) => setFormData({ ...formData, poOrderNumber: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Order Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.poOrderDate}
                        onChange={(e) => setFormData({ ...formData, poOrderDate: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Org</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.purchaseOrg}
                        onChange={(e) => setFormData({ ...formData, purchaseOrg: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Terms of Delivery</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.termsOfDelivery}
                        onChange={(e) => setFormData({ ...formData, termsOfDelivery: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Payment Terms</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.paymentTerms}
                        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Delivery Address</label>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Place of Supply</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.placeOfSupply}
                        onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  {/* Materials Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-slate-700">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addMaterial}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Material</span>
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.materials.map((material, index) => (
                        <div key={index} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="font-medium text-slate-800">Material {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeMaterial(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Part Number <span className="text-red-500">*</span>
                              </label>
                              <select
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={typeof material.partNumber === 'object' ? material.partNumber._id : material.partNumber}
                                onChange={(e) => updateMaterial(index, 'partNumber', e.target.value)}
                                required
                              >
                                <option value="">Select Part Number</option>
                                {getAvailablePartNumbers().map(part => (
                                  <option key={part._id} value={part._id}>
                                    {part.partNumber}
                                  </option>
                                ))}
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Material Code</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.materialCode}
                                onChange={(e) => updateMaterial(index, 'materialCode', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">HSN/SAC Code</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.HsnSacCode}
                                onChange={(e) => updateMaterial(index, 'HsnSacCode', e.target.value)}
                              />
                            </div>
                            
                            <div className="md:col-span-2 lg:col-span-3">
                              <label className="block text-sm font-medium text-slate-700 mb-1">Material Description</label>
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.materialDescriptionSpecification}
                                onChange={(e) => updateMaterial(index, 'materialDescriptionSpecification', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Quantity <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.quantity}
                                onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value) || 0)}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Unit Price <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.unitPrice}
                                onChange={(e) => updateMaterial(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                Delivery Schedule <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.deliverySchedule}
                                onChange={(e) => updateMaterial(index, 'deliverySchedule', e.target.value)}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Freight (%)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.freight}
                                onChange={(e) => updateMaterial(index, 'freight', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">GST (%)</label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={material.gst}
                                onChange={(e) => updateMaterial(index, 'gst', parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {formData.materials.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          <Package className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                          <p>No materials added yet. Click "Add Material" to get started.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
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
                  onClick={handleSubmitPO}
                  disabled={submitting || formData.materials.length === 0}
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
                      <span>{modalType === 'create' ? 'Create PO' : 'Update PO'}</span>
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

export default PlanningDashboard;