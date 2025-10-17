<template>
  <q-page class="bg-grey-1">
    <div class="row justify-center q-pt-xl">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Cabeçalho -->
        <div class="text-center q-mb-xl">
          <h1 class="text-h4 text-weight-bold text-primary">Cadastro de Estudante</h1>
          <p class="text-h6 text-grey-7 q-mt-md">
            Junte-se ao MozPesquisa e facilite suas pesquisas acadêmicas
          </p>
        </div>

        <!-- Stepper -->
        <q-stepper v-model="step" ref="stepper" color="primary" animated class="q-mb-lg">
          <!-- Step 1: Informações Pessoais -->
          <q-step :name="1" title="Informações Pessoais" icon="person" :done="step > 1">
            <q-form @submit="nextStep" class="q-gutter-md">
              <div>
                <label class="text-weight-bold text-grey-8">Nome Completo *</label>
                <q-input
                  v-model="form.name"
                  placeholder="João Nhampossa"
                  dense
                  outlined
                  class="q-mt-xs"
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                />
              </div>

              <div>
                <label class="text-weight-bold text-grey-8">Email *</label>
                <q-input
                  v-model="form.email"
                  placeholder="joao@exemplo.com"
                  type="email"
                  dense
                  outlined
                  class="q-mt-xs"
                  :rules="[
                    (val) => !!val || 'Email é obrigatório',
                    (val) => /.+@.+\..+/.test(val) || 'Email inválido',
                  ]"
                />
              </div>

              <div class="row q-gutter-md">
                <div class="col">
                  <label class="text-weight-bold text-grey-8">Universidade *</label>
                  <q-select
                    v-model="form.university"
                    :options="universities"
                    placeholder="Selecione sua universidade"
                    dense
                    outlined
                    class="q-mt-xs"
                    :rules="[(val) => !!val || 'Universidade é obrigatória']"
                  />
                </div>
                <div class="col">
                  <label class="text-weight-bold text-grey-8">Curso *</label>
                  <q-input
                    v-model="form.course"
                    placeholder="Engenharia Informática"
                    dense
                    outlined
                    class="q-mt-xs"
                    :rules="[(val) => !!val || 'Curso é obrigatório']"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn label="Próximo" type="submit" color="primary" icon-right="arrow_forward" />
              </div>
            </q-form>
          </q-step>

          <!-- Step 2: Verificação de Estudante -->
          <q-step :name="2" title="Verificação de Estudante" icon="school" :done="step > 2">
            <q-form @submit="nextStep" class="q-gutter-md">
              <div>
                <label class="text-weight-bold text-grey-8">Cartão de Estudante *</label>
                <q-file
                  v-model="form.studentCard"
                  placeholder="Escolha o arquivo do seu cartão de estudante"
                  dense
                  outlined
                  class="q-mt-xs"
                  accept=".jpg,.jpeg,.png,.pdf"
                  :rules="[(val) => !!val || 'Cartão de estudante é obrigatório']"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Formatos aceitos: JPG, PNG, PDF (máx. 5MB)
                </div>
              </div>

              <div class="row justify-between q-mt-lg">
                <q-btn label="Voltar" color="grey" @click="previousStep" icon="arrow_back" />
                <q-btn label="Próximo" type="submit" color="primary" icon-right="arrow_forward" />
              </div>
            </q-form>
          </q-step>

          <!-- Step 3: Segurança -->
          <q-step :name="3" title="Segurança" icon="lock" :done="step > 3">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div>
                <label class="text-weight-bold text-grey-8">Senha *</label>
                <q-input
                  v-model="form.password"
                  placeholder="Mínimo 8 caracteres"
                  type="password"
                  dense
                  outlined
                  class="q-mt-xs"
                  :rules="[
                    (val) => !!val || 'Senha é obrigatória',
                    (val) => val.length >= 8 || 'Mínimo 8 caracteres',
                  ]"
                />
              </div>

              <div>
                <label class="text-weight-bold text-grey-8">Confirmar Senha *</label>
                <q-input
                  v-model="form.confirmPassword"
                  placeholder="Repita a senha"
                  type="password"
                  dense
                  outlined
                  class="q-mt-xs"
                  :rules="[
                    (val) => !!val || 'Confirmação é obrigatória',
                    (val) => val === form.password || 'Senhas não coincidem',
                  ]"
                />
              </div>

              <div class="row justify-between q-mt-lg">
                <q-btn label="Voltar" color="grey" @click="previousStep" icon="arrow_back" />
                <q-btn
                  label="Finalizar Cadastro"
                  type="submit"
                  color="primary"
                  icon-right="check"
                />
              </div>
            </q-form>
          </q-step>
        </q-stepper>

        <!-- Link para Login -->
        <div class="text-center q-pt-md">
          <span class="text-grey-7">Já tem uma conta? </span>
          <a href="#" class="text-primary text-weight-bold" @click.prevent="$router.push('/login')">
            Fazer login
          </a>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from 'stores/user-store';
import { QStepper } from 'quasar';

const router = useRouter();
const userStore = useUserStore();
const stepper = ref<QStepper>();

const step = ref(1);

const form = ref({
  name: '',
  email: '',
  university: '',
  course: '',
  studentCard: null as File | null,
  password: '',
  confirmPassword: '',
});

const universities = [
  'Universidade Eduardo Mondlane (UEM)',
  'Universidade Pedagógica (UP)',
  'Universidade Lúrio (UniLúrio)',
  'Universidade Zambeze (UniZambeze)',
  'Universidade Save (UniSave)',
  'Universidade Rovuma (UniRovuma)',
  'Universidade Licungo (UniLicungo)',
  'Instituto Superior de Ciências e Tecnologia de Moçambique (ISCTEM)',
  'Instituto Superior de Transportes e Comunicações (ISUTC)',
  'Outra',
];

const nextStep = () => {
  step.value++;
};

const previousStep = () => {
  step.value--;
};

const onSubmit = async () => {
  try {
    // Simular cadastro
    await new Promise((resolve) => setTimeout(resolve, 1500));

    userStore.register(
      {
        id: Math.random().toString(36).substr(2, 9),
        name: form.value.name,
        email: form.value.email,
        type: 'student',
        status: 'active',
        registrationDate: new Date().toLocaleDateString('pt-BR'),
        university: form.value.university,
        course: form.value.course,
      },
      'fake-token-' + Date.now(),
    );

    await router.push('/dashboard');
  } catch (error) {
    console.error('Erro no cadastro:', error);
  }
};
</script>

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.q-stepper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
