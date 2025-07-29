import React, { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { User } from '../types';

interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExchange: (points: number, pixKey: string) => void;
  user: User;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({ 
  isOpen, 
  onClose, 
  onExchange, 
  user 
}) => {
  const [points, setPoints] = useState<string>('');
  const [pixKey, setPixKey] = useState<string>('');
  const [error, setError] = useState<string>('');

  const pointValue = 0.5; // R$ 0,50 por ponto
  const exchangeValue = points ? (parseFloat(points) * pointValue).toFixed(2) : '0.00';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const pointsNum = parseFloat(points);
    
    if (!pointsNum || pointsNum <= 0) {
      setError('Digite uma quantidade válida de pontos');
      return;
    }

    if (pointsNum > user.points) {
      setError('Você não possui pontos suficientes');
      return;
    }

    if (!pixKey.trim()) {
      setError('Digite uma chave Pix válida');
      return;
    }

    onExchange(pointsNum, pixKey.trim());
    onClose();
    setPoints('');
    setPixKey('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Trocar Pontos</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Pontos disponíveis: <span className="font-bold">{user.points}</span>
          </p>
          <p className="text-sm text-blue-600 mb-4">
            Cada ponto vale R$ 0,50
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantos pontos deseja trocar?
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite a quantidade"
              min="1"
              max={user.points}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <div className="flex items-center justify-center">
              <span className="text-lg font-bold text-green-800">
                Você receberá: R$ {exchangeValue}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chave Pix
            </label>
            <input
              type="text"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite sua chave Pix"
            />
            <p className="text-xs text-gray-500 mt-1">
              CPF, e-mail, telefone ou chave aleatória
            </p>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!points || !pixKey.trim() || parseFloat(points) > user.points}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ArrowRightLeft size={20} />
            Solicitar Troca
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Sua solicitação será analisada em até 24 horas
        </p>
      </div>
    </div>
  );
};