import axios from 'axios';
import Cookies from 'js-cookie';

// Tự động xác định URL dựa trên môi trường chạy (Server hay Client)
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Nếu là trình duyệt, gọi qua localhost:8080 (cổng public của Docker)
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }
  // Nếu là Server (Docker nội bộ), gọi qua tên service 'bookstore-api'
  // Lưu ý: Biến này phải được truyền vào qua Dockerfile ARG/ENV
  return process.env.NEXT_PUBLIC_API_URL_INTERNAL || 'http://bookstore-api:8080';
};

const api = axios.create({
  baseURL: `${getBaseURL()}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If the data is FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: { username: string; email: string; password: string; firstName?: string; lastName?: string; phoneNumber?: string; address?: string }) =>
    api.post('/auth/register', data),
  login: (data: { username: string; password: string }) =>
    api.post('/auth/login', data),
};

// Books API
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id: number) => api.get(`/books/${id}`),
  search: (title: string) => api.get(`/books/search?title=${encodeURIComponent(title)}`),
  getByAuthor: (authorId: number) => api.get(`/books/author/${authorId}`),
  getByCategory: (categoryId: number) => api.get(`/books/category/${categoryId}`),
  getAvailable: () => api.get('/books/available'),
  create: (data: any) => api.post('/books', data),
  createWithFile: (formData: FormData) => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    return api.post('/books', formData);
  },
  update: (id: number, data: any) => api.put(`/books/${id}`, data),
  updateWithFile: (id: number, formData: FormData) => {
    // Don't set Content-Type header - let axios set it automatically with boundary
    return api.put(`/books/${id}`, formData);
  },
  delete: (id: number) => api.delete(`/books/${id}`),
};

// Authors API
export const authorsAPI = {
  getAll: () => api.get('/authors'),
  getById: (id: number) => api.get(`/authors/${id}`),
  create: (data: any) => api.post('/authors', data),
  update: (id: number, data: any) => api.put(`/authors/${id}`, data),
  delete: (id: number) => api.delete(`/authors/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: number) => api.get(`/categories/${id}`),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getAllForAdmin: () => api.get('/orders/admin/all'),
  getById: (id: number) => api.get(`/orders/${id}`),
  getByStatus: (status: string) => api.get(`/orders/status/${status}`),
  create: (data: any) => api.post('/orders', data),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status?status=${status}`),
  cancel: (id: number) => api.post(`/orders/${id}/cancel`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

export default api;