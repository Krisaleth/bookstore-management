'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import { ArrowLeft, Package, Eye, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  subtotal: number;
  bookId: number;
  bookTitle: string;
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  userId: number;
  username: string;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadOrders();
  }, [isAuthenticated, isAdmin, router]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAllForAdmin();
      setOrders(response.data);
    } catch (error: any) {
      console.error('Failed to load orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    try {
      await ordersAPI.cancel(orderId);
      toast.success('Order cancelled successfully');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = selectedStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const statusOptions: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input"
          >
            <option value="ALL">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <button
            onClick={loadOrders}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order #</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Total</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr
                          key={order.id}
                          className={`border-b hover:bg-gray-50 cursor-pointer ${
                            selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedOrder(order)}
                        >
                          <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                          <td className="py-3 px-4">{order.username}</td>
                          <td className="py-3 px-4">${order.totalAmount.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(order);
                                }}
                                className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="card sticky top-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-medium">{selectedOrder.orderNumber}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedOrder.username}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Shipping Address</p>
                    <p className="font-medium">{selectedOrder.shippingAddress || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Order Items</p>
                    <div className="mt-2 space-y-2">
                      {selectedOrder.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm border-b pb-2">
                          <div>
                            <p className="font-medium">{item.bookTitle}</p>
                            <p className="text-gray-600">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                          </div>
                          <p className="font-medium">${item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-lg font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Update Status</p>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        status !== selectedOrder.status && (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(selectedOrder.id, status)}
                            className="w-full btn btn-secondary text-sm"
                            disabled={selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED'}
                          >
                            Mark as {status}
                          </button>
                        )
                      ))}
                      {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                        <button
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                          className="w-full btn bg-red-600 hover:bg-red-700 text-white text-sm"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t text-xs text-gray-500">
                    <p>Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    <p>Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Select an order to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

