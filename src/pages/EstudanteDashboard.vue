<template>
  <q-page class="bg-grey-1">
    <!-- Cabeçalho -->
    <div class="bg-primary text-white q-pa-md">
      <div class="container">
        <div class="row items-center">
          <div class="col">
            <h1 class="text-h4 text-weight-bold q-mb-xs">Painel do Estudante</h1>
            <div class="text-subtitle1">
              {{ userName }} • {{ userEmail }} • {{ userUniversity }}
            </div>
            <div class="text-caption" v-if="userCourse">Curso: {{ userCourse }}</div>
          </div>
          <div class="col-auto">
            <q-btn round icon="notifications" flat color="white">
              <q-badge color="red" floating>3</q-badge>
            </q-btn>
          </div>
        </div>
      </div>
    </div>

    <div class="container q-pa-lg">
      <div class="row q-col-gutter-lg">
        <!-- Coluna Principal -->
        <div class="col-12 col-md-8">
          <!-- Minhas Pesquisas -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-blue-grey-1">
              <div class="text-h6 text-weight-bold">Minhas Pesquisas</div>
            </q-card-section>

            <q-card-section>
              <!-- Pesquisas do estudante -->
              <div
                v-for="survey in studentSurveys"
                :key="survey.id"
                class="survey-item q-pa-md q-mb-md rounded-borders bg-white shadow-1"
              >
                <div class="row items-center">
                  <div class="col">
                    <div class="text-h6 text-weight-bold text-primary">{{ survey.title }}</div>
                    <div class="text-caption text-grey">Criada em {{ survey.createdDate }}</div>
                    <div class="text-caption text-grey" v-if="survey.targetAudience">
                      Público: {{ survey.targetAudience }}
                    </div>
                  </div>
                  <div class="col-auto">
                    <div class="row items-center q-gutter-x-lg">
                      <div class="text-center">
                        <div class="text-h5 text-weight-bold text-primary">
                          {{ survey.responses }}
                        </div>
                        <div class="text-caption text-grey">Respostas</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h5 text-weight-bold text-grey">{{ survey.target }}</div>
                        <div class="text-caption text-grey">Meta</div>
                      </div>
                      <div class="text-center">
                        <div class="text-h5 text-weight-bold text-green">
                          {{ survey.reward }} MZN
                        </div>
                        <div class="text-caption text-grey">Por resposta</div>
                      </div>
                      <q-badge
                        v-if="survey.responses >= survey.target"
                        color="green"
                        class="q-ml-sm"
                      >
                        Concluída
                      </q-badge>
                      <q-btn v-else label="Ver Detalhes" color="primary" outline size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mensagem quando não há pesquisas -->
              <div v-if="studentSurveys.length === 0" class="text-center q-pa-xl text-grey-6">
                <q-icon name="assignment" size="xl" class="q-mb-md" />
                <div class="text-h6">Nenhuma pesquisa criada ainda</div>
                <div class="text-caption">
                  Crie sua primeira pesquisa usando o formulário abaixo
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Nova Pesquisa -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-green-1">
              <div class="text-h6 text-weight-bold">Criar Nova Pesquisa</div>
            </q-card-section>
            <q-card-section>
              <q-form @submit="createNewSurvey" class="q-gutter-md">
                <div class="row q-gutter-md">
                  <div class="col">
                    <q-input
                      v-model="newSurvey.title"
                      label="Título da Pesquisa *"
                      placeholder="Ex: Satisfação com o ensino online"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Título é obrigatório']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="newSurvey.googleFormLink"
                      label="Link do Google Forms *"
                      placeholder="https://forms.google.com/..."
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Link é obrigatório']"
                    />
                  </div>
                </div>

                <div class="row q-gutter-md">
                  <div class="col">
                    <q-input
                      v-model="newSurvey.targetResponses"
                      label="Meta de Respostas *"
                      placeholder="100"
                      type="number"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Meta é obrigatória']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="newSurvey.reward"
                      label="Recompensa por Resposta (MZN) *"
                      placeholder="10"
                      type="number"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Recompensa é obrigatória']"
                    />
                  </div>
                  <div class="col">
                    <q-select
                      v-model="newSurvey.targetAudience"
                      label="Público-Alvo *"
                      :options="targetAudienceOptions"
                      outlined
                      dense
                      :rules="[(val) => !!val || 'Público-alvo é obrigatório']"
                    />
                  </div>
                </div>

                <div class="row justify-end">
                  <q-btn label="Criar Pesquisa" type="submit" color="primary" icon-right="add" />
                </div>
              </q-form>
            </q-card-section>
          </q-card>
        </div>

        <!-- Sidebar -->
        <div class="col-12 col-md-4">
          <!-- Modo Participante -->
          <q-card class="q-mb-lg">
            <q-card-section class="bg-orange-1">
              <div class="text-h6 text-weight-bold">Modo Participante</div>
            </q-card-section>
            <q-card-section>
              <p class="text-grey-7">
                Como estudante cadastrado, você também pode participar e ganhar dinheiro respondendo
                pesquisas de outros.
              </p>
              <q-checkbox
                v-model="participantMode"
                label="Ativar Modo Participante"
                color="primary"
              />

              <!-- Mostrar pesquisas disponíveis quando o modo participante estiver ativo -->
              <div v-if="participantMode && availableSurveys.length > 0" class="q-mt-md">
                <div class="text-weight-bold q-mb-sm">Pesquisas Disponíveis:</div>
                <div
                  v-for="survey in availableSurveys.slice(0, 3)"
                  :key="survey.id"
                  class="q-pa-xs q-mb-xs rounded-borders bg-grey-2"
                >
                  <div class="text-caption text-weight-medium">{{ survey.title }}</div>
                  <div class="text-caption text-grey">{{ survey.reward }} MZN por resposta</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- Estatísticas -->
          <q-card>
            <q-card-section class="bg-purple-1">
              <div class="text-h6 text-weight-bold">Estatísticas</div>
            </q-card-section>
            <q-card-section>
              <div class="q-gutter-y-md">
                <div class="row items-center justify-between">
                  <div class="text-grey-7">Total de Pesquisas</div>
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ studentStatistics.totalSurveys }}
                  </div>
                </div>
                <div class="row items-center justify-between">
                  <div class="text-grey-7">Taxa de Conclusão</div>
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ studentStatistics.completionRate }}%
                  </div>
                </div>
                <div class="row items-center justify-between">
                  <div class="text-grey-7">Total Ganho</div>
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ studentStatistics.totalEarned }} MZN
                  </div>
                </div>
                <div class="row items-center justify-between">
                  <div class="text-grey-7">Total Respostas</div>
                  <div class="text-h6 text-weight-bold text-primary">
                    {{ studentStatistics.totalResponses }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useUserStore } from 'stores/user-store';
