<script setup lang="ts">
const model = defineModel<any>();
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Address</h2>

		<!-- Mobile-first responsive grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Street & Barangay (span 2 columns on desktop for more space) -->
			<UFormField
				label="Street & Barangay"
				class="md:col-span-2"
			>
				<UInput
					v-model="model.streetBarangay"
					placeholder="Purok 5 Brgy. San Jose"
					class="w-full"
				/>
			</UFormField>

			<!-- Zip Code -->
			<UFormField
				label="Zip Code"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.zipcode"
					placeholder="6100"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
