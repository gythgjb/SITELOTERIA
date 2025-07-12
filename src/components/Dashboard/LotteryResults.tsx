import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, Trophy, TrendingUp } from 'lucide-react';
import { LotteryResult } from '../../services/lotteryResultsService';
import { lotteryResultsService } from '../../services/lotteryResultsService';
import { LOTTERY_CONFIGS } from '../../config/lotteries';

export const LotteryResults: React.FC = () => {
  const [results, setResults] = useState<LotteryResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const latestResults = await lotteryResultsService.getAllLatestResults();
      setResults(latestResults);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Erro ao buscar resultados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatPrize = (prize: string) => {
    if (prize.includes('R$')) return prize;
    return `R$ ${prize}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Carregando últimos resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Trophy className="h-6 w-6 text-yellow-600" />
          <h3 className="text-xl font-semibold text-gray-900">Últimos Resultados</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          {lastUpdate && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Atualizado: {lastUpdate.toLocaleTimeString('pt-BR')}</span>
            </div>
          )}
          
          <button
            onClick={fetchResults}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {results.map((result) => {
          const config = LOTTERY_CONFIGS[result.modalidade];
          
          return (
            <div
              key={result.modalidade}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{config.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-900">{config.name}</h4>
                    <p className="text-xs text-gray-500">Concurso {result.concurso}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs text-gray-500">{formatDate(result.data)}</div>
                  {result.acumulou && (
                    <div className="flex items-center space-x-1 text-orange-600">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-xs font-medium">Acumulou</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex flex-wrap gap-1">
                  {result.numeros.slice(0, 10).map((numero, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {numero}
                    </span>
                  ))}
                  {result.numeros.length > 10 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{result.numeros.length - 10}
                    </span>
                  )}
                </div>
              </div>

              {result.valorPremio && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Prêmio:</span> {formatPrize(result.valorPremio)}
                </div>
              )}

              {result.proximoConcurso && result.dataProximoConcurso && (
                <div className="text-xs text-gray-500 mt-1">
                  Próximo: {result.proximoConcurso} - {formatDate(result.dataProximoConcurso)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Resultados obtidos automaticamente. Em caso de divergência, consulte o site oficial da Caixa.
      </div>
    </div>
  );
};