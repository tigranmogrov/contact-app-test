<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-size-4">Список контактів</h1>

      <i-toolbar />

      <template v-if="listing">
        <i-contact-list />
        <i-pagination />
      </template>
    </div>
  </section>

  <add-contact-form ref="addFormComponent" @contact-added="load" />
</template>

<script setup lang="ts">
import AddContactForm from '@/components/add-contact-form.component.vue';
import IContactList from '@/components/contact/i-contact-list.vue';
import IPagination from '@/components/pagination/i-pagination.vue';
import IToolbar from '@/components/toolbar/i-toolbar.vue';
</script>

<style>
.contact-listing {
  display: grid;
  gap: 16px;
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.add-contact-button {
  margin-inline-start: auto;
}
@media only screen and (max-width: 768px) {
  .add-contact-button {
    flex: 1 1 100%;
  }
}
</style>
