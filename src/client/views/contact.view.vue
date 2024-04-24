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
import ILoadingScreen from '@/components/loading/i-loading-screen.vue';
import { ContractEnum } from '@/enums/contract.enum.ts';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { IContact } from '@/types';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const contactStore = useContactsStore();
const route = useRoute();
const contact = ref<IContact | null>(null);
const isDeletionModal = ref<boolean>(false);
const isActionContact = ref<boolean>(false);
const isEditFormOpened = ref(false);
const isDeleteContact = ref<boolean>(false);
const isDeleteStatus = ref<boolean>(false);

const actionContract = async (status: ContractEnum) => {
  try {
    await contactStore.actionContract(String(route.params.id), status);
    contact.value = await contactStore.getContactById(String(route.params.id));
  } catch (error) {
    console.error(error);
  }
};

const deleteContact = async () => {
  isDeleteContact.value = true;
  try {
    await contactStore.deleteContact(String(route.params.id));
    isDeleteStatus.value = true;
    setTimeout(() => {
      router.push({ name: RouteNameEnum.Contacts });
      isDeleteStatus.value = false;
    }, 700);
  } catch (error) {
    console.error(error);
  } finally {
    isDeleteContact.value = false;
  }
};

const closeModal = () => {
  isDeletionModal.value = false;
};
</script>

<style>
.confirmation-modal .modal-content {
  max-inline-size: 420px;
}
</style>
