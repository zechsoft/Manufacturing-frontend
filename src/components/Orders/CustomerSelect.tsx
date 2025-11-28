import React from 'react';
import { ChevronDown, Building2, Loader2 } from 'lucide-react';
import type { Customer } from '../../store/types/orders';

interface CustomerSelectProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onCustomerChange: (customer: Customer | null) => void;
  loading?: boolean;
  error?: string | null;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({
  customers,
  selectedCustomer,
  onCustomerChange,
  loading = false,
  error = null
}) => {
  // Ensure customers is always an array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Building2 className="w-4 h-4" />
        Select Customer
      </label>
      
      <div className="relative">
        <select
          value={selectedCustomer?._id || ''}
          onChange={(e) => {
            const customer = safeCustomers.find(c => c._id === e.target.value);
            onCustomerChange(customer || null);
          }}
          disabled={loading}
          className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">
            {loading ? 'Loading customers...' : 'Choose a customer'}
          </option>
          {safeCustomers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.companyName} ({customer.customerId})
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
          {error}
        </p>
      )}

      {selectedCustomer && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-medium text-gray-600">Email:</span>
              <span className="ml-2 text-gray-800">{selectedCustomer.email}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Phone:</span>
              <span className="ml-2 text-gray-800">{selectedCustomer.phone}</span>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-600">Address:</span>
              <span className="ml-2 text-gray-800">{selectedCustomer.address}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSelect;