'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ordersAPI } from '@/lib/api';
import Link from 'next/link';
import { Eye, Calendar } from 'lucide-react';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, router]);

  const loadOrders = async () => {
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
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
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't placed any orders yet.</p>
          <Link href="/books" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xl font-bold mt-2">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {order.orderItems && order.orderItems.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {order.orderItems.length} item(s)
                  </p>
                  <div className="space-y-1">
                    {order.orderItems.slice(0, 3).map((item: any) => (
                      <p key={item.id} className="text-sm">
                        {item.bookTitle} × {item.quantity}
                      </p>
                    ))}
                    {order.orderItems.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{order.orderItems.length - 3} more item(s)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {order.shippingAddress && (
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-semibold">Shipping to:</span> {order.shippingAddress}
                </p>
              )}

              <Link
                href={`/orders/${order.id}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

