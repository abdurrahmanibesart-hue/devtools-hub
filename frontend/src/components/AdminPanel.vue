<template>
  <div class="py-8">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-white">Admin Panel</h2>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 transition-colors"
          @click="openCreate"
        >
          + Add Link
        </button>
        <button
          class="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 text-sm hover:bg-slate-700 transition-colors"
          @click="auth.logout()"
        >
          Logout
        </button>
      </div>
    </div>

    <div v-if="store.loading" class="text-slate-400 text-center py-12">Loading…</div>
    <div v-else-if="!store.links.length" class="text-slate-500 text-center py-12">No links yet. Add one above.</div>
    <div v-else class="overflow-x-auto rounded-xl border border-slate-700">
      <table class="w-full text-sm text-left">
        <thead class="text-slate-400 bg-slate-800 border-b border-slate-700">
          <tr>
            <th class="px-4 py-3">Title</th>
            <th class="px-4 py-3">URL</th>
            <th class="px-4 py-3">Category</th>
            <th class="px-4 py-3">Active</th>
            <th class="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="link in store.links"
            :key="link.id"
            class="border-b border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-colors"
          >
            <td class="px-4 py-3 text-white font-medium">{{ link.title }}</td>
            <td class="px-4 py-3 text-slate-400 max-w-xs truncate">
              <a :href="link.url" target="_blank" class="hover:text-indigo-400 transition-colors">{{ link.url }}</a>
            </td>
            <td class="px-4 py-3 text-slate-400">{{ link.category }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-0.5 rounded-full text-xs"
                :class="link.isActive ? 'bg-green-900/50 text-green-400' : 'bg-slate-700 text-slate-400'"
              >
                {{ link.isActive ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-2">
                <button
                  class="text-indigo-400 hover:text-indigo-300 text-xs px-2 py-1 rounded hover:bg-indigo-900/30 transition-colors"
                  @click="openEdit(link)"
                >
                  Edit
                </button>
                <button
                  class="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900/30 transition-colors"
                  @click="handleDelete(link.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showModal = false"
    >
      <div class="bg-slate-800 rounded-xl p-8 w-full max-w-lg shadow-2xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-bold text-white mb-5">{{ editingId ? 'Edit Link' : 'Add Link' }}</h3>
        <form @submit.prevent="handleSave" class="space-y-4">
          <div>
            <label class="block text-sm text-slate-400 mb-1">Title *</label>
            <input v-model="form.title" required maxlength="80" class="input" />
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">URL *</label>
            <input v-model="form.url" required type="url" class="input" />
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" maxlength="300" class="input resize-none" />
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">Category</label>
            <select v-model="form.category" class="input">
              <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 accent-indigo-500" />
            <label for="isActive" class="text-sm text-slate-300">Active (visible on public page)</label>
          </div>
          <div v-if="formError" class="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-lg px-4 py-3">
            {{ formError }}
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors" @click="showModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="saving" class="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 disabled:opacity-50 transition-colors">
              {{ saving ? 'Saving…' : (editingId ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLinksStore, type Link } from '../stores/links.store';
import { useAuthStore } from '../stores/auth.store';

const store = useLinksStore();
const auth = useAuthStore();

const showModal = ref(false);
const editingId = ref<string | null>(null);
const saving = ref(false);
const formError = ref('');

const CATEGORIES = [
  'General',
  'Monitoring',
  'CI/CD',
  'Documentation',
  'Infrastructure',
  'Source Control',
  'Project Management',
  'Security',
  'Analytics',
];

const defaultForm = () => ({
  title: '',
  url: '',
  description: '',
  category: 'General',
  isActive: true,
});

const form = ref(defaultForm());

onMounted(() => store.fetchAllLinks());

function openCreate() {
  editingId.value = null;
  form.value = defaultForm();
  formError.value = '';
  showModal.value = true;
}

function openEdit(link: Link) {
  editingId.value = link.id;
  form.value = {
    title: link.title,
    url: link.url,
    description: link.description,
    category: link.category,
    isActive: link.isActive,
  };
  formError.value = '';
  showModal.value = true;
}

async function handleSave() {
  formError.value = '';
  saving.value = true;
  try {
    if (editingId.value) {
      await store.updateLink(editingId.value, form.value);
    } else {
      await store.createLink(form.value);
    }
    showModal.value = false;
  } catch {
    formError.value = 'Failed to save, please try again';
  } finally {
    saving.value = false;
  }
}

async function handleDelete(id: string) {
  if (!window.confirm('Delete this link?')) return;
  await store.deleteLink(id);
}
</script>

<style scoped>
.input {
  width: 100%;
  background: #334155;
  color: white;
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  border: 1px solid #475569;
  outline: none;
  font-size: 0.875rem;
}
select.input {
  appearance: auto;
  cursor: pointer;
}
.input:focus {
  border-color: #6366f1;
}
</style>
