<script setup lang="ts">
import {
  useAddQueryParams,
  useRemoveQueryParams,
  useTransformQuery
} from '@/composable/rout-query';
import { SortCriterion, SortDirection } from '@/enums/sort.enum.ts';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { IContactSortOptions } from '@/types';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const contactStore = useContactsStore();
const addQueryParams = useAddQueryParams();
const removeQueryParams = useRemoveQueryParams();
const transformQuery = useTransformQuery();
const parsedQuery = computed(() => transformQuery(router.currentRoute.value.query));
const isEmployment = ref(parsedQuery.value['isEmployee'] ?? false);
const selectedSortOption = ref(1);
const sortOptions: IContactSortOptions[] = [
  {
    id: 1,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Descending
    },
    title: 'Новіші'
  },
  {
    id: 2,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Ascending
    },
    title: 'Старіші'
  },
  {
    id: 3,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Ascending
    },
    title: `За ім'ям (А - Я)`
  },
  {
    id: 4,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Descending
    },
    title: `За ім'ям (Я - А)`
  }
];

const getEmployment = (value: boolean) => {
  contactStore.getContactsData({
    isEmployee: value,
    fromPageNumber: 1,
    toPageNumber: 1
  });
  if (value) {
    addQueryParams({ isEmployee: value, fromPageNumber: 1, toPageNumber: 1 });
  } else {
    removeQueryParams(['isEmployee', 'fromPageNumber', 'toPageNumber']);
  }
};
</script>

<template>
  <div class="toolbar box">
    <label class="select is-small">
      <select v-model="selectedSortOption">
        <option
          v-for="option in sortOptions"
          :key="option.id"
          :value="option.id"
          :disabled="option.id === selectedSortOption"
        >
          {{ option.title }}
        </option>
      </select>
    </label>

    <label class="checkbox">
      <input v-model="isEmployment" type="checkbox" @update:model-value="getEmployment" />
      Показати тільки співробітників
    </label>
  </div>
</template>

<style scoped></style>
