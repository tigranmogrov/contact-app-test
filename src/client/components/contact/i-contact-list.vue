<script setup lang="ts">
import IContactItem from '@/components/contact/i-contact-item.vue';
import { useContactsStore } from '@/stores/contacts.store.ts';
import { storeToRefs } from 'pinia';

const contactStore = useContactsStore();
const { contacts } = storeToRefs(contactStore);
</script>

<template>
  <ul class="contact-list">
    <i-contact-item v-for="contact in contacts" :key="contact.id" v-bind="contact" />
  </ul>
</template>

<style scoped></style>
