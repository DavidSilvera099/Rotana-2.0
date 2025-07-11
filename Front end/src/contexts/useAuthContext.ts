import { useContext } from 'react';
import { AuthContext } from './AuthContextDef';

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('Contexto de autenticación no definido');
  }
  return context;
}; 