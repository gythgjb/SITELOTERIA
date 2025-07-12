import { User } from '../types';

const USERS_KEY = 'lotemax_users';
const CURRENT_USER_KEY = 'lotemax_current_user';

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    }
    
    return null;
  },

  register: async (email: string, password: string, name: string): Promise<User | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find((u: User) => u.email === email)) {
      throw new Error('Email já cadastrado');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
    
    return userWithoutPassword;
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};