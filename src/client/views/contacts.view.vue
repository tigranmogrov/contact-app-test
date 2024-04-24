<script setup lang="ts">
import IContactList from '@/components/contact/i-contact-list.vue';
import ILoadingScreen from '@/components/loading/i-loading-screen.vue';
import IPagination from '@/components/pagination/i-pagination.vue';
import IToolbar from '@/components/toolbar/i-toolbar.vue';
import { useTransformQuery } from '@/composable/rout-query';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const contactStore = useContactsStore();
const transformQuery = useTransformQuery();
const router = useRouter();
const { isLoading, contacts } = storeToRefs(contactStore);
const loading = computed(() => isLoading.value);

const defaultQuery = {
  fromPageNumber: 1,
  toPageNumber: 1,
  sorting: { criterion: 1, direction: 1 },
  isEmployee: null
};

const queryRout = transformQuery(router.currentRoute.value.query);

onMounted(() => {
  try {
    const query = Object.keys(queryRout).length ? queryRout : defaultQuery;
    contactStore.getContactsData({ ...query });
  } catch (error: any) {
    console.error(error);
  }
});
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
