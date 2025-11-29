import { useState, useMemo } from 'react';
import { Plus, Users, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { CustomerCard } from '../components/Admin/CustomerCard';
import { CustomerForm } from '../components/Admin/CustomerForm';
import { SearchFilter } from '../components/Admin/SearchFilter';
import { ConfirmDialog } from '../components/Admin/ConfirmDialog';
import { Toast } from '../components/Admin/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCustomers } from '../hooks/usecustomers';
import type { Customer } from '../store/types/customer';

function App() {
  const {
    customers,
    loading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer
  } = useCustomers();

  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [creditTermFilter, setCreditTermFilter] = useState('All');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = 
        customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = creditTermFilter === 'All' || customer.creditTerms === creditTermFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [customers, searchTerm, creditTermFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setDeletingCustomer(customer);
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingCustomer) {
      const result = await updateCustomer(editingCustomer._id, formData);
      if (result.success) {
        showToast('Customer updated successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to update customer', 'error');
      }
      return result;
    } else {
      const result = await addCustomer(formData);
      if (result.success) {
        showToast('Customer added successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to add customer', 'error');
      }
      return result;
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingCustomer) {
      const result = await deleteCustomer(deletingCustomer._id);
      if (result.success) {
        showToast('Customer deleted successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to delete customer', 'error');
      }
      setDeletingCustomer(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-sm text-gray-600">Manage your customer database</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                {error ? (
                  <WifiOff className="w-4 h-4 text-red-500 mr-1" />
                ) : (
                  <Wifi className="w-4 h-4 text-green-500 mr-1" />
                )}
                <span>{error ? 'Offline' : 'Connected'}</span>
              </div>
              
              <button
                onClick={handleAddCustomer}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Customer
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-3" />
            <div>
              <p className="font-medium">Connection Error</p>
              <p className="text-sm">Unable to connect to the backend server on port 5000. Please ensure the server is running.</p>
            </div>
          </div>
        )}

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          creditTermFilter={creditTermFilter}
          onCreditTermFilterChange={setCreditTermFilter}
        />

        {loading ? (
          <div className="flex justify-center items-center py-12">
          
            <span className="ml-3 text-gray-600">Loading customers...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || creditTermFilter !== 'All' ? 'No customers found' : 'No customers yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || creditTermFilter !== 'All' 
                ? 'Try adjusting your search criteria or filters'
                : 'Get started by adding your first customer'
              }
            </p>
            {!searchTerm && creditTermFilter === 'All' && (
              <button
                onClick={handleAddCustomer}
                className="flex items-center mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add First Customer
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredCustomers.length} of {customers.length} customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer._id}
                  customer={customer}
                  onEdit={handleEditCustomer}
                  onDelete={handleDeleteCustomer}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Customer Form Modal */}
      {showForm && (
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          title={editingCustomer ? 'Edit Customer' : 'Add New Customer'}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete "${deletingCustomer?.companyName}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingCustomer(null)}
        confirmText="Delete"
        type="danger"
      />

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
