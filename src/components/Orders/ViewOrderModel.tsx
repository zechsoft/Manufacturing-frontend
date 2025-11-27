import React from 'react';
import { X, FileText, Building2, Package, Calendar, User, Clock, MapPin, Phone, Mail } from 'lucide-react';
import type { PopulatedOrder } from '../../types/orders';

interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PopulatedOrder | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'adminApproved':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'productionHeadApproved':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'businessHeadApproved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'adminApproved':
      return 'Admin Approved';
    case 'productionHeadApproved':
      return 'Production Approved';
    case 'businessHeadApproved':
      return 'Business Approved';
    default:
      return status;
  }
};

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const totalQuantity = order.parts.reduce((sum, part) => sum + part.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{order.order_number}</h2>
              <p className="text-sm text-gray-600">Order Details</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Order Info</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">PO Number:</span> {order.po_number}</p>
                <p><span className="font-medium">Order Number:</span> {order.order_number}</p>
                <p><span className="font-medium">Status:</span> {getStatusLabel(order.status)}</p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Parts Summary</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Total Parts:</span> {order.parts.length}</p>
                <p><span className="font-medium">Total Quantity:</span> {totalQuantity}</p>
                <p><span className="font-medium">Unique Items:</span> {order.parts.length}</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Timeline</span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Ordered:</span> {new Date(order.ordered_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Delivery:</span> {new Date(order.delivery_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Created:</span> {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900">{order.customer_id.companyName}</p>
                    <p className="text-sm text-gray-600">Customer ID: {order.customer_id.customerId}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-900">{order.customer_id.email}</p>
                    {order.customer_id.commercialEmail && (
                      <p className="text-sm text-gray-600">Commercial: {order.customer_id.commercialEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-900">{order.customer_id.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-900">{order.customer_id.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">GST:</span>
                  <span className="ml-2 text-gray-900">{order.customer_id.GST || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">PAN:</span>
                  <span className="ml-2 text-gray-900">{order.customer_id.PAN || 'N/A'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Credit Terms:</span>
                  <span className="ml-2 text-gray-900">{order.customer_id.creditTerms || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Ordered Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.ordered_date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">Planning Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.planning_date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium text-gray-700">Production Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.production_date).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">Delivery Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(order.delivery_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Parts Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Parts Breakdown</h3>
            </div>
            
            <div className="space-y-3">
              {(order.parts || []).map(part => (
                <div key={part.part_number.partNumber} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{part.part_number.partNumber}</h4>
                      <p className="text-sm text-gray-600">{part.part_number.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">×{part.quantity}</p>
                      <p className="text-xs text-gray-500">Quantity</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Raw Material:</span>
                      <span className="ml-2 text-gray-900">{part.part_number.rawMaterial}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Qty per Screw:</span>
                      <span className="ml-2 text-gray-900">{part.part_number.quantityPerScrew}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Process Steps:</span>
                      <span className="ml-2 text-gray-900">{(part.part_number.processSteps || []).length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;