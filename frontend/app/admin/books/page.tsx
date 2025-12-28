'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { booksAPI, authorsAPI, categoriesAPI } from '@/lib/api';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminBooksPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    isbn: '',
    authorId: '',
    categoryIds: [] as number[],
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadData();
  }, [isAuthenticated, isAdmin, router]);

  const loadData = async () => {
    try {
      const [booksRes, authorsRes, categoriesRes] = await Promise.all([
        booksAPI.getAll(),
        authorsAPI.getAll(),
        categoriesAPI.getAll(),
      ]);
      setBooks(booksRes.data);
      setAuthors(authorsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.title || !formData.price || !formData.stock || !formData.authorId) {
        toast.error('Please fill in all required fields');
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      if (formData.isbn) {
        formDataToSend.append('isbn', formData.isbn);
      }
      formDataToSend.append('authorId', formData.authorId);
      formData.categoryIds.forEach((id) => {
        formDataToSend.append('categoryIds', id.toString());
      });
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingBook) {
        await booksAPI.updateWithFile(editingBook.id, formDataToSend);
        toast.success('Book updated successfully');
      } else {
        await booksAPI.createWithFile(formDataToSend);
        toast.success('Book created successfully');
      }
      setShowForm(false);
      setEditingBook(null);
      resetForm();
      loadData();
    } catch (error: any) {
      console.error('Error saving book:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to save book';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (book: any) => {
    setEditingBook(book);
    setFormData({
      title: book.title || '',
      description: book.description || '',
      price: book.price?.toString() || '',
      stock: book.stock?.toString() || '',
      isbn: book.isbn || '',
      authorId: book.authorId?.toString() || '',
      categoryIds: book.categoryIds || [],
      imageUrl: book.imageUrl || '',
    });
    setImageFile(null);
    setImagePreview(book.imageUrl ? `${process.env.NEXT_PUBLIC_API_URL}/api/images/books/${book.imageUrl}` : null);
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this book?')) {
      return;
    }
    try {
      await booksAPI.delete(id);
      toast.success('Book deleted successfully');
      loadData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      stock: '',
      isbn: '',
      authorId: '',
      categoryIds: [],
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin" className="text-primary-600 hover:text-primary-700">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Manage Books</h1>
        </div>
        <button onClick={() => { setShowForm(true); setEditingBook(null); resetForm(); }} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Book</span>
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ISBN</label>
                <input
                  type="text"
                  className="input"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="input min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock *</label>
                <input
                  type="number"
                  required
                  className="input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author *</label>
                <select
                  required
                  className="input"
                  value={formData.authorId}
                  onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                >
                  <option value="">Select Author</option>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categories</label>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((category) => (
                  <label key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, categoryIds: [...formData.categoryIds, category.id] });
                        } else {
                          setFormData({ ...formData, categoryIds: formData.categoryIds.filter(id => id !== category.id) });
                        }
                      }}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Book Image</label>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-48 object-cover rounded border"
                  />
                </div>
              )}
              {!imagePreview && editingBook && formData.imageUrl && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/images/books/${formData.imageUrl}`}
                    alt="Current"
                    className="w-32 h-48 object-cover rounded border"
                  />
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">
                {editingBook ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingBook(null); resetForm(); }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading books...</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Author</th>
                  <th className="text-left py-3 px-4">Price</th>
                  <th className="text-left py-3 px-4">Stock</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{book.title}</td>
                    <td className="py-3 px-4">{book.authorName}</td>
                    <td className="py-3 px-4">${book.price.toFixed(2)}</td>
                    <td className="py-3 px-4">{book.stock}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

