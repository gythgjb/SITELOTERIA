import React, { useState, useMemo } from 'react';
import { ArrowLeft, Plus, BarChart3 } from 'lucide-react';
import { LotteryType, LotteryGame } from '../../types';
import { LOTTERY_CONFIGS } from '../../config/lotteries';
import { gameService } from '../../services/gameService';
import { useAuth } from '../../contexts/AuthContext';
import { GameCreator } from './GameCreator';
import { GameList } from './GameList';
import { GameStatistics } from './GameStatistics';

interface GameManagerProps {
  lottery: LotteryType;
  onBack: () => void;
}

export const GameManager: React.FC<GameManagerProps> = ({ lottery, onBack }) => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'statistics'>('list');
  const [games, setGames] = useState<LotteryGame[]>([]);

  const config = LOTTERY_CONFIGS[lottery];

  const refreshGames = useMemo(() => {
    if (user) {
      const userGames = gameService.getUserGames(user.id).filter(game => game.modalidade === lottery);
      setGames(userGames);
    }
  }, [user, lottery]);

  React.useEffect(() => {
    refreshGames;
  }, [refreshGames]);

  const handleGameCreated = (newGame: LotteryGame) => {
    setGames(prev => [newGame, ...prev]);
    setCurrentView('list');
  };

  const handleGameUpdated = () => {
    refreshGames;
  };

  const handleGameDeleted = (gameId: string) => {
    setGames(prev => prev.filter(game => game.id !== gameId));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar</span>
          </button>
          <div className="text-2xl">{config.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{config.name}</h2>
            <p className="text-gray-600">{games.length} jogos salvos</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setCurrentView('statistics')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'statistics'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Estatísticas</span>
          </button>
          
          <button
            onClick={() => setCurrentView('create')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'create'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Novo Jogo</span>
          </button>
        </div>
      </div>

      {currentView === 'create' && (
        <GameCreator
          lottery={lottery}
          onGameCreated={handleGameCreated}
          onCancel={() => setCurrentView('list')}
        />
      )}

      {currentView === 'list' && (
        <GameList
          games={games}
          onGameUpdated={handleGameUpdated}
          onGameDeleted={handleGameDeleted}
        />
      )}

      {currentView === 'statistics' && user && (
        <GameStatistics
          lottery={lottery}
          userId={user.id}
        />
      )}
    </div>
  );
};