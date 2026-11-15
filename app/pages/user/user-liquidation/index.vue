<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "user-header",
});

const selectedPortal = ref<"TES" | "TDP" | "">("");

const portals = [
	{ label: "TES", value: "TES" },
	{ label: "TDP", value: "TDP" },
];

function goToPortal() {
	if (!selectedPortal.value) return;

	navigateTo(`/user/user-liquidation/${selectedPortal.value}`);
}
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
		<UCard
			class="w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
		>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-indigo-50 p-4 ring-1 ring-indigo-100 dark:bg-indigo-950/30 dark:ring-indigo-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-indigo-600 p-2 text-white">
							<UIcon
								name="i-lucide-wallet"
								class="size-5"
							/>
						</div>

						<div>
							<h1 class="text-base font-semibold">Student Scholarship Payout</h1>

							<p class="text-sm text-slate-500">Select your scholarship portal to continue.</p>
						</div>
					</div>
				</div>

				<UAlert
					color="info"
					variant="soft"
					icon="i-lucide-info"
					title="Automatic Payout Records"
					description="Your payout records will be retrieved from your student account."
				/>

				<UFormField label="Select Scholarship Program">
					<USelect
						v-model="selectedPortal"
						:items="portals"
						placeholder="Choose TES or TDP"
						class="w-full"
						size="lg"
					/>
				</UFormField>

				<UButton
					block
					size="lg"
					icon="i-lucide-arrow-right"
					:disabled="!selectedPortal"
					class="bg-indigo-600 hover:bg-indigo-700"
					@click="goToPortal"
				>
					Continue
				</UButton>
			</div>
		</UCard>
	</div>

	<LoginFooter />
</template>
