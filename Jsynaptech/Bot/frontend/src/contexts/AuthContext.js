import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalar jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Comprobar si el token ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ 
            id: decoded.id,
            name: decoded.name,
            role: decoded.role,
            tenantId: decoded.tenantId
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error decodificando el token:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ 
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
      tenantId: decoded.tenantId
    });
    return decoded;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
