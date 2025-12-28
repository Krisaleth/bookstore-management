'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { authorsAPI } from '@/lib/api';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminAuthorsPage() {
  const { isAdmin, isAuthenticated } = useAuth();
  const router = useRouter();
  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    biography: '',
  });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadAuthors();
  }, [isAuthenticated, isAdmin, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAuthor) {
        await authorsAPI.update(editingAuthor.id, formData);
        toast.success('Author updated successfully');
      } else {
        await authorsAPI.create(formData);
        toast.success('Author created successfully');
      }
      setShowForm(false);
      setEditingAuthor(null);
      resetForm();
      loadAuthors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save author');
    }
  };

  const handleEdit = (author: any) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name || '',
      biography: author.biography || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this author?')) {
      return;
    }
    try {
      await authorsAPI.delete(id);
      toast.success('Author deleted successfully');
      loadAuthors();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete author');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', biography: '' });
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
          <h1 className="text-3xl font-bold">Manage Authors</h1>
        </div>
        <button onClick={() => { setShowForm(true); setEditingAuthor(null); resetForm(); }} className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Author</span>
        </button>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">{editingAuthor ? 'Edit Author' : 'Add New Author'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                required
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Biography</label>
              <textarea
                className="input min-h-[150px]"
                value={formData.biography}
                onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">
                {editingAuthor ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingAuthor(null); resetForm(); }}
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
          <p className="text-gray-500">Loading authors...</p>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Biography</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {authors.map((author) => (
                  <tr key={author.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold">{author.name}</td>
                    <td className="py-3 px-4 text-gray-600 line-clamp-2">{author.biography || 'No biography'}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(author)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(author.id)}
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

