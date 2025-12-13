import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import axios from "axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "planning" | "production" | "quality" | "purchase" | "npd" | "sales" | "stores";
  lastLogin: Date;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  message: string | null;
}

interface AuthActions {
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Use proxy in development, environment variable in production
const API_URL = import.meta.env.MODE === "development" 
  ? "/api/auth"  // Use Vite proxy in development
  : `${import.meta.env.VITE_API_URL}/api/auth`; // Use env var in production

axios.defaults.withCredentials = true;

// Mock users data for testing
const MOCK_USERS = [
  {
    _id: "mock-npd-001",
    email: "npd@company.com",
    password: "npd123456",
    name: "NPD Manager",
    role: "npd" as const,
    lastLogin: new Date()
  },
  {
    _id: "mock-purchase-001",
    email: "purchase@company.com",
    password: "purchase123456",
    name: "Purchase Manager",
    role: "purchase" as const,
    lastLogin: new Date()
  },
  {
    _id: "mock-sales-001",
    email: "sales@company.com",
    password: "sales123456",
    name: "Sales Manager",
    role: "sales" as const,
    lastLogin: new Date()
  },
  {
    _id: "mock-stores-001",
    email: "stores@company.com",
    password: "stores123456",
    name: "Stores Manager",
    role: "stores" as const,
    lastLogin: new Date()
  },
  {
    _id: "mock-admin-001",
    email: "admin@company.com",
    password: "admin123456",
    name: "Admin User",
    role: "admin" as const,
    lastLogin: new Date()
  }
];

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    devtools((set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      isCheckingAuth: false,
      message: null,

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axios.post(`${API_URL}/signup`, { email, password, name });
          console.log('Signup response:', response.data);
          
          if (response.data.user) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true, 
              isLoading: false,
              error: null
            });
          } else {
            throw new Error('No user data received from signup');
          }
        } catch (error: any) {
          console.error('Signup error:', error);
          let errorMessage = "Error signing up";
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Check for mock users first
          const mockUser = MOCK_USERS.find(
            u => u.email === email && u.password === password
          );

          if (mockUser) {
            // Mock login successful
            console.log('Mock login successful for:', email);
            const { password: _, ...userWithoutPassword } = mockUser;
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            set({
              isAuthenticated: true,
              user: userWithoutPassword,
              error: null,
              isLoading: false,
            });
            return;
          }

          // If not a mock user, try real API
          const response = await axios.post(`${API_URL}/login`, { email, password });
          console.log('Login response:', response.data);
          
          if (response.data.user) {
            set({
              isAuthenticated: true,
              user: response.data.user,
              error: null,
              isLoading: false,
            });
          } else {
            throw new Error('No user data received from login');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          let errorMessage = "Invalid email or password";
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          set({ 
            error: errorMessage, 
            isLoading: false,
            isAuthenticated: false,
            user: null
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // Check if current user is a mock user
          const currentUser = get().user;
          const isMockUser = MOCK_USERS.some(u => u._id === currentUser?._id);

          if (!isMockUser) {
            // Only call API logout for real users
            await axios.post(`${API_URL}/logout`);
          }
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null, 
            isLoading: false,
            isCheckingAuth: false
          });
        } catch (error: any) {
          console.error('Logout error:', error);
          // Even if logout fails, clear local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: "Error logging out", 
            isLoading: false,
            isCheckingAuth: false
          });
          throw error;
        }
      },

      checkAuth: async () => {
        // Prevent multiple simultaneous checkAuth calls
        if (get().isCheckingAuth) {
          console.log('checkAuth already in progress, skipping');
          return;
        }
        
        set({ isCheckingAuth: true, error: null });
        console.log('Starting checkAuth...');
        
        try {
          // Check if current user is a mock user (from persisted state)
          const persistedUser = get().user;
          const isMockUser = MOCK_USERS.some(u => u._id === persistedUser?._id);

          if (isMockUser && persistedUser) {
            // Mock user is already authenticated from persisted state
            console.log('Mock user authenticated from storage:', persistedUser.email);
            set({ 
              user: persistedUser, 
              isAuthenticated: true, 
              isCheckingAuth: false,
              error: null
            });
            return;
          }

          // For real users, check with API
          const response = await axios.get(`${API_URL}/check-auth`);
          console.log('CheckAuth response:', response.data);
          
          if (response.data.user) {
            set({ 
              user: response.data.user, 
              isAuthenticated: true, 
              isCheckingAuth: false,
              error: null
            });
            console.log('CheckAuth successful, user:', response.data.user.email, 'role:', response.data.user.role);
          } else {
            console.log('CheckAuth: No user data received, treating as unauthenticated');
            set({ 
              user: null,
              isAuthenticated: false, 
              isCheckingAuth: false,
              error: null
            });
          }
        } catch (error: any) {
          console.log('CheckAuth failed:', error.response?.status, error.response?.data);
          set({ 
            error: null, 
            isCheckingAuth: false, 
            isAuthenticated: false,
            user: null
          });
        }
      }
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      // Only persist essential data, not loading states
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Handle rehydration properly
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating auth state:', state);
        // Ensure consistency after rehydration
        if (state) {
          // If we have isAuthenticated but no user, something is wrong
          if (state.isAuthenticated && !state.user) {
            console.log('Inconsistent state detected: authenticated but no user data');
            state.isAuthenticated = false;
            state.user = null;
          }
        }
      },
    }
  )
);