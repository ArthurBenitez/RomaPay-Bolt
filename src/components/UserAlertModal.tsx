import React from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { UserAlert } from '../types';

interface UserAlertModalProps {
  alerts: UserAlert[];
  onClose: () => void;
  onMarkAsRead: (alertId: string) => void;
}

export const UserAlertModal: React.FC<UserAlertModalProps> = ({ 
  alerts, 
  onClose, 
  onMarkAsRead 
}) => {
  if (alerts.length === 0) return null;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'exchange_approved':
        return <CheckCircle className="text-green-400" size={24} />;
      case 'exchange_denied':
      case 'pix_invalid':
        return <XCircle className="text-red-400" size={24} />;
      default:
        return <AlertTriangle className="text-yellow-400" size={24} />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'exchange_approved':
        return 'border-green-400/30 bg-green-900/20';
      case 'exchange_denied':
      case 'pix_invalid':
        return 'border-red-400/30 bg-red-900/20';
      default:
        return 'border-yellow-400/30 bg-yellow-900/20';
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    onMarkAsRead(alertId);
    if (alerts.length === 1) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-md shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
            NOTIFICAÇÕES
          </h2>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 backdrop-blur-sm ${getAlertColor(alert.type)}`}>
              <div className="flex items-start gap-3 mb-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-white font-medium leading-relaxed">
                    {alert.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(alert.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleMarkAsRead(alert.id)}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-2 px-4 rounded-md hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 font-medium text-sm"
              >
                Marcar como Lida
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};