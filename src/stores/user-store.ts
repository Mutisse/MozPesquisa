import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Notify } from 'quasar';
import { sharedUsers, saveSharedData, generateId } from './base-store';
import type { User } from '../types/shared/shared';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const isAdminMode = ref(false);

  // Getters computados
  const isAuthenticated = computed(() => !!token.value);
  const userType = computed(() => user.value?.type);
  const currentMode = computed(() => (isAdminMode.value ? 'admin' : 'user'));

  // Actions
  const login = (userData: User, authToken: string) => {
    user.value = userData;
    token.value = authToken;
    isAdminMode.value = userData.type === 'admin';

    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('is_admin_mode', isAdminMode.value.toString());

    Notify.create({
      type: 'positive',
      message: `Login realizado como ${userData.type === 'admin' ? 'Administrador' : userData.type}!`,
      position: 'top',
    });
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    isAdminMode.value = false;

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('is_admin_mode');

    Notify.create({
      type: 'info',
      message: 'Logout realizado com sucesso!',
      position: 'top',
    });
  };

  const toggleAdminMode = () => {
    if (user.value?.type === 'admin') {
      isAdminMode.value = !isAdminMode.value;
      localStorage.setItem('is_admin_mode', isAdminMode.value.toString());

      Notify.create({
        type: 'info',
        message: `Modo alterado para: ${isAdminMode.value ? 'Administrador' : 'Usuário'}`,
        position: 'top',
      });
    }
  };

  // Função para registrar usuários (estudantes e participantes)
  const registerUser = (userData: Omit<User, 'id' | 'status' | 'registrationDate'>) => {
    // Verificar se email já existe
    const existingUser = sharedUsers.value.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    const newUser: User = {
      ...userData,
      id: generateId(),
      status: 'active',
      registrationDate: new Date().toLocaleDateString('pt-BR'),
    };

    // Adicionar usuário à lista compartilhada
    sharedUsers.value.push(newUser);
    saveSharedData();

    // Fazer login automaticamente após registro
    const authToken = 'auth-token-' + Date.now();
    login(newUser, authToken);

    Notify.create({
      type: 'positive',
      message: 'Cadastro realizado com sucesso!',
      position: 'top',
    });

    return newUser;
  };

  // Função de registro compatível com a versão anterior
  const register = (userData: User, authToken: string) => {
    login(userData, authToken);
  };

  const initialize = () => {
    const storedToken = localStorage.getItem('auth_token');
    const storedUserData = localStorage.getItem('user_data');
    const storedAdminMode = localStorage.getItem('is_admin_mode');

    if (storedToken && storedUserData) {
      token.value = storedToken;
      user.value = JSON.parse(storedUserData);
      isAdminMode.value = storedAdminMode === 'true';
    }
  };

  return {
    // State
    user,
    token,
    isAdminMode,

    // Getters
    isAuthenticated,
    userType,
    currentMode,

    // Actions
    login,
    logout,
    toggleAdminMode,
    registerUser,
    register,
    initialize,
  };
});
