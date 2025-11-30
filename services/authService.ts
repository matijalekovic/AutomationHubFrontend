import { User, UserRole } from '../types';

const MOCK_USERS: User[] = [
  {
    id: 'user_arch',
    name: 'Alice Architect',
    email: 'arch@design.com',
    role: UserRole.ARCHITECT,
    avatar: 'https://ui-avatars.com/api/?name=Alice+Architect&background=6366f1&color=fff'
  },
  {
    id: 'user_dev',
    name: 'Dave Developer',
    email: 'dev@code.com',
    role: UserRole.DEVELOPER,
    avatar: 'https://ui-avatars.com/api/?name=Dave+Developer&background=10b981&color=fff'
  }
];

export const login = async (email: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid credentials. (Hint: Try arch@design.com or dev@code.com)');
  }
  
  return user;
};

export const getCurrentUser = (): User | null => {
  const stored = sessionStorage.getItem('rah_current_user');
  return stored ? JSON.parse(stored) : null;
};

export const logout = () => {
  sessionStorage.removeItem('rah_current_user');
};