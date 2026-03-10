<script setup lang="ts">
import DatasetUpload from "./components/dataset-upload.vue";
import DatasetInstructions from "./components/dataset-instructions.vue";

definePageMeta({ layout: "admin" });
</script>

<template>
	<div class="flex items-center gap-3">
		<UDashboardSidebarCollapse />
		<h1 class="text-2xl font-bold">Admin Files</h1>
	</div>
	<div class="flex flex-col lg:flex-row gap-6">
		<div class="flex-1">
			<DatasetInstructions />
		</div>

		<div class="flex-1 lg:max-w-md">
			<DatasetUpload />
		</div>
	</div>
</template>
