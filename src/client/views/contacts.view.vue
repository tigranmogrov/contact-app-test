<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-size-4">Список контактів</h1>

      <div class="toolbar box">
        <div class="select is-small">
          <select v-model="selectedSortOption" @update:model-value="sort">
            <option
              v-for="option in sortOptions"
              :value="option.id"
              :disabled="option.id === selectedSortOption"
            >
              {{ option.title }}
            </option>
          </select>
        </div>

        <label class="checkbox">
          <input
            v-model="isFilteredByEmployment"
            type="checkbox"
            @update:model-value="filterByEmployment"
          />
          Показати тільки співробітників
        </label>

        <button
          type="button"
          class="add-contact-button button is-small is-dark"
          @click="openAddForm"
        >
          Додати контакт
        </button>
      </div>

      <template v-if="listing">
        <i-contact-list />
        <i-pagination />
      </template>
    </div>
  </section>

  <add-contact-form ref="addFormComponent" @contact-added="load" />
</template>

<script setup lang="ts">
import AddContactForm from '@/components/add-contact-form.component.vue';
import IContactList from '@/components/contact/i-contact-list.vue';
import IPagination from '@/components/pagination/i-pagination.vue';
import { config } from '@/config';
import { Contact, ContactContract } from '@/models/contact.model';
import { onMounted, ref } from 'vue';

const listing = ref();

enum SortDirection {
  Ascending,
  Descending
}
enum SortCriterion {
  Name,
  DateCreated
}

const sortOptions = [
  {
    id: 1,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Descending
    },
    title: 'Новіші'
  },
  {
    id: 2,
    value: {
      criterion: SortCriterion.DateCreated,
      direction: SortDirection.Ascending
    },
    title: 'Старіші'
  },
  {
    id: 3,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Ascending
    },
    title: `За ім'ям (А - Я)`
  },
  {
    id: 4,
    value: {
      criterion: SortCriterion.Name,
      direction: SortDirection.Descending
    },
    title: `За ім'ям (Я - А)`
  }
];
const sortOptionsMap = new Map(sortOptions.map((option) => [option.id, option]));
const selectedSortOption = ref(1);

const isFilteredByEmployment = ref(false);

type ContactsQuery = {
  fromPageNumber?: number;
  toPageNumber?: number;
  pageSize?: number;
  sorting?: { direction: SortDirection; criterion: SortCriterion };
  isEmployee?: boolean;
};

const query = ref<ContactsQuery>({
  pageSize: config.contactListPageSize,
  fromPageNumber: 1,
  toPageNumber: 1,
  sorting: sortOptionsMap.get(selectedSortOption.value)?.value ?? sortOptions[0].value
});

async function loadContacts(queryIncoming: ContactsQuery) {
  query.value = {
    ...query.value,
    ...queryIncoming,
    toPageNumber:
      queryIncoming.toPageNumber ?? queryIncoming.fromPageNumber ?? query.value.fromPageNumber
  };

  const res = await axios.get('/api/contacts', {
    params: query.value
  });

  listing.value = {
    ...res.data,
    items: res.data.items.map((contactRaw: ContactContract) => new Contact(contactRaw))
  };
}

onMounted(async () => {
  await loadContacts({ fromPageNumber: 1 });
});

const sort = async (selectedOption: number) => {
  await loadContacts({
    fromPageNumber: 1,
    toPageNumber: 1,
    sorting: sortOptionsMap.get(selectedOption)?.value
  });
};

async function filterByEmployment(isEmployee: boolean) {
  await loadContacts({
    fromPageNumber: 1,
    toPageNumber: 1,
    isEmployee
  });
}

const addFormComponent = ref();
function openAddForm() {
  addFormComponent.value?.open();
}

async function load() {
  await loadContacts({});
}
</script>

<style>
.contact-listing {
  display: grid;
  gap: 16px;
}
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.add-contact-button {
  margin-inline-start: auto;
}
@media only screen and (max-width: 768px) {
  .add-contact-button {
    flex: 1 1 100%;
  }
}
</style>
