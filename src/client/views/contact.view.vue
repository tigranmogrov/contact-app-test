<script setup lang="ts">
import IContactInfo from '@/components/contact/i-contact-info.vue';
import IUpdateContact from '@/components/edit-form/i-update-contact.vue';
import ILoadingScreen from '@/components/loading/i-loading-screen.vue';
import IModal from '@/components/modal/i-modal.vue';
import { ContractEnum } from '@/enums/contract.enum.ts';
import { EditFormEnum } from '@/enums/edit-form.enum.ts';
import { RouteNameEnum } from '@/enums/router.enum.ts';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { IContact, UpdateContactEmitType } from '@/types';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const contactStore = useContactsStore();
const route = useRoute();
const router = useRouter();
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

const editAction = async (event: UpdateContactEmitType) => {
  switch (event.status) {
    case EditFormEnum.CANCEL:
      isEditFormOpened.value = event.close;
      break;
    case EditFormEnum.SAVE:
      isEditFormOpened.value = event.close;
      contact.value = await contactStore.getContactById(String(route.params.id));
  }
};

onMounted(async () => {
  try {
    contact.value = await contactStore.getContactById(String(route.params.id));
  } catch (error: any) {
    console.error(error);
  }
});
</script>

<template>
  <i-loading-screen v-if="!contact" />

  <section v-else class="section">
    <div class="app-container">
      <i-contact-info v-bind="contact" />

      <div class="is-flex is-align-items-center is-flex-wrap-wrap mt-6">
        <button
          v-if="!contact.employeeId"
          type="button"
          class="button is-small is-outlined"
          :class="{ 'is-loading': isActionContact }"
          @click="actionContract(ContractEnum.ACTIVATE)"
        >
          Розпочати співпрацю
        </button>
        <button
          v-else
          :class="{ 'is-loading': isActionContact }"
          type="button"
          class="button is-small is-outlined"
          @click="actionContract(ContractEnum.DEACTIVATE)"
        >
          Припинити співпрацю
        </button>
      </div>

      <div v-if="!isEditFormOpened" class="is-flex is-align-items-center is-flex-wrap-wrap mt-2">
        <button type="button" class="button is-small is-light" @click="isDeletionModal = true">
          Видалити контакт
        </button>

        <button type="button" class="button is-small is-dark ml-3" @click="isEditFormOpened = true">
          Редагувати контакт
        </button>
      </div>

      <i-update-contact v-if="isEditFormOpened" :contact="contact" @update="editAction" />
    </div>

    <teleport to="body">
      <i-modal class="confirmation-modal" :modal-state="isDeletionModal" @update-state="closeModal">
        <div class="box">
          <template v-if="!isDeleteStatus">
            <h3 class="has-text-weight-medium mb-1">Ви дійсно бажаєте видалити даний контакт?</h3>
            <p>Контакт не буде доступним в списку після видалення.</p>
            <div class="is-flex is-align-items-center is-justify-content-end mt-4">
              <button
                type="button"
                class="button is-small is-light"
                :class="{ 'is-loading': isDeleteContact }"
                @click="deleteContact"
              >
                Так, видалити контакт
              </button>

              <button
                :disabled="isDeleteContact"
                type="button"
                class="button is-small is-dark ml-2"
                @click="closeModal"
              >
                Ні, скасувати
              </button>
            </div>
          </template>

          <p v-else>контакт видалено зі списку</p>
        </div>
      </i-modal>
    </teleport>
  </section>
</template>
