<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { ref } from "vue";

definePageMeta({
	layout: "admin", // use the admin layout
});

/* ---------------- Applicants Table ---------------- */
type Applicant = {
	id: number;
	name: string;
	email: string;
	income: number;
	gpa: number;
	eligibility: string;
};

const applicants = ref<Applicant[]>([
	{
		id: 1,
		name: "Juan Dela Cruz",
		email: "juan@example.com",
		income: 20000,
		gpa: 3.75,
		eligibility: "Eligible",
	},
	{
		id: 2,
		name: "Maria Santos",
		email: "maria@example.com",
		income: 15000,
		gpa: 3.9,
		eligibility: "Eligible",
	},
	{
		id: 3,
		name: "Pedro Reyes",
		email: "pedro@example.com",
		income: 10000,
		gpa: 2.8,
		eligibility: "Not Eligible",
	},
]);

const columns: TableColumn<Applicant>[] = [
	{ accessorKey: "name", header: "Name" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "income", header: "Income" },
	{ accessorKey: "gpa", header: "GPA" },
	{ accessorKey: "eligibility", header: "Eligibility" },
];

/* ---------------- Add Applicant Inline Form ---------------- */
const showForm = ref(false);
const newApplicant = ref<Applicant>({
	id: 0,
	name: "",
	email: "",
	income: 0,
	gpa: 0,
	eligibility: "Eligible",
});

function openForm() {
	newApplicant.value = {
		id: applicants.value.length + 1,
		name: "",
		email: "",
		income: 0,
		gpa: 0,
		eligibility: "Eligible",
	};
	showForm.value = true;
}

function addApplicant() {
	if (!newApplicant.value.name || !newApplicant.value.email) return;
	applicants.value.unshift({ ...newApplicant.value });
	showForm.value = false;
}
</script>

<template>
	<div class="space-y-6">
		<h1 class="text-2xl font-bold">Eligible Applicants</h1>

		<!-- Add Applicant Button -->
		<div class="flex items-center gap-4">
			<UButton
				label="Add Applicant"
				icon="i-lucide-plus"
				color="success"
				variant="outline"
				@click="openForm"
			/>
		</div>

		<!-- Add Applicant Form -->
		<div
			v-if="showForm"
			class="p-4 border rounded-md bg-gray-50 dark:bg-gray-900 space-y-3 mt-2"
		>
			<UInput
				v-model="newApplicant.name"
				label="Name"
				placeholder="Enter full name"
			/>
			<UInput
				v-model="newApplicant.email"
				label="Email"
				placeholder="Enter email"
			/>
			<UInput
				v-model.number="newApplicant.income"
				label="Income"
				type="number"
				placeholder="Enter income"
			/>
			<UInput
				v-model.number="newApplicant.gpa"
				label="GPA"
				type="number"
				step="0.01"
				placeholder="Enter GPA"
			/>
			<USelect
				v-model="newApplicant.eligibility"
				label="Eligibility"
				:options="['Eligible', 'Not Eligible']"
			/>

			<div class="flex justify-end gap-2">
				<UButton
					label="Cancel"
					variant="outline"
					color="neutral"
					@click="showForm = false"
				/>
				<UButton
					label="Add"
					color="success"
					@click="addApplicant"
				/>
			</div>
		</div>

		<!-- Applicants Table -->
		<UTable
			:data="applicants"
			:columns="columns"
			sticky
			class="w-full h-[600px]"
		/>
	</div>
</template>
