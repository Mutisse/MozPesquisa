<template>
  <q-page class="bg-grey-1">
    <!-- Layout com Sidebar -->
    <div class="row full-height">
      <!-- Sidebar -->
      <div class="col-2 bg-dark text-white">
        <div class="q-pa-lg">
          <div class="text-h5 text-weight-bold q-mb-xl">MozPesquisa</div>

          <q-list class="q-gutter-y-md">
            <q-item clickable class="rounded-borders" active>
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Home</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable class="rounded-borders">
              <q-item-section avatar>
                <q-icon name="people" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Usuários</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable class="rounded-borders">
              <q-item-section avatar>
                <q-icon name="assessment" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Relatórios</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable class="rounded-borders">
              <q-item-section avatar>
                <q-icon name="payments" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Transações</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div class="absolute-bottom q-pa-lg">
          <q-item class="rounded-borders bg-blue-grey-8">
            <q-item-section avatar>
              <q-icon name="admin_panel_settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">Administrador</q-item-label>
              <q-item-label caption class="text-white">Sistema</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn round flat icon="logout" size="sm" @click="logout" />
            </q-item-section>
          </q-item>
        </div>
      </div>

      <!-- Conteúdo Principal -->
      <div class="col-10 q-pa-lg">
        <!-- Cabeçalho -->
        <div class="q-mb-lg">
          <h1 class="text-h4 text-weight-bold text-grey-8 q-mb-xs">Painel Administrativo</h1>
          <p class="text-grey-6">Dashboard de gestão da plataforma MozPesquisa</p>
        </div>

        <!-- Estatísticas Rápidas -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-3">
            <q-card class="text-center bg-blue-1">
              <q-card-section>
                <div class="text-h4 text-weight-bold text-primary">{{ adminStats.totalUsers }}</div>
                <div class="text-caption text-grey">Total Usuários</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card class="text-center bg-green-1">
              <q-card-section>
                <div class="text-h4 text-weight-bold text-green">
                  {{ adminStats.activeSurveys }}
                </div>
                <div class="text-caption text-grey">Pesquisas Ativas</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card class="text-center bg-orange-1">
              <q-card-section>
                <div class="text-h4 text-weight-bold text-orange">
                  {{ formatCurrency(adminStats.transactionVolume) }}
                </div>
                <div class="text-caption text-grey">Volume Transações</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-3">
            <q-card class="text-center bg-purple-1">
              <q-card-section>
                <div class="text-h4 text-weight-bold text-purple">
                  +{{ adminStats.monthlyGrowth }}%
                </div>
                <div class="text-caption text-grey">Crescimento Mensal</div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <!-- Coluna Esquerda -->
          <div class="col-8">
            <!-- Gestão de Usuários -->
            <q-card class="q-mb-lg">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6 text-weight-bold">Gestão de Usuários</div>
              </q-card-section>

              <q-card-section class="q-pa-none">
                <q-table :rows="systemUsers" :columns="userColumns" row-key="id" flat bordered>
                  <template v-slot:body-cell-status="props">
                    <q-td :props="props">
                      <q-badge
                        :color="getStatusColor(props.row.status)"
                        :label="getStatusText(props.row.status)"
                      />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-type="props">
                    <q-td :props="props">
                      <q-badge
                        :color="props.row.type === 'student' ? 'blue' : 'green'"
                        :label="getUserTypeText(props.row.type)"
                      />
                    </q-td>
                  </template>

                  <template v-slot:body-cell-actions="props">
                    <q-td :props="props">
                      <div class="row q-gutter-xs">
                        <q-btn
                          icon="edit"
                          size="sm"
                          flat
                          color="primary"
                          @click="editUser(props.row)"
                        />
                        <q-btn
                          icon="delete"
                          size="sm"
                          flat
                          color="red"
                          @click="deleteUser(props.row.id)"
                        />
                        <q-btn icon="more_vert" size="sm" flat color="grey" />
                      </div>
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>

            <!-- Transações Recentes -->
            <q-card>
              <q-card-section class="bg-green text-white">
                <div class="text-h6 text-weight-bold">Transações Recentes</div>
              </q-card-section>

              <q-card-section>
                <div class="q-gutter-y-md">
                  <div
                    v-for="transaction in recentTransactions.slice(0, 5)"
                    :key="transaction.id"
                    class="row items-center justify-between q-pa-sm rounded-borders bg-grey-2"
                  >
                    <div class="col">
                      <div class="text-weight-medium">{{ transaction.userName }}</div>
                      <div class="text-caption text-grey">
                        {{ getTransactionTypeText(transaction.type) }} •
                        {{ getTransactionMethodText(transaction.method) }}
                      </div>
                    </div>
                    <div class="col-auto">
                      <div class="row items-center q-gutter-x-md">
                        <div class="text-h6 text-weight-bold text-green">
                          {{ formatCurrency(transaction.amount) }}
                        </div>
                        <q-badge
                          :color="getTransactionStatusColor(transaction.status)"
                          :label="getTransactionStatusText(transaction.status)"
                        />
                        <q-btn icon="more_vert" size="sm" flat round />
                      </div>
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>

          <!-- Coluna Direita -->
          <div class="col-4">
            <!-- Relatórios -->
            <q-card class="q-mb-lg">
              <q-card-section class="bg-orange-1">
                <div class="text-h6 text-weight-bold">Relatórios</div>
              </q-card-section>

              <q-card-section>
                <!-- Pesquisas por Mês -->
                <div class="q-mb-md">
                  <div class="text-weight-medium q-mb-sm">Pesquisas por Mês</div>
                  <div class="q-gutter-y-xs">
                    <div
                      v-for="stat in systemReport.monthlyStats.slice(0, 6)"
                      :key="stat.month"
                      class="row items-center justify-between"
                    >
                      <div class="text-caption">{{ stat.month }}</div>
                      <div class="text-caption text-weight-bold">{{ stat.surveys }}</div>
                    </div>
                  </div>
                </div>

                <q-separator class="q-my-md" />

                <!-- Métricas -->
                <div class="row items-center justify-between q-mb-sm">
                  <div class="text-caption">Taxa de Conclusão</div>
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ systemReport.completionRate }}%
                  </div>
                </div>

                <div class="row items-center justify-between">
                  <div class="text-caption">Satisfação Média</div>
                  <div class="text-h6 text-weight-bold text-orange">
                    {{ systemReport.averageSatisfaction }}/5
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <!-- Ações do Sistema -->
            <q-card>
              <q-card-section class="bg-purple-1">
                <div class="text-h6 text-weight-bold">Ações do Sistema</div>
              </q-card-section>

              <q-card-section>
                <div class="column q-gutter-y-md">
                  <q-btn
                    label="Gerar Relatório Mensal"
                    color="primary"
                    icon="description"
                    class="full-width"
                    @click="generateReport"
                  />

                  <q-btn
                    label="Exportar Usuários"
                    color="green"
                    icon="cloud_download"
                    class="full-width"
                    @click="exportUsers"
                  />

                  <q-btn
                    label="Processar Pagamentos"
                    color="orange"
                    icon="payments"
                    class="full-width"
                    @click="processPayments"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-store';
