<template>
  <q-page class="bg-grey-1">
    <!-- Cabeçalho -->
    <div class="bg-green text-white q-pa-md">
      <div class="container">
        <div class="row items-center">
          <div class="col">
            <h1 class="text-h4 text-weight-bold q-mb-xs">Painel do Participante</h1>
            <div class="text-subtitle1">
              {{ userStore.user?.name }} - {{ userStore.user?.email }}
            </div>
          </div>
          <div class="col-auto">
            <q-btn round icon="notifications" flat color="white">
              <q-badge color="red" floating>
                {{ pendingTransactionsCount }}
              </q-badge>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="container q-pa-lg">
      <div class="row q-col-gutter-lg">
        <!-- Coluna Principal -->
        <div class="col-12 col-md-8">
          <!-- Estatísticas Rápidas -->
          <div class="row q-col-gutter-md q-mb-lg">
            <div class="col-6 col-sm-3">
              <q-card class="text-center bg-blue-1">
                <q-card-section>
                  <div class="text-h5 text-weight-bold text-primary">
                    {{ participantStats.currentBalance }} MZN
                  </div>
                  <div class="text-caption text-grey">Saldo Atual</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card class="text-center bg-green-1">
                <q-card-section>
                  <div class="text-h5 text-weight-bold text-green">
                    {{ participantStats.totalEarned }} MZN
                  </div>
                  <div class="text-caption text-grey">Total Ganho</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card class="text-center bg-orange-1">
                <q-card-section>
                  <div class="text-h5 text-weight-bold text-orange">
                    #{{ participantStats.ranking }}
                  </div>
                  <div class="text-caption text-grey">Ranking</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-6 col-sm-3">
              <q-card class="text-center bg-purple-1">
                <q-card-section>
                  <div class="text-h5 text-weight-bold text-purple">
                    {{ availableSurveys.length }}
                  </div>
                  <div class="text-caption text-grey">Disponíveis</div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- Pesquisas Disponíveis -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-primary text-white">
              <div class="text-h6 text-weight-bold">Pesquisas Disponíveis</div>
              <div class="text-caption">{{ availableSurveys.length }} disponíveis</div>
            </q-card-section>

            <q-card-section>
              <!-- Pesquisas reais da store -->
              <div 
                v-for="survey in availableSurveys" 
                :key="survey.id"
                class="survey-item q-pa-md q-mb-md rounded-borders bg-white shadow-1"
              >
                <div class="row items-start">
                  <div class="col">
                    <div class="text-h6 text-weight-bold text-primary">
                      {{ survey.title }}
                    </div>
                    <div class="text-caption text-grey q-mb-sm">
                      {{ survey.description || 'Pesquisa acadêmica' }}
                    </div>
                    <div class="text-caption">
                      Por: <strong>{{ getCreatorName(survey) }}</strong>
                    </div>
                    <div v-if="survey.targetAudience" class="text-caption text-grey">
                      Público: {{ survey.targetAudience }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="column items-end q-gutter-y-sm">
                      <div class="text-h6 text-weight-bold text-green">{{ survey.reward }} MZN</div>
                      <div class="text-caption text-grey">Pagamento</div>

                      <div class="text-caption">
                        <q-icon name="schedule" size="16px" class="q-mr-xs" />
                        {{ estimateDuration(survey.target) }} min
                      </div>
                      <div class="text-caption text-grey">Duração estimada</div>

                      <div class="text-caption">
                        <q-icon name="people" size="16px" class="q-mr-xs" />
                        {{ survey.responses }}/{{ survey.target }}
                      </div>
                      <div class="text-caption text-grey">Progresso</div>
                    </div>
                  </div>
                </div>
                <div class="row justify-end q-mt-md">
                  <q-btn
                    label="Responder Pesquisa"
                    color="primary"
                    @click="respondToSurvey(survey.id)"
                  />
                </div>
              </div>

              <!-- Mensagem quando não há pesquisas -->
              <div 
                v-if="availableSurveys.length === 0"
                class="text-center q-pa-xl text-grey-6"
              >
                <q-icon name="search_off" size="xl" class="q-mb-md" />
                <div class="text-h6">Nenhuma pesquisa disponível no momento</div>
                <div class="text-caption">Novas pesquisas aparecerão aqui quando disponíveis</div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <!-- Saque via M-Pesa -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-green-1">
              <div class="text-h6 text-weight-bold">Meu Saldo</div>
            </q-card-section>
            <q-card-section>
              <div class="text-center q-mb-md">
                <div class="text-h4 text-weight-bold text-green">
                  {{ participantStats.currentBalance }} MZN
                </div>
                <div class="text-caption text-grey">Disponível para saque</div>
              </div>
              <q-btn
                label="Saque via M-Pesa"
                color="green"
                class="full-width"
                icon="account_balance_wallet"
                :disable="participantStats.currentBalance === 0"
                @click="showWithdrawDialog = true"
              />
            </q-card-section>
          </q-card>

          <!-- Ranking dos Participantes -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-orange-1">
              <div class="text-h6 text-weight-bold">Ranking dos Participantes</div>
            </q-card-section>
            <q-card-section>
              <div class="q-gutter-y-sm">
                <div
                  v-for="player in rankings.slice(0, 5)"
                  :key="player.userId"
                  class="row items-center q-pa-sm rounded-borders"
                  :class="player.userId === userStore.user?.id ? 'bg-blue-1' : ''"
                >
                  <div class="col-auto q-mr-md">
                    <q-badge
                      :color="player.position <= 3 ? 'orange' : 'grey'"
                      class="text-weight-bold"
                    >
                      #{{ player.position }}
                    </q-badge>
                  </div>
                  <div class="col">
                    <div class="text-caption text-weight-medium">
                      {{ getPlayerName(player) }}
                      <q-badge 
                        v-if="player.userId === userStore.user?.id" 
                        color="blue" 
                        label="Você" 
                      />
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="text-caption text-weight-bold text-green">
                      {{ player.totalEarned }} MZN
                    </div>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Histórico Recente -->
          <q-card>
            <q-card-section class="bg-purple-1">
              <div class="text-h6 text-weight-bold">Histórico Recente</div>
            </q-card-section>
            <q-card-section>
              <div class="q-gutter-y-md">
                <div
                  v-for="transaction in transactionHistory.slice(0, 3)"
                  :key="transaction.id"
                  class="row items-center justify-between"
                >
                  <div class="col">
                    <div class="text-caption text-weight-medium">
                      {{ transaction.surveyTitle || 'Saque' }}
                    </div>
                    <div class="text-caption text-grey">{{ transaction.date }}</div>
                  </div>
                  <div class="col-auto">
                    <div class="row items-center q-gutter-x-sm">
                      <div
                        class="text-caption text-weight-bold"
                        :class="transaction.type === 'withdrawal' ? 'text-red' : 'text-green'"
                      >
                        {{ transaction.type === 'withdrawal' ? '-' : '+' }}{{ transaction.amount }} MZN
                      </div>
                      <q-badge
                        :color="getStatusColor(transaction.status)"
                        :label="getStatusText(transaction.status)"
                      />
                    </div>
                  </div>
                </div>

                <!-- Mensagem quando não há transações -->
                <div 
                  v-if="transactionHistory.length === 0"
                  class="text-center q-py-md text-grey-6"
                >
                  <div class="text-caption">Nenhuma transação ainda</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Dialog de Saque -->
    <q-dialog v-model="showWithdrawDialog">
      <q-card style="width: 400px">
        <q-card-section class="bg-green text-white">
          <div class="text-h6">Saque via M-Pesa</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="text-center q-mb-md">
            <div class="text-h5 text-weight-bold">{{ participantStats.currentBalance }} MZN</div>
            <div class="text-caption text-grey">Saldo disponível</div>
          </div>

          <q-input
            v-model.number="withdrawAmount"
            type="number"
            label="Valor a sacar (MZN)"
            :max="participantStats.currentBalance"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="mpesaNumber"
            label="Número M-Pesa"
            placeholder="84 XXX XXXX"
            mask="## ### ####"
            outlined
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="Confirmar Saque"
            color="green"
            @click="processWithdraw"
            :disable="
              !withdrawAmount || !mpesaNumber || withdrawAmount > participantStats.currentBalance
            "
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/user-store';
import { useParticipantStore } from 'stores/participant-store';
import { Notify } from 'quasar';
import type { Survey, ParticipantStats } from '../types/shared/shared';

const userStore = useUserStore();
const participantStore = useParticipantStore();

const showWithdrawDialog = ref(false);
const withdrawAmount = ref<number | null>(null);
const mpesaNumber = ref('');

// Computed
const availableSurveys = computed(() => participantStore.availableSurveys);
const participantStats = computed(() => participantStore.myStats);
const rankings = computed(() => participantStore.rankings);
const transactionHistory = computed(() => participantStore.myTransactions);

// Computed adicional para transações pendentes
const pendingTransactionsCount = computed(() => {
  return transactionHistory.value.filter(t => t.status === 'pending').length;
});

// Métodos auxiliares
const estimateDuration = (target: number): number => {
  if (target <= 10) return 5;
  if (target <= 20) return 8;
  return 10;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    processed: 'green',
    approved: 'blue',
    pending: 'orange',
  };
  return colors[status] || 'grey';
};

