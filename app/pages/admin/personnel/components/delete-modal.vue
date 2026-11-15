<script setup lang="ts">
import type { Personnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{ data: Personnel }>();

async function confirmDelete() {
	const success = await store.deletePersonnel(props.data.id);

	if (!success) {
		toast.add({
			title: "Error",
			description: store.errorMessage || "Failed to delete personnel",
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Deleted",
		description: "Personnel deleted successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Personnel">
		<template #body>
			<div class="space-y-4">
				<p class="text-sm text-slate-600 dark:text-slate-300">
					Are you sure you want to delete
					<strong>{{ data.firstName }} {{ data.lastName }}</strong
					>? This action cannot be undone.
				</p>

				<div class="flex justify-end gap-2 mt-4">
					<UButton
						color="neutral"
						variant="soft"
						:disabled="store.isLoading"
						@click="emit('close', false)"
					>
						Cancel
					</UButton>

					<UButton
						color="error"
						:loading="store.isLoading"
						@click="confirmDelete"
					>
						Delete
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
