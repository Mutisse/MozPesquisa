import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AdminStats, SystemUser, Transaction, SystemReport } from 'src/types/dashboard';

// Dados padrão para inicialização - CORRIGIDO com todas as propriedades
const defaultAdminStats: AdminStats = {
  totalUsers: 0,
  activeSurveys: 0,
  transactionVolume: 0,
  monthlyGrowth: 0,
  pendingApprovals: 0, // ADICIONADO
  systemHealth: 100, // ADICIONADO
};

const defaultSystemUsers: SystemUser[] = [];

const defaultRecentTransactions: Transaction[] = [];

const defaultSystemReport: SystemReport = {
  completionRate: 0,
  averageSatisfaction: 0,
  monthlyStats: [],
  totalRevenue: 0, // ADICIONADO
};

export const useAdminStore = defineStore('admin', () => {
  // Funções de carregamento do localStorage (declaradas primeiro)
  const loadAdminStats = (): AdminStats => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mozpesquisa-admin-stats');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Garantir que todas as propriedades existam
        return {
          ...defaultAdminStats,
          ...parsed,
          pendingApprovals: parsed.pendingApprovals || 0,
          systemHealth: parsed.systemHealth || 100,
        };
      }
    }
    return defaultAdminStats;
  };

  const loadSystemUsers = (): SystemUser[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mozpesquisa-system-users');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return defaultSystemUsers;
  };

  const loadRecentTransactions = (): Transaction[] => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mozpesquisa-transactions');
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return defaultRecentTransactions;
  };

  const loadSystemReport = (): SystemReport => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mozpesquisa-system-report');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Garantir que todas as propriedades existam
        return {
          ...defaultSystemReport,
          ...parsed,
          totalRevenue: parsed.totalRevenue || 0,
        };
      }
    }
    return defaultSystemReport;
  };

  // Função auxiliar para gerar IDs
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Estado - agora as funções de carregamento já estão declaradas
  const adminStats = ref<AdminStats>(loadAdminStats());
  const systemUsers = ref<SystemUser[]>(loadSystemUsers());
  const recentTransactions = ref<Transaction[]>(loadRecentTransactions());
  const systemReport = ref<SystemReport>(loadSystemReport());

  // Salvar no localStorage separadamente
  const saveToLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mozpesquisa-admin-stats', JSON.stringify(adminStats.value));
      localStorage.setItem('mozpesquisa-system-users', JSON.stringify(systemUsers.value));
      localStorage.setItem('mozpesquisa-transactions', JSON.stringify(recentTransactions.value));
      localStorage.setItem('mozpesquisa-system-report', JSON.stringify(systemReport.value));
    }
  };

  // Atualizar estatísticas automaticamente - CORRIGIDO
  const updateAdminStats = () => {
    // Atualizar total de usuários
    adminStats.value.totalUsers = systemUsers.value.length;

    // Atualizar aprovações pendentes
    adminStats.value.pendingApprovals = systemUsers.value.filter(
      (user: SystemUser) => user.status === 'pending',
    ).length;

    // Calcular crescimento mensal (simplificado)
    const activeUsersCount = systemUsers.value.filter(
      (user: SystemUser) => user.status === 'active',
    ).length;
    const previousMonthUsers = Math.max(0, activeUsersCount - Math.floor(activeUsersCount * 0.1));
    adminStats.value.monthlyGrowth =
      previousMonthUsers > 0
        ? Math.round(((activeUsersCount - previousMonthUsers) / previousMonthUsers) * 100)
        : 0;

    // Atualizar volume de transações
    const totalRevenue = recentTransactions.value
      .filter(
        (t: Transaction) =>
          t.type === 'payment' && (t.status === 'approved' || t.status === 'processed'),
      )
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    const totalWithdrawals = recentTransactions.value
      .filter(
        (t: Transaction) =>
          t.type === 'withdrawal' && (t.status === 'approved' || t.status === 'processed'),
      )
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

    adminStats.value.transactionVolume = totalRevenue + totalWithdrawals;

    // Atualizar pesquisas ativas (baseado nos dados dos usuários)
    const totalSurveys = systemUsers.value.reduce((sum: number, user: SystemUser) => {
      if (user.activity) {
        const surveyMatch = user.activity.match(/(\d+)\s*pesquisas?/);
        if (surveyMatch && surveyMatch[1]) {
          return sum + parseInt(surveyMatch[1]);
        }
      }
      return sum;
    }, 0);
    adminStats.value.activeSurveys = totalSurveys;

    // Calcular saúde do sistema
    adminStats.value.systemHealth = calculateSystemHealth();
  };

  // Nova função para calcular saúde do sistema
  const calculateSystemHealth = (): number => {
    const totalUsers = systemUsers.value.length;
    const activeUsers = systemUsers.value.filter((user) => user.status === 'active').length;
    const completedTransactions = recentTransactions.value.filter(
      (t) => t.status === 'processed' || t.status === 'approved',
    ).length;
    const totalTransactions = recentTransactions.value.length;

    if (totalUsers === 0 && totalTransactions === 0) return 100;

    const userHealth = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 100;
    const transactionHealth =
      totalTransactions > 0 ? (completedTransactions / totalTransactions) * 100 : 100;

    return Math.round((userHealth + transactionHealth) / 2);
  };

  // Getters
  const activeUsers = computed(() =>
    systemUsers.value.filter((user: SystemUser) => user.status === 'active'),
  );

  const pendingUsers = computed(() =>
    systemUsers.value.filter((user: SystemUser) => user.status === 'pending'),
  );

  const suspendedUsers = computed(() =>
    systemUsers.value.filter((user: SystemUser) => user.status === 'suspended'),
  );

  const totalRevenue = computed(() =>
    recentTransactions.value
      .filter(
        (t: Transaction) =>
          t.type === 'payment' && (t.status === 'approved' || t.status === 'processed'),
      )
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
  );

  const totalWithdrawals = computed(() =>
    recentTransactions.value
      .filter(
        (t: Transaction) =>
          t.type === 'withdrawal' && (t.status === 'approved' || t.status === 'processed'),
      )
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
  );

  const pendingWithdrawals = computed(() =>
    recentTransactions.value
      .filter((t: Transaction) => t.type === 'withdrawal' && t.status === 'pending')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
  );

  const pendingPayments = computed(() =>
    recentTransactions.value
      .filter((t: Transaction) => t.type === 'payment' && t.status === 'pending')
      .reduce((sum: number, t: Transaction) => sum + t.amount, 0),
  );

  // Actions para Usuários
  const addUser = (userData: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...userData,
      id: generateId(),
    };
    systemUsers.value.push(newUser);
    updateAdminStats();
    saveToLocalStorage();
    return newUser;
  };

  const updateUserStatus = (userId: string, newStatus: SystemUser['status']) => {
    const user = systemUsers.value.find((u: SystemUser) => u.id === userId);
    if (user) {
      user.status = newStatus;
      updateAdminStats();
      saveToLocalStorage();
    }
  };

  const updateUser = (userId: string, updates: Partial<Omit<SystemUser, 'id'>>) => {
    const userIndex = systemUsers.value.findIndex((u: SystemUser) => u.id === userId);
    if (userIndex !== -1) {
      systemUsers.value[userIndex] = {
        ...systemUsers.value[userIndex]!,
        ...updates,
      };
      updateAdminStats();
      saveToLocalStorage();
    }
  };

  const deleteUser = (userId: string) => {
    systemUsers.value = systemUsers.value.filter((u: SystemUser) => u.id !== userId);
    updateAdminStats();
    saveToLocalStorage();
  };

  // Actions para Transações
  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: generateId(),
      date: new Date().toLocaleDateString('pt-BR'),
    };
    recentTransactions.value.unshift(newTransaction);
    updateAdminStats();
    saveToLocalStorage();
    return newTransaction;
  };

  const updateTransactionStatus = (transactionId: string, newStatus: Transaction['status']) => {
    const transaction = recentTransactions.value.find((t: Transaction) => t.id === transactionId);
    if (transaction) {
      transaction.status = newStatus;
      updateAdminStats();
      saveToLocalStorage();
    }
  };

  const deleteTransaction = (transactionId: string) => {
    recentTransactions.value = recentTransactions.value.filter(
      (t: Transaction) => t.id !== transactionId,
    );
    updateAdminStats();
    saveToLocalStorage();
  };

  // Actions para Relatórios
  const updateSystemReport = (newReport: Partial<SystemReport>) => {
    systemReport.value = { ...systemReport.value, ...newReport };
    // Atualizar revenue total se necessário
    if (newReport.monthlyStats) {
      systemReport.value.totalRevenue = newReport.monthlyStats.reduce(
        (total, stat) => total + stat.revenue, // Já deve reconhecer revenue
        0,
      );
    }
    saveToLocalStorage();
  };

  const addMonthlyStat = (month: string, surveys: number, revenue: number = 0) => {
    // Garantir que monthlyStats existe
    if (!systemReport.value.monthlyStats) {
      systemReport.value.monthlyStats = [];
    }

    const existingIndex = systemReport.value.monthlyStats.findIndex(
      (stat) => stat.month === month, // REMOVER a annotation de tipo desatualizada
    );
    if (existingIndex !== -1) {
      systemReport.value.monthlyStats[existingIndex]!.surveys = surveys;
      systemReport.value.monthlyStats[existingIndex]!.revenue = revenue;
    } else {
      systemReport.value.monthlyStats.push({ month, surveys, revenue });
    }

    // Atualizar revenue total
    systemReport.value.totalRevenue = systemReport.value.monthlyStats.reduce(
      (total, stat) => total + stat.revenue,
      0,
    );

    updateAdminStats();
    saveToLocalStorage();
  };

  // Ações do Sistema
  const generateMonthlyReport = () => {
    const report = {
      adminStats: adminStats.value,
      systemUsers: systemUsers.value,
      recentTransactions: recentTransactions.value,
      systemReport: systemReport.value,
      generatedAt: new Date().toISOString(),
      summary: {
        totalActiveUsers: activeUsers.value.length,
        totalPendingUsers: pendingUsers.value.length,
        totalRevenue: totalRevenue.value,
        totalWithdrawals: totalWithdrawals.value,
      },
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    return URL.createObjectURL(dataBlob);
  };

  const exportUsers = (format: 'csv' | 'json' = 'csv') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(systemUsers.value, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      return URL.createObjectURL(blob);
    } else {
      const csvContent = [
        [
          'Nome',
          'Email',
          'Instituição',
          'Tipo',
          'Status',
          'Atividade',
          'Financeiro',
          'Data Registro',
        ],
        ...systemUsers.value.map((user: SystemUser) => [
          `"${user.name}"`,
          `"${user.email}"`,
          `"${user.institution}"`,
          user.type,
          user.status,
          `"${user.activity}"`,
          `"${user.financials}"`,
          user.registrationDate,
        ]),
      ]
        .map((row) => row.join(','))
        .join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      return URL.createObjectURL(blob);
    }
  };

  const processPendingPayments = () => {
    const pending = recentTransactions.value.filter((t: Transaction) => t.status === 'pending');
    const processed: Transaction[] = [];

    pending.forEach((t: Transaction) => {
      t.status = 'processed';
      processed.push(t);
    });

    updateAdminStats();
    saveToLocalStorage();
    return processed;
  };

  const bulkUpdateUserStatus = (userIds: string[], newStatus: SystemUser['status']) => {
    systemUsers.value.forEach((user: SystemUser) => {
      if (userIds.includes(user.id)) {
        user.status = newStatus;
      }
    });
    updateAdminStats();
    saveToLocalStorage();
    return userIds.length;
  };

  // Limpar todos os dados (para reset)
  const clearAllData = () => {
    adminStats.value = defaultAdminStats;
    systemUsers.value = defaultSystemUsers;
    recentTransactions.value = defaultRecentTransactions;
    systemReport.value = defaultSystemReport;
    saveToLocalStorage();
  };

  // Inicializar estatísticas
  updateAdminStats();

  return {
    // State
    adminStats,
    systemUsers,
    recentTransactions,
    systemReport,

    // Getters
    activeUsers,
    pendingUsers,
    suspendedUsers,
    totalRevenue,
    totalWithdrawals,
    pendingWithdrawals,
    pendingPayments,

    // Actions - Usuários
    addUser,
    updateUser,
    updateUserStatus,
    deleteUser,
    bulkUpdateUserStatus,

    // Actions - Transações
    addTransaction,
    updateTransactionStatus,
    deleteTransaction,

    // Actions - Relatórios
    updateSystemReport,
    addMonthlyStat,

    // Ações do Sistema
    generateMonthlyReport,
    exportUsers,
    processPendingPayments,

    // Utilitários
    clearAllData,
    saveToLocalStorage,
    updateAdminStats,
  };
});
