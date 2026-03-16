<script setup lang="ts">
const model = defineModel<any>();
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Contact Information</h2>

		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<UFormField
				label="Contact Number"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.contactNumber"
					placeholder="09XXXXXXXXX"
					class="w-full"
				/>
			</UFormField>

			<UFormField
				label="Email"
				class="md:col-span-2"
			>
				<UInput
					type="email"
					v-model="model.email"
					placeholder="example@email.com"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
