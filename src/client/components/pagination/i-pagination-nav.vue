<script setup lang="ts">
import { computed, ref } from 'vue';

interface PaginationProps {
  currentPage: number;
  totalPage: number;
  maxVisible: number;
}

const { totalPage, maxVisible, currentPage } = defineProps<PaginationProps>();
const emit = defineEmits(['updatePage']);

const currentPageValue = ref<number>(currentPage);

const visiblePages = computed(() => {
  let startPage = Math.max(1, currentPageValue.value - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPage, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  const pages: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  return pages;
});

const handlePrevPage = (): void => {
  currentPageValue.value--;
  emit('updatePage', currentPageValue.value);
};

const handleNextPage = (): void => {
  currentPageValue.value++;
  emit('updatePage', currentPageValue.value);
};

const handleGoToPage = (page: number): void => {
  currentPageValue.value = page;
  emit('updatePage', currentPageValue.value);
};
</script>

<template>
  <nav
    class="app-pagination__nav is-flex is-justify-content-center is-flex-wrap-wrap"
    role="navigation"
    aria-label="pagination"
  >
    <div class="app-pagination__nav-buttons is-flex">
      <button
        type="button"
        class="button mx-2"
        :disabled="currentPageValue === 1"
        @click="handleGoToPage(1)"
      >
        &lt;&lt;
      </button>
      <button
        type="button"
        class="button mx-2"
        :disabled="currentPageValue === 1"
        @click="handlePrevPage"
      >
        &lt;
      </button>
    </div>

    <ul class="app-pagination__nav-list is-flex">
      <li v-for="pageNumber in visiblePages" :key="pageNumber" class="mx-2">
        <span v-if="currentPageValue === pageNumber" class="button is-dark">
          {{ pageNumber }}
        </span>
        <button v-else class="button sd" type="button" @click="handleGoToPage(pageNumber)">
          {{ pageNumber }}
        </button>
      </li>
    </ul>
    <div class="app-pagination__nav-buttons is-flex">
      <button
        type="button"
        class="button mx-2"
        :disabled="currentPageValue === totalPage"
        @click="handleNextPage"
      >
        &gt;
      </button>
      <button
        type="button"
        class="button mx-2"
        :disabled="currentPageValue === totalPage"
        @click="handleGoToPage(totalPage)"
      >
        &gt;&gt;
      </button>
    </div>
  </nav>
</template>

<style scoped></style>
