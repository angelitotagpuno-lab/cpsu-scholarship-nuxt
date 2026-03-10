<script setup lang="ts">
const model = defineModel<any>();
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Mother Information</h2>

		<!-- Mobile-first responsive grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Mother Maiden Last Name -->
			<UFormField
				label="Mother Maiden Last Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.motherLastName"
					placeholder="Enter mother's maiden last name"
					class="w-full"
				/>
			</UFormField>

			<!-- Mother First Name -->
			<UFormField
				label="Mother First Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.motherFirstName"
					placeholder="Enter mother's first name"
					class="w-full"
				/>
			</UFormField>

			<!-- Mother Middle Name -->
			<UFormField
				label="Mother Middle Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.motherMiddleName"
					placeholder="Enter mother's middle name"
					class="w-full"
				/>
			</UFormField>

			<!-- Mother Occupation -->
			<UFormField
				label="Mother Occupation"
				class="md:col-span-2"
			>
				<UInput
					v-model="model.motherOccupation"
					placeholder="Example: Vendor"
					class="w-full"
				/>
			</UFormField>

			<!-- Mother Monthly Income -->
			<UFormField
				label="Mother Monthly Income"
				class="md:col-span-1"
			>
				<UInput
					type="number"
					v-model="model.motherIncome"
					placeholder="Example: 4000"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
