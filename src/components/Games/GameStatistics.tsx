import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { LotteryType } from '../../types';
import { gameService } from '../../services/gameService';

interface GameStatisticsProps {
  lottery: LotteryType;
  userId: string;
}

export const GameStatistics: React.FC<GameStatisticsProps> = ({ lottery, userId }) => {
  const stats = gameService.getGameStatistics(userId, lottery);

  if (stats.totalGames === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sem estatísticas</h3>
        <p className="text-gray-600">Crie alguns jogos para ver as estatísticas</p>
      </div>
    );
  }

  const evenPercentage = Math.round((stats.evenCount / (stats.evenCount + stats.oddCount)) * 100);
  const oddPercentage = 100 - evenPercentage;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Total de Jogos</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <PieChart className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Números Pares</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{evenPercentage}%</div>
          <div className="text-sm text-gray-500">{stats.evenCount} números</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Números Ímpares</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{oddPercentage}%</div>
          <div className="text-sm text-gray-500">{stats.oddCount} números</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Nunca Jogados</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.neverDrawn.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Números Mais Frequentes</h3>
          </div>
          
          <div className="space-y-2">
            {stats.favoriteNumbers.slice(0, 10).map((number, index) => (
              <div key={number} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {number}
                  </div>
                  <span className="text-gray-700">Número {number}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {stats.frequency[number] || 0}x
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Números Nunca Jogados</h3>
          </div>
          
          {stats.neverDrawn.length === 0 ? (
            <p className="text-gray-500">Você já jogou com todos os números!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {stats.neverDrawn.slice(0, 20).map(number => (
                <span
                  key={number}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {number}
                </span>
              ))}
              {stats.neverDrawn.length > 20 && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-full">
                  +{stats.neverDrawn.length - 20} mais
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribuição Par/Ímpar</h3>
        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-green-500 flex items-center justify-center text-white text-sm font-medium"
              style={{ width: `${evenPercentage}%` }}
            >
              {evenPercentage > 15 && `${evenPercentage}% Pares`}
            </div>
            <div 
              className="bg-purple-500 flex items-center justify-center text-white text-sm font-medium"
              style={{ width: `${oddPercentage}%` }}
            >
              {oddPercentage > 15 && `${oddPercentage}% Ímpares`}
            </div>
          </div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Pares: {stats.evenCount}</span>
          <span>Ímpares: {stats.oddCount}</span>
        </div>
      </div>
    </div>
  );
};