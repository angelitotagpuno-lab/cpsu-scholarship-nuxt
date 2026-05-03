<script setup lang="ts">
import type { ScholarshipProgram } from "~/types/scholarship";

const store = useScholarshipStore();
const emit = defineEmits<{ close: [boolean] }>();
const props = defineProps<{ data: ScholarshipProgram }>();

async function remove() {
	await store.remove(props.data.id);
	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Scholarship">
		<p>Are you sure you want to delete {{ props.data.name }}?</p>

		<UButton
			color="error"
			@click="remove"
		>
			Delete
		</UButton>
	</UModal>
</template>
