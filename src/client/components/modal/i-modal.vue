<script setup lang="ts">
import { onUnmounted, watch } from 'vue';

const props = defineProps<{
  modalState: boolean;
}>();
const emits = defineEmits(['updateState']);

watch(
  () => props.modalState,
  (newVal) => {
    if (newVal) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
  }
);

const close = () => {
  emits('updateState', false);
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
};

const escapeHandler = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close();
  }
};

document.addEventListener('keydown', escapeHandler);

onUnmounted(() => {
  document.documentElement.style.removeProperty('overflow');
  document.body.style.removeProperty('overflow');
  document.removeEventListener('keydown', escapeHandler);
});
</script>

<template>
  <transition name="fade" appear>
    <div v-if="modalState" role="dialog" class="modal" :class="{ 'is-active': modalState }">
      <div class="modal-background" @click="close"></div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
