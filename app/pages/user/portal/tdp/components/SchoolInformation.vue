<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTdpFormStore } from "~/stores/tdp-form.store";
import { useCourseStore } from "~/stores/course.store";

const store = useTdpFormStore();
const courseStore = useCourseStore();

const SECTOR_OPTIONS = [
	{ label: "Public", value: "Public" },
	{ label: "Private", value: "Private" },
];

onMounted(async () => {
	if (!courseStore.courses.length) {
		await courseStore.getCourses({
			page: 1,
			perPage: 100,
		});
	}
});

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

const allowLetters = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", " "];

	if (!/[A-Za-z\s]/.test(e.key) && !allowed.includes(e.key) && !e.ctrlKey && !e.metaKey) {
		e.preventDefault();
	}
};
</script>

<template>
	<UForm class="space-y-6">
		<!-- HEADER -->
		<div class="flex items-center gap-2">
			<UIcon
				name="i-lucide-graduation-cap"
				class="size-5 text-emerald-600"
			/>

			<h2 class="text-lg font-semibold">School Information</h2>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
			<!-- SCHOOL NAME -->
			<UFormField
				label="School Name"
				required
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.school.schoolName"
					icon="i-lucide-building-2"
					placeholder="Enter school name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SCHOOL ADDRESS -->
			<UFormField
				label="School Address"
				required
				class="md:col-span-3"
			>
				<UInput
					v-model="store.item.profile.school.schoolAddress"
					icon="i-lucide-map-pin"
					placeholder="Enter school address"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL ID -->
			<UFormField label="School ID">
				<UInput
					v-model="store.item.profile.school.schoolId"
					icon="i-lucide-id-card"
					placeholder="e.g. 2024-001-ABC"
					class="w-full"
				/>
			</UFormField>

			<!-- SCHOOL SECTOR -->
			<UFormField
				label="School Sector"
				required
			>
				<USelect
					v-model="store.item.profile.school.schoolSector"
					:items="SECTOR_OPTIONS"
					placeholder="Select sector"
					icon="i-lucide-building"
					class="w-full"
				/>
			</UFormField>

			<!-- COURSE DROPDOWN -->
			<UFormField
				label="Course"
				required
			>
				<USelect
					v-model="store.item.profile.courseId"
					:items="COURSE_OPTIONS"
					:loading="courseStore.isLoading"
					:disabled="courseStore.isLoading"
					icon="i-lucide-book-open"
					placeholder="Select Course"
					class="w-full"
				/>

				<p
					v-if="courseStore.errorMessage"
					class="mt-1 text-xs text-red-500"
				>
					{{ courseStore.errorMessage }}
				</p>

				<p
					v-else-if="!courseStore.isLoading && COURSE_OPTIONS.length === 0"
					class="mt-1 text-xs text-amber-500"
				>
					No courses available.
				</p>
			</UFormField>
		</div>
	</UForm>
</template>
