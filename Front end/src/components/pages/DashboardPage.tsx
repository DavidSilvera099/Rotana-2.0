import React from 'react';
import { useAuthContext } from '../../contexts/useAuthContext';
import Button from '../atoms/Button';
import RegisterUserForm from '../molecules/RegisterUserForm';
import UsersList from '../molecules/UsersList';

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Rotana!
          </h1>
          <p className="text-gray-600">
            You have successfully logged in.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            User Information
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.uid}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Lista de usuarios */}
        <UsersList />

        {/* Formulario para registrar usuarios */}
        <div className="mb-6">
          <RegisterUserForm />
        </div>

        <Button 
          text="Logout" 
          type="primary" 
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default DashboardPage; 