import React, { useState } from 'react';
import { Factory, TrendingUp, Package, FileText, Plus } from 'lucide-react';
import { useOrders } from '../../hooks/ordersapi';
import type { PopulatedOrder } from '../../store/types/orders';
import OrdersList from './OrderList';
import CreateOrderModal from './CreateOrderModel';
import ViewOrderModal from './ViewOrderModel';
import EditOrderModal from './EditOrderModel';

const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PopulatedOrder | null>(null);
  const { orders, loading: ordersLoading, error: ordersError, refetch: reafetchOrders } = useOrders();

  const handleOrderCreated = () => {
    refetchOrders(); // Refresh orders list
  };

  const handleViewOrder = (order: PopulatedOrder) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleEditOrder = (order: PopulatedOrder) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleOrderUpdated = () => {
    refetchOrders(); // Refresh orders list
  };
  // Stats calculations
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const approvedOrders = orders.filter(order => order.status !== 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manufacturing Dashboard</h1>
              <p className="text-sm text-gray-600">Manage customers, parts, and orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Parts Selected</p>
                <p className="text-sm text-gray-600">Manage orders and track production</p>
              </div>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create Order
            </button>
          </div>
        </div>

        {/* Orders List */}
        <OrdersList
          orders={orders}
          loading={ordersLoading}
          error={ordersError}
          onViewOrder={handleViewOrder}
          onEditOrder={handleEditOrder}
        />

        {/* Create Order Modal */}

        {/* View Order Modal */}
        <ViewOrderModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          order={selectedOrder}
        />

        {/* Edit Order Modal */}
        <EditOrderModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onOrderUpdated={handleOrderUpdated}
          order={selectedOrder}
        />

        {/* Create Order Modal */}
        <CreateOrderModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onOrderCreated={handleOrderCreated}
        />
      </div>
    </div>
  );
};

export default Dashboard;
