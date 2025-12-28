'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getBookImageUrl } from '@/lib/imageUtils';

interface BookCardProps {
  book: {
    id: number;
    title: string;
    price: number;
    imageUrl?: string;
    stock: number;
    authorName?: string;
  };
}

export default function BookCard({ book }: BookCardProps) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (book.stock > 0) {
      addItem({
        bookId: book.id,
        title: book.title,
        price: book.price,
        imageUrl: book.imageUrl,
        stock: book.stock,
      });
    }
  };

  return (
    <Link href={`/books/${book.id}`}>
      <div className="card hover:shadow-lg transition-shadow duration-200 h-full flex flex-col">
        <div className="relative w-full h-64 mb-4 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={getBookImageUrl(book.imageUrl)}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{book.title}</h3>
          {book.authorName && (
            <p className="text-gray-600 text-sm mb-2">by {book.authorName}</p>
          )}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">
              ${book.price.toFixed(2)}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={book.stock === 0}
              className={`p-2 rounded-full transition-colors ${
                book.stock > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
          {book.stock === 0 && (
            <p className="text-red-500 text-sm mt-2">Out of Stock</p>
          )}
        </div>
      </div>
    </Link>
  );
}

