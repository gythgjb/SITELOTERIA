import React, { useState, useMemo } from 'react';
import { LotteryType } from '../../types';
import { LOTTERY_CONFIGS } from '../../config/lotteries';
import { gameService } from '../../services/gameService';
import { useAuth } from '../../contexts/AuthContext';
import { LotteryCard } from './LotteryCard';
import { LotteryResults } from './LotteryResults';
import { GameManager } from '../Games/GameManager';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedLottery, setSelectedLottery] = useState<LotteryType | null>(null);

  const gameCounts = useMemo(() => {
    if (!user) return {};
    
    const games = gameService.getUserGames(user.id);
    const counts: Record<LotteryType, number> = {} as any;
    
    Object.keys(LOTTERY_CONFIGS).forEach(type => {
      counts[type as LotteryType] = games.filter(game => game.modalidade === type).length;
    });
    
    return counts;
  }, [user]);

  if (selectedLottery) {
    return (
      <GameManager
        lottery={selectedLottery}
        onBack={() => setSelectedLottery(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Últimos Resultados */}
      <div className="mb-8">
        <LotteryResults />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Suas Loterias</h2>
        <p className="text-gray-600">Selecione uma modalidade para gerenciar seus jogos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Object.keys(LOTTERY_CONFIGS).map(type => (
          <LotteryCard
            key={type}
            type={type as LotteryType}
            gameCount={gameCounts[type as LotteryType] || 0}
            onClick={() => setSelectedLottery(type as LotteryType)}
          />
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Bem-vindo ao Lotemax!</h3>
        <div className="grid md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h4 className="font-medium mb-2">✨ Recursos Principais</h4>
            <ul className="space-y-1 text-sm">
              <li>• Jogos ilimitados para todas as modalidades</li>
              <li>• Geração automática e manual de números</li>
              <li>• Estatísticas detalhadas dos seus jogos</li>
              <li>• Sincronização automática na nuvem</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">🎯 Como usar</h4>
            <ul className="space-y-1 text-sm">
              <li>• Clique em uma modalidade para começar</li>
              <li>• Crie jogos manualmente ou use o gerador</li>
              <li>• Favorite seus jogos preferidos</li>
              <li>• Acompanhe suas estatísticas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};