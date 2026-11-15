<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useTdpFormStore } from "~/stores/tdp-form.store";
import { useCourseStore } from "~/stores/course.store";
import { useAuthStore } from "~/stores/auth.store";

const store = useTdpFormStore();
const courseStore = useCourseStore();
const authStore = useAuthStore();

const studentNumber = computed(() => authStore.currentAuth?.student?.studentNumber || "");

const SEX_OPTIONS = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const YEAR_LEVELS = [
	{ label: "1", value: "1" },
	{ label: "2", value: "2" },
	{ label: "3", value: "3" },
	{ label: "4", value: "4" },
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

const allowNumbers = (e: KeyboardEvent) => {
	const allowed = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

	if (!/[0-9]/.test(e.key) && !allowed.includes(e.key) && !e.ctrlKey && !e.metaKey) {
		e.preventDefault();
	}
};

function onFileChange(e: Event) {
	const target = e.target as HTMLInputElement;
	store.item.documentFile = target.files?.[0] || null;
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

			<!-- LAST NAME -->
			<UFormField
				label="Last Name"
				required
			>
				<UInput
					v-model="store.item.profile.lastName"
					icon="i-lucide-user"
					placeholder="Enter Last Name"
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
					v-model="store.item.profile.firstName"
					icon="i-lucide-user-round"
					placeholder="Enter First Name"
					class="w-full"
					@keydown="allowLetters"
				/>
			</UFormField>

			<!-- SEX -->
			<UFormField
				label="Sex"
				required
			>
				<USelect
					v-model="store.item.profile.sex"
					icon="i-lucide-user"
					:items="SEX_OPTIONS"
					placeholder="Select Sex"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHDATE -->
			<UFormField
				label="Birthdate"
				required
			>
				<UInput
					v-model="store.item.profile.birthdate"
					type="date"
					icon="i-lucide-calendar"
					class="w-full"
				/>
			</UFormField>

			<!-- BIRTHPLACE -->
			<UFormField
				label="Place of Birth"
				required
			>
				<UInput
					v-model="store.item.profile.birthplace"
					icon="i-lucide-map-pin"
					placeholder="Enter Place of Birth"
					class="w-full"
				/>
			</UFormField>

			<!-- CONTACT -->
			<UFormField
				label="Contact Number"
				required
			>
				<UInput
					v-model="store.item.profile.contactNumber"
					icon="i-lucide-phone"
					placeholder="09XXXXXXXXX"
					class="w-full"
					maxlength="11"
					@keydown="allowNumbers"
				/>
			</UFormField>

			<!-- YEAR LEVEL -->
			<UFormField
				label="Year Level"
				required
			>
				<USelect
					v-model="store.item.profile.yearLevel"
					icon="i-lucide-graduation-cap"
					:items="YEAR_LEVELS"
					placeholder="Select Year Level"
					class="w-full"
				/>
			</UFormField>

			<!-- COURSE -->
			<UFormField
				label="Course"
				required
			>
				<USelect
					v-model="store.item.profile.courseId"
					icon="i-lucide-book-open"
					:items="COURSE_OPTIONS"
					:loading="courseStore.isLoading"
					:disabled="courseStore.isLoading"
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

			<!-- EMAIL -->
			<UFormField
				label="Email"
				required
			>
				<UInput
					v-model="store.item.profile.email"
					type="email"
					icon="i-lucide-mail"
					placeholder="Enter email"
					class="w-full"
				/>
			</UFormField>

			<!-- CITIZENSHIP -->
			<UFormField
				label="Citizenship"
				required
			>
				<UInput
					v-model="store.item.profile.citizenship"
					placeholder="Enter citizenship"
					class="w-full"
				/>
			</UFormField>

			<!-- GWA -->
			<UFormField
				label="GWA"
				required
			>
				<UInput
					v-model="store.item.profile.gwa"
					placeholder="Enter GWA"
					class="w-full"
				/>
			</UFormField>

			<!-- CERTIFICATE OF REGISTRATION -->
			<UFormField
				label="Certificate of Registration"
				required
				class="sm:col-span-2 md:col-span-3"
			>
				<input
					type="file"
					accept=".pdf,.jpg,.jpeg,.png"
					class="block w-full rounded border p-2"
					@change="onFileChange"
				/>

				<p
					v-if="store.item.documentFile"
					class="mt-1 text-sm text-gray-500"
				>
					Selected: {{ store.item.documentFile.name }}
				</p>
			</UFormField>
		</div>
	</UForm>
</template>
