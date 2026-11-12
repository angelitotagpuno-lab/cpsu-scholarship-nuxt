<script setup lang="ts">
const props = defineProps<{ data: any }>();
const store = useScholarshipStore();
const emit = defineEmits<{ close: [boolean] }>();

async function confirm() {
	await store.remove(props.data.id);
	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Scholarship Program">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-red-50 p-4 ring-1 ring-red-100 dark:bg-red-950/30 dark:ring-red-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-red-600 p-2 text-white">
							<UIcon
								name="i-lucide-trash"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold">Delete confirmation</h3>
							<p class="text-sm text-slate-500">
								Are you sure you want to delete <b>{{ props.data.name }} </b>?
							</p>
						</div>
					</div>
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
						:loading="store.loading"
						@click="confirm"
					>
						Delete
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
