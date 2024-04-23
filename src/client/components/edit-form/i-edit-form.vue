<script setup lang="ts">
import FormValidator from '@/composable/form/validation';
import { IContactEditForm, IContactEditFormEmit, IValidationRules } from '@/types';
import { computed, onUnmounted, reactive, watchEffect } from 'vue';

const emits = defineEmits<{
  saveForm: [IContactEditFormEmit];
  cancelForm: [boolean];
}>();
const { fields, validateRules, isLoading } = defineProps<{
  isLoading: boolean;
  buttonPositionEnd?: boolean;
  fields: IContactEditForm[];
  validateRules: IValidationRules;
}>();

const newData = reactive<{ [key: string]: string }>({});
const formValidator = new FormValidator(newData, validateRules);
const getErrors = computed(() => formValidator.getErrors);
const isDisabled = computed(() => {
  return fields.some((field) => field.value.trim() !== field.initialValue);
});

const clearData = () => fields.map((field) => (field.value = field.initialValue));
const saveData = () => {
  const errors = formValidator.validateForm();
  if (!errors) {
    emits('saveForm', newData);
    isLoading ? clearData() : null;
  }
};

const cancelEditing = () => {
  emits('cancelForm', false);
};

watchEffect(() => {
  fields.map((field: any) => {
    newData[field.name] = field.value;
  });
});

onUnmounted(() => {
  clearData();
  formValidator.destroy();
});
</script>

<template>
  <div class="box">
    <h3 class="title is-size-6">
      <slot name="title"> Додати новий контакт: </slot>
    </h3>
    <form class="form" novalidate @submit.prevent="saveData">
      <div v-for="(field, index) in fields" :key="index" class="field">
        <label :for="field.name" class="label is-size-7">
          {{ field.label }}
          <span v-if="field.required" class="has-text-danger">*</span>
        </label>
        <div class="control">
          <input
            :id="field.name"
            v-model="field.value"
            :type="field.type"
            class="input is-small"
            :class="{ 'is-danger': getErrors[field.name] }"
            :required="field.required"
            :disabled="isLoading"
          />
        </div>
      </div>
      <div
        class="field is-grouped is-flex is-align-items-center mt-5"
        :class="{ 'is-justify-content-end': buttonPositionEnd }"
      >
        <div class="control">
          <button type="button" class="button is-small is-light" @click="cancelEditing">
            Скасувати
          </button>
        </div>
        <div class="control">
          <button
            type="submit"
            :disabled="!isDisabled"
            class="button is-small is-dark"
            :class="{ 'is-loading': isLoading }"
          >
            Зберегти
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
