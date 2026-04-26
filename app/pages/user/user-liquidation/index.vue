<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
	layout: "user-header",
});

const router = useRouter();

// ✅ use simple string (fixes v-model error)
const selectedPortal = ref<string>("");

// Nuxt UI select items (simple mode)
const portals = ["TDP", "TES"];

const goToPortal = () => {
	if (!selectedPortal.value) return;

	router.push(`/user/user-liquidation/${selectedPortal.value}`);
};
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
		<UCard class="w-full max-w-md">
			<div class="text-center mb-6">
				<h1 class="text-xl font-bold">Applicant Liquidation</h1>
				<p class="text-sm text-gray-500 dark:text-gray-400">Select your scholarship portal</p>
			</div>

			<div class="space-y-4">
				<UFormField label="Select Portal">
					<USelect
						v-model="selectedPortal"
						:items="portals"
						placeholder="Choose a portal"
						class="w-full"
					/>
				</UFormField>

				<UButton
					block
					size="lg"
					color="primary"
					:disabled="!selectedPortal"
					@click="goToPortal"
				>
					Continue
				</UButton>
			</div>
		</UCard>
	</div>

	<LoginFooter />
</template>