const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    processed: 'Processado',
    approved: 'Aprovado',
    pending: 'Pendente',
  };
  return texts[status] || status;
};

const getCreatorName = (survey: Survey): string => {
  // Tenta obter o nome do criador de várias fontes
  if (survey.creatorName) return survey.creatorName;
  if (survey.creatorId) {
    // Aqui você poderia buscar o nome do usuário pelo ID se necessário
    return `Estudante ${survey.creatorId.substring(0, 6)}`;
  }
  return 'Estudante';
};

const getPlayerName = (player: ParticipantStats): string => {
  if (player.userName) return player.userName;
  if (player.userId === userStore.user?.id) return 'Você';
  return `Participante ${player.userId.substring(0, 6)}`;
};

const respondToSurvey = (surveyId: string) => {
  const transaction = participantStore.respondToSurvey(surveyId);
  if (transaction) {
    Notify.create({
      type: 'positive',
      message: `Pesquisa iniciada! Você ganhará ${transaction.amount} MZN após conclusão.`,
      position: 'top',
      icon: 'check_circle',
    });
  }
};

const processWithdraw = () => {
  if (withdrawAmount.value && mpesaNumber.value) {
    const success = participantStore.withdrawBalance(withdrawAmount.value);
    if (success) {
      Notify.create({
        type: 'positive',
        message: `Saque de ${withdrawAmount.value} MZN processado para ${mpesaNumber.value}!`,
        position: 'top',
        icon: 'account_balance_wallet',
      });
      showWithdrawDialog.value = false;
      withdrawAmount.value = null;
      mpesaNumber.value = '';
    } else {
      Notify.create({
        type: 'negative',
        message: 'Saldo insuficiente para saque!',
        position: 'top',
        icon: 'error',
      });
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.survey-item {
  border-left: 4px solid $green;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.rounded-borders {
  border-radius: 8px;
}
</style>