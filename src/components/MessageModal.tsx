import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface Message {
  type: 'success' | 'error';
  title: string;
  description: string;
}

interface MessageModalProps {
  message: Message | null;
  onClose: () => void;
}

export const MessageModal: React.FC<MessageModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {message.type === 'success' ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <AlertCircle className="text-red-600" size={24} />
            )}
            <h2 className={`text-xl font-bold ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.title}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">{message.description}</p>

        <button
          onClick={onClose}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            message.type === 'success'
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          Entendi
        </button>
      </div>
    </div>
  );
};