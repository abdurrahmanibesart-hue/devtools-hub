import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, setToken, setLogoutHandler } from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('devtools_token'));

  if (token.value) setToken(token.value);

  const isAuthenticated = computed(() => !!token.value);

  function logout() {
    token.value = null;
    sessionStorage.removeItem('devtools_token');
    setToken(null);
  }

  setLogoutHandler(logout);

  async function login(email: string, password: string) {
    const res = await apiClient.post('/auth/login', { email, password });
    token.value = res.data.accessToken;
    sessionStorage.setItem('devtools_token', token.value!);
    setToken(token.value);
  }

  return { token, isAuthenticated, login, logout };
});
