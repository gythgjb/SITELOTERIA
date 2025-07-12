import { LotteryType } from '../types';

export interface LotteryResult {
  modalidade: LotteryType;
  concurso: number;
  data: string;
  numeros: number[];
  acumulou: boolean;
  valorPremio?: string;
  proximoConcurso?: number;
  dataProximoConcurso?: string;
}

// URLs das APIs públicas da Caixa
const LOTTERY_APIS = {
  megasena: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/',
  quina: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/quina/',
  lotofacil: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil/',
  lotomania: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/lotomania/',
  timemania: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/timemania/',
  duplasena: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/duplasena/',
  milionaria: 'https://servicebus2.caixa.gov.br/portaldeloterias/api/milionaria/'
};

// Dados mock para fallback quando a API não estiver disponível
const MOCK_RESULTS: Record<LotteryType, LotteryResult> = {
  megasena: {
    modalidade: 'megasena',
    concurso: 2650,
    data: '2024-01-15',
    numeros: [12, 18, 25, 31, 42, 58],
    acumulou: false,
    valorPremio: 'R$ 52.000.000,00',
    proximoConcurso: 2651,
    dataProximoConcurso: '2024-01-17'
  },
  quina: {
    modalidade: 'quina',
    concurso: 6350,
    data: '2024-01-15',
    numeros: [8, 23, 34, 67, 78],
    acumulou: true,
    valorPremio: 'R$ 8.500.000,00',
    proximoConcurso: 6351,
    dataProximoConcurso: '2024-01-16'
  },
  lotofacil: {
    modalidade: 'lotofacil',
    concurso: 2950,
    data: '2024-01-15',
    numeros: [2, 4, 6, 8, 9, 11, 13, 15, 16, 18, 19, 21, 22, 24, 25],
    acumulou: false,
    valorPremio: 'R$ 1.500.000,00',
    proximoConcurso: 2951,
    dataProximoConcurso: '2024-01-16'
  },
  lotomania: {
    modalidade: 'lotomania',
    concurso: 2550,
    data: '2024-01-12',
    numeros: [5, 12, 18, 23, 27, 31, 36, 42, 48, 53, 59, 64, 71, 76, 82, 87, 91, 95, 98, 99],
    acumulou: true,
    valorPremio: 'R$ 3.200.000,00',
    proximoConcurso: 2551,
    dataProximoConcurso: '2024-01-16'
  },
  timemania: {
    modalidade: 'timemania',
    concurso: 2050,
    data: '2024-01-13',
    numeros: [7, 15, 23, 31, 42, 56, 67, 71, 78, 80],
    acumulou: false,
    valorPremio: 'R$ 850.000,00',
    proximoConcurso: 2051,
    dataProximoConcurso: '2024-01-16'
  },
  duplasena: {
    modalidade: 'duplasena',
    concurso: 2450,
    data: '2024-01-13',
    numeros: [8, 15, 22, 31, 38, 47],
    acumulou: true,
    valorPremio: 'R$ 2.100.000,00',
    proximoConcurso: 2451,
    dataProximoConcurso: '2024-01-16'
  },
  milionaria: {
    modalidade: 'milionaria',
    concurso: 150,
    data: '2024-01-13',
    numeros: [3, 12, 18, 25, 31, 42],
    acumulou: true,
    valorPremio: 'R$ 45.000.000,00',
    proximoConcurso: 151,
    dataProximoConcurso: '2024-01-17'
  }
};

class LotteryResultsService {
  private cache: Map<LotteryType, { result: LotteryResult; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

  async getLatestResult(modalidade: LotteryType): Promise<LotteryResult> {
    // Verifica cache primeiro
    const cached = this.cache.get(modalidade);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }

    try {
      // Tenta buscar da API oficial
      const result = await this.fetchFromAPI(modalidade);
      
      // Salva no cache
      this.cache.set(modalidade, {
        result,
        timestamp: Date.now()
      });
      
      return result;
    } catch (error) {
      console.warn(`Erro ao buscar resultado de ${modalidade}:`, error);
      
      // Retorna dados mock em caso de erro
      return MOCK_RESULTS[modalidade];
    }
  }

  async getAllLatestResults(): Promise<LotteryResult[]> {
    const modalidades = Object.keys(LOTTERY_APIS) as LotteryType[];
    const promises = modalidades.map(modalidade => this.getLatestResult(modalidade));
    
    try {
      return await Promise.all(promises);
    } catch (error) {
      console.warn('Erro ao buscar todos os resultados:', error);
      return Object.values(MOCK_RESULTS);
    }
  }

  private async fetchFromAPI(modalidade: LotteryType): Promise<LotteryResult> {
    const url = LOTTERY_APIS[modalidade];
    
    // Usa proxy CORS para contornar limitações de CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const lotteryData = JSON.parse(data.contents);

    return this.parseAPIResponse(modalidade, lotteryData);
  }

  private parseAPIResponse(modalidade: LotteryType, data: any): LotteryResult {
    // Adapta a resposta da API para nosso formato
    const numeros = this.extractNumbers(modalidade, data);
    
    return {
      modalidade,
      concurso: data.numero || data.concurso || 0,
      data: data.dataApuracao || data.data || new Date().toISOString().split('T')[0],
      numeros,
      acumulou: data.acumulou || false,
      valorPremio: data.valorEstimadoProximoConcurso || data.valorPremio || 'Não informado',
      proximoConcurso: data.numeroConcursoProximo || data.proximoConcurso,
      dataProximoConcurso: data.dataProximoConcurso
    };
  }

  private extractNumbers(modalidade: LotteryType, data: any): number[] {
    // Diferentes modalidades podem ter estruturas diferentes na API
    if (data.listaDezenas) {
      return data.listaDezenas.map((n: string) => parseInt(n, 10));
    }
    
    if (data.dezenas) {
      return data.dezenas.map((n: string) => parseInt(n, 10));
    }
    
    if (data.numeros) {
      return data.numeros;
    }

    // Fallback para dados mock
    return MOCK_RESULTS[modalidade].numeros;
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const lotteryResultsService = new LotteryResultsService();