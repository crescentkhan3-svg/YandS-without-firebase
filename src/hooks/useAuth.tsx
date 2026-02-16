import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    const saved = localStorage.getItem('demo_user');
    return saved ? JSON.parse(saved) : { email: 'demo@example.com', uid: 'demo-uid' };
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    const userData = { email, uid: 'demo-uid' };
    setUser(userData);
    localStorage.setItem('demo_user', JSON.stringify(userData));
    return { user: userData };
  };

  const signUp = async (email: string, password: string) => {
    const userData = { email, uid: 'demo-uid' };
    setUser(userData);
    localStorage.setItem('demo_user', JSON.stringify(userData));
    return { user: userData };
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('demo_user');
  };

  const resetPassword = async (email: string) => {
    console.log('Password reset for:', email);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
