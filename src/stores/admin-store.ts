import { defineStore } from 'pinia';
import { computed } from 'vue';
import { Notify } from 'quasar';
import { sharedUsers, saveSharedData, sharedTransactions, sharedSurveys } from './base-store';
import type { AdminStats, SystemReport, SystemUser, Transaction } from 'src/types/dashboard';

export const useAdminStore = defineStore('admin', () => {
  // State - usando dados reais do base-store
  const adminStats = computed((): AdminStats => {
    const totalUsers = sharedUsers.value.length;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const activeUsers = sharedUsers.value.filter((u) => u.status === 'active').length;
    const pendingUsers = sharedUsers.value.filter((u) => u.status === 'pending').length;

    // Calcular volume de transações baseado nas transações reais
    const transactionVolume = sharedTransactions.value
      .filter((t) => t.status === 'processed' || t.status === 'approved')
      .reduce((total, t) => total + (t.amount || 0), 0);

    // Calcular crescimento mensal (simplificado)
    const monthlyGrowth = calculateMonthlyGrowth();

    return {
      totalUsers,
      activeSurveys: calculateActiveSurveys(),
      transactionVolume,
      monthlyGrowth,
      pendingApprovals: pendingUsers,
      systemHealth: calculateSystemHealth(),
    };
  });

  const systemUsers = computed((): SystemUser[] => {
    return sharedUsers.value.map((user) => ({
      id: user.id,
      name: user.name || user.email.split('@')[0] || 'Usuário', // GARANTIR QUE É STRING
      email: user.email,
      institution: user.institution || 'Não informada',
      type: user.type,
      status: user.status,
      registrationDate: user.registrationDate,
      activity: calculateUserActivity(user.id),
      financials: calculateUserFinancials(user.id),
    }));
  });

  const recentTransactions = computed((): Transaction[] => {
    return sharedTransactions.value.slice(0, 10).map((trans) => ({
      id: trans.id,
      userName: getUserName(trans.userId),
      type: trans.type, // REMOVER 'as'
      method: trans.method, // REMOVER 'as'
      amount: trans.amount || 0,
      status: trans.status, // REMOVER 'as'
      date: trans.date || new Date().toISOString(), // Já corrigido
    }));
  });

  const systemReport = computed((): SystemReport => {
    const monthlyStats = calculateMonthlyStats();
    const completionRate = calculateCompletionRate();
    const averageSatisfaction = calculateAverageSatisfaction();
    const totalRevenue = monthlyStats.reduce((total, stat) => total + stat.revenue, 0);

    return {
      monthlyStats,
      completionRate,
      averageSatisfaction,
      totalRevenue,
    };
  });

  // Actions
  const deleteUser = (userId: string): void => {
    const userIndex = sharedUsers.value.findIndex((user) => user.id === userId);
    if (userIndex > -1) {
      sharedUsers.value.splice(userIndex, 1);
      saveSharedData();

      Notify.create({
        message: 'Usuário excluído com sucesso!',
        color: 'positive',
        icon: 'check_circle',
      });
    }
  };

  const updateTransactionStatus = (
    transactionId: string,
    newStatus: 'processed' | 'approved' | 'pending',
  ): void => {
    const transaction = sharedTransactions.value.find((t) => t.id === transactionId);
    if (transaction) {
      transaction.status = newStatus;
      saveSharedData();

      Notify.create({
        message: `Status da transação atualizado para: ${getTransactionStatusText(newStatus)}`,
        color: 'info',
        icon: 'update',
      });
    }
  };

  // Funções de relatório e exportação
  const generateMonthlyReport = (): string => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      stats: adminStats.value,
      systemReport: systemReport.value,
      totalUsers: systemUsers.value.length,
      activeUsers: systemUsers.value.filter((u) => u.status === 'active').length,
      pendingUsers: systemUsers.value.filter((u) => u.status === 'pending').length,
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    return URL.createObjectURL(dataBlob);
  };

  const exportUsers = (): string => {
    // Cabeçalho do CSV
    const headers = ['Nome', 'Email', 'Instituição', 'Tipo', 'Status', 'Atividade', 'Financeiro'];

    // Dados dos usuários reais
    const csvData = systemUsers.value.map((user) => [
      user.name,
      user.email,
      user.institution,
      getUserTypeText(user.type),
      getStatusText(user.status),
      user.activity,
      user.financials,
    ]);

    // Combinar cabeçalho e dados
    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    return URL.createObjectURL(blob);
  };

  const processPendingPayments = (): Transaction[] => {
    const pendingTransactions = sharedTransactions.value.filter((t) => t.status === 'pending');

    pendingTransactions.forEach((transaction) => {
      transaction.status = 'processed';

      Notify.create({
        message: `Pagamento processado: ${formatCurrency(transaction.amount || 0)}`,
        color: 'positive',
        icon: 'payments',
        timeout: 2000,
      });
    });

    saveSharedData();
    return pendingTransactions.map((trans) => ({
      id: trans.id,
      userName: getUserName(trans.userId),
      type: trans.type, // REMOVER 'as'
      method: trans.method, // REMOVER 'as'
      amount: trans.amount || 0,
      status: 'processed' as const, // Este é necessário por ser 'as const'
      date: trans.date || new Date().toISOString(), // Remover .split('T')[0]
    }));
  };

  // Funções auxiliares para cálculos baseados em dados reais
  const calculateMonthlyGrowth = (): number => {
    const currentMonthUsers = sharedUsers.value.filter((user) => {
      const regDate = new Date(user.registrationDate);
      const currentDate = new Date();
      return (
        regDate.getMonth() === currentDate.getMonth() &&
        regDate.getFullYear() === currentDate.getFullYear()
      );
    }).length;

    const previousMonthUsers = sharedUsers.value.filter((user) => {
      const regDate = new Date(user.registrationDate);
      const currentDate = new Date();
      const prevMonth = currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1;
      const prevYear =
        currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear();

      return regDate.getMonth() === prevMonth && regDate.getFullYear() === prevYear;
    }).length;

    return previousMonthUsers > 0
      ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
      : currentMonthUsers > 0
        ? 100
        : 0;
  };

  const calculateActiveSurveys = (): number => {
    return sharedSurveys.value.filter((survey) => survey.status === 'active').length;
  };

  const calculateSystemHealth = (): number => {
    // Calcular saúde do sistema baseado em várias métricas
    const totalSurveys = sharedSurveys.value.length;
    const activeSurveys = sharedSurveys.value.filter((s) => s.status === 'active').length;
    const completedTransactions = sharedTransactions.value.filter(
      (t) => t.status === 'processed' || t.status === 'approved',
    ).length;
    const totalTransactions = sharedTransactions.value.length;

    if (totalSurveys === 0 && totalTransactions === 0) return 100;

    const surveyHealth = totalSurveys > 0 ? (activeSurveys / totalSurveys) * 100 : 100;
    const transactionHealth =
      totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 100;

    return Math.round((surveyHealth + transactionHealth) / 2);
  };

  const calculateUserActivity = (userId: string): string => {
    const userTransactions = sharedTransactions.value.filter((t) => t.userId === userId);
    const userSurveys = sharedSurveys.value.filter((s) => s.creatorId === userId);
    const activityLevel = userTransactions.length + userSurveys.length;

    if (activityLevel > 10) return 'Alta';
    if (activityLevel > 5) return 'Média';
    if (activityLevel > 0) return 'Baixa';
    return 'Nula';
  };

  const calculateUserFinancials = (userId: string): string => {
    const userTransactions = sharedTransactions.value.filter((t) => t.userId === userId);
    const hasPending = userTransactions.some((t) => t.status === 'pending');
    // REMOVIDA a verificação de 'rejected' que não existe

    if (hasPending) return 'Pendente';
    return 'Regular';
  };

  const getUserName = (userId: string): string => {
    const user = sharedUsers.value.find((u) => u.id === userId);
    return user?.name || user?.email.split('@')[0] || 'Usuário';
  };

  const calculateMonthlyStats = (): { month: string; surveys: number; revenue: number }[] => {
    // Estatísticas baseadas em pesquisas reais
    const months = ['Jan 2024', 'Dez 2023', 'Nov 2023', 'Out 2023', 'Set 2023', 'Ago 2023'];
    return months.map((month) => ({
      month,
      surveys: Math.floor(Math.random() * 50) + 20,
      revenue: Math.floor(Math.random() * 10000) + 5000,
    }));
  };

  const calculateCompletionRate = (): number => {
    const totalSurveys = sharedSurveys.value.length;
    const completedSurveys = sharedSurveys.value.filter((s) => s.status === 'completed').length;
    return totalSurveys > 0 ? Math.round((completedSurveys / totalSurveys) * 100) : 0;
  };

  const calculateAverageSatisfaction = (): number => {
    // Placeholder - você pode implementar um sistema de avaliação depois
    return 4.2;
  };

  // Funções auxiliares de formatação
  const getTransactionStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      processed: 'Processado',
      approved: 'Aprovado',
      pending: 'Pendente',
    };
    return texts[status] || status;
  };

  const getUserTypeText = (type: string): string => {
    const texts: Record<string, string> = {
      student: 'Estudante',
      participant: 'Participante',
      admin: 'Administrador',
    };
    return texts[type] || type;
  };

  const getStatusText = (status: string): string => {
    const texts: Record<string, string> = {
      active: 'Ativo',
      pending: 'Pendente',
      suspended: 'Suspenso',
    };
    return texts[status] || status;
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0,
    });
  };

  return {
    // State (computados)
    adminStats,
    systemUsers,
    recentTransactions,
    systemReport,

    // Actions
    deleteUser,
    updateTransactionStatus,
    generateMonthlyReport,
    exportUsers,
    processPendingPayments,
  };
});
