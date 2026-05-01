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
		:state="formStore.father"
		:validate-on="['input']"
	>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- LAST NAME -->
			<UFormField
				label="Father Last Name"
				name="fatherLastName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.father.fatherLastName"
					placeholder="Enter father's last name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField
				label="Father First Name"
				name="fatherFirstName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.father.fatherFirstName"
					placeholder="Enter father's first name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField
				label="Father Middle Name"
				name="fatherMiddleName"
				:rules="[isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.father.fatherMiddleName"
					placeholder="Enter father's middle name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- OCCUPATION -->
			<UFormField
				label="Father Occupation"
				name="fatherOccupation"
				:rules="[isRequired, isName]"
				validate-on="input"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.father.fatherOccupation"
					placeholder="Ex: Farmer"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- INCOME -->
			<UFormField
				label="Father Monthly Income"
				name="fatherIncome"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.father.fatherIncome"
					type="number"
					placeholder="Ex: 5000"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
