<script setup lang="ts">
const model = defineModel<any>();
</script>

<template>
	<div>
		<h2 class="text-xl font-semibold mb-4">Father Information</h2>

		<!-- Mobile-first responsive grid -->
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
			<!-- Father Last Name -->
			<UFormField
				label="Father Last Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.fatherLastName"
					placeholder="Enter father's last name"
					class="w-full"
				/>
			</UFormField>

			<!-- Father First Name -->
			<UFormField
				label="Father First Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.fatherFirstName"
					placeholder="Enter father's first name"
					class="w-full"
				/>
			</UFormField>

			<!-- Father Middle Name -->
			<UFormField
				label="Father Middle Name"
				class="md:col-span-1"
			>
				<UInput
					v-model="model.fatherMiddleName"
					placeholder="Enter father's middle name"
					class="w-full"
				/>
			</UFormField>

			<!-- Father Occupation -->
			<UFormField
				label="Father Occupation"
				class="md:col-span-2"
			>
				<UInput
					v-model="model.fatherOccupation"
					placeholder="Example: Farmer"
					class="w-full"
				/>
			</UFormField>

			<!-- Father Monthly Income -->
			<UFormField
				label="Father Monthly Income"
				class="md:col-span-1"
			>
				<UInput
					type="number"
					v-model="model.fatherIncome"
					placeholder="Example: 5000"
					class="w-full"
				/>
			</UFormField>
		</div>
	</div>
</template>
