<script setup lang="ts">
definePageMeta({
	layout: "user-header",
});
</script>

<template>
	<div
		class="flex flex-col lg:flex-row bg-white dark:bg-gray-950 text-gray-900 dark:text-white p-8 gap-8 lg:gap-16"
	>
		<div class="flex-1 flex flex-col gap-6">
			<h1 class="text-4xl font-bold">Contact us</h1>
			<p class="text-gray-600 dark:text-gray-400">
				Get in touch with us for any enquiries and questions
			</p>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
				<div>
					<h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
						General inquiries
					</h3>
					<p class="font-medium">work@horizonstudio.work</p>
					<p class="font-medium">+7 911 296 92 17</p>
				</div>

				<div>
					<h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Careers</h3>
					<p class="font-medium">hr@horizonstudio.work</p>
				</div>

				<div>
					<h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">
						Collaborations
					</h3>
					<p class="font-medium">n.karpova@horizonstudio.work</p>
					<p class="font-medium">+7 931 212-16-07</p>
				</div>

				<div>
					<h3 class="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400">Address</h3>
					<p class="font-medium">191189, St. Petersburg</p>
					<p class="font-medium">Moika River Embankment 67-69</p>
				</div>
			</div>
		</div>

		<div class="flex-1 flex justify-center">
			<UCard class="overflow-hidden rounded-xl shadow-md max-w-md">
				<img
					src="/contact.png"
					alt="Contact Illustration"
					class="w-full h-auto"
				/>
			</UCard>
		</div>
	</div>
</template>
