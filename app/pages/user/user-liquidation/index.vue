<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
	layout: "user-header",
});

const router = useRouter();
const selectedPortal = ref<string>("");

const portals = ["TDP", "TES"];

const goToPortal = () => {
	if (!selectedPortal.value) return;
	router.push(`/user/user-liquidation/${selectedPortal.value}`);
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
		<UCard
			class="w-full max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
		>
			<!-- HEADER -->
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
						<h1 class="text-base font-semibold text-slate-900 dark:text-white">
							Applicant Liquidation
						</h1>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Select your scholarship portal to continue
						</p>
					</div>
				</div>
			</div>

			<!-- FORM -->
			<div class="space-y-5">
				<UFormField label="Select Portal">
					<USelect
						v-model="selectedPortal"
						:items="portals"
						placeholder="Choose a portal"
						class="w-full"
						size="lg"
					/>
				</UFormField>

				<UButton
					block
					size="lg"
					color="primary"
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
