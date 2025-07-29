import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { User } from '../types';
import { StripeCheckout } from './StripeCheckout';

interface CreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (amount: number) => void;
  user: User;
}

export const CreditModal: React.FC<CreditModalProps> = ({ 
  isOpen, 
  onClose, 
  onPurchase, 
  user 
}) => {
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [showStripeCheckout, setShowStripeCheckout] = useState(false);
  const [error, setError] = useState<string>('');

  const predefinedAmounts = [50, 100, 200, 500, 1000];

  const handleProceedToPayment = () => {
    const finalAmount = isCustom ? parseFloat(customAmount) : amount;
    if (finalAmount <= 0) {
      setError('Digite um valor válido');
      return;
    }
    setError('');
    setShowStripeCheckout(true);
  };

  const handlePaymentSuccess = (paidAmount: number) => {
    onPurchase(paidAmount);
    onClose();
    resetForm();
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setShowStripeCheckout(false);
  };

  const handlePaymentCancel = () => {
    setShowStripeCheckout(false);
  };

  const resetForm = () => {
    setCustomAmount('');
    setIsCustom(false);
    setAmount(50);
    setShowStripeCheckout(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-md shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
            OBTER CRÉDITOS
          </h2>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!showStripeCheckout ? (
          <>
            <div className="mb-6">
              <p className="font-medium text-cyan-300 tracking-wide mb-4">ESCOLHA O VALOR:</p>
              
              <div className="grid grid-cols-2 gap-2">
                {predefinedAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setAmount(value);
                      setIsCustom(false);
                      setError('');
                    }}
                    className={`p-3 rounded-md border-2 transition-colors ${
                      !isCustom && amount === value
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 neon-glow'
                        : 'border-cyan-500/30 hover:border-cyan-400 text-cyan-400 bg-slate-700/30'
                    }`}
                  >
                    R$ {value}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsCustom(true);
                    setError('');
                  }}
                  className={`w-full p-3 rounded-md border-2 transition-colors ${
                    isCustom
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300 neon-glow'
                      : 'border-cyan-500/30 hover:border-cyan-400 text-cyan-400 bg-slate-700/30'
                  }`}
                >
                  VALOR PERSONALIZADO
                </button>
                
                {isCustom && (
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setError('');
                    }}
                    placeholder="Digite o valor"
                    className="w-full mt-2 px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 backdrop-blur-sm"
                    min="1"
                    step="0.01"
                  />
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-400/30 p-4 rounded-md mb-6 backdrop-blur-sm">
              <p className="text-sm text-cyan-300 font-medium">
                <strong>Valor a pagar:</strong> R$ {isCustom ? (customAmount || '0') : amount}
              </p>
              <p className="text-sm text-purple-300 mt-1">
                Você receberá créditos equivalentes ao valor pago (1:1) ⚡
              </p>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-md mb-4 backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <button
              onClick={handleProceedToPayment}
              disabled={isCustom && (!customAmount || parseFloat(customAmount) <= 0)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-md hover:from-green-400 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wide shadow-lg shadow-green-500/25"
            >
              <CreditCard size={20} />
              PROSSEGUIR PARA PAGAMENTO
            </button>
          </>
        ) : (
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2 tracking-wide">
                FINALIZAR PAGAMENTO
              </h3>
              <p className="text-cyan-300">Pagamento seguro via Stripe</p>
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded-md mb-4 backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <StripeCheckout
              amount={isCustom ? parseFloat(customAmount) : amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handlePaymentCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};