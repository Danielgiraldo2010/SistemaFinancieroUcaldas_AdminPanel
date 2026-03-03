import { create } from 'zustand';
import Cookies from 'js-cookie';

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

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  logout: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    set({ user: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = Cookies.get('access_token');
    set({ isAuthenticated: !!token, isLoading: false });
  },
}));
