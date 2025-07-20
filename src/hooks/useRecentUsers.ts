
import { useState, useEffect } from 'react';

interface RecentUser {
  email: string;
  lastLogin: string;
}

const STORAGE_KEY = 'locarPayRecentUsers';
const MAX_RECENT_USERS = 5;

export const useRecentUsers = () => {
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    loadRecentUsers();
  }, []);

  const loadRecentUsers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const users = JSON.parse(stored) as RecentUser[];
        setRecentUsers(users);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários recentes:', error);
    }
  };

  const addRecentUser = (email: string) => {
    try {
      const currentUsers = [...recentUsers];
      
      // Remove o email se já existir na lista
      const filteredUsers = currentUsers.filter(user => user.email !== email);
      
      // Adiciona o novo email no início da lista
      const newUser: RecentUser = {
        email,
        lastLogin: new Date().toISOString()
      };
      
      const updatedUsers = [newUser, ...filteredUsers].slice(0, MAX_RECENT_USERS);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
      setRecentUsers(updatedUsers);
    } catch (error) {
      console.error('Erro ao salvar usuário recente:', error);
    }
  };

  const clearRecentUsers = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentUsers([]);
    } catch (error) {
      console.error('Erro ao limpar usuários recentes:', error);
    }
  };

  return {
    recentUsers,
    addRecentUser,
    clearRecentUsers
  };
};
