<script setup lang="ts">
import type { ScholarshipProgram } from "~/types/scholarship";

const store = useScholarshipStore();
const emit = defineEmits<{ close: [boolean] }>();
const props = defineProps<{ data: ScholarshipProgram }>();

const form = reactive({ ...props.data });

async function update() {
	await store.update(form.id, form);
	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Scholarship">
		<UInput v-model="form.name" />
		<UInput
			v-model.number="form.defaultAmountPerSemester"
			type="number"
		/>
		<USwitch v-model="form.isActive" />

		<UButton @click="update">Update</UButton>
	</UModal>
</template>
