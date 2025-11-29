import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  Save,
  Eye,
  Download,
  Upload,
  Image as ImageIcon,
  Tag,
  Layers,
  DollarSign,
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  partNumber: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  supplier?: string;
  manufacturer?: string;
  specifications?: string;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

interface ProductFormData {
  name: string;
  partNumber: string;
  description: string;
  category: string;
  price: number;
  stockQuantity: number;
  unit: string;
  supplier?: string;
  manufacturer?: string;
  specifications?: string;
  imageUrl?: string;
  status: 'active' | 'inactive' | 'discontinued';
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    partNumber: '',
    description: '',
    category: '',
    price: 0,
    stockQuantity: 0,
    unit: 'pcs',
    supplier: '',
    manufacturer: '',
    specifications: '',
    imageUrl: '',
    status: 'active',
  });

  const API_BASE_URL = 'https://manufacturing-frontend-rose.vercel.app/api';

  const categories = [
    'Raw Materials',
    'Components',
    'Finished Products',
    'Tools',
    'Consumables',
    'Packaging',
  ];

  const units = ['pcs', 'kg', 'lbs', 'meters', 'liters', 'boxes'];

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulating API call with mock data
        setTimeout(() => {
          setProducts([
            {
              _id: '1',
              name: 'Steel Sheet 1mm',
              partNumber: 'STEEL-001',
              description: 'High-quality steel sheet for manufacturing',
              category: 'Raw Materials',
              price: 150.00,
              stockQuantity: 500,
              unit: 'kg',
              supplier: 'Steel Corp',
              manufacturer: 'Steel Industries',
              specifications: '1mm thickness, Grade A',
              status: 'active',
              createdAt: '2025-01-01',
              updatedAt: '2025-01-15',
            },
            {
              _id: '2',
              name: 'Bearing Assembly',
              partNumber: 'BEAR-456',
              description: 'Precision bearing assembly',
              category: 'Components',
              price: 45.50,
              stockQuantity: 200,
              unit: 'pcs',
              supplier: 'Bearing Solutions',
              manufacturer: 'Precision Parts',
              specifications: 'Model XYZ-100',
              status: 'active',
              createdAt: '2025-01-05',
              updatedAt: '2025-01-18',
            },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle Create Product
  const handleCreateProduct = () => {
    setModalType('create');
    setFormData({
      name: '',
      partNumber: '',
      description: '',
      category: '',
      price: 0,
      stockQuantity: 0,
      unit: 'pcs',
      supplier: '',
      manufacturer: '',
      specifications: '',
      imageUrl: '',
      status: 'active',
    });
    setShowModal(true);
  };

  // Handle Edit Product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalType('edit');
    setFormData({
      name: product.name,
      partNumber: product.partNumber,
      description: product.description,
      category: product.category,
      price: product.price,
      stockQuantity: product.stockQuantity,
      unit: product.unit,
      supplier: product.supplier || '',
      manufacturer: product.manufacturer || '',
      specifications: product.specifications || '',
      imageUrl: product.imageUrl || '',
      status: product.status,
    });
    setShowModal(true);
  };

  // Handle View Product
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalType('view');
    setShowModal(true);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setProducts(products.filter(product => product._id !== productId));
      setError(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product');
    }
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.partNumber || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      setTimeout(() => {
        if (modalType === 'create') {
          const newProduct: Product = {
            _id: Date.now().toString(),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setProducts([...products, newProduct]);
        } else if (modalType === 'edit' && selectedProduct) {
          setProducts(products.map(p => 
            p._id === selectedProduct._id 
              ? { ...p, ...formData, updatedAt: new Date().toISOString() }
              : p
          ));
        }
        setShowModal(false);
        setSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product');
      setSubmitting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-yellow-100 text-yellow-800', label: 'Inactive' },
      discontinued: { color: 'bg-red-100 text-red-800', label: 'Discontinued' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stockQuantity), 0),
    lowStock: products.filter(p => p.stockQuantity < 50).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 space-y-6">
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
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Product Management</h2>
        <p className="text-slate-600">Manage your product catalog and inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Active Products</p>
              <p className="text-2xl font-bold text-slate-800">{stats.activeProducts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Layers className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Total Value</p>
              <p className="text-2xl font-bold text-slate-800">₹{stats.totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm">Low Stock</p>
              <p className="text-2xl font-bold text-slate-800">{stats.lowStock}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Tag className="h-6 w-6 text-orange-600" />
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
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>

            <button
              onClick={handleCreateProduct}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-700">Product</th>
                <th className="text-left p-4 font-semibold text-slate-700">Part Number</th>
                <th className="text-left p-4 font-semibold text-slate-700">Category</th>
                <th className="text-left p-4 font-semibold text-slate-700">Price</th>
                <th className="text-left p-4 font-semibold text-slate-700">Stock</th>
                <th className="text-left p-4 font-semibold text-slate-700">Status</th>
                <th className="text-left p-4 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const statusBadge = getStatusBadge(product.status);
                return (
                  <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                          {product.imageUrl ? (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <Package className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600">{product.partNumber}</td>
                    <td className="p-4 text-slate-600">{product.category}</td>
                    <td className="p-4 text-slate-600">₹{product.price.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`${product.stockQuantity < 50 ? 'text-red-600 font-semibold' : 'text-slate-600'}`}>
                        {product.stockQuantity} {product.unit}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View Product"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Product"
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

          {filteredProducts.length === 0 && (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">
                  {modalType === 'create' ? 'Add New Product' : 
                   modalType === 'edit' ? 'Edit Product' : 'Product Details'}
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
              {modalType === 'view' && selectedProduct ? (
                <div className="space-y-6">
                  <div className="flex items-start space-x-6">
                    <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {selectedProduct.imageUrl ? (
                        <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package className="h-16 w-16 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-2xl font-bold text-slate-800 mb-2">{selectedProduct.name}</h4>
                      <p className="text-slate-600 mb-4">{selectedProduct.description}</p>
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedProduct.status).color}`}>
                          {getStatusBadge(selectedProduct.status).label}
                        </span>
                        <span className="text-slate-500 text-sm">Part #: {selectedProduct.partNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                      <p className="text-slate-900">{selectedProduct.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                      <p className="text-slate-900 font-semibold">₹{selectedProduct.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                      <p className="text-slate-900">{selectedProduct.stockQuantity} {selectedProduct.unit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                      <p className="text-slate-900">{selectedProduct.unit}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                      <p className="text-slate-900">{selectedProduct.supplier || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                      <p className="text-slate-900">{selectedProduct.manufacturer || 'N/A'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Specifications</label>
                      <p className="text-slate-900">{selectedProduct.specifications || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
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
                        Part Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.partNumber}
                        onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Unit</label>
                      <select
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      >
                        {units.map(unit => (
                          <option key={unit} value={unit}>{unit}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Supplier</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Manufacturer</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={formData.manufacturer}
                        onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Specifications</label>
                    <textarea
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
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
                      <span>{modalType === 'create' ? 'Create Product' : 'Update Product'}</span>
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

export default ProductsPage;
