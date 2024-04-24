<script setup lang="ts">
import IEditForm from '@/components/edit-form/i-edit-form.vue';
import IModal from '@/components/modal/i-modal.vue';
import { createNewContactRules } from '@/composable/form/validation';
import { RouteNameEnum } from '@/enums/router.enum.ts';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { IContactCreateFormData, IContactEditFormEmit } from '@/types';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const contactStore = useContactsStore();

const router = useRouter();
const isLoading = ref(false);
const isModalOpen = ref(false);
let fields = ref([
  {
    label: `Ім'я`,
    name: 'firstname',
    value: '',
    initialValue: '',
    required: true,
    type: 'text'
  },
  {
    label: `Прізвище`,
    name: 'lastname',
    value: '',
    initialValue: '',
    required: true,
    type: 'text'
  },
  {
    label: `По-батькові`,
    name: 'middlename',
    value: '',
    initialValue: '',
    required: false,
    type: 'text'
  },
  {
    label: `Телефон`,
    name: 'telephone',
    value: '',
    initialValue: '',
    required: true,
    type: 'tel'
  },
  {
    label: `E-mail`,
    name: 'email',
    value: '',
    initialValue: '',
    required: false,
    type: 'email'
  }
]);

const cancelForm = (value: boolean) => {
  isModalOpen.value = value;
};

const openAddForm = () => {
  isModalOpen.value = true;
};

const createContact = async (event: IContactEditFormEmit): Promise<void> => {
  isLoading.value = true;
  try {
    const { middlename, ...data } = event as unknown as IContactCreateFormData;

    const id = await contactStore.createContact({
      ...data,
      middlename: (middlename as string).length ? middlename : undefined
    });
    await router.push({ name: RouteNameEnum.Contact, params: { id } });
  } catch (error: any) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <button type="button" class="ml-auto button is-small is-dark" @click="openAddForm">
    Додати контакт
  </button>
  <teleport to="body">
    <i-modal :modal-state="isModalOpen" @update-state="cancelForm">
      <i-edit-form
        :validate-rules="createNewContactRules"
        :button-position-end="true"
        :fields="fields"
        :is-loading="isLoading"
        @save-form="createContact"
        @cancel-form="cancelForm"
      />
    </i-modal>
  </teleport>
</template>

<style scoped></style>
