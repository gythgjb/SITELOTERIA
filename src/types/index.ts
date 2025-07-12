export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LotteryGame {
  id: string;
  userId: string;
  modalidade: LotteryType;
  numbers: number[];
  createdAt: string;
  isFavorite: boolean;
  isManual: boolean;
}

export type LotteryType = 'megasena' | 'quina' | 'lotofacil' | 'lotomania' | 'timemania' | 'duplasena' | 'federal';

export interface LotteryConfig {
  name: string;
  minNumbers: number;
  maxNumbers: number;
  range: number;
  icon: string;
}

export interface GameStatistics {
  totalGames: number;
  favoriteNumbers: number[];
  neverDrawn: number[];
  evenCount: number;
  oddCount: number;
  frequency: Record<number, number>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}