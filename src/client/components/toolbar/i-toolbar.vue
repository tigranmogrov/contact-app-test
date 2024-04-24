<script setup lang="ts">
import { SortCriterion, SortDirection } from '@/enums/sort.enum.ts';
import { IContactSortOptions } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isEmployment = ref(Boolean(router.currentRoute.value.query.isEmployment) ?? false);
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
      <input v-model="isEmployment" type="checkbox" />
      Показати тільки співробітників
    </label>
  </div>
</template>

<style scoped></style>