import { useAdminStore } from 'stores/admin-store';
import { Notify } from 'quasar';
import type { QTableColumn, SystemUserColumn } from 'src/types/qtable';
import type { SystemUser } from '../types/dashboard';

const router = useRouter();
const userStore = useUserStore();
const adminStore = useAdminStore();

// Computed
const adminStats = computed(() => adminStore.adminStats);
const systemUsers = computed(() => adminStore.systemUsers);
const recentTransactions = computed(() => adminStore.recentTransactions);
const systemReport = computed(() => adminStore.systemReport);

// Colunas da tabela de usuários - TIPADO CORRETAMENTE
const userColumns: QTableColumn<SystemUserColumn>[] = [
  {
    name: 'user',
    label: 'Usuário',
    field: 'name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    field: 'email',
    align: 'left',
    sortable: true,
  },
  {
    name: 'institution',
    label: 'Instituição',
    field: 'institution',
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Tipo',
    field: 'type',
    align: 'center',
    sortable: true,
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'center',
    sortable: true,
  },
  {
    name: 'activity',
    label: 'Atividade',
    field: 'activity',
    align: 'center',
    sortable: true,
  },
  {
    name: 'financials',
    label: 'Financeiro',
    field: 'financials',
    align: 'center',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Ações',
    field: '',
    align: 'center',
  },
];

// Métodos
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
  });
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'green',
    pending: 'orange',
    suspended: 'red',
  };
  return colors[status] || 'grey';
};

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    active: 'Ativo',
    pending: 'Pendente',
    suspended: 'Suspenso',
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

const getTransactionStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    processed: 'green',
    approved: 'blue',
    pending: 'orange',
  };
  return colors[status] || 'grey';
};

const getTransactionStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    processed: 'Processado',
    approved: 'Aprovado',
    pending: 'Pendente',
  };
  return texts[status] || status;
};

const getTransactionTypeText = (type: string): string => {
  const texts: Record<string, string> = {
    withdrawal: 'Saque',
    payment: 'Pagamento',
  };
  return texts[type] || type;
};

const getTransactionMethodText = (method: string): string => {
  const texts: Record<string, string> = {
    mpesa: 'M-Pesa',
    card: 'Cartão',
  };
  return texts[method] || method.toUpperCase();
};

const editUser = (user: SystemUser): void => {
  Notify.create({
    message: `Editando usuário: ${user.name}`,
    color: 'info',
    icon: 'edit',
  });
};

const deleteUser = (userId: string): void => {
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    adminStore.deleteUser(userId);
    Notify.create({
      message: 'Usuário excluído com sucesso!',
      color: 'positive',
      icon: 'check_circle',
    });
  }
};

const generateReport = (): void => {
  const reportUrl = adminStore.generateMonthlyReport();
  const link = document.createElement('a');
  link.href = reportUrl;
  link.download = `relatorio-mensal-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  Notify.create({
    message: 'Relatório gerado com sucesso!',
    color: 'positive',
    icon: 'description',
  });
};

const exportUsers = (): void => {
  const csvUrl = adminStore.exportUsers();
  const link = document.createElement('a');
  link.href = csvUrl;
  link.download = `usuarios-mozpesquisa-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();

  Notify.create({
    message: 'Usuários exportados com sucesso!',
    color: 'positive',
    icon: 'cloud_download',
  });
};

const processPayments = (): void => {
  const processed = adminStore.processPendingPayments();
  Notify.create({
    message: `${processed.length} pagamentos processados!`,
    color: 'positive',
    icon: 'payments',
  });
};

const logout = (): void => {
  userStore.logout();
  void router.push('/login');
  Notify.create({
    message: 'Logout realizado com sucesso!',
    color: 'info',
    icon: 'logout',
  });
};
</script>

<style scoped lang="scss">
.bg-dark {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.full-height {
  height: 100vh;
}

.rounded-borders {
  border-radius: 8px;
}

:deep(.q-table__card) {
  box-shadow: none;
}

:deep(.q-table tbody td) {
  border-bottom: 1px solid #e0e0e0;
}
</style>
