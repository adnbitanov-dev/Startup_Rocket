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
  userId: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
  userName: string;
  userPhone: string;
  loginUser: (id: string, name: string, phone: string, role: UserRole) => void;
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
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('gs_user_id') || '';
  });
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('gs_user_name') || '';
  });
  const [userPhone, setUserPhone] = useState(() => {
    return localStorage.getItem('gs_user_phone') || '';
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

  const loginUser = (id: string, name: string, phone: string, newRole: UserRole) => {
    setUserId(id);
    setUserName(name);
    setUserPhone(phone);
    setRoleState(newRole);
    setIsAuthenticated(true);
    
    localStorage.setItem('gs_user_id', id);
    localStorage.setItem('gs_user_name', name);
    localStorage.setItem('gs_user_phone', phone);
    localStorage.setItem('gs_role', newRole);
    localStorage.setItem('gs_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false);
    setUserId('');
    setUserName('');
    setUserPhone('');
    localStorage.clear();
  };

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        isOnboarded,
        setAuthenticated,
        setOnboarded,
        logout,
        userId,
        role,
        setRole,
        userName,
        userPhone,
        loginUser,
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
