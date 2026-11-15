<script setup lang="ts">
import ApplicantsAnalytics from "./components/ApplicantsAnalytics.vue";

definePageMeta({
	layout: "admin",
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
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Scholarship Analytics</h1>

					<p class="text-sm text-slate-500 dark:text-slate-400">
						Monitor scholarship applications, student records, and approval statistics.
					</p>
				</div>
			</div>
		</div>

		<!-- ANALYTICS COMPONENT -->
		<ApplicantsAnalytics />
	</div>
</template>
