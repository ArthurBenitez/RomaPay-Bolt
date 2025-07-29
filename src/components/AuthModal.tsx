import React, { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';
import { storage } from '../utils/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLoginMode) {
      // Login logic
      const users = storage.getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        onLogin(user);
        onClose();
        resetForm();
      } else {
        // Check for admin credentials
        if (email === 'admin@imperium.com' && password === 'admin123') {
          const adminUser: User = {
            id: 'admin',
            email: 'admin@imperium.com',
            name: 'Administrador',
            credits: 999999,
            points: 999999,
            tokens: [],
            isAdmin: true
          };
          onLogin(adminUser);
          onClose();
          resetForm();
        } else {
          setError('Email ou senha incorretos');
        }
      }
    } else {
      // Register logic
      if (!name || !email || !password) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      const users = storage.getUsers();
      if (users.find(u => u.email === email)) {
        setError('Email já cadastrado');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        credits: 0,
        points: 0,
        tokens: [],
        isAdmin: false
      };

      users.push({ ...newUser, password } as any);
      storage.saveUsers(users);
      onLogin(newUser);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
      <div className="bg-slate-800/90 backdrop-blur-md border border-cyan-400/30 rounded-lg p-8 w-full max-w-md shadow-2xl neon-glow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 tracking-wide">
            {isLoginMode ? 'Login' : 'Criar Conta'}
          </h2>
          <button onClick={onClose} className="text-cyan-400 hover:text-cyan-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-1 tracking-wide">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 backdrop-blur-sm"
                placeholder="Seu nome completo"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1 tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 backdrop-blur-sm"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-cyan-300 mb-1 tracking-wide">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700/50 border border-cyan-500/30 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-white placeholder-gray-400 backdrop-blur-sm"
              placeholder="Sua senha"
            />
          </div>

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 p-3 rounded backdrop-blur-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white py-3 px-4 rounded-md hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 flex items-center justify-center gap-2 font-bold tracking-wide shadow-lg shadow-cyan-500/25"
          >
            {isLoginMode ? <LogIn size={20} /> : <UserPlus size={20} />}
            {isLoginMode ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            {isLoginMode 
              ? 'Não tem conta? Criar uma nova' 
              : 'Já tem conta? Fazer login'
            }
          </button>
        </div>
      </div>
    </div>
  );
};