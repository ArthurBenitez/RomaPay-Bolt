import { TokenType } from '../types';

export const TOKEN_TYPES: TokenType[] = [
  {
    id: 'gold',
    name: 'Gold Token',
    price: 100,
    color: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  },
  {
    id: 'silver',
    name: 'Silver Token',
    price: 50,
    color: 'bg-gradient-to-r from-gray-300 to-gray-500'
  },
  {
    id: 'bronze',
    name: 'Bronze Token',
    price: 25,
    color: 'bg-gradient-to-r from-orange-400 to-orange-600'
  },
  {
    id: 'diamond',
    name: 'Diamond Token',
    price: 200,
    color: 'bg-gradient-to-r from-blue-400 to-purple-600'
  },
  {
    id: 'emerald',
    name: 'Emerald Token',
    price: 150,
    color: 'bg-gradient-to-r from-green-400 to-green-600'
  },
  {
    id: 'ruby',
    name: 'Ruby Token',
    price: 175,
    color: 'bg-gradient-to-r from-red-400 to-red-600'
  }
];

export const getTokenType = (id: string): TokenType | undefined => {
  return TOKEN_TYPES.find(token => token.id === id);
};