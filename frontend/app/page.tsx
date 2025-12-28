import Link from 'next/link'
import { booksAPI } from '@/lib/api'
import BookCard from '@/components/BookCard'

export const dynamic = 'force-dynamic'; // Ép Next.js không được cache trang này
export const revalidate = 0;
export default async function Home() {
  let books = [];
  try {
    const response = await booksAPI.getAvailable();
    books = response.data.slice(0, 12); // Show first 12 books
    console.log('Fetched books:', books);
  } catch (error) {
    console.error('Failed to fetch books:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our Bookstore
        </h1>
        <p className="text-xl text-gray-600">
          Discover your next favorite book from our extensive collection
        </p>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Featured Books</h2>
        <Link href="/books" className="text-primary-600 hover:text-primary-700 font-medium">
          View All Books →
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No books available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}

