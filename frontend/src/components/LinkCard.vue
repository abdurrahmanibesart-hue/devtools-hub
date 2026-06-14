<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="block bg-slate-800 rounded-xl p-5 hover:bg-slate-700 hover:shadow-lg hover:scale-105 transition-all duration-200 no-underline"
  >
    <div class="flex items-start gap-4">
      <div class="w-11 h-11 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-lg shrink-0">
        {{ link.title.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-1 min-w-0">
        <h3 class="text-white font-semibold text-base truncate mb-1">{{ link.title }}</h3>
        <p v-if="link.description" class="text-slate-400 text-sm line-clamp-2 mb-2">
          {{ link.description }}
        </p>
        <span class="inline-block text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
          {{ link.category || 'Misc' }}
        </span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Link } from '../stores/links.store';
defineProps<{ link: Link }>();
</script>
