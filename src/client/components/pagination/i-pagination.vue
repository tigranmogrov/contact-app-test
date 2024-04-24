<script setup lang="ts">
import IPaginationNav from './i-pagination-nav.vue';
import IPaginationShowMore from '@/components/pagination/i-pagination-show-more.vue';
import { useAddQueryParams, useRemoveQueryParams } from '@/composable/rout-query';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { storeToRefs } from 'pinia';

const contactStore = useContactsStore();
const { currentPage, totalPaginationPage, fromPage, lastPage } = storeToRefs(contactStore);
const addQueryParams = useAddQueryParams();
const removeQueryParams = useRemoveQueryParams();

const pageQueryAction = (page: number, nextPage: number = page) => {
  if (nextPage !== 1) {
    addQueryParams({ fromPageNumber: page, toPageNumber: nextPage });
  } else {
    removeQueryParams(['fromPageNumber', 'toPageNumber']);
  }
};

const updatePage = (page: number): void => {
  try {
    contactStore.getContactsData({ fromPageNumber: page, toPageNumber: page });
    pageQueryAction(page);
  } catch (error: any) {
    console.error(error);
  }
};

const loadMore = (nextPage: number): void => {
  try {
    contactStore.getContactsData({
      fromPageNumber: fromPage.value,
      toPageNumber: currentPage.value + nextPage
    });
    pageQueryAction(fromPage.value, currentPage.value + nextPage);
  } catch (error: any) {
    console.error(error);
  }
};
</script>

<template>
  <div class="app-pagination">
    <i-pagination-show-more :is-last-page="lastPage" @load-more="loadMore" />
    <i-pagination-nav
      :max-visible="4"
      :total-page="totalPaginationPage"
      :current-page="currentPage"
      @update-page="updatePage"
    />
  </div>
</template>

<style scoped></style>
