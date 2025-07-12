import { LotteryGame, LotteryType, GameStatistics } from '../types';
import { LOTTERY_CONFIGS } from '../config/lotteries';

const GAMES_KEY = 'lotemax_games';

export const gameService = {
  getUserGames: (userId: string): LotteryGame[] => {
    const games = JSON.parse(localStorage.getItem(GAMES_KEY) || '[]');
    return games.filter((game: LotteryGame) => game.userId === userId);
  },

  saveGame: (game: Omit<LotteryGame, 'id' | 'createdAt'>): LotteryGame => {
    const games = JSON.parse(localStorage.getItem(GAMES_KEY) || '[]');
    const newGame: LotteryGame = {
      ...game,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    games.push(newGame);
    localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    
    return newGame;
  },

  updateGame: (gameId: string, updates: Partial<LotteryGame>): void => {
    const games = JSON.parse(localStorage.getItem(GAMES_KEY) || '[]');
    const index = games.findIndex((game: LotteryGame) => game.id === gameId);
    
    if (index !== -1) {
      games[index] = { ...games[index], ...updates };
      localStorage.setItem(GAMES_KEY, JSON.stringify(games));
    }
  },

  deleteGame: (gameId: string): void => {
    const games = JSON.parse(localStorage.getItem(GAMES_KEY) || '[]');
    const filteredGames = games.filter((game: LotteryGame) => game.id !== gameId);
    localStorage.setItem(GAMES_KEY, JSON.stringify(filteredGames));
  },

  generateRandomNumbers: (modalidade: LotteryType, count: number): number[] => {
    const config = LOTTERY_CONFIGS[modalidade];
    const numbers: number[] = [];
    
    if (modalidade === 'federal') {
      // Federal lottery uses different logic
      return [Math.floor(Math.random() * config.range)];
    }
    
    while (numbers.length < count) {
      const num = Math.floor(Math.random() * config.range) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    return numbers.sort((a, b) => a - b);
  },

  getGameStatistics: (userId: string, modalidade: LotteryType): GameStatistics => {
    const games = this.getUserGames(userId).filter(game => game.modalidade === modalidade);
    const config = LOTTERY_CONFIGS[modalidade];
    
    const frequency: Record<number, number> = {};
    let evenCount = 0;
    let oddCount = 0;
    
    games.forEach(game => {
      game.numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (num % 2 === 0) evenCount++;
        else oddCount++;
      });
    });
    
    const allNumbers = Array.from({ length: config.range }, (_, i) => i + 1);
    const drawnNumbers = Object.keys(frequency).map(Number);
    const neverDrawn = allNumbers.filter(num => !drawnNumbers.includes(num));
    
    const favoriteNumbers = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([num]) => Number(num));
    
    return {
      totalGames: games.length,
      favoriteNumbers,
      neverDrawn: neverDrawn.slice(0, 20),
      evenCount,
      oddCount,
      frequency
    };
  }
};