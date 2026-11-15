<script setup lang="ts">
import { onMounted } from "vue";
import { useAdminApplicationStore } from "~/stores/application.store";
import ApplicantRecommendations from "./components/ApplicantsRecommendations.vue";

definePageMeta({
	layout: "admin",
});

const store = useAdminApplicationStore();

onMounted(async () => {
	await store.fetchApplications();
});
</script>

<template>
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">
						Applicant Recommendations
					</h1>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Review TES and TDP applicants based on academic performance and reported family income.
					</p>
				</div>
			</div>
		</div>

		<UAlert
			v-if="store.errorMessage"
			title="Unable to load applicants"
			description="We couldn't retrieve the applicant records. Please try again."
			color="warning"
			variant="soft"
		/>

		<div
			v-if="store.isLoading"
			class="flex items-center justify-center gap-3 py-12"
		>
			<UIcon
				name="i-lucide-loader-circle"
				class="size-6 animate-spin text-primary"
			/>
			<p class="text-sm text-slate-500">Loading applicant information...</p>
		</div>

		<ApplicantRecommendations
			v-else-if="!store.errorMessage"
			:applications="store.items"
		/>

		<p class="text-xs text-slate-500">
			Recommendations are based on applications loaded from the current page of records. Final
			scholarship decisions remain with the administrator.
		</p>
	</div>
</template>
