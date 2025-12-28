import Cookies from 'js-cookie';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  role: 'USER' | 'ADMIN';
  enabled: boolean;
}

export const getToken = (): string | undefined => {
  return Cookies.get('token');
};

export const setToken = (token: string): void => {
  Cookies.set('token', token, { expires: 7 }); // 7 days
};

export const removeToken = (): void => {
  Cookies.remove('token');
};

export const getUser = (): User | null => {
  const userStr = Cookies.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUser = (user: User): void => {
  Cookies.set('user', JSON.stringify(user), { expires: 7 });
};

export const removeUser = (): void => {
  Cookies.remove('user');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getUser();
  return user?.role === 'ADMIN';
};

export const logout = (): void => {
  removeToken();
  removeUser();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
};

