<template>
	<div class="flex flex-col lg:flex-row gap-6">

		<div class="flex-1">
			<UBlogPost title="Introducing Nuxt Icon v1"
				description="Discover Nuxt Icon v1 - a modern, versatile, and customizable icon solution for your Nuxt projects." />
		</div>

		<div class="flex-1 lg:max-w-md">
			<UFileUpload v-model="value" icon="i-lucide-file-text" label="Drop your dataset files here"
				description="Excel, CSV, Word files (max. 5MB)" layout="grid" multiple :interactive="false"
				class="w-full min-h-48" accept=".xlsx,.xls,.csv,.docx,.doc">
				<template #actions="{ open }">
					<UButton label="Select files" icon="i-lucide-upload" color="neutral" variant="outline" @click="open()" />
				</template>

				<template #files-top="{ open, files }">
					<div v-if="files?.length" class="mb-2 flex items-center justify-between">
						<p class="font-bold">Files ({{ files?.length }})</p>
						<UButton icon="i-lucide-plus" label="Add more" color="neutral" variant="outline" class="-my-2"
							@click="open()" />
					</div>
				</template>
			</UFileUpload>
		</div>
	</div>
</template>

<script
	setup
	lang="ts"
>
	definePageMeta({
		layout: 'admin'
	})

	import { ref } from 'vue'

	const value = ref<File[]>([])
</script>
