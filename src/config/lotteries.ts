import { LotteryConfig, LotteryType } from '../types';

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  megasena: {
    name: 'Mega-Sena',
    minNumbers: 6,
    maxNumbers: 15,
    range: 60,
    icon: '💰'
  },
  quina: {
    name: 'Quina',
    minNumbers: 5,
    maxNumbers: 15,
    range: 80,
    icon: '🎯'
  },
  lotofacil: {
    name: 'Lotofácil',
    minNumbers: 15,
    maxNumbers: 15,
    range: 25,
    icon: '🍀'
  },
  lotomania: {
    name: 'Lotomania',
    minNumbers: 50,
    maxNumbers: 50,
    range: 100,
    icon: '🎰'
  },
  timemania: {
    name: 'Timemania',
    minNumbers: 10,
    maxNumbers: 10,
    range: 80,
    icon: '⚽'
  },
  duplasena: {
    name: 'Dupla Sena',
    minNumbers: 6,
    maxNumbers: 15,
    range: 50,
    icon: '🎲'
  },
  milionaria: {
    name: '+Milionária',
    minNumbers: 6,
    maxNumbers: 12,
    range: 50,
    icon: '💎'
  }
};