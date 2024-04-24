<script setup lang="ts">
import IContactList from '@/components/contact/i-contact-list.vue';
import IPagination from '@/components/pagination/i-pagination.vue';
import IToolbar from '@/components/toolbar/i-toolbar.vue';
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-size-4">Список контактів</h1>
      <i-toolbar />

      <i-contact-list />
      <i-pagination />
    </div>
  </section>
</template>
