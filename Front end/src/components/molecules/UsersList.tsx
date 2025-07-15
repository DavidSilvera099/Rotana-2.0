import React, { useEffect, useState } from 'react';
import { db } from '../../config/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  uid: string;
  name: string;
  email: string;
  role: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList: User[] = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        usersList.push({
          uid: data.uid,
          name: data.name,
          email: data.email,
          role: data.role
        });
      });
      setUsers(usersList);
    } catch (err: any) {
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lista de usuarios</h3>
      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : users.length === 0 ? (
        <div>No hay usuarios registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Rol</th>
                <th className="px-4 py-2">UID</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.uid} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.role}</td>
                  <td className="px-4 py-2 font-mono text-xs">{user.uid}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={fetchUsers}
      >
        Actualizar lista
      </button>
    </div>
  );
};

export default UsersList; 