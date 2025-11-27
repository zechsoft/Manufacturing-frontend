import React, { useState } from 'react';
import { X, Calendar, FileText, Loader2, Save, AlertCircle } from 'lucide-react';
import type { Customer, OrderPart, Order } from '../../types/orders';
import { useCustomers, useParts, api } from '../../hooks/ordersapi';
import CustomerSelect from './CustomerSelect';
import PartSelect from './PartSelect';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedParts, setSelectedParts] = useState<OrderPart[]>([]);
  const [formData, setFormData] = useState({
    po_number: '',
    ordered_date: new Date().toISOString().split('T')[0],
    delivery_date: '',
    planning_date: '',
    production_date: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // FIX: Ensure customers is always an array of customers, not the whole API response
  const { customers: rawCustomers, loading: customersLoading, error: customersError } = useCustomers();
  const customers = Array.isArray(rawCustomers) ? rawCustomers : (typeof rawCustomers === 'object' && rawCustomers !== null && 'data' in rawCustomers ? (rawCustomers as { data: Customer[] }).data : []);

  const { parts, loading: partsLoading, error: partsError } = useParts(selectedCustomer?._id || null);

  const handleCustomerChange = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    setSelectedParts([]); // Clear selected parts when customer changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomer) {
      setError('Please select a customer');
      return;
    }
    
    if (selectedParts.length === 0) {
      setError('Please select at least one part');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const orderData: Order = {
        ...formData,
        customer_id: selectedCustomer._id,
        parts: selectedParts,
        status: 'pending'
      };

      // Remove order_number if it exists - let backend generate it
      const { order_number, ...orderDataWithoutOrderNumber } = orderData;

      await api.orders.create(orderDataWithoutOrderNumber);
      
      // Reset form
      setFormData({
        po_number: '',
        ordered_date: new Date().toISOString().split('T')[0],
        delivery_date: '',
        planning_date: '',
        production_date: ''
      });
      setSelectedCustomer(null);
      setSelectedParts([]);
      
      onOrderCreated();
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      
      // If it's a duplicate key error, we can suggest retrying
      if (errorMessage.includes('Order number conflict')) {
        // Add a small delay and suggest retry
        setTimeout(() => {
          setError(errorMessage + ' You can try submitting again.');
        }, 100);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!selectedCustomer || selectedParts.length === 0) return;
    
    try {
      setLoading(true);
      setError(null);

      const orderData: Order = {
        ...formData,
        customer_id: selectedCustomer._id,
        parts: selectedParts,
        status: 'pending'
      };

      const { order_number, ...orderDataWithoutOrderNumber } = orderData;
      await api.orders.create(orderDataWithoutOrderNumber);
      
      setFormData({
        po_number: '',
        ordered_date: new Date().toISOString().split('T')[0],
        delivery_date: '',
        planning_date: '',
        production_date: ''
      });
      setSelectedCustomer(null);
      setSelectedParts([]);
      
      onOrderCreated();
      onClose();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create order';
      setError(errorMessage);
      
      if (errorMessage.includes('Order number conflict')) {
        setError(errorMessage + ' Please contact support if this continues.');
      }
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedCustomer && selectedParts.length > 0 && formData.po_number.trim() !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <CustomerSelect
              customers={customers}
              selectedCustomer={selectedCustomer}
              onCustomerChange={handleCustomerChange}
              loading={customersLoading}
              error={customersError}
            />
          </div>

          {/* Parts Selection */}
          <div className="bg-gray-50 rounded-lg p-4">
            <PartSelect
              parts={parts}
              selectedParts={selectedParts}
              onPartsChange={setSelectedParts}
              loading={partsLoading}
              error={partsError}
              disabled={!selectedCustomer}
            />
          </div>

          {/* Order Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Order Details</h3>
            
            {/* PO Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Order Number *
              </label>
              <input
                type="text"
                value={formData.po_number}
                onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                placeholder="Enter PO number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Ordered Date *
                </label>
                <input
                  type="date"
                  value={formData.ordered_date}
                  onChange={(e) => setFormData({ ...formData, ordered_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={formData.delivery_date}
                  onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })}
                  min={formData.ordered_date}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Planning Date *
                </label>
                <input
                  type="date"
                  value={formData.planning_date}
                  onChange={(e) => setFormData({ ...formData, planning_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Production Date *
                </label>
                <input
                  type="date"
                  value={formData.production_date}
                  onChange={(e) => setFormData({ ...formData, production_date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Error Creating Order</h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
                {error.includes('Order number conflict') && (
                  <button
                    type="button"
                    onClick={handleRetry}
                    disabled={loading}
                    className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors disabled:opacity-50"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          {selectedCustomer && selectedParts.length > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Order Summary</h4>
              <div className="text-sm text-blue-700">
                <p><strong>Customer:</strong> {selectedCustomer.companyName}</p>
                <p><strong>Parts:</strong> {selectedParts.length} selected</p>
                <p><strong>Total Quantity:</strong> {selectedParts.reduce((sum, part) => sum + part.quantity, 0)}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;