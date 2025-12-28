'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { booksAPI } from '@/lib/api';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getBookImageUrl } from '@/lib/imageUtils';

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      loadBook(Number(params.id));
    }
  }, [params.id]);

  const loadBook = async (id: number) => {
    try {
      const response = await booksAPI.getById(id);
      setBook(response.data);
    } catch (error) {
      console.error('Failed to load book:', error);
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (book.stock > 0) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          bookId: book.id,
          title: book.title,
          price: book.price,
          imageUrl: book.imageUrl,
          stock: book.stock,
        });
      }
      toast.success(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Book not found.</p>
          <Link href="/books" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/books" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Books
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={getBookImageUrl(book.imageUrl)}
            alt={book.title}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
          {book.authorName && (
            <p className="text-xl text-gray-600 mb-4">
              by <Link href={`/authors/${book.authorId}`} className="text-primary-600 hover:underline">{book.authorName}</Link>
            </p>
          )}
          
          <div className="mb-6">
            <span className="text-4xl font-bold text-primary-600">${book.price.toFixed(2)}</span>
          </div>

          {book.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{book.description}</p>
            </div>
          )}

          <div className="mb-6 space-y-2">
            {book.isbn && (
              <p><span className="font-semibold">ISBN:</span> {book.isbn}</p>
            )}
            <p>
              <span className="font-semibold">Stock:</span>{' '}
              <span className={book.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {book.stock > 0 ? `${book.stock} available` : 'Out of Stock'}
              </span>
            </p>
            {book.categoryNames && book.categoryNames.length > 0 && (
              <div>
                <span className="font-semibold">Categories: </span>
                {book.categoryNames.map((cat: string, idx: number) => (
                  <span key={idx} className="text-primary-600">
                    {cat}{idx < book.categoryNames.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            )}
          </div>

          {book.stock > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-semibold">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={book.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(book.stock, parseInt(e.target.value) || 1)))}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full btn btn-primary flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-semibold">This book is currently out of stock.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

