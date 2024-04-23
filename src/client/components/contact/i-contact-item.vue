<script setup lang="ts">
import { RouteNameEnum } from '@/enums/router.enum.ts';
import { IContact } from '@/types';

const contact = defineProps<IContact>();
const { firstname, lastname, middlename } = contact.personalization.name;
const fullName = `${firstname} ${lastname} ${middlename ? middlename : ''}`;
</script>

<template>
  <li class="contact-list__item">
    <RouterLink
      :to="{
        name: RouteNameEnum.Contact,
        params: { id: contact.id }
      }"
      class="box is-large"
    >
      <p class="has-text-weight-bold">
        {{ fullName }}
      </p>

      <p>{{ contact.telephone.number }}</p>

      <p class="is-italic">{{ contact.email?.address }}</p>

      <p v-if="contact.employeeId" class="is-size-7 has-text-weight-medium has-text-grey">
        Співробітник підприємства
      </p>
    </RouterLink>
  </li>
</template>
