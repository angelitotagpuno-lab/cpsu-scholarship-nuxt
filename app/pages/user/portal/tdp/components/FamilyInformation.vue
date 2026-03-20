<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();
const yesNoOptions = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];
</script>

<template>
	<div class="space-y-6">
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Family Background
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
			<!-- Father -->
			<div>
				<h4 class="text-gray-900 dark:text-white font-medium mb-2">Father</h4>
				<UFormField label="Name">
					<UInput
						v-model="formStore.father.fatherName"
						placeholder="Ex: Juan Dela Cruz"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Occupation">
					<UInput
						v-model="formStore.father.fatherOccupation"
						placeholder="Ex: Farmer"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Status">
					<USelect
						v-model="formStore.father.fatherStatus"
						:options="[
							{ label: 'Living', value: 'Living' },
							{ label: 'Deceased', value: 'Deceased' },
						]"
						placeholder="Select Status"
						class="w-full"
					/>
				</UFormField>
			</div>

			<!-- Mother -->
			<div>
				<h4 class="text-gray-900 dark:text-white font-medium mb-2">Mother</h4>
				<UFormField label="Name">
					<UInput
						v-model="formStore.mother.motherName"
						placeholder="Ex: Maria Santos"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Occupation">
					<UInput
						v-model="formStore.mother.motherOccupation"
						placeholder="Ex: Vendor"
						class="w-full"
					/>
				</UFormField>

				<UFormField label="Status">
					<USelect
						v-model="formStore.mother.motherStatus"
						:options="[
							{ label: 'Living', value: 'Living' },
							{ label: 'Deceased', value: 'Deceased' },
						]"
						placeholder="Select Status"
						class="w-full"
					/>
				</UFormField>
			</div>
		</div>

		<!-- Extra Family Details -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
			<UFormField label="Total Parents Income">
				<UInput
					v-model="formStore.family.income"
					placeholder="Ex: 15000"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="No. of Siblings">
				<UInput
					v-model="formStore.family.siblings"
					placeholder="Ex: 3"
					class="w-full"
				/>
			</UFormField>

			<UFormField label="Other Financial Assistance">
				<USelect
					v-model="formStore.family.financialAid"
					:options="yesNoOptions"
					placeholder="Select Yes or No"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
