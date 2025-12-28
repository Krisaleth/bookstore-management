'use client';

import { useState, useEffect } from 'react';
import { authorsAPI } from '@/lib/api';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const response = await authorsAPI.getAll();
      setAuthors(response.data);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading authors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Authors</h1>

      {authors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No authors found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map((author) => (
            <Link key={author.id} href={`/authors/${author.id}`}>
              <div className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{author.name}</h3>
                  </div>
                </div>
                {author.biography && (
                  <p className="text-gray-600 line-clamp-3">{author.biography}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

