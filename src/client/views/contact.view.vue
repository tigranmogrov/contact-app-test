<template>
  <i-loading-screen v-if="!contact" />

  <section v-else class="section">
    <div class="container">
      <i-contact-info id="" personalization="" employee-id="" telephone="" email="" />

      <div class="is-flex is-align-items-center is-flex-wrap-wrap mt-6">
        <button
          type="button"
          class="button is-small is-outlined"
          :class="{ 'is-loading': activatingEmployment }"
          @click="activateEmployment"
        >
          Розпочати співпрацю
        </button>

        <button
          type="button"
          class="button is-small is-outlined ml-3"
          :class="{ 'is-loading': deactivatingEmployment }"
          @click="deactivateEmployment"
        >
          Припинити співпрацю
        </button>
      </div>

      <div v-if="!isEditFormOpened" class="is-flex is-align-items-center is-flex-wrap-wrap mt-2">
        <button type="button" class="button is-small is-light" @click="isDeletionRequested = true">
          Видалити контакт
        </button>

        <button type="button" class="button is-small is-dark ml-3" @click="isEditFormOpened = true">
          Редагувати контакт
        </button>
      </div>

      <i-update-contact v-if="isEditFormOpened" :contact="contact" />
    </div>
    <teleport to="body">
      <i-modal class="confirmation-modal">
        <div class="box">
          <template>
            <h3 class="has-text-weight-medium mb-1">Ви дійсно бажаєте видалити даний контакт?</h3>
            <p>Контакт не буде доступним в списку після видалення.</p>
            <div class="is-flex is-align-items-center is-justify-content-end mt-4">
              <button type="button" class="button is-small is-light" @click="deleteContact">
                Так, видалити контакт
              </button>

              <button type="button" class="button is-small is-dark ml-2">Ні, скасувати</button>
            </div>
          </template>

          <p>контакт видалено зі списку</p>
        </div>
      </i-modal>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import IContactInfo from '@/components/contact/i-contact-info.vue';
import IUpdateContact from '@/components/edit-form/i-update-contact.vue';
import ILoadingScreen from '@/components/loading/i-loading-screen.component.vue';
import { ContractEnum } from '@/enums/contract.enum.ts';
import { Contact } from '@/models';
import { RouteName } from '@/router';
import { useContactsStore } from '@/stores/contacts.store.ts';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

const route = useRoute();
const contactStore = useContactsStore();

const contact = ref<Contact | null>(null);

const isEditFormOpened = ref(false);
const saving = ref(false);

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
let error = ref<string | null>(null);

const cancelEditing = () => {
  fields.value.forEach((field) => (field.value = field.initialValue));
  isEditFormOpened.value = false;
  error.value = null;
};

onMounted(async () => {
  // just to see the loader
  setTimeout(async () => {
    const data = (await axios.get('/api/contacts/' + route.params.id)).data;
    contact.value = new Contact(data);

    fields.value[0].value = fields.value[0].initialValue =
      contact.value.personalization.name.firstname;
    fields.value[1].value = fields.value[1].initialValue =
      contact.value.personalization.name.lastname;
    fields.value[2].value = fields.value[2].initialValue =
      contact.value.personalization.name.middlename;
    fields.value[3].value = fields.value[3].initialValue = contact.value.email;
  }, 1000);
});

async function save() {
  error.value = null;
  saving.value = true;

  const data = fields.value.reduce(
    (acc, field) => {
      acc[field.name] = field.value?.trim();
      return acc;
    },
    {} as Record<string, string | undefined>
  );

  await axios.put('/api/contacts/' + route.params.id, data);
  contact.value = new Contact((await axios.get('/api/contacts/' + route.params.id)).data);

  isEditFormOpened.value = false;

  saving.value = false;
}

const router = useRouter();
const isDeletionRequested = ref(false);
const deleting = ref(false);

async function deleteContact() {
  deleting.value = true;
  await axios.delete('/api/contacts/' + route.params.id);
  deleting.value = false;
  isDeletionRequested.value = false;

  router.push({ name: RouteName.Contacts });
}

const activatingEmployment = ref(false);

const actionContract = async (status: ContractEnum) => {
  try {
    await contactStore.actionContract(String(route.params.id), status);
    contact.value = await contactStore.getContactById(String(route.params.id));
  } catch (error) {
    console.error(error);
  }
};

const deactivatingEmployment = ref(false);
</script>

<style>
.confirmation-modal .modal-content {
  max-inline-size: 420px;
}
</style>
