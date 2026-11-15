<script setup lang="ts">
import { computed } from "vue";
import { useTdpFormStore } from "~/stores/tdp-form.store";

const store = useTdpFormStore();

// Parent references
const father = computed(() => store.item.profile.parents[0]);
const mother = computed(() => store.item.profile.parents[1]);

const STATUS_OPTIONS = [
	{ label: "Living", value: "living" },
	{ label: "Deceased", value: "deceased" },
	{ label: "Unknown", value: "unknown" },
];

const FINANCIAL_OPTIONS = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
		return;
	}

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key)) {
		e.preventDefault();
	}
};

const allowNumbers = (e: KeyboardEvent) => {
	if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
		return;
	}

	if (!/[0-9]/.test(e.key)) {
		e.preventDefault();
	}
};
</script>

<template>
	<div class="space-y-6">
		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-heart-handshake"
				class="size-5 text-emerald-600"
			/>

			<h2 class="text-lg font-semibold">Family Information</h2>
		</div>

		<!-- PARENTS -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- FATHER -->
			<UCard>
				<h3 class="mb-4 font-semibold">Father Information</h3>

				<div
					v-if="father"
					class="space-y-4"
				>
					<UFormField
						label="First Name"
						required
					>
						<UInput
							v-model="father.firstName"
							icon="i-lucide-user"
							placeholder="Father First Name"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						label="Last Name"
						required
					>
						<UInput
							v-model="father.lastName"
							icon="i-lucide-user"
							placeholder="Father Last Name"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						label="Status"
						required
					>
						<USelect
							v-model="father.status"
							:items="STATUS_OPTIONS"
							placeholder="Select status"
							icon="i-lucide-activity"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Occupation"
						required
					>
						<UInput
							v-model="father.occupation"
							icon="i-lucide-briefcase-business"
							placeholder="Father's occupation"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Monthly Income"
						required
					>
						<UInput
							v-model="father.monthlyIncome"
							icon="i-lucide-wallet"
							placeholder="Father's monthly income"
							class="w-full"
							@keydown="allowNumbers"
						/>
					</UFormField>
				</div>
			</UCard>

			<!-- MOTHER -->
			<UCard>
				<h3 class="mb-4 font-semibold">Mother Information</h3>

				<div
					v-if="mother"
					class="space-y-4"
				>
					<UFormField
						label="First Name"
						required
					>
						<UInput
							v-model="mother.firstName"
							icon="i-lucide-user-round"
							placeholder="Mother First Name"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						label="Last Name"
						required
					>
						<UInput
							v-model="mother.lastName"
							icon="i-lucide-user"
							placeholder="Mother Last Name"
							class="w-full"
							@keydown="allowLetters"
						/>
					</UFormField>

					<UFormField
						label="Status"
						required
					>
						<USelect
							v-model="mother.status"
							:items="STATUS_OPTIONS"
							placeholder="Select status"
							icon="i-lucide-activity"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Occupation"
						required
					>
						<UInput
							v-model="mother.occupation"
							icon="i-lucide-briefcase-business"
							placeholder="Mother's occupation"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Monthly Income"
						required
					>
						<UInput
							v-model="mother.monthlyIncome"
							icon="i-lucide-wallet"
							placeholder="Mother's monthly income"
							class="w-full"
							@keydown="allowNumbers"
						/>
					</UFormField>
				</div>
			</UCard>
		</div>

		<!-- FAMILY INFORMATION -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<UFormField label="Total Family Monthly Income">
				<UInput
					v-model="store.item.profile.family.income"
					icon="i-lucide-wallet"
					placeholder="Enter total family income"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField
				label="No. of Siblings"
				required
			>
				<UInput
					v-model="store.item.profile.family.siblings"
					icon="i-lucide-users"
					placeholder="Number of siblings"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<UFormField label="Financial Aid">
				<USelect
					v-model="store.item.profile.family.financialAid"
					:items="FINANCIAL_OPTIONS"
					placeholder="Select option"
					icon="i-lucide-hand-coins"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				v-if="store.item.profile.family.financialAid === 'Yes'"
				label="Specify Assistance"
				required
			>
				<UInput
					v-model="store.item.profile.family.financialAidSpecify"
					icon="i-lucide-pen"
					placeholder="Specify financial assistance"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
