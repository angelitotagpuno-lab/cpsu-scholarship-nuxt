<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";
import { isRequired, isName, isNumber, isEmail } from "~/utils/validators";

const formStore = useTdpScholarFormStore();

const SEX_OPTIONS = ["Male", "Female"];

// STRICT LETTERS ONLY
const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Space"];

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

// STRICT NUMBERS ONLY
const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<UForm
		:state="formStore.student"
		:validate-on="['input']"
	>
		<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Student Information
		</h3>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<!-- LAST NAME -->
			<UFormField
				label="Last Name"
				name="lastName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.lastName"
					placeholder="Ex: Dela Cruz"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField
				label="First Name"
				name="firstName"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.firstName"
					placeholder="Ex: Juan"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField
				label="Middle Name"
				name="middleName"
				:rules="[isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.middleName"
					placeholder="Ex: Delapena"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField
				label="Sex"
				name="sex"
				:rules="[isRequired]"
				validate-on="input"
			>
				<USelect
					v-model="formStore.student.sex"
					:items="SEX_OPTIONS"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField
				label="Birthdate"
				name="birthdate"
				:rules="[isRequired]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.birthdate"
					type="date"
					class="w-full"
				/>
			</UFormField>

			<!-- PLACE OF BIRTH -->
			<UFormField
				label="Place of Birth"
				name="birthPlace"
				:rules="[isRequired]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.birthPlace"
					placeholder="Ex: San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<!-- CITIZENSHIP -->
			<UFormField
				label="Citizenship"
				name="citizenship"
				:rules="[isRequired, isName]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.citizenship"
					placeholder="Ex: Filipino"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MOBILE -->
			<UFormField
				label="Mobile Number"
				name="mobile"
				:rules="[isRequired, isNumber]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.mobile"
					placeholder="Ex: 09385254043"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- EMAIL -->
			<UFormField
				label="Email Address"
				name="email"
				:rules="[isRequired, isEmail]"
				validate-on="input"
			>
				<UInput
					v-model="formStore.student.email"
					placeholder="Ex: example@gmail.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
