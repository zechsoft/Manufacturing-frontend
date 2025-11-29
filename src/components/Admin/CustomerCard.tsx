import React from 'react';
import { Edit, Trash2, Mail, Phone, MapPin, Calendar, CreditCard } from 'lucide-react';
import type { Customer } from '../../store/types/customer';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onEdit,
  onDelete
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {customer.companyName}
            </h3>
            <p className="text-sm text-gray-600 font-mono">
              {customer.customerId}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(customer)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit customer"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(customer)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete customer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <span className="truncate">{customer.email}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <span>{customer.phone}</span>
          </div>

          <div className="flex items-start text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="line-clamp-2">{customer.address}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
            <span>{customer.creditTerms} ({customer.creditDays} days)</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Created {formatDate(customer.createdAt)}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div>
              <p className="text-gray-500 mb-1">GST</p>
              <p className="font-mono text-gray-700">{customer.GST}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">PAN</p>
              <p className="font-mono text-gray-700">{customer.PAN}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">TAN</p>
              <p className="font-mono text-gray-700">{customer.TAN}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
