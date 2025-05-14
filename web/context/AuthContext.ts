// context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {


  return (
    <AuthContext.Provider value={{
        
     }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
