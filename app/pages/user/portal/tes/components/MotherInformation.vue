<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";
import { isRequired, isName, isNumber } from "~/utils/validators";

const formStore = useTesScholarFormStore();

// 🔒 STRICT LETTERS ONLY
const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

// 🔒 STRICT NUMBERS ONLY
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<UForm
		:state="formStore.mother"
		:validate-on="['input']"
	>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- LAST NAME -->
			<UFormField
				label="Mother Maiden Last Name"
				name="motherLastName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.mother.motherLastName"
					placeholder="Enter mother's maiden last name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField
				label="Mother First Name"
				name="motherFirstName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.mother.motherFirstName"
					placeholder="Enter mother's first name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField
				label="Mother Middle Name"
				name="motherMiddleName"
				:rules="[isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.mother.motherMiddleName"
					placeholder="Enter mother's middle name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- OCCUPATION -->
			<UFormField
				label="Mother Occupation"
				name="motherOccupation"
				:rules="[isRequired, isName]"
				validate-on="input"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.mother.motherOccupation"
					placeholder="Ex: Vendor"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- INCOME -->
			<UFormField
				label="Mother Monthly Income"
				name="motherIncome"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.mother.motherIncome"
					type="number"
					placeholder="Ex: 4000"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
