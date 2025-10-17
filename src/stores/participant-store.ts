import { defineStore } from 'pinia';
import { computed } from 'vue';
import {
  sharedSurveys,
  sharedTransactions,
  sharedParticipantStats,
  saveSharedData,
  generateId,
} from './base-store';
import type { ParticipantStats, Transaction } from '../types/shared/shared';
import { useUserStore } from 'stores/user-store';

export const useParticipantStore = defineStore('participant', () => {
  const userStore = useUserStore();
  const currentUser = computed(() => userStore.user);

  // Getters
  const availableSurveys = computed(() =>
    sharedSurveys.value.filter(
      (survey) => survey.status === 'active' && survey.creator !== currentUser.value?.name, // Não mostrar próprias pesquisas
    ),
  );

  const myStats = computed(() => {
    const user = currentUser.value; // Usar variável local
    if (!user) return getDefaultStats();

    const stats = sharedParticipantStats.value.find((stats) => stats.userId === user.id); // Agora user não é null
    return stats || getDefaultStats();
  });

  const myTransactions = computed(() => {
    const user = currentUser.value; // Usar variável local
    if (!user) return [];
    return sharedTransactions.value.filter((transaction) => transaction.userId === user.id); // Agora user não é null
  });

  const rankings = computed(() =>
    sharedParticipantStats.value
      .sort((a, b) => b.totalEarned - a.totalEarned)
      .map((stats, index) => ({
        ...stats,
        position: index + 1,
      })),
  );

  // Actions
  const respondToSurvey = (surveyId: string) => {
    const user = currentUser.value; // Usar variável local
    if (!user) throw new Error('Usuário não autenticado');

    const survey = sharedSurveys.value.find((s) => s.id === surveyId);
    if (!survey) return null;

    // Criar transação pendente
    const newTransaction: Transaction = {
      id: generateId(),
      userId: user.id, // Agora user não é null
      userName: user.name, // Agora user não é null
      type: 'payment',
      method: 'mpesa',
      amount: survey.reward,
      status: 'pending',
      date: new Date().toLocaleDateString('pt-BR'),
      surveyId: survey.id,
      surveyTitle: survey.title,
    };

    sharedTransactions.value.unshift(newTransaction);

    // Atualizar estatísticas
    updateParticipantStats(survey.reward);

    // Adicionar resposta à pesquisa
    survey.responses += 1;
    if (survey.responses >= survey.target) {
      survey.status = 'completed';
    }

    saveSharedData();
    return newTransaction;
  };

  const completeTransaction = (transactionId: string) => {
    const transaction = sharedTransactions.value.find((t) => t.id === transactionId);
    if (transaction && transaction.status === 'pending') {
      transaction.status = 'processed';
      saveSharedData();
    }
  };

  const withdrawBalance = (amount: number) => {
    const user = currentUser.value; // Usar variável local
    if (!user) return false;

    const stats = myStats.value;
    if (amount <= stats.currentBalance) {
      // Criar transação de saque
      const withdrawalTransaction: Transaction = {
        id: generateId(),
        userId: user.id, // Agora user não é null
        userName: user.name, // Agora user não é null
        type: 'withdrawal',
        method: 'mpesa',
        amount: amount,
        status: 'pending',
        date: new Date().toLocaleDateString('pt-BR'),
      };

      sharedTransactions.value.unshift(withdrawalTransaction);

      // Atualizar saldo
      stats.currentBalance -= amount;
      updateParticipantStatsInArray(stats);

      saveSharedData();
      return true;
    }
    return false;
  };

  // Funções auxiliares
  const getDefaultStats = (): ParticipantStats => {
    const user = currentUser.value; // Usar variável local
    return {
      userId: user?.id || '',
      currentBalance: 0,
      totalEarned: 0,
      ranking: 0,
      completedSurveys: 0,
    };
  };

  const updateParticipantStats = (earnedAmount: number) => {
    const user = currentUser.value; // Usar variável local
    if (!user) return;

    const stats = myStats.value;
    stats.totalEarned += earnedAmount;
    stats.currentBalance += earnedAmount;
    stats.completedSurveys += 1;
    updateParticipantStatsInArray(stats);
  };

  const updateParticipantStatsInArray = (updatedStats: ParticipantStats) => {
    const index = sharedParticipantStats.value.findIndex((s) => s.userId === updatedStats.userId);
    if (index !== -1) {
      sharedParticipantStats.value[index] = updatedStats;
    } else {
      sharedParticipantStats.value.push(updatedStats);
    }
  };

  return {
    // Getters
    availableSurveys,
    myStats,
    myTransactions,
    rankings,

    // Actions
    respondToSurvey,
    completeTransaction,
    withdrawBalance,
  };
});
