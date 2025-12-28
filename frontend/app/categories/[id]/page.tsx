'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { categoriesAPI, booksAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookCard from '@/components/BookCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadCategory(Number(params.id));
      loadCategoryBooks(Number(params.id));
    }
  }, [params.id]);

  const loadCategory = async (id: number) => {
    try {
      const response = await categoriesAPI.getById(id);
      setCategory(response.data);
    } catch (error) {
      console.error('Failed to load category:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryBooks = async (categoryId: number) => {
    try {
      const response = await booksAPI.getByCategory(categoryId);
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to load category books:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading category details...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Category not found.</p>
          <Link href="/categories" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Categories
      </Link>

      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-gray-700">{category.description}</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Books in {category.name}</h2>
        {books.length === 0 ? (
          <p className="text-gray-500">No books found in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

