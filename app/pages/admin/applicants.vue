<script setup lang="ts">
definePageMeta({
	layout: "admin", // <-- Uses the admin layout
});
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Approved Applicants</h1>
		<p>View the list of approved applicants from the ADMIN's perspective.</p>

		<!-- Example placeholder for a table or card list -->
		<div class="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
			<p class="text-gray-500 dark:text-gray-400">No applicants to show yet.</p>
		</div>
	</div>
</template>
