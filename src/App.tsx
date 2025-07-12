import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthForm } from './components/Auth/AuthForm';
import { Header } from './components/Dashboard/Header';
import { Dashboard } from './components/Dashboard/Dashboard';
import { WinningGames } from './components/WinningGames/WinningGames';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'winning-games'>('dashboard');

  useEffect(() => {
    if (!isLoading && !user) {
      setShowAuth(true);
    } else if (user) {
      setShowAuth(false);
    }
  }, [user, isLoading]);

  // Simular navegação simples
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path.includes('winning-games')) {
        setCurrentView('winning-games');
      } else {
        setCurrentView('dashboard');
      }
    };

    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    
    // Interceptar cliques nos links
    const handleLinkClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('winning-games')) {
        e.preventDefault();
        window.history.pushState({}, '', '/winning-games');
        setCurrentView('winning-games');
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
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
        {currentView === 'dashboard' ? <Dashboard /> : <WinningGames />}
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