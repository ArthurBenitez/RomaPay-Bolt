export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  points: number;
  tokens: Token[];
  isAdmin: boolean;
}

export interface Token {
  id: string;
  name: string;
  value: number;
  quantity: number;
}

export interface TokenType {
  id: string;
  name: string;
  price: number;
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit_purchase' | 'token_purchase' | 'point_exchange' | 'token_loss';
  amount: number;
  description: string;
  timestamp: Date;
}

export interface ExchangeRequest {
  id: string;
  userId: string;
  userName: string;
  points: number;
  pixAmount: number;
  pixKey: string;
  status: 'pending' | 'approved' | 'denied';
  timestamp: Date;
}

export interface UserAlert {
  id: string;
  userId: string;
  type: 'pix_invalid' | 'exchange_approved' | 'exchange_denied' | 'token_sold';
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface LotteryResult {
  winnerId: string;
  winnerName: string;
  tokenType: string;
  pointsGained: number;
}