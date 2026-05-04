import { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole } from '../types';

interface UserContextType {
  // Auth state
  isAuthenticated: boolean;
  isOnboarded: boolean;
  setAuthenticated: (v: boolean) => void;
  setOnboarded: (v: boolean) => void;
  logout: () => void;

  // User data
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userPhone: string;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gs_auth') === 'true';
  });
  const [isOnboarded, setIsOnboarded] = useState(() => {
    return localStorage.getItem('gs_onboarded') === 'true';
  });
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('gs_role') as UserRole) || 'customer';
  });

  const setAuthenticated = (v: boolean) => {
    setIsAuthenticated(v);
    localStorage.setItem('gs_auth', String(v));
  };

  const setOnboarded = (v: boolean) => {
    setIsOnboarded(v);
    localStorage.setItem('gs_onboarded', String(v));
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('gs_role', newRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
    localStorage.removeItem('gs_auth');
    localStorage.removeItem('gs_onboarded');
    localStorage.removeItem('gs_role');
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        setAuthenticated,
        setOnboarded,
        logout,
        role,
        setRole,
        userName: 'Алексей Данилов',
        userPhone: '+7 (777) 123-45-67',
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
