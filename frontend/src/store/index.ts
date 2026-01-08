import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth Store
interface User {
  id: string;
  email: string;
  role: "patient" | "doctor";
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);

// Theme Store
interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setTheme: (theme) => set({ theme }),
    }),
    { name: "theme-storage" }
  )
);

// Offline Queue Store
interface QueueItem {
  id: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  data?: any;
  timestamp: number;
}

interface OfflineState {
  isOnline: boolean;
  queue: QueueItem[];
  setOnlineStatus: (status: boolean) => void;
  addToQueue: (item: Omit<QueueItem, "id" | "timestamp">) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      isOnline: navigator.onLine,
      queue: [],
      setOnlineStatus: (status) => set({ isOnline: status }),
      addToQueue: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      removeFromQueue: (id) =>
        set((state) => ({
          queue: state.queue.filter((item) => item.id !== id),
        })),
      clearQueue: () => set({ queue: [] }),
    }),
    { name: "offline-storage" }
  )
);

// Language Store
interface LanguageState {
  language: "en" | "es" | "fr";
  setLanguage: (lang: "en" | "es" | "fr") => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    { name: "language-storage" }
  )
);

// Consultation Store (for local state management)
interface ConsultationState {
  consultations: any[];
  selectedConsultation: any | null;
  setConsultations: (consultations: any[]) => void;
  selectConsultation: (consultation: any) => void;
  addConsultation: (consultation: any) => void;
  updateConsultation: (id: string, data: any) => void;
}

export const useConsultationStore = create<ConsultationState>((set) => ({
  consultations: [],
  selectedConsultation: null,
  setConsultations: (consultations) => set({ consultations }),
  selectConsultation: (consultation) =>
    set({ selectedConsultation: consultation }),
  addConsultation: (consultation) =>
    set((state) => ({
      consultations: [...state.consultations, consultation],
    })),
  updateConsultation: (id, data) =>
    set((state) => ({
      consultations: state.consultations.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),
}));
