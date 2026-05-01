<script setup lang="ts">
import type { Student } from "~/types/student";

const store = useStudentStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{
	data: Student;
}>();

function fullName(student: Student) {
	return [student.firstName, student.middleName, student.lastName, student.extName]
		.filter(Boolean)
		.join(" ");
}

async function onDelete() {
	if (!props.data.id) return;

	await store.deleteStudent(props.data.id);

	if (store.errorMessage) {
		toast.add({
			title: "Error",
			description: store.errorMessage,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Deleted",
		description: "Student deleted successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Delete Student">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-rose-50 p-4 ring-1 ring-rose-100 dark:bg-rose-950/30 dark:ring-rose-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-rose-600 p-2 text-white">
							<UIcon
								name="i-lucide-trash-2"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Delete student?
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								This action cannot be undone.
							</p>
						</div>
					</div>
				</div>

				<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
					<p class="font-semibold text-slate-900 dark:text-white">
						{{ fullName(props.data) }}
					</p>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Year {{ props.data.yearLevel }} • {{ props.data.contactNumber }}
					</p>
				</div>

				<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
					<UButton
						color="neutral"
						variant="outline"
						@click="emit('close', false)"
					>
						Cancel
					</UButton>

					<UButton
						color="error"
						icon="i-lucide-trash-2"
						:loading="store.isLoading"
						@click="onDelete"
					>
						Delete Student
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
