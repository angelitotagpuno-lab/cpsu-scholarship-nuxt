<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
	layout: "user-header",
});

const router = useRouter();
const selectedPortal = ref<string | null>(null);

const goToPortal = () => {
	if (!selectedPortal.value) return alert("Please select a portal.");
	router.push(`/user/user-liquidation/${selectedPortal.value}`);
};
</script>

<template>
	<div
		class="p-6 min-h-screen flex flex-col items-center justify-center bg-background text-foreground"
	>
		<h1 class="text-2xl font-bold mb-6 text-center">Applicant Liquidation</h1>

		<div
			class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow w-full max-w-sm flex flex-col gap-4"
		>
			<label class="block font-medium mb-2">Select Your Portal</label>
			<select
				v-model="selectedPortal"
				class="w-full border rounded p-2 bg-white dark:bg-gray-700 text-black dark:text-white"
			>
				<!-- Use value="" for placeholder, ensure v-model is null -->
				<option
					disabled
					value=""
				>
					Select Portal
				</option>
				<option value="tdp">TDP Portal</option>
				<option value="tes">TES Portal</option>
			</select>

			<button
				@click="goToPortal"
				class="w-full bg-blue-600 dark:bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 mt-2"
			>
				Go
			</button>
		</div>
	</div>
	<LoginFooter />
</template>
