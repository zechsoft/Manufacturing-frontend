import React from 'react';
import { FileText, Package, Calendar, User, Clock, Loader2, Eye, Edit } from 'lucide-react';
import type { PopulatedOrder } from '../../types/orders';

interface OrdersListProps {
  orders: PopulatedOrder[];
  loading: boolean;
  error: string | null;
  onViewOrder: (order: PopulatedOrder) => void;
  onEditOrder: (order: PopulatedOrder) => void;
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

const OrdersList: React.FC<OrdersListProps> = ({ orders, loading, error, onViewOrder, onEditOrder }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
        <div className="text-center text-red-600">
          <FileText className="w-8 h-8 mx-auto mb-2 text-red-400" />
          <p className="font-medium">Failed to load orders</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          <span className="ml-auto text-sm text-gray-500">
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm mt-1">Create your first order using the form above</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {orders.map((order) => (
            <div key={order._id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {order.order_number}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">PO: {order.po_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{order.company_name}</p>
                    <p className="text-gray-600">{order.customer_id.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.parts.length} part{order.parts.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-gray-600">
                      {order.parts.reduce((sum: number, part: any) => sum + part.quantity, 0)} total qty
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Delivery</p>
                    <p className="text-gray-600">
                      {new Date(order.delivery_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Created</p>
                    <p className="text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parts Details */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-medium text-gray-600 mb-2">PARTS BREAKDOWN</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {order.parts.map((part, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-white rounded px-2 py-1">
                      <span className="text-gray-900 font-medium truncate">
                        {part.part_number.partNumber}
                      </span>
                      <span className="text-gray-600 ml-2">×{part.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                <button
                  onClick={() => onViewOrder(order)}
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                <button
                  onClick={() => onEditOrder(order)}
                  className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2 text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;