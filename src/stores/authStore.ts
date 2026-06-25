import { create } from 'zustand';
import api from '@/lib/api';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  roles: string[];
  active_role: string;
  financial_summaries?: {
    wallet_balance?: number;
    seller_income?: number;
    driver_earnings?: number;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  switchRole: (role: string) => Promise<void>;
  addRole: (role: string) => Promise<void>;
  setLoading: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: true,

  setLoading: (status: boolean) => set({ loading: status }),

  login: (access: string, refresh: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
    }
    set({ isAuthenticated: true });
    get().fetchProfile();
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await api.post('/auth/logout/', { refresh_token: refreshToken });
        } catch (error) {
          console.error('Failed to logout on server', error);
        }
      }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    set({ isAuthenticated: false, user: null });
  },

  switchRole: async (role: string) => {
    try {
      set({ loading: true });
      const response = await api.post('/auth/select-role/', { role });
      const { access, refresh } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      }
      await get().fetchProfile();
      if (typeof window !== 'undefined') {
        window.location.href = `/dashboard/${role.toLowerCase()}`;
      }
    } catch (error) {
      console.error('Failed to switch role', error);
      set({ loading: false });
    }
  },

  addRole: async (role: string) => {
    try {
      set({ loading: true });
      const response = await api.post('/auth/add-role/', { role });
      const { access, refresh } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
      }
      await get().fetchProfile();
      if (typeof window !== 'undefined') {
        window.location.href = `/dashboard/${role.toLowerCase()}`;
      }
    } catch (error) {
      console.error('Failed to add role', error);
      set({ loading: false });
      throw error; // Rethrow so components can catch and show errors
    }
  },

  fetchProfile: async () => {
    try {
      set({ loading: true });
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        if (!token) {
          set({ isAuthenticated: false, user: null, loading: false });
          return;
        }
      }
      const response = await api.get('/auth/profile/');
      set({ isAuthenticated: true, user: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      set({ isAuthenticated: false, user: null, loading: false });
    }
  },
}));
