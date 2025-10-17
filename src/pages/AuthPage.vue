<template>
  <div class="login-container">
    <!-- Tela de Login Usuário -->
    <div v-if="currentMode === 'user'">
      <q-card class="login-card q-pa-lg shadow-1">
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
            />
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmitUser" class="q-gutter-md">
            <!-- Email -->
            <div>
              <label class="text-weight-bold text-grey-8">Email</label>
              <q-input
                v-model="userForm.email"
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
                v-model="userForm.password"
                placeholder="Sua senha"
                :type="isPwdUser ? 'password' : 'text'"
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
                    :name="isPwdUser ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdUser = !isPwdUser"
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
                :loading="loadingUser"
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
            <div class="col-12 col-sm-6">
              <q-btn
                label="Cadastrar como Estudante"
                color="primary"
                outline
                class="full-width"
                @click="$router.push('/register/student')"
                icon="school"
              />
            </div>
            <div class="col-12 col-sm-6">
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
    </div>

    <!-- Tela de Login Admin -->
    <div v-else>
      <q-card class="login-card q-pa-lg shadow-1">
        <q-card-section class="text-center">
          <div class="text-h5 text-weight-bold text-grey-8 q-mb-md">Acesso Administrativo</div>
          <p class="text-grey-7 q-mb-md">Área restrita para administradores</p>

          <!-- Botões de alternância -->
          <div class="row justify-center q-mb-md">
            <q-btn-toggle
              v-model="currentMode"
              toggle-color="red"
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
            />
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmitAdmin" class="q-gutter-md">
            <!-- Email Administrativo -->
            <div>
              <label class="text-weight-bold text-grey-8">Email Administrativo</label>
              <q-input
                v-model="adminForm.email"
                placeholder="admin@mozpesquisa.ac.mz"
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
                  <q-icon name="admin_panel_settings" color="red" />
                </template>
              </q-input>
            </div>

            <!-- Senha Administrativa -->
            <div>
              <label class="text-weight-bold text-grey-8">Senha Administrativa</label>
              <q-input
                v-model="adminForm.password"
                placeholder="Senha administrativa"
                :type="isPwdAdmin ? 'password' : 'text'"
                dense
                outlined
                class="q-mt-xs"
                :rules="[(val) => !!val || 'Senha é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="red" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwdAdmin ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwdAdmin = !isPwdAdmin"
                  />
                </template>
              </q-input>
            </div>

            <!-- Botão Acessar Sistema -->
            <div class="q-pt-md">
              <q-btn
                label="Acessar Sistema"
                type="submit"
                color="red"
                class="full-width"
                size="lg"
                icon="security"
                :loading="loadingAdmin"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-separator class="q-my-md" />

        <!-- Voltar para Login Usuário -->
        <q-card-section class="text-center">
          <q-btn
            label="Voltar para Login Usuário"
            color="primary"
            flat
            class="full-width"
            @click="currentMode = 'user'"
            icon="arrow_back"
          />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useUserStore } from 'stores/user-store';
import { useRouter } from 'vue-router';
import { Notify } from 'quasar';
import { sharedUsers } from 'stores/base-store';

const userStore = useUserStore();
const router = useRouter();

// Estados para usuário comum
const isPwdUser = ref(true);
const loadingUser = ref(false);
const userForm = ref({
  email: '',
  password: '',
});

// Estados para admin
const isPwdAdmin = ref(true);
const loadingAdmin = ref(false);
const adminForm = ref({
  email: '',
  password: '',
});

// Modo atual (user ou admin)
const currentMode = ref<'user' | 'admin'>('user');

// Credenciais administrativas
const adminCredentials = {
  email: 'admin@mozpesquisa.ac.mz',
  password: '@dm!n2025%',
};

// Preencher automaticamente credenciais admin ao montar
onMounted(() => {
  adminForm.value.email = adminCredentials.email;
  adminForm.value.password = adminCredentials.password;
});

// Login para usuário comum
const onSubmitUser = async () => {
  loadingUser.value = true;

  try {
    // Buscar usuário na lista compartilhada
    const user = sharedUsers.value.find(
      (u) => u.email === userForm.value.email && u.status === 'active',
    );

    if (!user) {
      throw new Error('Usuário não encontrado ou conta inativa');
    }

    // Simular verificação de senha
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Fazer login
    userStore.login(user, 'auth-token-' + Date.now());

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
      message:
        error instanceof Error ? error.message : 'Erro no login. Verifique suas credenciais.',
      position: 'top',
      icon: 'error',
    });
  } finally {
    loadingUser.value = false;
  }
};

// Login para admin
const onSubmitAdmin = async () => {
  loadingAdmin.value = true;
  
  try {
    // Verificar credenciais admin
    if (
      adminForm.value.email === adminCredentials.email &&
      adminForm.value.password === adminCredentials.password
    ) {
      // Buscar usuário admin na lista compartilhada
      let adminUser = sharedUsers.value.find(u => 
        u.email === adminCredentials.email && u.type === 'admin'
      );

      // Se não existir, criar (para compatibilidade)
      if (!adminUser) {
        adminUser = {
          id: 'admin-001',
          name: 'Administrador Sistema',
          email: adminCredentials.email,
          type: 'admin',
          institution: 'MozPesquisa',
          registrationDate: new Date().toLocaleDateString('pt-BR'),
          status: 'active'
        };
        sharedUsers.value.push(adminUser);
      }

      // Simular delay de login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      userStore.login(
        adminUser,
        'admin-token-' + Date.now(),
      );

      Notify.create({
        type: 'positive',
        message: 'Login administrativo realizado com sucesso!',
        position: 'top',
        icon: 'security',
      });

      await router.push('/admin/dashboard');

    } else {
      Notify.create({
        type: 'negative',
        message: 'Credenciais administrativas inválidas!',
        position: 'top',
        icon: 'error',
      });
    }
  } catch {
    Notify.create({
      type: 'negative',
      message: 'Erro no login administrativo.',
      position: 'top',
      icon: 'error',
    });
  } finally {
    loadingAdmin.value = false;
  }
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
}

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

// Responsividade para telas menores
@media (max-width: 600px) {
  .login-container {
    padding: 16px;
  }
  
  .login-card {
    max-width: 100%;
  }
  
  .mode-toggle {
    width: 180px;
  }
}

// Para telas maiores
@media (min-width: 1200px) {
  .login-card {
    max-width: 480px;
  }
}
</style>