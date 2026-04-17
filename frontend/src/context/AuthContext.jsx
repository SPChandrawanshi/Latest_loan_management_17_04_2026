import React, { createContext, useContext, useState, useEffect } from 'react';
// Removed axios dependency to keep frontend UI-only. Using local demo mocks below.

const DEMO_MOCK_USERS = {
  'admin@demo.com': { id: 'u1', name: 'Supreme Administrator', role: 'admin', email: 'admin@demo.com' },
  'agent@demo.com': { id: 'u2', name: 'Elite Partner Node', role: 'agent', email: 'agent@demo.com' },
  'borrower@demo.com': { id: 'u3', name: 'Verified Capital User', role: 'borrower', email: 'borrower@demo.com' },
  'staff@demo.com': { id: 'u4', name: 'Operations Officer', role: 'staff', email: 'staff@demo.com' }
};

function mockApiGet(path) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (path.includes('/auth/me')) {
        const role = localStorage.getItem('role') || 'admin';
        const userKey = Object.keys(DEMO_MOCK_USERS).find(k => DEMO_MOCK_USERS[k].role === role) || 'admin@demo.com';
        resolve({ data: { success: true, data: { user: DEMO_MOCK_USERS[userKey] } } });
      } else {
        resolve({ data: { success: true, data: {} } });
      }
    }, 350);
  });
}

function mockApiPost(path, payload) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (path.includes('/auth/login')) {
        const user = DEMO_MOCK_USERS[payload.email] || DEMO_MOCK_USERS['admin@demo.com'];
        resolve({ data: { success: true, data: { token: 'demo-token', user } } });
      } else {
        resolve({ data: { success: true, data: {} } });
      }
    }, 350);
  });
}

const AuthContext = createContext(null);

export function normalizeRole(value) {
  if (value == null || value === '') return null;
  return String(value).trim().toLowerCase();
}

// Simplified for Demo: Read directly from localStorage
function getInitialUser() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('userName');
  
  if (token && role) {
    return { role: normalizeRole(role), name: name || 'Demo User' };
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);

  // Simplified Demo Session Init (UI-only)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Simulate "Checking Session" in Demo mode using local mock
    mockApiGet('/auth/me').then((res) => {
      if (res.data.success && res.data.data?.user) {
        const u = res.data.data.user;
        setUser({ role: normalizeRole(u.role), name: u.name });
      }
    });
  }, []);

  const login = async (email, password) => {
    try {
      const response = await mockApiPost('/auth/login', { email, password });
      if (response.data.success) {
        const { user: mockUser, token } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', mockUser.role);
        localStorage.setItem('userName', mockUser.name);

        setUser({ role: normalizeRole(mockUser.role), name: mockUser.name });
        return { success: true, role: mockUser.role };
      }
      return { success: false, message: 'Identity verification failed.' };
    } catch (error) {
      return { success: false, message: 'Demo system encountered an error.' };
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const register = async (userData) => {
    // Demo registration is always successful
    return { success: true, message: 'Demo account registered successfully.' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
