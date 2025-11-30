
import { User } from '../types';
import { db } from '../db';

export const login = async (email: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find user in local DB
  const user = await db.users.where('email').equals(email).first();
  
  if (user) {
      sessionStorage.setItem('rah_current_user_id', user.id);
      return user;
  }
  throw new Error('User not found. Try arch@design.com or dev@code.com');
};

export const getCurrentUser = async (): Promise<User | null> => {
  const userId = sessionStorage.getItem('rah_current_user_id');
  if (!userId) return null;
  
  const user = await db.users.get(userId);
  return user || null;
};

export const logout = () => {
  sessionStorage.removeItem('rah_current_user_id');
};
