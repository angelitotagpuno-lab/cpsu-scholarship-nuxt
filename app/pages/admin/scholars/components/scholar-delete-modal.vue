<script setup lang="ts">
type Scholar = {
	no: number;
	lastName: string;
	firstName: string;
	middleInitial: string;
	course: string;
	yearLevel: string;
	semester: string;
	enrolled: string;
};

const props = defineProps<{
	show: boolean;
	scholar: Scholar | null;
}>();

const emit = defineEmits<{
	(e: "close"): void;
	(e: "confirm", scholar: Scholar): void;
}>();

function confirmDelete() {
	if (props.scholar) {
		emit("confirm", props.scholar);
	}
}
</script>

<template>
	<div
		v-if="props.show"
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/75"
	>
		<div
			class="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="bg-rose-50 p-5 ring-1 ring-rose-100 dark:bg-rose-950/30 dark:ring-rose-900">
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-rose-600 p-2 text-white">
						<UIcon
							name="i-lucide-trash-2"
							class="size-5"
						/>
					</div>

					<div>
						<h2 class="text-lg font-semibold text-slate-900 dark:text-white">Remove Scholar</h2>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							This action will remove the selected scholar from the list.
						</p>
					</div>
				</div>
			</div>

			<div
				v-if="props.scholar"
				class="space-y-4 p-6"
			>
				<p class="text-sm text-slate-600 dark:text-slate-300">
					Are you sure you want to remove this scholar?
				</p>

				<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
					<p class="font-semibold text-slate-900 dark:text-white">
						{{ props.scholar.firstName }} {{ props.scholar.middleInitial }}.
						{{ props.scholar.lastName }}
					</p>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						{{ props.scholar.course }} • Year {{ props.scholar.yearLevel }} •
						{{ props.scholar.semester }} Semester
					</p>
				</div>
			</div>

			<div
				class="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
			>
				<UButton
					label="Cancel"
					variant="outline"
					color="secondary"
					@click="$emit('close')"
				/>

				<UButton
					label="Remove"
					icon="i-lucide-trash-2"
					color="error"
					@click="confirmDelete"
				/>
			</div>
		</div>
	</div>
</template>
