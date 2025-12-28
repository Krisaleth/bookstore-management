'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, User, Tag, Package } from 'lucide-react';

export default function AdminPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const adminLinks = [
    {
      title: 'Manage Books',
      description: 'Add, edit, and delete books',
      href: '/admin/books',
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Authors',
      description: 'Add, edit, and delete authors',
      href: '/admin/authors',
      icon: User,
      color: 'bg-green-500',
    },
    {
      title: 'Manage Categories',
      description: 'Add, edit, and delete categories',
      href: '/admin/categories',
      icon: Tag,
      color: 'bg-purple-500',
    },
    {
      title: 'Manage Orders',
      description: 'View and manage customer orders',
      href: '/admin/orders',
      icon: Package,
      color: 'bg-indigo-500',
    },
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      href: '/admin/users',
      icon: User,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}>
              <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`${link.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                <p className="text-gray-600">{link.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

