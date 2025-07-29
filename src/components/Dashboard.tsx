import React from 'react';
import { User } from '../types';
import { CreditCard, Coins, ArrowRightLeft, Trophy } from 'lucide-react';
import { getTokenType } from '../utils/tokenData';

interface DashboardProps {
  user: User;
  onOpenCreditModal: () => void;
  onOpenTokenModal: () => void;
  onOpenExchangeModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onOpenCreditModal,
  onOpenTokenModal,
  onOpenExchangeModal
}) => {
  return (
    <div className="space-y-8">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 text-white p-6 rounded-lg shadow-lg neon-glow hologram">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 font-medium tracking-wide">CRÉDITOS</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                R$ {user.credits.toFixed(2)}
              </p>
            </div>
            <CreditCard size={40} className="text-cyan-400 pulse-neon" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border border-green-400/30 text-white p-6 rounded-lg shadow-lg neon-glow hologram">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 font-medium tracking-wide">PONTOS</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                {user.points}
              </p>
            </div>
            <Trophy size={40} className="text-green-400 pulse-neon" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-purple-400/30 text-white p-6 rounded-lg shadow-lg neon-glow hologram">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-300 font-medium tracking-wide">TOKENS</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {user.tokens.reduce((sum, token) => sum + token.quantity, 0)}
              </p>
            </div>
            <Coins size={40} className="text-purple-400 pulse-neon" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={onOpenCreditModal}
          className="bg-slate-800/50 backdrop-blur-md border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 transition-all duration-300 p-6 rounded-lg font-bold text-lg tracking-wide transform hover:scale-105 neon-glow"
        >
          OBTER CRÉDITOS
        </button>

        <button
          onClick={onOpenTokenModal}
          className="bg-slate-800/50 backdrop-blur-md border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-300 p-6 rounded-lg font-bold text-lg tracking-wide transform hover:scale-105 neon-glow"
        >
          COMPRAR TOKENS
        </button>

        <button
          onClick={onOpenExchangeModal}
          className="bg-slate-800/50 backdrop-blur-md border-2 border-green-500 text-green-400 hover:bg-green-500/20 hover:text-green-300 transition-all duration-300 p-6 rounded-lg font-bold text-lg tracking-wide transform hover:scale-105 neon-glow"
        >
          TROCAR PONTOS
        </button>
      </div>

      {/* User Tokens */}
      {user.tokens && user.tokens.length > 0 && (
        <div className="bg-slate-800/50 backdrop-blur-md border border-cyan-400/30 rounded-lg shadow-lg p-6 neon-glow">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-6 tracking-wide">
            MEUS TOKENS
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {user.tokens.filter(token => token.quantity > 0).map((token) => {
              const tokenType = getTokenType(token.id);
              return (
                <div key={token.id} className="text-center transform hover:scale-110 transition-all duration-300">
                  <div className={`w-16 h-16 rounded-full ${tokenType?.color || 'bg-gray-400'} mx-auto mb-2 flex items-center justify-center shadow-lg neon-glow`}>
                    <Coins size={24} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-cyan-300">{token.name}</p>
                  <p className="text-xs text-purple-400 font-bold">Qtd: {token.quantity}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};