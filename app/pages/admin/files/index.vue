<script setup lang="ts">
import DatasetUpload from "./components/dataset-upload.vue";
import DatasetInstructions from "./components/dataset-instructions.vue";

definePageMeta({ layout: "admin" });
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
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Admin Files</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage dataset uploads and file instructions
					</p>
				</div>
			</div>
		</div>

		<!-- CONTENT -->
		<div class="flex flex-col lg:flex-row gap-6">
			<!-- INSTRUCTIONS -->
			<div
				class="flex-1 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<DatasetInstructions />
			</div>

			<!-- UPLOAD -->
			<div
				class="flex-1 lg:max-w-md rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
			>
				<DatasetUpload />
			</div>
		</div>
	</div>
</template>
