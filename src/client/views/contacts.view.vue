<script setup lang="ts">
import IContactList from '@/components/contact/i-contact-list.vue';
import ILoadingScreen from '@/components/loading/i-loading-screen.vue';
import IPagination from '@/components/pagination/i-pagination.vue';
import IToolbar from '@/components/toolbar/i-toolbar.vue';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const contactStore = useContactsStore();

const { isLoading, contacts } = storeToRefs(contactStore);
const loading = computed(() => isLoading.value);
contactStore.getContactsData({});
</script>

<template>
  <section class="section">
    <div class="app-container">
      <i-toolbar />
      <template v-if="!loading">
        <template v-if="contacts.length">
          <i-contact-list />
          <i-pagination class="mt-6" />
        </template>
        <div v-else>
          <h3 class="title mt-6">Ooops... dont have Contacts</h3>
        </div>
      </template>
      <i-loading-screen v-else />
    </div>
  </section>
</template>
