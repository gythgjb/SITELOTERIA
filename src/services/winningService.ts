import { LotteryGame, LotteryType } from '../types';
import { lotteryResultsService, LotteryResult } from './lotteryResultsService';
import { LOTTERY_CONFIGS } from '../config/lotteries';

export interface WinningMatch {
  game: LotteryGame;
  result: LotteryResult;
  matchedNumbers: number[];
  matchCount: number;
  prizeCategory: string;
  estimatedPrize: string;
  isWinner: boolean;
}

export interface WinningStats {
  totalGames: number;
  totalWinners: number;
  totalPrizeValue: number;
  winningPercentage: number;
  bestMatch: WinningMatch | null;
}

class WinningService {
  private readonly PRIZE_CATEGORIES = {
    megasena: {
      6: { name: 'Sena', prize: 'Prêmio Principal' },
      5: { name: 'Quina', prize: 'R$ 50.000,00' },
      4: { name: 'Quadra', prize: 'R$ 1.000,00' }
    },
    quina: {
      5: { name: 'Quina', prize: 'Prêmio Principal' },
      4: { name: 'Quadra', prize: 'R$ 8.000,00' },
      3: { name: 'Terno', prize: 'R$ 120,00' },
      2: { name: 'Duque', prize: 'R$ 3,50' }
    },
    lotofacil: {
      15: { name: '15 acertos', prize: 'Prêmio Principal' },
      14: { name: '14 acertos', prize: 'R$ 1.500,00' },
      13: { name: '13 acertos', prize: 'R$ 25,00' },
      12: { name: '12 acertos', prize: 'R$ 10,00' },
      11: { name: '11 acertos', prize: 'R$ 5,00' }
    },
    lotomania: {
      20: { name: '20 acertos', prize: 'Prêmio Principal' },
      19: { name: '19 acertos', prize: 'R$ 15.000,00' },
      18: { name: '18 acertos', prize: 'R$ 300,00' },
      17: { name: '17 acertos', prize: 'R$ 20,00' },
      16: { name: '16 acertos', prize: 'R$ 8,00' },
      0: { name: '0 acertos', prize: 'R$ 8,00' }
    },
    timemania: {
      7: { name: '7 acertos', prize: 'Prêmio Principal' },
      6: { name: '6 acertos', prize: 'R$ 8.000,00' },
      5: { name: '5 acertos', prize: 'R$ 300,00' },
      4: { name: '4 acertos', prize: 'R$ 10,50' },
      3: { name: '3 acertos', prize: 'R$ 3,50' }
    },
    duplasena: {
      6: { name: 'Sena', prize: 'Prêmio Principal' },
      5: { name: 'Quina', prize: 'R$ 15.000,00' },
      4: { name: 'Quadra', prize: 'R$ 500,00' },
      3: { name: 'Terno', prize: 'R$ 5,00' }
    },
    milionaria: {
      6: { name: '6 + 2 trevos', prize: 'Prêmio Principal' },
      5: { name: '5 + 2 trevos', prize: 'R$ 50.000,00' },
      4: { name: '4 + 2 trevos', prize: 'R$ 1.000,00' },
      3: { name: '3 + 2 trevos', prize: 'R$ 50,00' },
      2: { name: '2 + 2 trevos', prize: 'R$ 6,00' }
    }
  };

  async checkWinningGames(games: LotteryGame[]): Promise<WinningMatch[]> {
    const results = await lotteryResultsService.getAllLatestResults();
    const winningMatches: WinningMatch[] = [];

    for (const game of games) {
      const result = results.find(r => r.modalidade === game.modalidade);
      if (!result) continue;

      const match = this.checkGameMatch(game, result);
      if (match) {
        winningMatches.push(match);
      }
    }

    return winningMatches.sort((a, b) => b.matchCount - a.matchCount);
  }

  private checkGameMatch(game: LotteryGame, result: LotteryResult): WinningMatch | null {
    const matchedNumbers = game.numbers.filter(num => result.numeros.includes(num));
    const matchCount = matchedNumbers.length;
    
    const prizeInfo = this.getPrizeInfo(game.modalidade, matchCount);
    const isWinner = prizeInfo !== null;

    return {
      game,
      result,
      matchedNumbers,
      matchCount,
      prizeCategory: prizeInfo?.name || `${matchCount} acertos`,
      estimatedPrize: prizeInfo?.prize || 'Sem premiação',
      isWinner
    };
  }

  private getPrizeInfo(modalidade: LotteryType, matchCount: number) {
    const categories = this.PRIZE_CATEGORIES[modalidade];
    if (!categories) return null;

    return categories[matchCount as keyof typeof categories] || null;
  }

  async getWinningStats(games: LotteryGame[]): Promise<WinningStats> {
    const matches = await this.checkWinningGames(games);
    const winners = matches.filter(m => m.isWinner);
    
    const bestMatch = matches.length > 0 ? matches[0] : null;
    
    return {
      totalGames: games.length,
      totalWinners: winners.length,
      totalPrizeValue: 0, // Seria calculado com valores reais
      winningPercentage: games.length > 0 ? (winners.length / games.length) * 100 : 0,
      bestMatch
    };
  }

  getWinningsByLottery(matches: WinningMatch[]): Record<LotteryType, WinningMatch[]> {
    const grouped: Record<string, WinningMatch[]> = {};
    
    matches.forEach(match => {
      const modalidade = match.game.modalidade;
      if (!grouped[modalidade]) {
        grouped[modalidade] = [];
      }
      grouped[modalidade].push(match);
    });

    return grouped as Record<LotteryType, WinningMatch[]>;
  }
}

export const winningService = new WinningService();