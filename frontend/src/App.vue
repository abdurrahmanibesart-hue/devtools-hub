<template>
  <div class="min-h-screen bg-slate-900">
    <header class="bg-slate-800 border-b border-slate-700 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛠️</span>
          <span class="text-white font-bold text-lg">DevTools Hub</span>
        </div>
        <div class="flex items-center gap-3">
          <template v-if="auth.isAuthenticated">
            <button
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="showAdmin ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'"
              @click="showAdmin = !showAdmin"
            >
              {{ showAdmin ? 'Public View' : 'Admin Panel' }}
            </button>
          </template>
          <template v-else>
            <button
              class="px-4 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              @click="showLogin = true"
            >
              Login
            </button>
          </template>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AdminPanel v-if="auth.isAuthenticated && showAdmin" />
      <LinkGrid v-else :links="linksStore.links" />
    </main>

    <AdminLogin
      v-if="showLogin"
      @close="showLogin = false"
      @success="onLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import { useLinksStore } from './stores/links.store';
import AdminLogin from './components/AdminLogin.vue';
import AdminPanel from './components/AdminPanel.vue';
import LinkGrid from './components/LinkGrid.vue';

const showLogin = ref(false);
const showAdmin = ref(false);

const auth = useAuthStore();
const linksStore = useLinksStore();

onMounted(() => linksStore.fetchPublicLinks());

function onLoginSuccess() {
  showLogin.value = false;
  showAdmin.value = true;
}
</script>
