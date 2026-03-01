<script setup lang="ts">
import { ref } from "vue";

const files = ref<File[]>([]);
</script>

<template>
	<UFileUpload
		v-model="files"
		icon="i-lucide-file-text"
		label="Drop your dataset files here"
		description="Excel, CSV, Word files (max. 5MB). You can upload multiple files."
		layout="grid"
		multiple
		:interactive="false"
		class="w-full min-h-48"
		accept=".xlsx,.xls,.csv,.docx,.doc"
	>
		<!-- Select button -->
		<template #actions="{ open }">
			<UButton
				label="Select files"
				icon="i-lucide-upload"
				color="neutral"
				variant="outline"
				@click="open()"
			/>
		</template>

		<!-- Files header -->
		<template #files-top="{ open, files }">
			<div
				v-if="files?.length"
				class="mb-2 flex items-center justify-between"
			>
				<p class="font-bold">Files Selected ({{ files?.length }})</p>
				<UButton
					icon="i-lucide-plus"
					label="Add more"
					color="neutral"
					variant="outline"
					class="-my-2"
					@click="open()"
				/>
			</div>
		</template>
	</UFileUpload>
</template>
