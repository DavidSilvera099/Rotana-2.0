import React, { useState } from 'react';
import Input from '../atoms/Input';
import Spinner from '../atoms/Spinner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { AuthError } from 'firebase/auth';
import { auth } from '../../config/firebase/firebase';

interface LoginFormProps {
  title: string;
  subtitle: string;
  onLoginSuccess?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({title, subtitle, onLoginSuccess}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess?.();
    } catch (error) {
      const authError = error as AuthError;
      let errorMessage = 'Credenciales incorrectas';
      
      switch (authError.code) {
        case 'auth/user-not-found':
          errorMessage = 'No se encontró una cuenta con esta dirección de email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email o contraseña incorrectos';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Dirección de email inválida';
          break;
        default:
          errorMessage = 'Credenciales incorrectas';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error) setError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (error) setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
      <div>
        <h1 className='text-colorLogo text-sm'>{title}</h1>
        <p className='text-colorLogo text-4xl'>{subtitle}</p>
      </div>
      <Input 
        label="Email" 
        type="email" 
        value={email}
        onChange={handleEmailChange}
      />
      <Input 
        label="Password" 
        type="password" 
        value={password}
        onChange={handlePasswordChange}
      />
      {error && (
        <div className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-md p-3">
          {error}
        </div>
      )}
      <button 
        type="submit"

        disabled={!email || !password || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <Spinner size="sm" color="white" className="mr-2" />
            Cargando...
          </div>
        ) : (
          'Iniciar sesión'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
