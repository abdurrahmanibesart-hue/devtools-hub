<template>
  <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-slate-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
      <h2 class="text-xl font-bold text-white mb-6">Admin Login</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-slate-400 mb-1">Email</label>
          <input
            ref="emailInput"
            v-model="email"
            type="email"
            required
            class="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm text-slate-400 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full bg-slate-700 text-white rounded-lg px-4 py-2.5 border border-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
          {{ error }}
        </div>
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            class="flex-1 px-4 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
            @click="$emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.store';

const emit = defineEmits<{ close: []; success: [] }>();

const auth = useAuthStore();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');
const emailInput = ref<HTMLInputElement | null>(null);

onMounted(() => emailInput.value?.focus());

async function handleSubmit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    emit('success');
  } catch {
    error.value = 'Wrong email or password';
  } finally {
    loading.value = false;
  }
}
</script>
