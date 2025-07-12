import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Calendar, Star, Award, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { gameService } from '../../services/gameService';
import { winningService, WinningMatch, WinningStats } from '../../services/winningService';
import { LOTTERY_CONFIGS } from '../../config/lotteries';
import { LotteryType } from '../../types';

export const WinningGames: React.FC = () => {
  const { user } = useAuth();
  const [winningMatches, setWinningMatches] = useState<WinningMatch[]>([]);
  const [stats, setStats] = useState<WinningStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLottery, setSelectedLottery] = useState<LotteryType | 'all'>('all');

  useEffect(() => {
    if (user) {
      checkWinningGames();
    }
  }, [user]);

  const checkWinningGames = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const games = gameService.getUserGames(user.id);
      const matches = await winningService.checkWinningGames(games);
      const gameStats = await winningService.getWinningStats(games);
      
      setWinningMatches(matches);
      setStats(gameStats);
    } catch (error) {
      console.error('Erro ao verificar jogos vencedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = selectedLottery === 'all' 
    ? winningMatches 
    : winningMatches.filter(match => match.game.modalidade === selectedLottery);

  const winners = filteredMatches.filter(match => match.isWinner);
  const lotteryTypes = [...new Set(winningMatches.map(match => match.game.modalidade))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Trophy className="h-12 w-12 text-yellow-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando seus jogos vencedores...</p>
        </div>
      </div>
    );
  }

  if (!stats || winningMatches.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum jogo para verificar</h2>
            <p className="text-gray-600 mb-6">Crie alguns jogos primeiro para verificar se você ganhou!</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Jogos Vencedores</h1>
          </div>
          <p className="text-gray-600">Verifique se seus jogos foram premiados nos últimos sorteios</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total de Jogos</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalGames}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Vencedores</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.totalWinners}</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Taxa de Acerto</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.winningPercentage.toFixed(1)}%</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-gray-600">Melhor Jogo</span>
            </div>
            <div className="text-lg font-bold text-yellow-600">
              {stats.bestMatch ? `${stats.bestMatch.matchCount} acertos` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedLottery('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedLottery === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todas ({winningMatches.length})
            </button>
            {lotteryTypes.map(type => {
              const count = winningMatches.filter(m => m.game.modalidade === type).length;
              const config = LOTTERY_CONFIGS[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedLottery(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedLottery === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{config.icon}</span>
                  <span>{config.name} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Winners Section */}
        {winners.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center space-x-2">
              <Award className="h-6 w-6" />
              <span>🎉 Parabéns! Você tem {winners.length} jogo(s) premiado(s)!</span>
            </h3>
            <div className="space-y-4">
              {winners.map((match, index) => (
                <WinningCard key={`winner-${index}`} match={match} isWinner={true} />
              ))}
            </div>
          </div>
        )}

        {/* All Games Results */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Todos os Resultados ({filteredMatches.length})
          </h3>
          <div className="space-y-4">
            {filteredMatches.map((match, index) => (
              <WinningCard key={`match-${index}`} match={match} isWinner={match.isWinner} />
            ))}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={checkWinningGames}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Verificar Novamente'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface WinningCardProps {
  match: WinningMatch;
  isWinner: boolean;
}

const WinningCard: React.FC<WinningCardProps> = ({ match, isWinner }) => {
  const config = LOTTERY_CONFIGS[match.game.modalidade];
  
  return (
    <div className={`bg-white rounded-xl p-4 md:p-6 shadow-sm border-2 transition-all ${
      isWinner 
        ? 'border-green-200 bg-green-50' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center space-x-3 mb-2 md:mb-0">
          <span className="text-2xl">{config.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{config.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date(match.game.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>•</span>
              <span>Concurso {match.result.concurso}</span>
            </div>
          </div>
        </div>
        
        {isWinner && (
          <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">PREMIADO!</span>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h5 className="text-sm font-medium text-gray-600 mb-2">Seus números:</h5>
          <div className="flex flex-wrap gap-1">
            {match.game.numbers.map(number => (
              <span
                key={number}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  match.matchedNumbers.includes(number)
                    ? 'bg-green-100 text-green-800 ring-2 ring-green-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {number}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h5 className="text-sm font-medium text-gray-600 mb-2">Números sorteados:</h5>
          <div className="flex flex-wrap gap-1">
            {match.result.numeros.slice(0, 10).map(number => (
              <span
                key={number}
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  match.matchedNumbers.includes(number)
                    ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {number}
              </span>
            ))}
            {match.result.numeros.length > 10 && (
              <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                +{match.result.numeros.length - 10}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-2 md:mb-0">
            <span className="text-lg font-bold text-gray-900">
              {match.matchCount} acerto{match.matchCount !== 1 ? 's' : ''}
            </span>
            <span className="text-sm text-gray-500 ml-2">({match.prizeCategory})</span>
          </div>
          
          <div className="text-right">
            <div className={`text-sm font-medium ${
              isWinner ? 'text-green-600' : 'text-gray-500'
            }`}>
              {match.estimatedPrize}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};