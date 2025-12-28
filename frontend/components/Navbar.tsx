'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, User, LogOut, BookOpen, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { getItemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getItemCount();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Bookstore</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/books" className="text-gray-700 hover:text-primary-600 transition">
              Books
            </Link>
            <Link href="/authors" className="text-gray-700 hover:text-primary-600 transition">
              Authors
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition">
              Categories
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-primary-600 transition"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary-600 transition">
                  <User className="h-6 w-6" />
                  <span className="hidden md:inline">{user?.firstName || user?.username}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}

            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/books" className="block py-2 text-gray-700 hover:text-primary-600">
              Books
            </Link>
            <Link href="/authors" className="block py-2 text-gray-700 hover:text-primary-600">
              Authors
            </Link>
            <Link href="/categories" className="block py-2 text-gray-700 hover:text-primary-600">
              Categories
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/orders" className="block py-2 text-gray-700 hover:text-primary-600">
                  My Orders
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="block py-2 text-gray-700 hover:text-primary-600">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

