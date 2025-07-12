import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎲</div>
            <h1 className="text-xl font-bold text-gray-900">Lotemax</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="hidden sm:block">{user?.name}</span>
            </div>
            
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:block">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};