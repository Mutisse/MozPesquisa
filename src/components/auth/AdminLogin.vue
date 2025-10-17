<template>
  <div>
    <!-- Card de Login Admin -->
    <q-card class="q-pa-lg shadow-1">
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
            @update:model-value="handleModeChange"
          />
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <!-- Email Administrativo -->
          <div>
            <label class="text-weight-bold text-grey-8">Email Administrativo</label>
            <q-input
              v-model="form.email"
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
              v-model="form.password"
              placeholder="Senha administrativa"
              :type="isPwd ? 'password' : 'text'"
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
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
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
              :loading="loading"
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
          @click="handleModeChange('user')"
          icon="arrow_back"
        />
      </q-card-section>
    </q-card>

    <!-- Credenciais Admin -->
    <q-card class="q-mt-lg q-pa-md bg-red-1">
      <q-card-section class="text-center">
        <div class="text-caption text-weight-bold text-grey-8 q-mb-xs">
          Credenciais Admin:
        </div>
        <div class="text-caption text-grey-7">
          Email: admin@mozpesquisa.ac.mz
        </div>
        <div class="text-caption text-grey-7">
          Senha: @dm!n2025%
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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
const currentMode = ref<'user' | 'admin'>('admin');

const form = ref({
  email: '',
  password: '',
});

// Credenciais administrativas atualizadas
const adminCredentials = {
  email: 'admin@mozpesquisa.ac.mz',
  password: '@dm!n2025%',
};

// Preencher automaticamente ao montar
onMounted(() => {
  form.value.email = adminCredentials.email;
  form.value.password = adminCredentials.password;
});

// Manipular mudança de modo
const handleModeChange = (mode: 'user' | 'admin') => {
  emit('switchMode', mode);
};

const onSubmit = async () => {
  loading.value = true;
  
  try {
    // Verificar credenciais admin
    if (
      form.value.email === adminCredentials.email &&
      form.value.password === adminCredentials.password
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
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.mode-toggle {
  width: 200px;

  .q-btn {
    border-radius: 8px;
  }
}
</style>