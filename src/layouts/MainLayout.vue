<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated style="background: #003366">
      <q-toolbar>
        <q-toolbar-title
          class="text-weight-bold text-white cursor-pointer"
          @click="$router.push('/')"
        >
          <q-icon name="poll" class="q-mr-sm" />
          Moz-Pesquisa
        </q-toolbar-title>
        <q-space />

        <!-- Menu quando usuário está logado -->
        <template v-if="userStore.isAuthenticated">
          <q-btn flat icon="dashboard" class="text-white" @click="$router.push('/#')">
            <q-tooltip>Dashboard</q-tooltip>
          </q-btn>

          <q-btn flat :label="userStore.user?.name || 'Usuário'" class="text-white" />

          <q-btn flat icon="logout" class="text-white" @click="logout">
            <q-tooltip>Sair</q-tooltip>
          </q-btn>
        </template>

        <!-- Menu quando usuário não está logado - APENAS LOGIN -->
        <template v-else>
          <q-btn
            flat
            icon="login"
            label="Login"
            class="text-white"
            @click="$router.push('/login')"
          />
        </template>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- Footer NORMAL (não fixo) -->
    <footer style="background: #313b45" class="text-white">
      <div class="q-pa-xl">
        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4">
            <h3 class="text-h5 text-weight-bold q-mb-md">Moz-Pesquisa</h3>
            <p>Conectando pesquisadores e participantes em Moçambique para o avanço da ciência.</p>
          </div>
          <div class="col-12 col-md-2">
            <h4 class="text-h6 text-weight-bold q-mb-md">Para Estudantes</h4>
            <div class="column q-gutter-xs">
              <a @click="$router.push('/register/student')" class="text-white cursor-pointer"
                >Cadastrar</a
              >
              <a class="text-white cursor-pointer">Como Publicar</a>
              <a @click="$router.push('/pricing')" class="text-white cursor-pointer">Preços</a>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <h4 class="text-h6 text-weight-bold q-mb-md">Para Participantes</h4>
            <div class="column q-gutter-xs">
              <a @click="$router.push('/register/participant')" class="text-white cursor-pointer"
                >Cadastrar</a
              >
              <a class="text-white cursor-pointer">Como Ganhar</a>
              <a class="text-white cursor-pointer">Pagamentos</a>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <h4 class="text-h6 text-weight-bold q-mb-md">Suporte</h4>
            <div class="column q-gutter-xs">
              <a class="text-white cursor-pointer">Ajuda</a>
              <a class="text-white cursor-pointer">Contacto</a>
              <a class="text-white cursor-pointer">Termos</a>
            </div>
          </div>
        </div>
        <q-separator class="q-my-lg" color="white" />
        <div class="text-center">
          <div class="text-caption">© 2024 Moz-Pesquisa. Todos os direitos reservados.</div>
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup lang="ts">
import { useUserStore } from 'stores/user-store';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.initialize();
});

const logout = () => {
  userStore.logout();
  void router.push('/login');
};
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}

footer a {
  text-decoration: none;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
}
</style>
