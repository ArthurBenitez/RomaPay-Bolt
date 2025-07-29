import React, { useState } from 'react';
import { X, Bell, CheckCircle, XCircle, AlertTriangle, Coins, Filter } from 'lucide-react';
import { UserAlert } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: UserAlert[];
  onMarkAsRead: (alertId: string) => void;
  onMarkAllAsRead: () => void;
}

type FilterType = 'all' | 'unread' | 'exchange' | 'token';

export const NotificationModal: React.FC<NotificationModalProps> = ({ 
  isOpen, 
  onClose, 
  notifications,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'exchange_approved':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'exchange_denied':
      case 'pix_invalid':
        return <XCircle className="text-red-400" size={24} />;
      case 'token_sold':
        return <Coins className="text-yellow-400" size={24} />;
      default:
        return <AlertTriangle className="text-cyan-400" size={24} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'exchange_approved':
        return 'border-green-400/30 bg-green-900/20';
      case 'exchange_denied':
      case 'pix_invalid':
        return 'border-red-400/30 bg-red-900/20';
      case 'token_sold':
        return 'border-yellow-400/30 bg-yellow-900/20';
      default:
        return 'border-cyan-400/30 bg-cyan-900/20';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'exchange':
        return ['exchange_approved', 'exchange_denied', 'pix_invalid'].includes(notification.type);
      case 'token':
        return notification.type === 'token_sold';
      default:
        return true;
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Bell className="text-cyan-400" size={28} />
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
              NOTIFICAÇÕES
            </h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="text-purple-400" size={20} />
            <span className="text-purple-300 font-medium">Filtrar:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'unread', label: 'Não Lidas' },
              { key: 'exchange', label: 'Trocas' },
              { key: 'token', label: 'Tokens' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as FilterType)}
                className={`px-3 py-1 rounded-md transition-all duration-300 text-sm font-medium ${
                  filter === key
                    ? 'bg-purple-500 text-white neon-glow'
                    : 'bg-slate-700/50 text-purple-400 hover:bg-purple-500/20 border border-purple-500/30'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Botão Marcar Todas como Lidas */}
        {unreadCount > 0 && (
          <div className="mb-4">
            <button
              onClick={onMarkAllAsRead}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-md hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 font-medium text-sm"
            >
              Marcar Todas como Lidas ({unreadCount})
            </button>
          </div>
        )}

        {/* Lista de Notificações */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-cyan-400 text-lg font-medium">Nenhuma notificação encontrada</p>
            <p className="text-cyan-400/70 text-sm mt-2">
              {filter === 'unread' ? 'Todas as notificações foram lidas!' : 'Tente ajustar os filtros acima'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`border rounded-lg p-4 backdrop-blur-sm transition-all duration-300 ${
                  getNotificationColor(notification.type)
                } ${!notification.isRead ? 'ring-2 ring-cyan-400/50' : ''}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-white font-medium leading-relaxed mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.timestamp).toLocaleString('pt-BR')}
                    </p>
                    {!notification.isRead && (
                      <span className="inline-block mt-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                        NOVA
                      </span>
                    )}
                  </div>
                </div>
                
                {!notification.isRead && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 text-white py-2 px-4 rounded-md hover:from-slate-500 hover:to-slate-600 transition-all duration-300 font-medium text-sm"
                  >
                    Marcar como Lida
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};