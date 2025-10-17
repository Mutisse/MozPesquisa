<template>
  <q-page class="bg-grey-1">
    <div class="row justify-center q-pt-xl">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Cabeçalho -->
        <div class="text-center q-mb-xl">
          <h1 class="text-h4 text-weight-bold text-primary">MozPesquisa</h1>
          <p class="text-h6 text-grey-7 q-mt-md">Ganhe dinheiro respondendo pesquisas acadêmicas</p>
        </div>

        <!-- Stepper -->
        <q-stepper v-model="step" ref="stepper" color="green" animated class="q-mb-lg">
          <!-- Step 1: Informações Pessoais -->
          <q-step :name="1" title="Informações Pessoais" icon="person" :done="step > 1">
            <q-form @submit="nextStep" class="q-gutter-md">
              <div>
                <div class="row items-center">
                  <div class="feature-letter">A</div>
                  <label class="text-weight-bold text-grey-8">Nome Completo *</label>
                </div>
                <q-input
                  v-model="form.name"
                  placeholder="Maria Chissano"
                  dense
                  outlined
                  class="q-mt-xs"
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                />
              </div>

              <div>
                <div class="row items-center">
                  <div class="feature-letter">B</div>
                  <label class="text-weight-bold text-grey-8">Email *</label>
                </div>
                <q-input
                  v-model="form.email"
                  placeholder="maria@exemplo.com"
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
                  <label class="text-weight-bold text-grey-8">Idade *</label>
                  <q-input
                    v-model="form.age"
                    placeholder="Ex: 25"
                    type="number"
                    dense
                    outlined
                    class="q-mt-xs"
                    :rules="[
                      (val) => !!val || 'Idade é obrigatória',
                      (val) => val >= 18 || 'Idade mínima é 18 anos',
                      (val) => val <= 100 || 'Idade inválida',
                    ]"
                  />
                </div>
                <div class="col">
                  <div class="row items-center">
                    <div class="feature-letter">C</div>
                    <label class="text-weight-bold text-grey-8">Província *</label>
                  </div>
                  <q-select
                    v-model="form.province"
                    :options="provinces"
                    placeholder="Selecione sua província"
                    dense
                    outlined
                    class="q-mt-xs"
                    :rules="[(val) => !!val || 'Província é obrigatória']"
                  />
                </div>
              </div>

              <div class="row justify-end q-mt-lg">
                <q-btn label="Próximo" type="submit" color="green" icon-right="arrow_forward" />
              </div>
            </q-form>
          </q-step>

          <!-- Step 2: Informações de Pagamento -->
          <q-step :name="2" title="Informações de Pagamento" icon="payments" :done="step > 2">
            <q-form @submit="nextStep" class="q-gutter-md">
              <div>
                <div class="row items-center">
                  <div class="feature-letter">D</div>
                  <label class="text-weight-bold text-grey-8">Número M-Pesa *</label>
                </div>
                <q-input
                  v-model="form.mpesaNumber"
                  placeholder="+258841234567"
                  dense
                  outlined
                  class="q-mt-xs"
                  mask="+258##########"
                  :rules="[(val) => !!val || 'Número M-Pesa é obrigatório']"
                />
                <div class="text-caption text-grey-6 q-mt-xs">
                  Número onde receberá os pagamentos via M-Pesa
                </div>
              </div>

              <div>
                <div class="row items-center">
                  <div class="feature-letter">G</div>
                  <label class="text-weight-bold text-grey-8">
                    Receber notificações de novas pesquisas via WhatsApp
                  </label>
                </div>
                <q-toggle v-model="form.whatsappNotifications" color="green" class="q-mt-xs" />
                <div class="text-caption text-grey-6 q-mt-xs">
                  Receba alertas quando novas pesquisas estiverem disponíveis
                </div>
              </div>

              <div class="row justify-between q-mt-lg">
                <q-btn label="Voltar" color="grey" @click="previousStep" icon="arrow_back" />
                <q-btn label="Próximo" type="submit" color="green" icon-right="arrow_forward" />
              </div>
            </q-form>
          </q-step>

          <!-- Step 3: Segurança -->
          <q-step :name="3" title="Segurança" icon="lock" :done="step > 3">
            <q-form @submit="onSubmit" class="q-gutter-md">
              <div>
                <div class="row items-center">
                  <div class="feature-letter">E</div>
                  <label class="text-weight-bold text-grey-8">Senha *</label>
                </div>
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
                <div class="row items-center">
                  <div class="feature-letter">F</div>
                  <label class="text-weight-bold text-grey-8">Confirmar Senha *</label>
                </div>
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
                <q-btn label="Finalizar Cadastro" type="submit" color="green" icon-right="check" />
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
  age: '',
  province: '',
  mpesaNumber: '',
  password: '',
  confirmPassword: '',
  whatsappNotifications: true,
});

const provinces = [
  'Maputo Cidade',
  'Maputo Província',
  'Gaza',
  'Inhambane',
  'Sofala',
  'Manica',
  'Tete',
  'Zambézia',
  'Nampula',
  'Cabo Delgado',
  'Niassa',
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
        type: 'participant',
        status: 'active', // ADICIONADO: propriedade obrigatória
        registrationDate: new Date().toLocaleDateString('pt-BR'), // ADICIONADO: propriedade obrigatória
        age: parseInt(form.value.age),
        province: form.value.province,
        mpesaNumber: form.value.mpesaNumber,
      },
      'fake-token-' + Date.now(),
    );

    await router.push('/dashboard'); // CORRIGIDO: adicionado await
  } catch (error) {
    console.error('Erro no cadastro:', error);
  }
};
</script>

<style scoped lang="scss">
.feature-letter {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #003366;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  margin-right: 8px;
}

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
