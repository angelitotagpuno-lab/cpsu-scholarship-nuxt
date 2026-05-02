<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";
import { isRequired, isName, isNumber } from "~/utils/validators";

const formStore = useTesScholarFormStore();

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];
	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];
	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<div class="space-y-4">
		<!-- SECTION LABEL -->
		<div class="flex items-center gap-2 font-semibold text-blue-600">
			<UIcon
				name="i-lucide-user"
				class="size-5"
			/>
			<span>Father Information</span>
		</div>

		<UForm
			:state="formStore.father"
			:validate-on="['input']"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<!-- LAST NAME -->
				<UFormField
					label="Last Name"
					name="fatherLastName"
					:rules="[isRequired, isName]"
				>
					<UInput
						v-model="formStore.father.fatherLastName"
						class="w-full"
						placeholder="Dela Cruz"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- FIRST NAME -->
				<UFormField
					label="First Name"
					name="fatherFirstName"
					:rules="[isRequired, isName]"
				>
					<UInput
						v-model="formStore.father.fatherFirstName"
						class="w-full"
						placeholder="Juan"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- MIDDLE NAME -->
				<UFormField
					label="Middle Name"
					name="fatherMiddleName"
					:rules="[isName]"
				>
					<UInput
						v-model="formStore.father.fatherMiddleName"
						class="w-full"
						placeholder="Santos"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- OCCUPATION -->
				<UFormField
					label="Occupation"
					name="fatherOccupation"
					:rules="[isRequired, isName]"
					class="md:col-span-2"
				>
					<UInput
						v-model="formStore.father.fatherOccupation"
						class="w-full"
						placeholder="Farmer"
						icon="i-lucide-briefcase"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- INCOME -->
				<UFormField
					label="Monthly Income"
					name="fatherIncome"
					:rules="[isRequired, isNumber]"
				>
					<UInput
						v-model="formStore.father.fatherIncome"
						class="w-full"
						type="number"
						placeholder="5000"
						icon="i-lucide-wallet"
						@keydown="allowNumbers"
					/>
				</UFormField>
			</div>
		</UForm>
	</div>
</template>
