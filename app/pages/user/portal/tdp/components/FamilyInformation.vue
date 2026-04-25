<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";
import { isNumber, isName, isRequired } from "~/utils/validators";

const formStore = useTdpScholarFormStore();

const STATUS_OPTIONS = ["Living", "Deceased"];
const FINANCIAL_OPTIONS = ["Yes", "No"];

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
	<UForm :state="formStore">
		<div class="space-y-6">
			<h3 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
				Family Background
			</h3>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<!-- FATHER -->
				<div>
					<h4 class="font-medium mb-2">Father</h4>

					<UFormField
						name="fatherName"
						label="Name"
						:rules="[isRequired, isName]"
						validate-on="input"
					>
						<UInput
							v-model="formStore.father.fatherName"
							placeholder="Ex: Juan Dela Cruz"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="fatherOccupation"
						label="Occupation"
						:rules="[isRequired, isName]"
						validate-on="input"
					>
						<UInput
							v-model="formStore.father.fatherOccupation"
							placeholder="Ex: Farmer"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="fatherStatus"
						label="Status"
						:rules="[isRequired]"
						validate-on="input"
					>
						<USelect
							v-model="formStore.father.fatherStatus"
							:items="STATUS_OPTIONS"
							placeholder="Select Status"
							class="w-full"
						/>
					</UFormField>
				</div>

				<!-- MOTHER -->
				<div>
					<h4 class="font-medium mb-2">Mother</h4>

					<UFormField
						name="motherName"
						label="Name"
						:rules="[isRequired, isName]"
						validate-on="input"
					>
						<UInput
							v-model="formStore.mother.motherName"
							placeholder="Ex: Maria Santos"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="motherOccupation"
						label="Occupation"
						:rules="[isRequired, isName]"
						validate-on="input"
					>
						<UInput
							v-model="formStore.mother.motherOccupation"
							placeholder="Ex: Vendor"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="motherStatus"
						label="Status"
						:rules="[isRequired]"
						validate-on="input"
					>
						<USelect
							v-model="formStore.mother.motherStatus"
							:items="STATUS_OPTIONS"
							placeholder="Select Status"
							class="w-full"
						/>
					</UFormField>
				</div>
			</div>

			<!-- EXTRA DETAILS -->
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
				<!-- INCOME -->
				<UFormField
					name="income"
					label="Total Parents Income"
					:rules="[isRequired, isNumber]"
					validate-on="input"
				>
					<UInput
						v-model="formStore.family.income"
						placeholder="Ex: 15000"
						class="w-full"
						@keydown="allowNumbers"
					/>
				</UFormField>

				<!-- SIBLINGS -->
				<UFormField
					name="siblings"
					label="No. of Siblings"
					:rules="[isRequired, isNumber]"
					validate-on="input"
				>
					<UInput
						v-model="formStore.family.siblings"
						placeholder="Ex: 3"
						class="w-full"
						@keydown="allowNumbers"
					/>
				</UFormField>

				<!-- FINANCIAL AID -->
				<UFormField
					name="financialAid"
					label="Other Financial Assistance?"
					:rules="[isRequired]"
					validate-on="input"
				>
					<USelect
						v-model="formStore.family.financialAid"
						:items="FINANCIAL_OPTIONS"
						placeholder="Select Option"
						class="w-full"
					/>
				</UFormField>

				<!-- SPECIFY -->
				<UFormField
					v-if="formStore.family.financialAid === 'Yes'"
					name="financialAidSpecify"
					label="Please specify"
					:rules="[isRequired]"
					validate-on="input"
				>
					<UInput
						v-model="formStore.family.financialAidSpecify"
						placeholder="Please specify assistance"
						class="w-full"
					/>
				</UFormField>
			</div>
		</div>
	</UForm>
</template>
