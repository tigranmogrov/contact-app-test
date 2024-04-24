<script setup lang="ts">
import IEditForm from '@/components/edit-form/i-edit-form.vue';
import { updateNewContactRules } from '@/composable/form/validation';
import { EditFormEnum } from '@/enums/edit-form.enum.ts';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { IContact, IContactUpdateFormData, UpdateContactEmitType } from '@/types';
import { reactive, ref } from 'vue';

const { contact } = defineProps<{
  contact: IContact;
}>();

const emits = defineEmits<{
  update: [event: UpdateContactEmitType];
}>();

const contactStore = useContactsStore();

const isLoading = ref(false);
const isModalOpen = ref(false);
const updateError = ref<string>('');
const contactValues = reactive<{ [key: string]: string }>({
  ...contact.personalization.name,
  email: contact.email?.address ?? ''
});

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
    label: `E-mail`,
    name: 'email',
    value: '',
    initialValue: '',
    required: false,
    type: 'email'
  }
]);

const updateFieldsValue = () => {
  fields.value.forEach((item) => {
    if (contactValues[item.name]) {
      item.value = contactValues[item.name];
      item.initialValue = contactValues[item.name];
    }
  });
};

const createNewData = (): IContactUpdateFormData => {
  return fields.value.reduce((acc, field) => {
    acc[field.name as keyof IContactUpdateFormData] = field.value;
    return acc;
  }, {} as IContactUpdateFormData);
};

const cancelForm = (value: boolean) => {
  isModalOpen.value = value;
  emits('update', { status: EditFormEnum.CANCEL, close: false });
};

const updateContact = async () => {
  const data = createNewData();
  isLoading.value = true;
  try {
    await contactStore.updateContact(contact.id, {
      ...data,
      middlename: data.middlename?.length ? data.middlename : '  '
    });
    emits('update', { status: EditFormEnum.SAVE, close: false });
  } catch (error: any) {
    console.error(error);
    updateError.value = `Update contact failed:`;
  } finally {
    isLoading.value = false;
  }
};

updateFieldsValue();
</script>

<template>
  <i-edit-form
    :class="{ 'has-background-danger-light': updateError.length }"
    :validate-rules="updateNewContactRules"
    :button-position-end="true"
    :fields="fields"
    :is-loading="isLoading"
    @save-form="updateContact"
    @cancel-form="cancelForm"
  >
    <template #title> Редагувати контакт: </template>
  </i-edit-form>

  <p v-if="updateError.length" class="has-text-danger">{{ updateError }}</p>
</template>

<style scoped></style>
