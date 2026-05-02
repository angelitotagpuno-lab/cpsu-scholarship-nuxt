<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";
import { isNumber, isName, isRequired } from "~/utils/validators";

const formStore = useTdpScholarFormStore();

const STATUS_OPTIONS = ["Living", "Deceased"];
const FINANCIAL_OPTIONS = ["Yes", "No"];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Space"];

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
	<UForm
		:state="formStore"
		class="space-y-8"
	>
		<!-- PARENTS SECTION -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- FATHER -->
			<UCard>
				<div class="flex items-center gap-2 mb-4">
					<UIcon
						name="i-lucide-user"
						class="text-slate-500 size-5"
					/>
					<h4 class="font-semibold">Father Information</h4>
				</div>

				<div class="space-y-4">
					<UFormField
						name="fatherName"
						label="Name"
						:rules="[isRequired, isName]"
					>
						<UInput
							v-model="formStore.father.fatherName"
							icon="i-lucide-user"
							placeholder="Juan Dela Cruz"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="fatherOccupation"
						label="Occupation"
						:rules="[isRequired, isName]"
					>
						<UInput
							v-model="formStore.father.fatherOccupation"
							icon="i-lucide-briefcase"
							placeholder="Farmer"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="fatherStatus"
						label="Status"
						:rules="[isRequired]"
					>
						<USelect
							v-model="formStore.father.fatherStatus"
							:items="STATUS_OPTIONS"
							icon="i-lucide-heart"
							class="w-full"
							placeholder="Select Status"
						/>
					</UFormField>
				</div>
			</UCard>

			<!-- MOTHER -->
			<UCard>
				<div class="flex items-center gap-2 mb-4">
					<UIcon
						name="i-lucide-user"
						class="text-slate-500 size-5"
					/>
					<h4 class="font-semibold">Mother Information</h4>
				</div>

				<div class="space-y-4">
					<UFormField
						name="motherName"
						label="Name"
						:rules="[isRequired, isName]"
					>
						<UInput
							v-model="formStore.mother.motherName"
							icon="i-lucide-user"
							placeholder="Maria Santos"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="motherOccupation"
						label="Occupation"
						:rules="[isRequired, isName]"
					>
						<UInput
							v-model="formStore.mother.motherOccupation"
							icon="i-lucide-briefcase"
							placeholder="Vendor"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						name="motherStatus"
						label="Status"
						:rules="[isRequired]"
					>
						<USelect
							v-model="formStore.mother.motherStatus"
							:items="STATUS_OPTIONS"
							icon="i-lucide-heart"
							class="w-full"
							placeholder="Select Status"
						/>
					</UFormField>
				</div>
			</UCard>
		</div>

		<!-- FAMILY DETAILS -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				name="income"
				label="Total Parents Income"
				:rules="[isRequired, isNumber]"
			>
				<UInput
					v-model="formStore.family.income"
					icon="i-lucide-dollar-sign"
					placeholder="15000"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				name="siblings"
				label="No. of Siblings"
				:rules="[isRequired, isNumber]"
			>
				<UInput
					v-model="formStore.family.siblings"
					icon="i-lucide-users"
					placeholder="3"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				name="financialAid"
				label="Other Financial Assistance?"
				:rules="[isRequired]"
			>
				<USelect
					v-model="formStore.family.financialAid"
					:items="FINANCIAL_OPTIONS"
					icon="i-lucide-hand-coins"
					class="w-full"
					placeholder="Select Option"
				/>
			</UFormField>

			<UFormField
				v-if="formStore.family.financialAid === 'Yes'"
				name="financialAidSpecify"
				label="Please specify"
				:rules="[isRequired]"
			>
				<UInput
					v-model="formStore.family.financialAidSpecify"
					icon="i-lucide-pen"
					placeholder="Specify assistance"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
