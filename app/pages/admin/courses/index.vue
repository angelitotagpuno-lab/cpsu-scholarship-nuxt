<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCourses } from "~/services/course.service";
import { useToast } from "#imports";

const toast = useToast();
const courses = ref<{ id: number; name: string }[]>([]);
const newCourse = ref("");

definePageMeta({
	layout: "admin",
});

const { fetchCourses, addCourse, editCourse, deleteCourse } = useCourses();

// Fetch courses on page load
async function loadCourses() {
	courses.value = await fetchCourses();
}

onMounted(loadCourses);

// Add course
async function handleAddCourse() {
	if (!newCourse.value.trim()) return;
	try {
		await addCourse(newCourse.value);
		toast.add({ title: "Success", description: "Course added!" });
		newCourse.value = "";
		await loadCourses();
	} catch (e) {
		toast.add({ title: "Error", description: "Failed to add course", color: "error" });
	}
}

// Edit course
async function handleEditCourse(course: { id: number; name: string }) {
	const newName = prompt("Edit course name:", course.name);
	if (!newName) return;
	try {
		await editCourse(course.id, newName);
		toast.add({ title: "Success", description: "Course updated!" });
		await loadCourses();
	} catch (e) {
		toast.add({ title: "Error", description: "Failed to update course", color: "error" });
	}
}

// Delete course
async function handleDeleteCourse(course: { id: number; name: string }) {
	if (!confirm(`Delete course "${course.name}"?`)) return;
	try {
		await deleteCourse(course.id);
		toast.add({ title: "Deleted", description: "Course removed" });
		await loadCourses();
	} catch (e) {
		toast.add({ title: "Error", description: "Failed to delete course", color: "error" });
	}
}
</script>

<template>
	<u-container class="p-4">
		<h1 class="text-2xl font-bold mb-4">Courses</h1>

		<!-- Add course -->
		<div class="flex mb-4 gap-2">
			<input
				v-model="newCourse"
				type="text"
				placeholder="New course name"
				class="border p-2 rounded flex-1"
			/>
			<u-button
				color="primary"
				label="Add"
				@click="handleAddCourse"
			/>
		</div>

		<!-- Courses list -->
		<ul>
			<li
				v-for="course in courses"
				:key="course.id"
				class="flex justify-between items-center mb-2 p-2 border rounded"
			>
				<span>{{ course.name }}</span>
				<div class="flex gap-2">
					<u-button
						size="sm"
						color="warning"
						label="Edit"
						@click="() => handleEditCourse(course)"
					/>
					<u-button
						size="sm"
						color="error"
						label="Delete"
						@click="() => handleDeleteCourse(course)"
					/>
				</div>
			</li>
		</ul>

		<p
			v-if="courses.length === 0"
			class="text-muted mt-2"
		>
			No courses found.
		</p>
	</u-container>
</template>
