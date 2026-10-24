import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, generateId } from '../utils/helpers';

const USERS_STORAGE_KEY = 'taskflow_users_v2';
const AUTH_SESSION_KEY = 'taskflow_auth_session_v2';

const DEFAULT_USERS = [
  {
    id: 'user-arnab-1',
    name: 'Arnab Maity',
    email: 'arnab.maity@taskflow.dev',
    password: 'password123',
    role: 'Lead Engineer',
    initials: 'AM',
    createdAt: '2026-01-01T00:00:00Z',
  }
];

const AuthContext = createContext(null);

export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AuthProvider({ children }) {
  // Registered users list in localStorage
  const [users, setUsers] = useState(() => {
    const saved = storage.get(USERS_STORAGE_KEY, null);
    if (Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    // Seed default users
    storage.set(USERS_STORAGE_KEY, DEFAULT_USERS);
    return DEFAULT_USERS;
  });

  // Current logged in user
  const [currentUser, setCurrentUser] = useState(() => {
    return storage.get(AUTH_SESSION_KEY, null);
  });

  // Keep users synced to storage
  useEffect(() => {
    storage.set(USERS_STORAGE_KEY, users);
  }, [users]);

  // Keep active session synced to storage
  useEffect(() => {
    if (currentUser) {
      storage.set(AUTH_SESSION_KEY, currentUser);
    } else {
      storage.remove(AUTH_SESSION_KEY);
    }
  }, [currentUser]);

  // Login handler
  const login = useCallback((email, password, rememberMe = true) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      };
    }

    const sessionUser = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role || 'Product Lead',
      initials: foundUser.initials || getInitials(foundUser.name),
      rememberMe,
    };

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }, [users]);

  // Register handler
  const register = useCallback(({ name, email, password, role = 'Team Member' }) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address already exists.',
      };
    }

    const newUser = {
      id: generateId(),
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: role.trim() || 'Team Member',
      initials: getInitials(name),
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    storage.set(USERS_STORAGE_KEY, updatedUsers);

    // Auto-login after registration
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      initials: newUser.initials,
      rememberMe: true,
    };

    setCurrentUser(sessionUser);
    return { success: true, user: sessionUser };
  }, [users]);

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null);
    storage.remove(AUTH_SESSION_KEY);
  }, []);

  const value = {
    currentUser,
    users,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
