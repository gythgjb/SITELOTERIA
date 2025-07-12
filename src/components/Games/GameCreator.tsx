import React, { useState } from 'react';
import { Shuffle, Save, X } from 'lucide-react';
import { LotteryType, LotteryGame } from '../../types';
import { LOTTERY_CONFIGS } from '../../config/lotteries';
import { gameService } from '../../services/gameService';
import { useAuth } from '../../contexts/AuthContext';

interface GameCreatorProps {
  lottery: LotteryType;
  onGameCreated: (game: LotteryGame) => void;
  onCancel: () => void;
}

export const GameCreator: React.FC<GameCreatorProps> = ({ lottery, onGameCreated, onCancel }) => {
  const { user } = useAuth();
  const config = LOTTERY_CONFIGS[lottery];
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isManual, setIsManual] = useState(true);

  const maxSelectable = lottery === 'lotofacil' ? 15 : config.maxNumbers;
  const minSelectable = lottery === 'lotofacil' ? 15 : config.minNumbers;

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(prev => prev.filter(n => n !== number));
    } else if (selectedNumbers.length < maxSelectable) {
      setSelectedNumbers(prev => [...prev, number].sort((a, b) => a - b));
    }
  };

  const generateRandomGame = () => {
    const count = lottery === 'lotofacil' ? 15 : config.minNumbers;
    const numbers = gameService.generateRandomNumbers(lottery, count);
    setSelectedNumbers(numbers);
    setIsManual(false);
  };

  const saveGame = () => {
    if (!user || selectedNumbers.length < minSelectable) return;

    const game = gameService.saveGame({
      userId: user.id,
      modalidade: lottery,
      numbers: selectedNumbers,
      isFavorite: false,
      isManual
    });

    onGameCreated(game);
  };

  const canSave = selectedNumbers.length >= minSelectable && 
                  (lottery !== 'lotofacil' || selectedNumbers.length === 15);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Criar Novo Jogo</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={generateRandomGame}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Shuffle className="h-4 w-4" />
            <span>Gerar Aleatório</span>
          </button>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Selecione {lottery === 'lotofacil' ? '15 números' : `${minSelectable}-${maxSelectable} números`}
          </div>
          <div className="text-sm font-medium text-blue-600">
            {selectedNumbers.length} selecionados
          </div>
        </div>

        {lottery === 'federal' ? (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Digite o número (0-99999)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => {
                const value = parseInt(e.target.value);
                if (!isNaN(value) && value >= 0 && value <= 99999) {
                  setSelectedNumbers([value]);
                }
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-8 sm:grid-cols-10 gap-2">
            {Array.from({ length: config.range }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => toggleNumber(number)}
                disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= maxSelectable}
                className={`
                  h-10 w-10 rounded-lg text-sm font-medium transition-all
                  ${selectedNumbers.includes(number)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                  ${!selectedNumbers.includes(number) && selectedNumbers.length >= maxSelectable
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                  }
                `}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedNumbers.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900 mb-2">Números selecionados:</div>
          <div className="flex flex-wrap gap-2">
            {selectedNumbers.map(number => (
              <span
                key={number}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
              >
                {number}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={saveGame}
          disabled={!canSave}
          className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="h-4 w-4" />
          <span>Salvar Jogo</span>
        </button>
      </div>
    </div>
  );
};