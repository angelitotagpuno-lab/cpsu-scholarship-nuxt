<script setup lang="ts">
import type { Personnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{ data: Personnel }>();

async function confirmDelete() {
	await store.deletePersonnel(props.data.id!);

	if (store.errorMessage) {
		toast.add({ title: "Error", description: store.errorMessage, color: "error" });
	} else {
		toast.add({ title: "Deleted", color: "success" });
		emit("close", true);
	}
}
</script>

<template>
	<UModal title="Delete Personnel">
		<template #body>
			<p>Are you sure you want to delete this personnel?</p>

			<div class="flex justify-end gap-2 mt-4">
				<UButton
					color="neutral"
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
		</template>
	</UModal>
</template>
