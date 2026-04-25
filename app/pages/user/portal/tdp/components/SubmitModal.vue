<script setup lang="ts">
const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue", "confirm"]);

function close() {
	emit("update:modelValue", false);
}

function confirm() {
	emit("confirm");
	close();
}
</script>

<template>
	<UModal
		:model-value="props.modelValue"
		@update:model-value="(val: any) => emit('update:modelValue', val)"
	>
		<UCard class="p-4 space-y-4">
			<h2 class="text-lg font-semibold">Confirm Submission</h2>

			<p class="text-gray-500">Are you sure you want to submit your application?</p>

			<div class="flex justify-end gap-2">
				<UButton
					color="primary"
					variant="soft"
					@click="close"
				>
					Cancel
				</UButton>

				<UButton
					color="primary"
					@click="confirm"
				>
					Submit
				</UButton>
			</div>
		</UCard>
	</UModal>
</template>
