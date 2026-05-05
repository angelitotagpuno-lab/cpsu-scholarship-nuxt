<script setup lang="ts">
const props = defineProps<{ data: any }>();
const emit = defineEmits<{ close: [boolean] }>();

function confirmDelete() {
	console.log("🗑 DELETE:", props.data);

	// TODO API later
	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Student Record">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-red-50 p-4 ring-1 ring-red-100 dark:bg-red-950/30 dark:ring-red-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-red-600 p-2 text-white">
							<UIcon
								name="i-lucide-alert-triangle"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-red-700">Delete confirmation</h3>
							<p class="text-sm text-red-500">This action cannot be undone.</p>
						</div>
					</div>
				</div>

				<div class="text-sm">
					<p>Are you sure you want to delete:</p>
					<p class="font-bold">{{ props.data?.studentId }} — {{ props.data?.fullName }}</p>
				</div>

				<div class="flex justify-end gap-2 border-t pt-4">
					<UButton
						color="primary"
						@click="emit('close', false)"
					>
						Cancel
					</UButton>

					<UButton
						color="error"
						@click="confirmDelete"
					>
						Delete
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
