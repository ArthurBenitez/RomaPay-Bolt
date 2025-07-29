import React, { useState } from 'react';
import { X, Check, XCircle, Clock, Filter, ArrowUpDown } from 'lucide-react';
import { ExchangeRequest, User } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchangeRequests: ExchangeRequest[];
  onApprove: (requestId: string, user: User) => void;
  onDeny: (requestId: string, user: User) => void;
  allUsers: User[];
}

type SortOption = 'newest' | 'oldest' | 'value_high' | 'value_low';
type FilterOption = 'all' | 'pending' | 'approved' | 'denied';

export const AdminModal: React.FC<AdminModalProps> = ({ 
  isOpen, 
  onClose, 
  exchangeRequests,
  onApprove,
  onDeny,
  allUsers
}) => {
  const [filter, setFilter] = useState<FilterOption>('pending');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const getUser = (userId: string) => allUsers.find(u => u.id === userId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="text-green-400" size={20} />;
      case 'denied':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-yellow-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-900/20 text-green-400 border-green-400/30';
      case 'denied':
        return 'bg-red-900/20 text-red-400 border-red-400/30';
      default:
        return 'bg-yellow-900/20 text-yellow-400 border-yellow-400/30';
    }
  };

  const sortedAndFilteredRequests = exchangeRequests
    .filter(req => {
      if (filter === 'all') return true;
      return req.status === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'value_high':
          return b.pixAmount - a.pixAmount;
        case 'value_low':
          return a.pixAmount - b.pixAmount;
        default:
          return 0;
      }
    });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
            PAINEL ADMINISTRATIVO
          </h2>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Filtros e Ordenação */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="text-cyan-400" size={20} />
              <span className="text-cyan-300 font-medium">Filtrar:</span>
              <div className="flex gap-2">
                {[
                  { key: 'pending', label: 'Pendentes' },
                  { key: 'approved', label: 'Aprovadas' },
                  { key: 'denied', label: 'Negadas' },
                  { key: 'all', label: 'Todas' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as FilterOption)}
                    className={`px-3 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
                      filter === key
                        ? 'bg-cyan-500 text-white neon-glow'
                        : 'bg-slate-700/50 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-purple-400" size={20} />
            <span className="text-purple-300 font-medium">Ordenar:</span>
            <div className="flex gap-2">
              {[
                { key: 'newest', label: 'Mais Recente' },
                { key: 'oldest', label: 'Mais Antigo' },
                { key: 'value_high', label: 'Maior Valor' },
                { key: 'value_low', label: 'Menor Valor' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key as SortOption)}
                  className={`px-3 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
                    sortBy === key
                      ? 'bg-purple-500 text-white neon-glow'
                      : 'bg-slate-700/50 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista de Solicitações */}
        {sortedAndFilteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-cyan-400 text-lg font-medium">Nenhuma solicitação encontrada</p>
            <p className="text-cyan-400/70 text-sm mt-2">Tente ajustar os filtros acima</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAndFilteredRequests.map((request) => {
              const user = getUser(request.userId);
              return (
                <div key={request.id} className="bg-slate-700/30 border border-cyan-400/30 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-cyan-300 mb-1">{request.userName}</h3>
                      <p className="text-cyan-400/70">{user?.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(request.status)}`}>
                        {request.status === 'pending' ? 'PENDENTE' : 
                         request.status === 'approved' ? 'APROVADA' : 'NEGADA'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-800/50 p-3 rounded-md border border-cyan-500/20">
                      <p className="text-xs text-cyan-400/70 mb-1">PONTOS</p>
                      <p className="font-bold text-cyan-300 text-lg">{request.points}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-md border border-green-500/20">
                      <p className="text-xs text-green-400/70 mb-1">VALOR</p>
                      <p className="font-bold text-green-300 text-lg">R$ {request.pixAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-md border border-purple-500/20">
                      <p className="text-xs text-purple-400/70 mb-1">CHAVE PIX</p>
                      <p className="font-mono text-sm text-purple-300 break-all">{request.pixKey}</p>
                    </div>
                    <div className="bg-slate-800/50 p-3 rounded-md border border-yellow-500/20">
                      <p className="text-xs text-yellow-400/70 mb-1">DATA</p>
                      <p className="text-sm text-yellow-300">{new Date(request.timestamp).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  {request.status === 'pending' && user && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => onApprove(request.id, user)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-md hover:from-green-400 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-500/25"
                      >
                        <Check size={18} />
                        APROVAR USUÁRIO
                      </button>
                      <button
                        onClick={() => onDeny(request.id, user)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-md hover:from-red-400 hover:to-pink-400 transition-all duration-300 flex items-center justify-center gap-2 font-bold shadow-lg shadow-red-500/25"
                      >
                        <XCircle size={18} />
                        NEGAR USUÁRIO
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};