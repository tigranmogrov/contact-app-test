import { API } from '@/api';
import { config } from '@/config.ts';
import { ContactsQueryType, IContact, IContactData } from '@/types';
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
  const fromPage = computed(() => contactData.fromPageNumber);
  const lastPage = computed(() => contactData.toPageNumber === contactData.last);

  const getContactsData = async (queryParams: Partial<ContactsQueryType> = {}): Promise<void> => {
    try {
      isLoading.value = true;
      const { data } = await API.get<IContactData>('/api/contacts', {
        params: {
          pageSize: config.contactListPageSize,
          ...queryParams
        }
      });
      setContactData(data);
    } catch (error: any) {
      throw error;
    } finally {
      // just to see the loader
      setTimeout(() => {
        isLoading.value = false;
      }, 1000);
    }
  };

  const getContactById = async (id: string): Promise<IContact> => {
    try {
      const { data } = await API.get<IContact>(`/api/contacts/${id}`);
      return data;
    } catch (error: any) {
      throw error;
    }
  };

  const setContactData = (data: IContactData): void => {
    contactData.last = data.last;
    contactData.toPageNumber = data.toPageNumber;
    contactData.fromPageNumber = data.fromPageNumber;
    contactData.total = data.total;
    contactData.size = data.size;
    contactData.items = data.items;
  };

  return {
    contactData,
    isLoading,
    totalPaginationPage,
    currentPage,
    contacts,
    fromPage,
    lastPage,
    getContactsData,
    getContactById,
    setContactData
  };
});
