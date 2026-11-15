<script setup lang="ts">
import type { ScholarshipOffering } from "~/types/scholarship-offering";
import { ref } from "vue";

const props = defineProps<{ data: ScholarshipOffering }>();
const store = useScholarshipOfferingStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

async function confirm() {
	errorMessage.value = "";

	const success = await store.deleteOffering(props.data.id);

	if (!success) {
		errorMessage.value = store.errorMessage || "Failed to delete offering";
		return;
	}

	toast.add({
		title: "Success",
		description: "Offering deleted successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Offering">
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
							<h3 class="text-base font-semibold">Delete Offering</h3>
							<p class="text-sm text-slate-500">
								Are you sure you want to delete the offering for
								<b>{{ props.data.schoolYear }}</b>?
							</p>
						</div>
					</div>
				</div>

				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Delete failed"
					:description="errorMessage"
				/>

				<div class="flex justify-end gap-2 border-t pt-4">
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
						@click="confirm"
					>
						Delete Offering
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
