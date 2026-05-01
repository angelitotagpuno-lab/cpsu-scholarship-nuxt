<script setup lang="ts">
import { ref, watch } from "vue";

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
	(e: "save", updatedScholar: Scholar): void;
}>();

const localScholar = ref<Scholar | null>(null);

watch(
	() => props.scholar,
	(newVal) => {
		localScholar.value = newVal ? { ...newVal } : null;
	},
);

const STATUS_OPTIONS = ["Drop", "Enrolled", "Not Enrolled", "Stop"];
const COURSES = ["BSIT", "BSBA", "BSCRIM", "BSHM", "BSMATH", "BSSCI", "BEED"];
const YEAR_LEVELS = ["1", "2", "3", "4"];
const SEMESTERS = ["1st", "2nd"];

function save() {
	if (localScholar.value) {
		emit("save", localScholar.value);
	}
}
</script>

<template>
	<div
		v-if="props.show"
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm dark:bg-black/75"
	>
		<div
			class="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<!-- Header -->
			<div class="bg-blue-50 p-5 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900">
				<div class="flex items-start gap-3">
					<div class="rounded-md bg-blue-600 p-2 text-white">
						<UIcon
							name="i-lucide-user-pen"
							class="size-5"
						/>
					</div>

					<div>
						<h2 class="text-lg font-semibold text-slate-900 dark:text-white">Update Scholar</h2>
						<p class="text-sm text-slate-500 dark:text-slate-400">
							Edit scholar details, academic information, and enrollment status.
						</p>
					</div>
				</div>
			</div>

			<template v-if="localScholar">
				<div class="max-h-[70vh] overflow-y-auto p-6">
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								Last Name
							</label>
							<input
								v-model="localScholar.lastName"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
								placeholder="Last name"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								First Name
							</label>
							<input
								v-model="localScholar.firstName"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
								placeholder="First name"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								M.I.
							</label>
							<input
								v-model="localScholar.middleInitial"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
								placeholder="Middle initial"
							/>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								Course
							</label>
							<select
								v-model="localScholar.course"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
							>
								<option
									disabled
									value=""
								>
									Select course
								</option>
								<option
									v-for="c in COURSES"
									:key="c"
									:value="c"
								>
									{{ c }}
								</option>
							</select>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								Year Level
							</label>
							<select
								v-model="localScholar.yearLevel"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
							>
								<option
									disabled
									value=""
								>
									Select year
								</option>
								<option
									v-for="y in YEAR_LEVELS"
									:key="y"
									:value="y"
								>
									{{ y }}
								</option>
							</select>
						</div>

						<div>
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								Semester
							</label>
							<select
								v-model="localScholar.semester"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
							>
								<option
									disabled
									value=""
								>
									Select semester
								</option>
								<option
									v-for="s in SEMESTERS"
									:key="s"
									:value="s"
								>
									{{ s }}
								</option>
							</select>
						</div>

						<div class="sm:col-span-2">
							<label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
								Status
							</label>
							<select
								v-model="localScholar.enrolled"
								class="h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-950"
							>
								<option
									disabled
									value=""
								>
									Select status
								</option>
								<option
									v-for="s in STATUS_OPTIONS"
									:key="s"
									:value="s"
								>
									{{ s }}
								</option>
							</select>
						</div>
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
						label="Save"
						icon="i-lucide-save"
						color="primary"
						class="bg-blue-600 hover:bg-blue-700"
						@click="save"
					/>
				</div>
			</template>
		</div>
	</div>
</template>
