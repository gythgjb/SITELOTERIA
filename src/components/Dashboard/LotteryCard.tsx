import React from 'react';
import { LotteryType } from '../../types';
import { LOTTERY_CONFIGS } from '../../config/lotteries';

interface LotteryCardProps {
  type: LotteryType;
  gameCount: number;
  onClick: () => void;
}

export const LotteryCard: React.FC<LotteryCardProps> = ({ type, gameCount, onClick }) => {
  const config = LOTTERY_CONFIGS[type];

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 group"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl group-hover:scale-110 transition-transform">
            {config.icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{gameCount}</div>
            <div className="text-xs text-gray-500">jogos</div>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{config.name}</h3>
        
        <div className="text-sm text-gray-600 space-y-1">
          <div>Números: {config.minNumbers === config.maxNumbers ? config.minNumbers : `${config.minNumbers}-${config.maxNumbers}`}</div>
          <div>Faixa: 1-{config.range}</div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
            Gerenciar jogos →
          </span>
        </div>
      </div>
    </div>
  );
};