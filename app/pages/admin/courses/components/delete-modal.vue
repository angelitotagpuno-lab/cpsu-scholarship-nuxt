<script setup lang="ts">
import type { Course } from "~/types/course";

const store = useCourseStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{
	data: Course;
}>();

async function confirmDelete() {
	await store.deleteCourse(props.data.id!);

	if (store.errorMessage) {
		toast.add({
			title: "Error",
			description: store.errorMessage,
			color: "error",
		});
	} else {
		toast.add({
			title: "Deleted",
			description: "Course removed successfully",
			color: "success",
		});
		emit("close", true);
	}
}
</script>

<template>
	<UModal title="Delete Course">
		<template #body>
			<p class="mb-4">
				Are you sure you want to delete
				<strong>{{ (props.data?.name || "").capitalize() }}</strong
				>?
			</p>
			<div class="flex justify-end gap-2">
				<UButton
					color="neutral"
					variant="soft"
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
