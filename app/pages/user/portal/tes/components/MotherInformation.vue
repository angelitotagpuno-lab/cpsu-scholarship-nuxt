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
	<div class="space-y-4 mt-6">
		<!-- SECTION LABEL -->
		<div class="flex items-center gap-2 font-semibold text-rose-600">
			<UIcon
				name="i-lucide-user"
				class="size-5"
			/>
			<span>Mother Information</span>
		</div>

		<UForm
			:state="formStore.mother"
			:validate-on="['input']"
		>
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
				<!-- LAST NAME -->
				<UFormField
					label="Maiden Last Name"
					name="motherLastName"
					:rules="[isRequired, isName]"
				>
					<UInput
						v-model="formStore.mother.motherLastName"
						class="w-full"
						placeholder="Santos"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- FIRST NAME -->
				<UFormField
					label="First Name"
					name="motherFirstName"
					:rules="[isRequired, isName]"
				>
					<UInput
						v-model="formStore.mother.motherFirstName"
						class="w-full"
						placeholder="Maria"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- MIDDLE NAME -->
				<UFormField
					label="Middle Name"
					name="motherMiddleName"
					:rules="[isName]"
				>
					<UInput
						v-model="formStore.mother.motherMiddleName"
						class="w-full"
						placeholder="Cruz"
						icon="i-lucide-user"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- OCCUPATION -->
				<UFormField
					label="Occupation"
					name="motherOccupation"
					:rules="[isRequired, isName]"
					class="md:col-span-2"
				>
					<UInput
						v-model="formStore.mother.motherOccupation"
						class="w-full"
						placeholder="Vendor"
						icon="i-lucide-briefcase"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- INCOME -->
				<UFormField
					label="Monthly Income"
					name="motherIncome"
					:rules="[isRequired, isNumber]"
				>
					<UInput
						v-model="formStore.mother.motherIncome"
						class="w-full"
						type="number"
						placeholder="4000"
						icon="i-lucide-wallet"
						@keydown="allowNumbers"
					/>
				</UFormField>
			</div>
		</UForm>
	</div>
</template>
