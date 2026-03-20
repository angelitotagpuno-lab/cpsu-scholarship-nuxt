<script setup lang="ts">
import { useTesScholarFormStore } from "~/stores/TesScholarForm.store";

const formStore = useTesScholarFormStore();
</script>

<template>
	<div class="space-y-6">
		<h2 class="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl">
			Contact Information
		</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
			<UFormField
				label="Contact Number"
				class="md:col-span-1"
			>
				<UInput
					v-model="formStore.contact.contactNumber"
					placeholder="Ex: 09XXXXXXXXX"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Email"
				class="md:col-span-2"
			>
				<UInput
					v-model="formStore.contact.email"
					type="email"
					placeholder="example@email.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
