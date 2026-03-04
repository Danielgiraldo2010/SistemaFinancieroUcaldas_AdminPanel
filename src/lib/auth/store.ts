import { create } from 'zustand';
import Cookies from 'js-cookie';
import { tokenService } from './tokenService';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: any) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      // Iniciar monitoreo de token
      tokenService.startTokenMonitoring();
    }
    set({ user, isAuthenticated: !!user });
  },

  logout: () => {
    tokenService.cleanup();
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = Cookies.get('access_token');
    const savedUser = localStorage.getItem('user');
    const user = savedUser ? JSON.parse(savedUser) : null;
    
    if (token && user) {
      // Iniciar monitoreo de token si hay sesión activa
      tokenService.startTokenMonitoring();
    }
    
    set({ user, isAuthenticated: !!token, isLoading: false });
  },
}));
