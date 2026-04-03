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
	<!-- Overlay background -->
	<div
		v-if="props.show"
		class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
	>
		<!-- Centered modal box -->
		<div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
			<h2 class="text-lg font-semibold mb-4">Update Scholar</h2>

			<template v-if="localScholar">
				<div class="space-y-4">
					<!-- Last Name -->
					<div>
						<label class="block text-sm font-medium mb-1">Last Name</label>
						<input
							v-model="localScholar.lastName"
							class="border rounded px-2 py-1 w-full"
						/>
					</div>

					<!-- First Name -->
					<div>
						<label class="block text-sm font-medium mb-1">First Name</label>
						<input
							v-model="localScholar.firstName"
							class="border rounded px-2 py-1 w-full"
						/>
					</div>

					<!-- Middle Initial -->
					<div>
						<label class="block text-sm font-medium mb-1">M.I.</label>
						<input
							v-model="localScholar.middleInitial"
							class="border rounded px-2 py-1 w-full"
						/>
					</div>

					<!-- Course -->
					<div>
						<label class="block text-sm font-medium mb-1">Course</label>
						<select
							v-model="localScholar.course"
							class="border rounded px-2 py-1 w-full"
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

					<!-- Year Level -->
					<div>
						<label class="block text-sm font-medium mb-1">Year Level</label>
						<select
							v-model="localScholar.yearLevel"
							class="border rounded px-2 py-1 w-full"
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

					<!-- Semester -->
					<div>
						<label class="block text-sm font-medium mb-1">Semester</label>
						<select
							v-model="localScholar.semester"
							class="border rounded px-2 py-1 w-full"
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

					<!-- Status -->
					<div>
						<label class="block text-sm font-medium mb-1">Status</label>
						<select
							v-model="localScholar.enrolled"
							class="border rounded px-2 py-1 w-full"
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

				<!-- Modal Buttons -->
				<div class="mt-6 flex justify-end gap-2">
					<UButton
						label="Cancel"
						variant="outline"
						color="secondary"
						@click="$emit('close')"
					/>
					<UButton
						label="Save"
						color="primary"
						@click="save"
					/>
				</div>
			</template>
		</div>
	</div>
</template>
