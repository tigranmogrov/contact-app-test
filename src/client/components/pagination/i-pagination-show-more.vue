<script setup lang="ts">
defineProps<{
  isLoading?: boolean;
  isLastPage: boolean;
}>();
const emits = defineEmits<{
  loadMore: [number];
}>();
const loadMore = () => {
  emits('loadMore', 1);
};
</script>

<template>
  <div class="is-flex is-justify-content-center mb-4">
    <button type="button" :disabled="isLastPage" class="button" @click="loadMore">
      Показати ще
    </button>
  </div>
</template>
