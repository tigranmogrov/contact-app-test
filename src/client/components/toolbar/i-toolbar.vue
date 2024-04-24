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
const parsedQuery = computed(() => transformQuery(router.currentRoute.value.query));

const getSelectedSort = computed(() => {
  const query = parsedQuery.value.sorting;
  const queryDirection = query ? query.direction : 1;
  const queryCriterion = query ? query.criterion : 1;
  const option = sortOptions.find(
    ({ value }) => value.criterion === queryCriterion && value.direction === queryDirection
  );
  return option?.id ?? 1;
});

const isEmployment = ref(parsedQuery.value['isEmployee'] ?? false);
const selectedSortOption = ref(getSelectedSort.value);

const employmentQueryAction = (state: boolean) => {
  if (state) {
    addQueryParams({ isEmployee: state, fromPageNumber: 1, toPageNumber: 1 });
  } else {
    removeQueryParams(['isEmployee', 'fromPageNumber', 'toPageNumber']);
  }
};

const getEmployment = (value: boolean) => {
  contactStore.getContactsData({
    isEmployee: value,
    fromPageNumber: 1,
    toPageNumber: 1
  });
  employmentQueryAction(value);
};

const sortQueryParamsAction = (id: number, selected: { criterion: number; direction: number }) => {
  if (id == 1) {
    removeQueryParams(['sorting[criterion]', 'sorting[direction]']);
  } else {
    addQueryParams({
      'sorting[criterion]': selected.criterion,
      'sorting[direction]': selected.direction
    });
  }
};

const sortAction = (value: number) => {
  const selectedOption = sortOptions.find((option) => option.id === value);

  if (selectedOption) {
    contactStore.getContactsData({ sorting: selectedOption.value });
    sortQueryParamsAction(value, { ...selectedOption.value });
  }
};
</script>

<template>
  <div class="toolbar box">
    <label class="select is-small">
      <select v-model="selectedSortOption" @update:model-value="sortAction">
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
