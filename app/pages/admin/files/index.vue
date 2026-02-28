<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
	layout: "admin",
});

const value = ref<File[]>([]);
</script>

<template>
	<div class="flex flex-col lg:flex-row gap-6">
		<div class="flex-1">
			<UBlogPost
				title="Import Your Dataset"
				description="Upload your dataset to manage scholarship applicants.
                     Supported file types: Excel (.xlsx, .xls), CSV (.csv), Word (.docx, .doc).
                     Maximum file size: 5MB per file.
                     Once uploaded, the system will process the data and display applicants in the dashboard.
                     Ensure your dataset columns match the required format: Last Name, First Name, Middle Initial, GPA, Income, Course, Year Level, etc."
			/>
		</div>

		<div class="flex-1 lg:max-w-md">
			<UFileUpload
				v-model="value"
				icon="i-lucide-file-text"
				label="Drop your dataset files here"
				description="Excel, CSV, Word files (max. 5MB). You can upload multiple files."
				layout="grid"
				multiple
				:interactive="false"
				class="w-full min-h-48"
				accept=".xlsx,.xls,.csv,.docx,.doc"
			>
				<!-- Actions Slot -->
				<template #actions="{ open }">
					<UButton
						label="Select files"
						icon="i-lucide-upload"
						color="neutral"
						variant="outline"
						@click="open()"
					/>
				</template>

				<!-- Files Top Slot -->
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
		</div>
	</div>
</template>
