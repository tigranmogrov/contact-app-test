<script setup lang="ts">
import AppFooter from '@/components/footer/app-footer.vue';
import AppHeader from '@/components/header/app-header.vue';
</script>
<template>
  <app-header />

  <div class="app-body">
    <RouterView />
  </div>

  <app-footer />
</template>
