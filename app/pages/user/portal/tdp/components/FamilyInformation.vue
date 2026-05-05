<script setup lang="ts">
import { useApplicationStore } from "~/stores/application.store";

const store = useApplicationStore();

const STATUS_OPTIONS = [
	{ label: "Living", value: "living" },
	{ label: "Deceased", value: "deceased" },
];

const FINANCIAL_OPTIONS = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];

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
	<UForm class="space-y-6">
		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-heart-handshake"
				class="text-emerald-600 size-5"
			/>
			<h2 class="text-lg font-semibold">Family Information</h2>
		</div>

		<!-- PARENTS -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<!-- FATHER -->
			<UCard>
				<h3 class="font-semibold mb-4">Father Information</h3>

				<UFormField label="First Name">
					<UInput
						v-model="store.item.profile.parents[0].firstName"
						icon="i-lucide-user"
						placeholder="Father First Name"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Last Name">
					<UInput
						v-model="store.item.profile.parents[0].lastName"
						icon="i-lucide-user"
						placeholder="Father Last Name"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- DROPDOWN FIXED -->
				<UFormField label="Status">
					<USelect
						v-model="store.item.profile.parents[0].status"
						:items="STATUS_OPTIONS"
						option-attribute="label"
						value-attribute="value"
						placeholder="Select status"
						icon="i-lucide-activity"
						class="w-full"
					/>
				</UFormField>
			</UCard>

			<!-- MOTHER -->
			<UCard>
				<h3 class="font-semibold mb-4">Mother Information</h3>

				<UFormField label="First Name">
					<UInput
						v-model="store.item.profile.parents[1].firstName"
						icon="i-lucide-user-round"
						placeholder="Mother First Name"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>

				<UFormField label="Last Name">
					<UInput
						v-model="store.item.profile.parents[1].lastName"
						icon="i-lucide-user"
						placeholder="Mother Last Name"
						class="w-full"
						@keydown="allowLetters"
					/>
				</UFormField>

				<!-- DROPDOWN FIXED -->
				<UFormField label="Status">
					<USelect
						v-model="store.item.profile.parents[1].status"
						:items="STATUS_OPTIONS"
						option-attribute="label"
						value-attribute="value"
						placeholder="Select status"
						icon="i-lucide-activity"
						class="w-full"
					/>
				</UFormField>
			</UCard>
		</div>

		<!-- FAMILY INFO -->
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
			<UFormField label="Monthly Income">
				<UInput
					v-model="store.item.profile.family.income"
					icon="i-lucide-wallet"
					placeholder="Enter income"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField label="No. of Siblings">
				<UInput
					v-model="store.item.profile.family.siblings"
					icon="i-lucide-users"
					placeholder="Number of siblings"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- DROPDOWN FIXED -->
			<UFormField label="Financial Aid">
				<USelect
					v-model="store.item.profile.family.financialAid"
					:items="FINANCIAL_OPTIONS"
					option-attribute="label"
					value-attribute="value"
					placeholder="Select option"
					icon="i-lucide-hand-coins"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				v-if="store.item.profile.family.financialAid === 'Yes'"
				label="Specify Assistance"
			>
				<UInput
					v-model="store.item.profile.family.financialAidSpecify"
					icon="i-lucide-pen"
					placeholder="Specify assistance"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
