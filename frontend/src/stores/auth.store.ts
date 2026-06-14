import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient, setToken, registerUnauthorizedHandler } from '../api/client';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(sessionStorage.getItem('devtools_token'));
  const email = ref<string | null>(sessionStorage.getItem('devtools_email'));

  if (token.value) setToken(token.value);

  const isAuthenticated = computed(() => !!token.value);

  function logout() {
    token.value = null;
    email.value = null;
    sessionStorage.removeItem('devtools_token');
    sessionStorage.removeItem('devtools_email');
    setToken(null);
  }

  registerUnauthorizedHandler(logout);

  async function login(loginEmail: string, password: string) {
    const res = await apiClient.post('/auth/login', { email: loginEmail, password });
    token.value = res.data.accessToken;
    email.value = loginEmail;
    sessionStorage.setItem('devtools_token', token.value!);
    sessionStorage.setItem('devtools_email', loginEmail);
    setToken(token.value);
  }

  return { token, email, isAuthenticated, login, logout };
});
