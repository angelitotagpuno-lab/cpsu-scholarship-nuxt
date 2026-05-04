<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";

const store = useApplicationStore();

const STATUS_OPTIONS = ["Living", "Deceased"];
const FINANCIAL_OPTIONS = ["Yes", "No"];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};
</script>

<template>
	<UForm
		:state="store.item.profile"
		class="space-y-8"
	>
		<!-- PARENTS -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<UCard>
				<h4 class="font-semibold mb-4">Father Information</h4>

				<UFormField label="First Name">
					<UInput
						v-model="store.item.profile.parents[0].firstName"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Last Name">
					<UInput
						v-model="store.item.profile.parents[0].lastName"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Status">
					<USelect
						v-model="store.item.profile.parents[0].status"
						:items="STATUS_OPTIONS"
					/>
				</UFormField>
			</UCard>

			<UCard>
				<h4 class="font-semibold mb-4">Mother Information</h4>

				<UFormField label="First Name">
					<UInput
						v-model="store.item.profile.parents[1].firstName"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Last Name">
					<UInput
						v-model="store.item.profile.parents[1].lastName"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Status">
					<USelect
						v-model="store.item.profile.parents[1].status"
						:items="STATUS_OPTIONS"
					/>
				</UFormField>
			</UCard>
		</div>

		<!-- FAMILY -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormField label="Monthly Income">
				<UInput
					v-model="store.item.profile.family.income"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField label="No. of Siblings">
				<UInput
					v-model="store.item.profile.family.siblings"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField label="Financial Assistance">
				<USelect
					v-model="store.item.profile.family.financialAid"
					:items="FINANCIAL_OPTIONS"
				/>
			</UFormField>

			<UFormField
				v-if="store.item.profile.family.financialAid === 'Yes'"
				label="Specify"
			>
				<UInput v-model="store.item.profile.family.financialAidSpecify" />
			</UFormField>
		</div>
	</UForm>
</template>
