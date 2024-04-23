<script setup lang="ts">
import AppHeader from '@/components/header/app-header.vue';
</script>
<template>
  <app-header />

  <div class="app-body">
    <RouterView />
  </div>

  <div class="app-footer">
    <div class="container">
      <p>NexCore Take Home Test</p>
    </div>
  </div>
</template>