import { useStudentStore } from 'stores/student-store';
import { Notify } from 'quasar';

const userStore = useUserStore();
const studentStore = useStudentStore();

// Variáveis reativas
const participantMode = ref(false);

const newSurvey = ref({
  title: '',
  googleFormLink: '',
  targetResponses: null as number | null,
  reward: null as number | null,
  targetAudience: '',
});

const targetAudienceOptions = [
  'Estudantes Universitários',
  'Jovens 18-25 anos',
  'Profissionais TI',
  'Estudantes Secundários',
  'Geral',
];

// Dados do usuário logado
const userName = computed(() => userStore.user?.name || 'Estudante');
const userEmail = computed(() => userStore.user?.email || '');
const userUniversity = computed(() => userStore.user?.university || 'Não informada');
const userCourse = computed(() => userStore.user?.course || 'Não informado');

// Estatísticas do estudante
const studentStatistics = computed(() => studentStore.studentStats);
const studentSurveys = computed(() => studentStore.studentSurveys);
const availableSurveys = computed(() => studentStore.availableSurveys);

// Função para criar nova pesquisa
const createNewSurvey = () => {
  if (
    !newSurvey.value.title ||
    !newSurvey.value.googleFormLink ||
    !newSurvey.value.targetResponses ||
    !newSurvey.value.reward ||
    !newSurvey.value.targetAudience
  ) {
    Notify.create({
      type: 'negative',
      message: 'Preencha todos os campos obrigatórios',
      position: 'top',
    });
    return;
  }

  studentStore.createSurvey({
    title: newSurvey.value.title,
    googleFormLink: newSurvey.value.googleFormLink,
    targetResponses: newSurvey.value.targetResponses,
    reward: newSurvey.value.reward,
    targetAudience: newSurvey.value.targetAudience,
  });

  Notify.create({
    type: 'positive',
    message: 'Pesquisa criada com sucesso!',
    position: 'top',
  });

  // Reset form
  newSurvey.value = {
    title: '',
    googleFormLink: '',
    targetResponses: null,
    reward: null,
    targetAudience: '',
  };
};
</script>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.survey-item {
  border-left: 4px solid $primary;
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
