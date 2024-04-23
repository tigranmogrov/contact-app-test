<script setup lang="ts">
import { IContact, INameContact } from '@/types';

const { telephone, personalization, email, employeeId } = defineProps<IContact>();

const fullName = (name: INameContact) => Object.values(name).join(' ');
const regexp = /\*(.*?)\d*/g;
const phone = !telephone.number.match(regexp) ? `+${telephone.number}` : telephone.number;
</script>

<template>
  <div>
    <h1 class="title is-size-5">
      {{ fullName(personalization.name) }}
    </h1>
    <p>
      <span class="has-text-grey">Телефон:</span>
      {{ phone }}
    </p>
    <p>
      <span class="has-text-grey">E-mail:</span>
      {{ email?.address ? `${email.address}` : 'No email' }}
    </p>
    <p>
      <span class="has-text-grey">Є співробітником:</span>
      {{ employeeId ? 'Так' : 'Ні' }}
    </p>
  </div>
</template>

<style scoped></style>
