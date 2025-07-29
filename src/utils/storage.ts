import { User, Transaction, ExchangeRequest, UserAlert } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER: 'roma_pay_current_user',
  USERS: 'roma_pay_users',
  TRANSACTIONS: 'roma_pay_transactions',
  EXCHANGE_REQUESTS: 'roma_pay_exchange_requests',
  USER_ALERTS: 'roma_pay_user_alerts',
};

export const storage = {
  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  getUsers: (): User[] => {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  },

  saveUsers: (users: User[]): void => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  updateUser: (updatedUser: User): void => {
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      storage.saveUsers(users);
      
      // Update current user if it's the same
      const currentUser = storage.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        storage.setCurrentUser(updatedUser);
      }
    }
  },

  getTransactions: (): Transaction[] => {
    const transactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return transactions ? JSON.parse(transactions) : [];
  },

  addTransaction: (transaction: Transaction): void => {
    const transactions = storage.getTransactions();
    transactions.push(transaction);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getExchangeRequests: (): ExchangeRequest[] => {
    const requests = localStorage.getItem(STORAGE_KEYS.EXCHANGE_REQUESTS);
    return requests ? JSON.parse(requests) : [];
  },

  addExchangeRequest: (request: ExchangeRequest): void => {
    const requests = storage.getExchangeRequests();
    requests.push(request);
    localStorage.setItem(STORAGE_KEYS.EXCHANGE_REQUESTS, JSON.stringify(requests));
  },

  updateExchangeRequest: (requestId: string, updates: Partial<ExchangeRequest>): void => {
    const requests = storage.getExchangeRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex !== -1) {
      requests[requestIndex] = { ...requests[requestIndex], ...updates };
      localStorage.setItem(STORAGE_KEYS.EXCHANGE_REQUESTS, JSON.stringify(requests));
    }
  },

  getUserAlerts: (): UserAlert[] => {
    const alerts = localStorage.getItem(STORAGE_KEYS.USER_ALERTS);
    return alerts ? JSON.parse(alerts) : [];
  },

  addUserAlert: (alert: UserAlert): void => {
    const alerts = storage.getUserAlerts();
    alerts.push(alert);
    localStorage.setItem(STORAGE_KEYS.USER_ALERTS, JSON.stringify(alerts));
  },

  markAlertAsRead: (alertId: string): void => {
    const alerts = storage.getUserAlerts();
    const alertIndex = alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      alerts[alertIndex].isRead = true;
      localStorage.setItem(STORAGE_KEYS.USER_ALERTS, JSON.stringify(alerts));
    }
  },

  getUserUnreadAlerts: (userId: string): UserAlert[] => {
    const alerts = storage.getUserAlerts();
    return alerts.filter(a => a.userId === userId && !a.isRead);
  },
};