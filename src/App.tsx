import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Dashboard/Header';
import { Dashboard } from './components/Dashboard/Dashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuth(true);
    } else if (user) {
      setShowAuth(false);
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🎲</div>
          <div className="text-lg text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthForm onSuccess={() => setShowAuth(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Dashboard />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;