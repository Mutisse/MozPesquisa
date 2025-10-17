import { ref } from 'vue';
import type { User, Survey, Transaction, ParticipantStats } from '../types/shared/shared';

// Funções utilitárias para localStorage
export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  }
  return defaultValue;
};

export const saveToStorage = (key: string, data: unknown): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

// Dados base compartilhados - INICIAR VAZIOS
export const sharedUsers = ref<User[]>(loadFromStorage('mozpesquisa-users', []));
export const sharedSurveys = ref<Survey[]>(loadFromStorage('mozpesquisa-surveys', []));
export const sharedTransactions = ref<Transaction[]>(
  loadFromStorage('mozpesquisa-transactions', []),
);
export const sharedParticipantStats = ref<ParticipantStats[]>(
  loadFromStorage('mozpesquisa-participant-stats', []),
);

// Funções para salvar dados compartilhados
export const saveSharedData = () => {
  saveToStorage('mozpesquisa-users', sharedUsers.value);
  saveToStorage('mozpesquisa-surveys', sharedSurveys.value);
  saveToStorage('mozpesquisa-transactions', sharedTransactions.value);
  saveToStorage('mozpesquisa-participant-stats', sharedParticipantStats.value);
};

// Funções utilitárias
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Criar admin apenas se não existir
if (sharedUsers.value.length === 0) {
  // Criar apenas o usuário admin
  sharedUsers.value = [
    {
      id: 'admin-001',
      name: 'Administrador Sistema',
      email: 'admin@mozpesquisa.ac.mz',
      type: 'admin',
      institution: 'MozPesquisa',
      registrationDate: new Date().toLocaleDateString('pt-BR'),
      status: 'active',
    },
  ];
  saveSharedData();
}