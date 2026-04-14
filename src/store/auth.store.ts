import { create } from 'zustand';
import { persistAuthUser, readPersistedAuthUser, tokenManager } from '@/lib';
import { AuthStatus } from '@/core';
import type { UserDto } from '@/core';

interface AuthState {
  user: UserDto | null;
  status: AuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingTwoFAToken: string | null;
  setUser: (user: UserDto | null) => void;
  setPendingTwoFAToken: (token: string | null) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: readPersistedAuthUser<UserDto>(),
  status: AuthStatus.Idle,
  isAuthenticated: !!readPersistedAuthUser<UserDto>(),
  isLoading: true,
  pendingTwoFAToken: null,

  setUser: (user) => {
    if (user) tokenManager.startMonitoring();
    persistAuthUser(user);
    set({
      user,
      isAuthenticated: !!user,
      status: user ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
    });
  },

  setPendingTwoFAToken: (token) => set({ pendingTwoFAToken: token }),

  logout: () => {
    tokenManager.cleanup();
    tokenManager.clearTokens();
    persistAuthUser<UserDto>(null);
    set({
      user: null,
      isAuthenticated: false,
      status: AuthStatus.Unauthenticated,
      pendingTwoFAToken: null,
    });
  },

  initialize: () => {
    const token = tokenManager.getAccessToken();
    const storedUser = readPersistedAuthUser<UserDto>();
    if (token) tokenManager.startMonitoring();
    set({
      user: storedUser,
      isAuthenticated: !!token,
      status: token ? AuthStatus.Authenticated : AuthStatus.Unauthenticated,
      isLoading: false,
    });
  },
}));
