'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { authorsAPI, booksAPI } from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BookCard from '@/components/BookCard';

export default function AuthorDetailPage() {
  const params = useParams();
  const [author, setAuthor] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadAuthor(Number(params.id));
      loadAuthorBooks(Number(params.id));
    }
  }, [params.id]);

  const loadAuthor = async (id: number) => {
    try {
      const response = await authorsAPI.getById(id);
      setAuthor(response.data);
    } catch (error) {
      console.error('Failed to load author:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAuthorBooks = async (authorId: number) => {
    try {
      const response = await booksAPI.getByAuthor(authorId);
      setBooks(response.data);
    } catch (error) {
      console.error('Failed to load author books:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading author details...</p>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Author not found.</p>
          <Link href="/authors" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
            ← Back to Authors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/authors" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Authors
      </Link>

      <div className="card mb-8">
        <h1 className="text-3xl font-bold mb-4">{author.name}</h1>
        {author.biography && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Biography</h2>
            <p className="text-gray-700">{author.biography}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">Books by {author.name}</h2>
        {books.length === 0 ? (
          <p className="text-gray-500">No books found for this author.</p>
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

