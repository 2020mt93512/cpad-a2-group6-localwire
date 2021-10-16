import * as firebaseAuth from '@firebase/auth';
import type { User } from '@firebase/auth';
import React from 'react';

type AuthContextType = {
  loading: boolean;
  isLoggedIn: boolean;
  user?: User;
};

export const AuthContext = React.createContext<AuthContextType>({ loading: true, isLoggedIn: false });

const AuthProvider: React.FC = ({ children }) => {
  const [auth, setAuth] = React.useState<AuthContextType>({ loading: true, isLoggedIn: false });

  React.useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      firebaseAuth.getAuth(),
      (user) => {
        if (user) {
          setAuth({ loading: false, isLoggedIn: true, user });
        } else {
          setAuth({ loading: false, isLoggedIn: false, user: undefined });
        }
      },
      (err) => {
        console.error(err);
        setAuth({ loading: false, isLoggedIn: false, user: undefined });
      }
    );

    return () => {
      unsubscribe();
      setAuth({ loading: false, isLoggedIn: false, user: undefined });
    };
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
