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
  contactStore.getContactsData({ fromPageNumber: page, toPageNumber: page });
  pageQueryAction(page);
};

const loadMore = (nextPage: number): void => {
  contactStore.getContactsData({
    fromPageNumber: fromPage.value,
    toPageNumber: currentPage.value + nextPage
  });
  pageQueryAction(fromPage.value, currentPage.value + nextPage);
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
