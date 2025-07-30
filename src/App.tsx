import React, { useState, useEffect } from 'react';
import { User, TokenType, LotteryResult, ExchangeRequest, Transaction, UserAlert } from './types';
import { storage } from './utils/storage';
import { getTokenType } from './utils/tokenData';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { CreditModal } from './components/CreditModal';
import { TokenModal } from './components/TokenModal';
import { ExchangeModal } from './components/ExchangeModal';
import { AdminModal } from './components/AdminModal';
import { MessageModal } from './components/MessageModal';
import { NotificationModal } from './components/NotificationModal';

interface Message {
  type: 'success' | 'error';
  title: string;
  description: string;
}

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [exchangeRequests, setExchangeRequests] = useState<ExchangeRequest[]>([]);
  const [notifications, setNotifications] = useState<UserAlert[]>([]);

  useEffect(() => {
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Check for unread alerts
      const unreadAlerts = storage.getUserUnreadAlerts(user.id);
      setNotifications(unreadAlerts);
    }
    
    setAllUsers(storage.getUsers());
    setExchangeRequests(storage.getExchangeRequests());
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unreadAlerts = storage.getUserUnreadAlerts(currentUser.id);
      setNotifications(unreadAlerts);
    }
  }, [currentUser]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    storage.setCurrentUser(user);
    
    // Check for alerts after login
    const unreadAlerts = storage.getUserUnreadAlerts(user.id);
    setNotifications(unreadAlerts);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    storage.setCurrentUser(null);
  };

  const handleCreditPurchase = (amount: number) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits + amount
    };

    setCurrentUser(updatedUser);
    storage.updateUser(updatedUser);
    
    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: 'credit_purchase',
      amount: amount,
      description: `Compra de créditos: R$ ${amount.toFixed(2)}`,
      timestamp: new Date()
    };
    storage.addTransaction(transaction);

    setMessage({
      type: 'success',
      title: 'Créditos Adquiridos!',
      description: `Você adquiriu R$ ${amount.toFixed(2)} em créditos com sucesso!`
    });
  };

  const handleTokenPurchase = (tokenType: TokenType, lotteryResult?: LotteryResult) => {
    if (!currentUser) return;

    console.log('Iniciando compra de token:', tokenType.name);
    console.log('Resultado do sorteio:', lotteryResult);

    // Atualizar usuário atual
    const pointsGained = Math.floor(tokenType.price * 1.25);
    const existingTokenIndex = currentUser.tokens.findIndex(t => t.id === tokenType.id);
    
    let updatedTokens = [...currentUser.tokens];
    if (existingTokenIndex >= 0) {
      updatedTokens[existingTokenIndex].quantity += 1;
    } else {
      updatedTokens.push({
        id: tokenType.id,
        name: tokenType.name,
        value: tokenType.price,
        quantity: 1
      });
    }

    const updatedUser = {
      ...currentUser,
      credits: currentUser.credits - tokenType.price,
      points: currentUser.points + pointsGained,
      tokens: updatedTokens
    };

    setCurrentUser(updatedUser);
    storage.updateUser(updatedUser);

    // Processar resultado do sorteio
    if (lotteryResult) {
      const users = storage.getUsers();
      const winnerIndex = users.findIndex(u => u.id === lotteryResult.winnerId);
      
      if (winnerIndex >= 0) {
        const winner = users[winnerIndex];
        const winnerTokenIndex = winner.tokens.findIndex(t => t.id === tokenType.id);
        
        console.log(`Processando sorteio para ${winner.name}, token index: ${winnerTokenIndex}`);
        
        if (winnerTokenIndex >= 0 && winner.tokens[winnerTokenIndex].quantity > 0) {
          // Remove token from winner and add points
          const updatedWinnerTokens = [...winner.tokens];
          updatedWinnerTokens[winnerTokenIndex].quantity -= 1;
          
          const updatedWinner = {
            ...winner,
            tokens: updatedWinnerTokens,
            points: winner.points + lotteryResult.pointsGained
          };
          
          users[winnerIndex] = updatedWinner;
          storage.saveUsers(users);
          setAllUsers(users);
          
          console.log(`Token removido de ${winner.name}, pontos adicionados: ${lotteryResult.pointsGained}`);

          // Create notification for winner
          const winnerAlert: UserAlert = {
            id: Date.now().toString() + '_winner',
            userId: winner.id,
            type: 'token_sold',
            message: `🎯 Seu ${tokenType.name} foi sorteado! Você perdeu 1 token mas ganhou ${lotteryResult.pointsGained} pontos como compensação.`,
            timestamp: new Date(),
            isRead: false
          };
          storage.addUserAlert(winnerAlert);

          // Add transaction for winner
          const winnerTransaction: Transaction = {
            id: Date.now().toString() + '_winner',
            userId: winner.id,
            type: 'token_loss',
            amount: lotteryResult.pointsGained,
            description: `Sorteio: Perdeu 1 ${tokenType.name}, ganhou ${lotteryResult.pointsGained} pontos`,
            timestamp: new Date()
          };
          storage.addTransaction(winnerTransaction);
        } else {
          console.log('Erro: Usuário sorteado não possui o token ou quantidade insuficiente');
          console.log('Winner tokens:', winner.tokens);
        }
      }
    }

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: currentUser.id,
      type: 'token_purchase',
      amount: tokenType.price,
      description: `Compra de token: ${tokenType.name}`,
      timestamp: new Date()
    };
    storage.addTransaction(transaction);

    let successMessage = `Você comprou 1 ${tokenType.name} e ganhou ${pointsGained} pontos!`;
    if (lotteryResult) {
      successMessage += ` 🎯 ${lotteryResult.winnerName} foi sorteado e perdeu 1 token, recebendo ${lotteryResult.pointsGained} pontos.`;
    } else {
      successMessage += ` Você é o primeiro a possuir este token!`;
    }

    console.log('Compra finalizada com sucesso');
    console.log('Usuários atualizados:', storage.getUsers().map(u => ({ name: u.name, tokens: u.tokens })));

    setMessage({
      type: 'success',
      title: 'Token Comprado!',
      description: successMessage
    });
  };

  const handlePointExchange = (points: number, pixKey: string) => {
    if (!currentUser) return;

    const pixAmount = points * 0.5;
    
    const exchangeRequest: ExchangeRequest = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      points: points,
      pixAmount: pixAmount,
      pixKey: pixKey,
      status: 'pending',
      timestamp: new Date()
    };

    // Remove points from user
    const updatedUser = {
      ...currentUser,
      points: currentUser.points - points
    };

    setCurrentUser(updatedUser);
    storage.updateUser(updatedUser);
    storage.addExchangeRequest(exchangeRequest);
    setExchangeRequests(prev => [...prev, exchangeRequest]);

    setMessage({
      type: 'success',
      title: 'Solicitação Enviada!',
      description: `Sua solicitação de troca de ${points} pontos por R$ ${pixAmount.toFixed(2)} foi enviada para análise.`
    });
  };

  const handleApproveExchange = (requestId: string, user: User) => {
    const request = exchangeRequests.find(r => r.id === requestId);
    if (!request) return;

    storage.updateExchangeRequest(requestId, { status: 'approved' });
    setExchangeRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'approved' as const } : r)
    );

    // Create alert for user
    const alert: UserAlert = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'exchange_approved',
      message: `Parabéns! Sua solicitação de troca foi aprovada. Você receberá R$ ${request.pixAmount.toFixed(2)} na sua chave Pix em até 24 horas.`,
      timestamp: new Date(),
      isRead: false
    };
    storage.addUserAlert(alert);

    // Add transaction
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'point_exchange',
      amount: request.pixAmount,
      description: `Troca aprovada: ${request.points} pontos por R$ ${request.pixAmount.toFixed(2)}`,
      timestamp: new Date()
    };
    storage.addTransaction(transaction);

    setMessage({
      type: 'success',
      title: 'Solicitação Aprovada!',
      description: `A solicitação de ${user.name} foi aprovada. O usuário foi notificado.`
    });
  };

  const handleDenyExchange = (requestId: string, user: User) => {
    const request = exchangeRequests.find(r => r.id === requestId);
    if (!request) return;

    // Return points to user
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex >= 0) {
      const updatedUser = {
        ...users[userIndex],
        points: users[userIndex].points + request.points
      };
      
      users[userIndex] = updatedUser;
      storage.saveUsers(users);
      setAllUsers(users);

      // Update current user if it's the same
      if (currentUser && currentUser.id === user.id) {
        setCurrentUser(updatedUser);
      }
    }

    storage.updateExchangeRequest(requestId, { status: 'denied' });
    setExchangeRequests(prev => 
      prev.map(r => r.id === requestId ? { ...r, status: 'denied' as const } : r)
    );

    // Create alert for user
    const alert: UserAlert = {
      id: Date.now().toString(),
      userId: user.id,
      type: 'pix_invalid',
      message: `Sua solicitação de troca foi negada. Seus ${request.points} pontos foram devolvidos. Por favor, envie uma chave Pix válida para receber seus pagamentos.`,
      timestamp: new Date(),
      isRead: false
    };
    storage.addUserAlert(alert);

    setMessage({
      type: 'success',
      title: 'Solicitação Negada!',
      description: `A solicitação de ${user.name} foi negada. Os pontos foram devolvidos e o usuário foi notificado.`
    });
  };

  const handleMarkAlertAsRead = (alertId: string) => {
    storage.markAlertAsRead(alertId);
    setNotifications(prev => prev.filter(a => a.id !== alertId));
  };

  const handleMarkAllAlertsAsRead = () => {
    notifications.forEach(alert => {
      storage.markAlertAsRead(alert.id);
    });
    setNotifications([]);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 cyber-grid relative overflow-hidden">
        {/* Animated background particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center relative z-10">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4 neon-text glitch" data-text="ROMA PAY">
              ROMA PAY
            </h1>
            <p className="text-cyan-300 mb-8 text-xl font-light tracking-wider">Sistema de Tokens e Créditos</p>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-8 rounded-full"></div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-12 py-4 rounded-lg font-bold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 neon-glow text-lg tracking-wide"
            >
              INICIAR SESSÃO
            </button>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 cyber-grid relative">
      {/* Animated background particles */}
      <div className="particles">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout}
        onAdminClick={() => setShowAdminModal(true)}
        onNotificationsClick={() => setShowNotificationModal(true)}
        unreadNotifications={notifications.length}
      />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
            Bem-vindo, {currentUser.name}!
          </h2>
          <p className="text-cyan-300 text-lg">Gerencie seus créditos, tokens e pontos</p>
        </div>

        <Dashboard
          user={currentUser}
          onOpenCreditModal={() => setShowCreditModal(true)}
          onOpenTokenModal={() => setShowTokenModal(true)}
          onOpenExchangeModal={() => setShowExchangeModal(true)}
        />
      </main>

      {/* Modals */}
      <CreditModal
        isOpen={showCreditModal}
        onClose={() => setShowCreditModal(false)}
        onPurchase={handleCreditPurchase}
        user={currentUser}
      />

      <TokenModal
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onPurchase={handleTokenPurchase}
        user={currentUser}
        allUsers={allUsers}
      />

      <ExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        onExchange={handlePointExchange}
        user={currentUser}
      />

      {currentUser.isAdmin && (
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          exchangeRequests={exchangeRequests}
          onApprove={handleApproveExchange}
          onDeny={handleDenyExchange}
          allUsers={allUsers}
        />
      )}

      <MessageModal
        message={message}
        onClose={() => setMessage(null)}
      />

      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAlertAsRead}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
      />

      {/* Auto-show notifications when user logs in */}
      {notifications.length > 0 && !showNotificationModal && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setShowNotificationModal(true)}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg shadow-lg hover:from-red-400 hover:to-pink-400 transition-all duration-300 flex items-center gap-2 font-medium animate-pulse"
          >
            <span className="bg-white text-red-500 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {notifications.length}
            </span>
            Nova{notifications.length > 1 ? 's' : ''} Notificação{notifications.length > 1 ? 'ões' : ''}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;