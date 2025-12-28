'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.bookId === item.bookId);
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > item.stock) {
          toast.error('Not enough stock available');
          return prevItems;
        }
        toast.success('Item quantity updated');
        return prevItems.map((i) =>
          i.bookId === item.bookId ? { ...i, quantity: newQuantity } : i
        );
      }
      toast.success('Item added to cart');
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (bookId: number) => {
    setItems((prevItems) => {
      const filtered = prevItems.filter((i) => i.bookId !== bookId);
      if (filtered.length < prevItems.length) {
        toast.success('Item removed from cart');
      }
      return filtered;
    });
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bookId);
      return;
    }
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.bookId === bookId);
      if (item && quantity > item.stock) {
        toast.error('Not enough stock available');
        return prevItems;
      }
      return prevItems.map((i) =>
        i.bookId === bookId ? { ...i, quantity } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

