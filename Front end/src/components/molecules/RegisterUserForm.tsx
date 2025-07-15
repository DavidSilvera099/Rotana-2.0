import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { secondaryAuth } from '../../config/firebase/firebaseSecondaryAuth';
import { db } from '../../config/firebase/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface RegisterUserFormProps {
  onUserCreated?: () => void;
}

const RegisterUserForm: React.FC<RegisterUserFormProps> = ({ onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      // Validar que el correo no exista en la colección 'users'
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('Ya existe un usuario registrado con ese correo');
        setLoading(false);
        return;
      }
      // Crear usuario en Firebase Auth usando secondaryAuth
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        email,
        password
      );
      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        role
      });
      setSuccess('Usuario creado exitosamente');
      setName('');
      setEmail('');
      setPassword('');
      setRole('user');
      onUserCreated?.();
    } catch (err: any) {
      setError(err.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrar nuevo usuario</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          type="text"
          value={name}
          onChange={setName}
        />
        <Input
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={setEmail}
        />
        <Input
          label="Contraseña"
          type="password"
          value={password}
          onChange={setPassword}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as 'user' | 'admin')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">{success}</div>}
        <Button
          text={loading ? 'Registrando...' : 'Registrar usuario'}
          type="primary"
          buttonType="submit"
          disabled={loading}
        />
      </form>
    </div>
  );
};

export default RegisterUserForm; 