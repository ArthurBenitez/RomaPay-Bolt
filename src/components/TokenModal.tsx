import React, { useState } from 'react';
import { X, Coins, Sparkles } from 'lucide-react';
import { User, TokenType, LotteryResult } from '../types';
import { TOKEN_TYPES, getTokenType } from '../utils/tokenData';

interface TokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (tokenType: TokenType, lotteryResult?: LotteryResult) => void;
  user: User;
  allUsers: User[];
}

export const TokenModal: React.FC<TokenModalProps> = ({ 
  isOpen, 
  onClose, 
  onPurchase, 
  user,
  allUsers 
}) => {
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lotteryResult, setLotteryResult] = useState<LotteryResult | null>(null);

  const handleTokenSelect = (token: TokenType) => {
    if (user.credits < token.price) {
      alert('Créditos insuficientes!');
      return;
    }

    setSelectedToken(token);
    
    // Verificar se outros usuários possuem este tipo de token
    const usersWithToken = allUsers.filter(u => 
      u.id !== user.id && 
      u.tokens.some(t => t.id === token.id && t.quantity > 0)
    );

    // SEMPRE executar sorteio se houver usuários com tokens
    if (usersWithToken.length > 0) {
      // Executar sorteio entre usuários que possuem o token
      const randomIndex = Math.floor(Math.random() * usersWithToken.length);
      const winner = usersWithToken[randomIndex];
      
      const result: LotteryResult = {
        winnerId: winner.id,
        winnerName: winner.name,
        tokenType: token.name,
        pointsGained: token.price
      };
      
      setLotteryResult(result);
      console.log(`Sorteio executado! Vencedor: ${winner.name} (${winner.id})`);
    } else {
      // Nenhum usuário possui este token ainda
      setLotteryResult(null);
      console.log('Nenhum usuário possui este token para sorteio');
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
    if (selectedToken) {
      onPurchase(selectedToken, lotteryResult || undefined);
      onClose();
      setShowConfirmation(false);
      setSelectedToken(null);
      setLotteryResult(null);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedToken(null);
    setLotteryResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
            COMPRAR TOKENS
          </h2>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!showConfirmation ? (
          <>
            <div className="mb-6">
              <p className="text-cyan-300 mb-2 text-lg">
                Créditos disponíveis: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">R$ {user.credits.toFixed(2)}</span>
              </p>
              <p className="text-sm text-purple-400 font-medium">
                ⚡ Ao comprar tokens, você ganha 25% de pontos extras!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TOKEN_TYPES.map((token) => (
                <div key={token.id} className="bg-slate-700/30 border border-cyan-500/30 rounded-lg p-4 hover:shadow-lg hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm transform hover:scale-105">
                  <div className={`w-full h-20 rounded-md ${token.color} mb-4 flex items-center justify-center shadow-lg neon-glow`}>
                    <Coins size={32} className="text-white" />
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-cyan-300 tracking-wide">{token.name}</h3>
                  <p className="text-purple-400 mb-3 font-medium">Preço: R$ {token.price}</p>
                  <p className="text-sm text-green-400 mb-4 font-bold">
                    ⚡ Você ganha: {Math.floor(token.price * 1.25)} pontos
                  </p>
                  
                  <button
                    onClick={() => handleTokenSelect(token)}
                    disabled={user.credits < token.price}
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wider shadow-lg shadow-cyan-500/25"
                  >
                    {user.credits >= token.price ? 'COMPRAR' : 'CRÉDITOS INSUFICIENTES'}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className={`w-24 h-24 rounded-full ${selectedToken?.color} mx-auto mb-4 flex items-center justify-center`}>
              <Coins size={40} className="text-white" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
              CONFIRMAR COMPRA
            </h3>
            <p className="text-cyan-300 mb-2">Token: <span className="font-bold text-purple-400">{selectedToken?.name}</span></p>
            <p className="text-cyan-300 mb-2">Preço: <span className="font-bold text-green-400">R$ {selectedToken?.price}</span></p>
            <p className="text-green-400 mb-4 font-bold">
              ⚡ Pontos que você receberá: <span className="text-yellow-400">{selectedToken ? Math.floor(selectedToken.price * 1.25) : 0}</span>
            </p>

            {lotteryResult && (
              <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-400/30 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="text-yellow-400 mr-2" size={20} />
                  <span className="font-bold text-yellow-300 tracking-wide">SORTEIO ATIVO!</span>
                </div>
                <p className="text-sm text-yellow-300 font-medium">
                  🎯 <strong>{lotteryResult.winnerName}</strong> foi sorteado!
                </p>
                <p className="text-xs text-yellow-400 mt-1">
                  Ele perderá 1 {selectedToken?.name} e receberá {lotteryResult.pointsGained} pontos como compensação.
                </p>
              </div>
            )}
            
            {!lotteryResult && (
              <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-400/30 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <div className="flex items-center justify-center mb-2">
                  <Coins className="text-cyan-400 mr-2" size={20} />
                  <span className="font-bold text-cyan-300 tracking-wide">PRIMEIRO TOKEN!</span>
                </div>
                <p className="text-sm text-cyan-300 font-medium">
                  Você será o primeiro a possuir este tipo de token.
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-red-500/50 rounded-md text-red-400 hover:bg-red-500/10 transition-all duration-300 font-medium backdrop-blur-sm"
              >
                CANCELAR
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-md hover:from-green-400 hover:to-emerald-400 transition-all duration-300 font-bold tracking-wide shadow-lg shadow-green-500/25"
              >
                CONFIRMAR COMPRA
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};