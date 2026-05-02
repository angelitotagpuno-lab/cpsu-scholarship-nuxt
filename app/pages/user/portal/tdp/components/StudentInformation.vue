<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";
import { isRequired, isName, isNumber } from "~/utils/validators";
import { z } from "zod";

const formStore = useTdpScholarFormStore();

const SEX_OPTIONS = ["Male", "Female"];

const isEmail = (value: string): true | string => {
	if (!value) return "Email is required";
	return z.string().email().safeParse(value).success ? true : "Invalid email format";
};

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Space"];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) e.preventDefault();
};
</script>

<template>
	<div class="space-y-6">
		<!-- TITLE -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-user-round"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">Student Information</h2>
		</div>

		<!-- FORM -->
		<UForm
			:state="formStore.student"
			:validate-on="['input']"
			class="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full"
		>
			<!-- LAST NAME -->
			<UFormField
				label="Last Name"
				name="lastName"
				:rules="[isRequired, isName]"
			>
				<UInput
					v-model="formStore.student.lastName"
					icon="i-lucide-user"
					placeholder="Dela Cruz"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField
				label="First Name"
				name="firstName"
				:rules="[isRequired, isName]"
			>
				<UInput
					v-model="formStore.student.firstName"
					icon="i-lucide-user"
					placeholder="Juan"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField
				label="Middle Name"
				name="middleName"
				:rules="[isName]"
			>
				<UInput
					v-model="formStore.student.middleName"
					icon="i-lucide-user"
					placeholder="Delapena"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField
				label="Sex"
				name="sex"
				:rules="[isRequired]"
			>
				<USelect
					v-model="formStore.student.sex"
					:items="SEX_OPTIONS"
					icon="i-lucide-user"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField
				label="Birthdate"
				name="birthdate"
				:rules="[isRequired]"
			>
				<UInput
					v-model="formStore.student.birthdate"
					type="date"
					icon="i-lucide-calendar"
					class="w-full"
				/>
			</UFormField>

			<!-- PLACE OF BIRTH -->
			<UFormField
				label="Place of Birth"
				name="birthPlace"
				:rules="[isRequired]"
			>
				<UInput
					v-model="formStore.student.birthPlace"
					icon="i-lucide-map-pin"
					placeholder="San Carlos City"
					class="w-full"
				/>
			</UFormField>

			<!-- CITIZENSHIP -->
			<UFormField
				label="Citizenship"
				name="citizenship"
				:rules="[isRequired, isName]"
			>
				<UInput
					v-model="formStore.student.citizenship"
					icon="i-lucide-globe"
					placeholder="Filipino"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MOBILE -->
			<UFormField
				label="Mobile Number"
				name="mobile"
				:rules="[isRequired, isNumber]"
			>
				<UInput
					v-model="formStore.student.mobile"
					icon="i-lucide-phone"
					placeholder="09XXXXXXXXX"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- EMAIL -->
			<UFormField
				label="Email Address"
				name="email"
				:rules="[isRequired, isEmail]"
			>
				<UInput
					v-model="formStore.student.email"
					type="email"
					icon="i-lucide-mail"
					placeholder="example@gmail.com"
					class="w-full"
				/>
			</UFormField>
		</UForm>
	</div>
</template>
