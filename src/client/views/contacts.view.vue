<template>
	<section class="section">
		<div class="container">
			<h1 class="title is-size-4">Список контактів</h1>

			<div class="toolbar box">
				<div class="select is-small">
					<select
						v-model="selectedSortOption"
						@update:model-value="sort"
					>
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
						type="checkbox"
						v-model="isFilteredByEmployment"
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
				<div class="contact-listing">
					<RouterLink
						v-for="contact in listing.items"
						:key="contact.id"
						:to="{
							name: RouteName.Contact,
							params: { id: contact.id },
						}"
						class="box"
					>
						<p class="has-text-weight-bold">
							{{
								`${contact.personalization.name.firstname} ${
									contact.personalization.name.lastname
								}${
									contact.personalization.name.middlename
										? ' ' +
										  contact.personalization.name
												.middlename
										: ''
								}`
							}}
						</p>

						<p>{{ contact.telephone }}</p>

						<p class="is-italic">{{ contact.email }}</p>

						<p
							v-if="contact.employeeId"
							class="is-size-7 has-text-weight-medium has-text-grey"
						>
							Співробітник підприємства
						</p>
					</RouterLink>
				</div>

				<div class="app-pagination py-6">
					<div class="is-flex is-justify-content-center mb-4">
						<button
							type="button"
							class="button"
							:class="{ 'is-loading': loadingMore }"
							@click="loadMore"
						>
							Показати ще {{ nextPageSize }}
						</button>
					</div>

					<div class="is-flex is-justify-content-center">
						<button
							type="button"
							class="button mx-2"
							@click="loadContacts({ fromPageNumber: 1 })"
						>
							&lt;&lt;
						</button>
						<button
							type="button"
							class="button mx-2"
							@click="
								loadContacts({
									fromPageNumber: listing.fromPageNumber - 1,
								})
							"
						>
							&lt;
						</button>

						<button
							v-for="pageNumber in pageCount"
							type="button"
							class="button mx-2"
							:class="{
								'is-dark':
									pageNumber <= listing.toPageNumber &&
									pageNumber >= listing.fromPageNumber,
							}"
							@click="
								loadContacts({ fromPageNumber: pageNumber })
							"
						>
							{{ pageNumber }}
						</button>

						<button
							type="button"
							class="button mx-2"
							@click="loadContacts(listing.fromPageNumber + 1)"
						>
							&gt;
						</button>
						<button
							type="button"
							class="button mx-2"
							@click="loadContacts(listing.last)"
						>
							&gt;&gt;
						</button>
					</div>
				</div>
			</template>
		</div>
	</section>

	<AddContactForm ref="addFormComponent" @contact-added="load" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import { Contact, ContactContract } from '@/models/contact.model'
import { RouteName } from '@/router'
import { config } from '@/config'
import AddContactForm from '@/components/add-contact-form.component.vue'

const listing = ref()
let loadingMore = ref(false)

async function loadMore() {
	if (!listing.value) throw new Error('no data was loaded')

	loadingMore.value = true
	await loadContacts({
		fromPageNumber: listing.value.fromPageNumber,
		toPageNumber: listing.value.toPageNumber + 1,
	})
	loadingMore.value = false
}

enum SortDirection {
	Ascending,
	Descending,
}
enum SortCriterion {
	Name,
	DateCreated,
}

const sortOptions = [
	{
		id: 1,
		value: {
			criterion: SortCriterion.DateCreated,
			direction: SortDirection.Descending,
		},
		title: 'Новіші',
	},
	{
		id: 2,
		value: {
			criterion: SortCriterion.DateCreated,
			direction: SortDirection.Ascending,
		},
		title: 'Старіші',
	},
	{
		id: 3,
		value: {
			criterion: SortCriterion.Name,
			direction: SortDirection.Ascending,
		},
		title: `За ім'ям (А - Я)`,
	},
	{
		id: 4,
		value: {
			criterion: SortCriterion.Name,
			direction: SortDirection.Descending,
		},
		title: `За ім'ям (Я - А)`,
	},
]
const sortOptionsMap = new Map(sortOptions.map(option => [option.id, option]))
const selectedSortOption = ref(1)

const isFilteredByEmployment = ref(false)

type ContactsQuery = {
	fromPageNumber?: number
	toPageNumber?: number
	pageSize?: number
	sorting?: { direction: SortDirection; criterion: SortCriterion }
	isEmployee?: boolean
}

const query = ref<ContactsQuery>({
	pageSize: config.contactListPageSize,
	fromPageNumber: 1,
	toPageNumber: 1,
	sorting:
		sortOptionsMap.get(selectedSortOption.value)?.value ??
		sortOptions[0].value,
})

async function loadContacts(queryIncoming: ContactsQuery) {
	query.value = {
		...query.value,
		...queryIncoming,
		toPageNumber:
			queryIncoming.toPageNumber ??
			queryIncoming.fromPageNumber ??
			query.value.fromPageNumber,
	}

	const res = await axios.get('/api/contacts', {
		params: query.value,
	})

	listing.value = {
		...res.data,
		items: res.data.items.map(
			(contactRaw: ContactContract) => new Contact(contactRaw)
		),
	}
}

onMounted(async () => {
	await loadContacts({ fromPageNumber: 1 })
})

let nextPageSize = computed(() => {
	if (!listing.value) return 0

	if (listing.value.toPageNumber === listing.value.last) return 0

	if (listing.value.toPageNumber === listing.value.last - 1)
		return listing.value.total % listing.value.size

	return listing.value.size
})

let pageCount = computed(() => {
	if (!listing.value) return 0

	return Math.floor(listing.value.total / listing.value.size)
})

const sort = async (selectedOption: number) => {
	await loadContacts({
		fromPageNumber: 1,
		toPageNumber: 1,
		sorting: sortOptionsMap.get(selectedOption)?.value,
	})
}

async function filterByEmployment(isEmployee: boolean) {
	await loadContacts({
		fromPageNumber: 1,
		toPageNumber: 1,
		isEmployee,
	})
}

const addFormComponent = ref()
function openAddForm() {
	addFormComponent.value?.open()
}

async function load() {
	await loadContacts({})
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
