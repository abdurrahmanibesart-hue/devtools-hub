import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiClient } from '../api/client';

export interface Link {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  isActive: boolean;
}

export const useLinksStore = defineStore('links', () => {
  const links = ref<Link[]>([]);
  const loading = ref(false);

  async function fetchPublicLinks() {
    loading.value = true;
    try {
      const res = await apiClient.get('/links');
      links.value = res.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchAdminLinks() {
    const res = await apiClient.get('/admin/links');
    links.value = res.data;
  }

  async function createLink(data: Partial<Link>) {
    const res = await apiClient.post('/admin/links', data);
    links.value.push(res.data);
    return res.data as Link;
  }

  async function updateLink(id: string, data: Partial<Link>) {
    const res = await apiClient.put(`/admin/links/${id}`, data);
    const idx = links.value.findIndex((l) => l.id === id);
    if (idx !== -1) links.value[idx] = res.data;
    return res.data as Link;
  }

  async function deleteLink(id: string) {
    await apiClient.delete(`/admin/links/${id}`);
    links.value = links.value.filter((l) => l.id !== id);
  }

  return { links, loading, fetchPublicLinks, fetchAdminLinks, createLink, updateLink, deleteLink };
});
