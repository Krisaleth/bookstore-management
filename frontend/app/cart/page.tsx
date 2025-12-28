'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { getBookImageUrl } from '@/lib/imageUtils';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Please enter a shipping address');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress,
        items: items.map(item => ({
          bookId: item.bookId,
          quantity: item.quantity,
        })),
      };

      const response = await ordersAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${response.data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
          <Link href="/books" className="btn btn-primary">
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.bookId} className="card flex items-center space-x-4">
              <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={getBookImageUrl(item.imageUrl)}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Link href={`/books/${item.bookId}`}>
                  <h3 className="font-semibold text-lg hover:text-primary-600">{item.title}</h3>
                </Link>
                <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                <p className="text-sm text-gray-500">Stock: {item.stock}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 border rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.bookId, item.quantity - 1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                    className="p-2 hover:bg-gray-100"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.bookId)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-1">
          <div className="card sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Address *
              </label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="input min-h-[100px]"
                placeholder="Enter your shipping address"
                required
              />
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || !shippingAddress.trim()}
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

