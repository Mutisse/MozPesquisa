<template>
  <div>
    <!-- Card de Login Usuário -->
    <q-card class="q-pa-lg shadow-1">
      <q-card-section class="text-center">
        <div class="text-h5 text-weight-bold text-grey-8 q-mb-md">Login</div>
        <p class="text-grey-7 q-mb-md">Acesse sua conta MozPesquisa</p>

        <!-- Botões de alternância -->
        <div class="row justify-center q-mb-md">
          <q-btn-toggle
            v-model="currentMode"
            toggle-color="primary"
            spread
            :options="[
              {
                label: 'Usuário',
                value: 'user',
                icon: 'person',
              },
              {
                label: 'Admin',
                value: 'admin',
                icon: 'admin_panel_settings',
              },
            ]"
            class="mode-toggle"
            @update:model-value="handleModeChange"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Email -->
          <div>
            <label class="text-weight-bold text-grey-8">Email</label>
            <q-input
              v-model="form.email"
              placeholder="seu@email.com"
              type="email"
              dense
              outlined
              class="q-mt-xs"
              :rules="[
                (val) => !!val || 'Email é obrigatório',
                (val) => /.+@.+\..+/.test(val) || 'Email inválido',
              ]"
            >
              <template v-slot:prepend>
                <q-icon name="mail" color="grey-6" />
              </template>
            </q-input>
          </div>

          <!-- Senha -->
          <div>
            <label class="text-weight-bold text-grey-8">Senha</label>
            <q-input
              v-model="form.password"
              placeholder="Sua senha"
              :type="isPwd ? 'password' : 'text'"
              dense
              outlined
              class="q-mt-xs"
              :rules="[(val) => !!val || 'Senha é obrigatória']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="grey-6" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>

          <!-- Botão Entrar -->
          <div class="q-pt-md">
            <q-btn
              label="Entrar"
              type="submit"
              color="primary"
              class="full-width"
              size="lg"
              icon="login"
              :loading="loading"
            />
          </div>

          <!-- Link Esqueci Senha -->
          <div class="text-center">
            <a href="#" class="text-primary text-caption"> Esqueci minha senha </a>
          </div>
        </q-form>
      </q-card-section>

      <q-separator class="q-my-md" />

      <!-- Cadastro -->
      <q-card-section class="text-center">
        <p class="text-grey-7 q-mb-md">Ainda não tem uma conta?</p>

        <div class="row q-col-gutter-sm">
          <div class="col-6">
            <q-btn
              label="Cadastrar como Estudante"
              color="primary"
              outline
              class="full-width"
              @click="$router.push('/register/student')"
              icon="school"
            />
          </div>
          <div class="col-6">
            <q-btn
              label="Cadastrar como Participante"
              color="green"
              outline
              class="full-width"
              @click="$router.push('/register/participant')"
              icon="person"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Credenciais de Teste -->
    <q-card class="q-mt-lg q-pa-md bg-blue-1">
      <q-card-section class="text-center">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
          Credenciais de Teste:
        </div>
        <div class="text-caption text-grey-7">Estudante: estudante@exemplo.com / senha123</div>
        <div class="text-caption text-grey-7">Participante: participante@exemplo.com / senha123</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from 'stores/user-store';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { sharedUsers } from 'stores/base-store';

// Emits
const emit = defineEmits<{
  switchMode: [mode: 'user' | 'admin'];
}>();

const userStore = useUserStore();
const router = useRouter();

const isPwd = ref(true);
const loading = ref(false);
const currentMode = ref<'user' | 'admin'>('user');

const form = ref({
  email: '',
  password: '',
});

// Manipular mudança de modo
const handleModeChange = (mode: 'user' | 'admin') => {
  if (mode === 'admin') {
    emit('switchMode', 'admin');
  }
};

const onSubmit = async () => {
  loading.value = true;
  
  try {
    // Buscar usuário na lista compartilhada
    const user = sharedUsers.value.find(u => 
      u.email === form.value.email && u.status === 'active'
    );

    if (!user) {
      throw new Error('Usuário não encontrado ou conta inativa');
    }

    // Simular verificação de senha (em produção, isso seria feito no backend)
    // Por enquanto, aceita qualquer senha para usuários existentes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fazer login
    userStore.login(
      user,
      'auth-token-' + Date.now(),
    );

    // Redirecionar baseado no tipo de usuário
    let redirectPath = '/dashboard';
    if (user.type === 'student') {
      redirectPath = '/Estudante/dashboard';
    } else if (user.type === 'participant') {
      redirectPath = '/participant/dashboard';
    }

    Notify.create({
      type: 'positive',
      message: `Login realizado como ${user.type === 'student' ? 'Estudante' : 'Participante'}!`,
      position: 'top',
      icon: 'check_circle',
    });

    await router.push(redirectPath);

  } catch (error) {
    Notify.create({
      type: 'negative',
      message: error instanceof Error ? error.message : 'Erro no login. Verifique suas credenciais.',
      position: 'top',
      icon: 'error',
    });
  } finally {
    loading.value = false;
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

.mode-toggle {
  width: 200px;

  .q-btn {
    border-radius: 8px;
  }
}
</style>