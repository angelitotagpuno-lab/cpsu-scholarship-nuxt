<script setup lang="ts">
import { computed, onMounted } from "vue";

import { useTesScholarFormStore } from "~/stores/tes-form.store";
import { useAuthStore } from "~/stores/auth.store";
import { useCourseStore } from "~/stores/course.store";

const formStore = useTesScholarFormStore();
const authStore = useAuthStore();
const courseStore = useCourseStore();

const SEX_OPTIONS = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const YEAR_OPTIONS = [
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
];

const SECTOR_OPTIONS = [
	{ label: "Public", value: "Public" },
	{ label: "Private", value: "Private" },
];

const studentNumber = computed(() => authStore.currentAuth?.student?.studentNumber || "");

const COURSE_OPTIONS = computed(() =>
	courseStore.courses
		.filter((course) => !!course.id)
		.map((course) => ({
			label: [course.abbreviation.toUpperCase(), course.major?.trim() ? `- ${course.major}` : ""]
				.filter(Boolean)
				.join(" "),
			value: course.id,
		})),
);

onMounted(async () => {
	if (!courseStore.courses.length) {
		await courseStore.getCourses({
			page: 1,
			perPage: 100,
		});
	}

	if (studentNumber.value) {
		formStore.student.studentId = studentNumber.value;
	}
});

function allowLetters(e: KeyboardEvent) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
		return;
	}

	if (!/[A-Za-z\s]/.test(e.key)) {
		e.preventDefault();
	}
}

function allowNumbers(e: KeyboardEvent) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.key.length > 1) {
		return;
	}

	if (!/[0-9]/.test(e.key)) {
		e.preventDefault();
	}
}
</script>

<template>
	<UForm class="space-y-6">
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
			<!-- STUDENT NUMBER -->
			<UFormField
				label="Student Number"
				required
			>
				<UInput
					:model-value="studentNumber"
					icon="i-lucide-id-card"
					placeholder="Registered student number"
					class="w-full"
					readonly
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField
				label="Sex"
				required
			>
				<USelect
					v-model="formStore.student.sex"
					icon="i-lucide-user"
					:items="SEX_OPTIONS"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- YEAR LEVEL -->
			<UFormField
				label="Year Level"
				required
			>
				<USelect
					v-model="formStore.student.yearLevel"
					icon="i-lucide-cog"
					:items="YEAR_OPTIONS"
					placeholder="Select Year"
					class="w-full"
				/>
			</UFormField>

			<!-- LAST NAME -->
			<UFormField
				label="Last Name"
				required
			>
				<UInput
					v-model="formStore.student.lastName"
					icon="i-lucide-user"
					placeholder="Dela Cruz"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- FIRST NAME -->
			<UFormField
				label="First Name"
				required
			>
				<UInput
					v-model="formStore.student.firstName"
					icon="i-lucide-user-round"
					placeholder="Juan"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- MIDDLE NAME -->
			<UFormField label="Middle Name">
				<UInput
					v-model="formStore.student.middleName"
					icon="i-lucide-user"
					placeholder="Santos"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- EXTENSION -->
			<UFormField label="Extension">
				<UInput
					v-model="formStore.student.extName"
					icon="i-lucide-award"
					placeholder="Jr, Sr, III"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField
				label="Birthdate"
				required
			>
				<UInput
					v-model="formStore.student.birthdate"
					type="date"
					icon="i-lucide-calendar"
					class="w-full"
				/>
			</UFormField>

			<!-- PROGRAM -->
			<UFormField
				label="Program"
				class="sm:col-span-2 md:col-span-3"
			>
				<UInput
					v-model="formStore.student.program"
					icon="i-lucide-graduation-cap"
					placeholder="BS Information Technology"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHPLACE -->
			<UFormField
				label="Birthplace"
				required
			>
				<UInput
					v-model="formStore.student.birthplace"
					placeholder="City / Municipality of Birth"
					class="w-full"
				/>
			</UFormField>

			<!-- CITIZENSHIP -->
			<UFormField
				label="Citizenship"
				required
			>
				<UInput
					v-model="formStore.student.citizenship"
					placeholder="Filipino"
					class="w-full"
				/>
			</UFormField>

			<!-- GWA -->
			<UFormField
				label="GWA"
				required
			>
				<UInput
					v-model="formStore.student.gwa"
					placeholder="Enter GWA"
					class="w-full"
				/>
			</UFormField>

			<!-- NUMBER OF SIBLINGS -->
			<UFormField
				label="Number of Siblings"
				required
			>
				<UInput
					v-model="formStore.student.numberOfSiblings"
					placeholder="0"
					class="w-full"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- COURSE FROM BACKEND -->
			<UFormField
				label="Course"
				required
			>
				<USelect
					v-model="formStore.student.courseId"
					:items="COURSE_OPTIONS"
					icon="i-lucide-graduation-cap"
					placeholder="Select your course"
					class="w-full"
					:loading="courseStore.isLoading"
				/>
				<p
					v-if="courseStore.errorMessage"
					class="mt-1 text-xs text-red-500"
				>
					{{ courseStore.errorMessage }}
				</p>
			</UFormField>

			<!-- SCHOOL SECTOR -->
			<UFormField
				label="School Sector"
				required
			>
				<USelect
					v-model="formStore.student.schoolSector"
					:items="SECTOR_OPTIONS"
					placeholder="Select school sector"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL NAME -->
			<UFormField
				label="School Name"
				required
			>
				<UInput
					v-model="formStore.student.schoolName"
					placeholder="Central Philippines State University"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL ADDRESS -->
			<UFormField
				label="School Address"
				required
				class="sm:col-span-2"
			>
				<UInput
					v-model="formStore.student.schoolAddress"
					placeholder="School address"
					class="w-full"
				/>
			</UFormField>
		</div>
	</UForm>
</template>
