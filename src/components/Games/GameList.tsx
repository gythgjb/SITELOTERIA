import React, { useState } from 'react';
import { Heart, Trash2, Copy, Download, MoreVertical } from 'lucide-react';
import { LotteryGame } from '../../types';
import { gameService } from '../../services/gameService';

interface GameListProps {
  games: LotteryGame[];
  onGameUpdated: () => void;
  onGameDeleted: (gameId: string) => void;
}

export const GameList: React.FC<GameListProps> = ({ games, onGameUpdated, onGameDeleted }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleFavorite = (game: LotteryGame) => {
    gameService.updateGame(game.id, { isFavorite: !game.isFavorite });
    onGameUpdated();
  };

  const deleteGame = (gameId: string) => {
    if (confirm('Tem certeza que deseja excluir este jogo?')) {
      gameService.deleteGame(gameId);
      onGameDeleted(gameId);
    }
  };

  const copyNumbers = (numbers: number[]) => {
    navigator.clipboard.writeText(numbers.join(', '));
    alert('Números copiados para a área de transferência!');
  };

  const exportGame = (game: LotteryGame) => {
    const text = `${game.modalidade.toUpperCase()}\nNúmeros: ${game.numbers.join(', ')}\nCriado em: ${new Date(game.createdAt).toLocaleDateString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lotemax-${game.modalidade}-${game.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🎲</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum jogo salvo</h3>
        <p className="text-gray-600">Crie seu primeiro jogo clicando no botão "Novo Jogo"</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                {new Date(game.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center space-x-2">
                {game.isManual ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    Manual
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Automático
                  </span>
                )}
                {game.isFavorite && (
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                )}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveMenu(activeMenu === game.id ? null : game.id)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {activeMenu === game.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      toggleFavorite(game);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-4 w-4 ${game.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    <span>{game.isFavorite ? 'Remover favorito' : 'Favoritar'}</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      copyNumbers(game.numbers);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-400" />
                    <span>Copiar números</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      exportGame(game);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 text-gray-400" />
                    <span>Exportar</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      deleteGame(game.id);
                      setActiveMenu(null);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Excluir</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {game.numbers.map((number, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};