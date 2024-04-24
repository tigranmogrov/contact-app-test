import { IContactData } from '@/types';
import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';

export const useContactsStore = defineStore('contacts', () => {
  const isLoading = ref(false);
  const contactData = reactive<IContactData>({
    last: 0,
    toPageNumber: 0,
    fromPageNumber: 0,
    total: 0,
    size: 0,
    items: []
  });

  const totalPaginationPage = computed(() => contactData.last);
  const contacts = computed(() => contactData.items);
  const currentPage = computed(() => contactData.toPageNumber);
  const fromPageNumber = computed(() => contactData.fromPageNumber);
  const lastPage = computed(() => contactData.toPageNumber === contactData.last);

  return {
    contactData,
    isLoading,
    totalPaginationPage,
    currentPage,
    contacts,
    fromPageNumber,
    lastPage
  };
});
