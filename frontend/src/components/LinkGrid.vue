<template>
  <div class="py-8">
    <h2 class="text-2xl font-bold text-white mb-6">Developer Tools</h2>
    <div
      v-if="links.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <LinkCard v-for="link in links" :key="link.id" :link="link" />
    </div>
    <div v-else class="text-center py-20 text-slate-500">
      <p class="text-lg">Nothing here yet.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Link } from '../stores/links.store';
import LinkCard from './LinkCard.vue';
defineProps<{ links: Link[] }>();
</script>
