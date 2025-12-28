'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (params.id) {
      loadOrder(Number(params.id));
    }
  }, [params.id, isAuthenticated, router]);

  const loadOrder = async (id: number) => {
    try {
      const response = await ordersAPI.getById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('Failed to load order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    try {
      await ordersAPI.cancel(Number(params.id));
      toast.success('Order cancelled successfully');
      loadOrder(Number(params.id));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Order not found.</p>
          <Link href="/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/orders" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Link>

      <div className="card mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order.orderNumber}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        {order.shippingAddress && (
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Shipping Address</h3>
            <p className="text-gray-700">{order.shippingAddress}</p>
          </div>
        )}

        {order.status === 'PENDING' || order.status === 'PROCESSING' ? (
          <button
            onClick={handleCancelOrder}
            className="btn btn-danger"
          >
            Cancel Order
          </button>
        ) : null}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.orderItems && order.orderItems.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
              <div>
                <Link href={`/books/${item.bookId}`} className="font-semibold hover:text-primary-600">
                  {item.bookTitle}
                </Link>
                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: ${item.price.toFixed(2)} each</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${item.subtotal.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t flex justify-between items-center">
          <span className="text-xl font-semibold">Total</span>
          <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

