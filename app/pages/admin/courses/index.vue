<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Course } from "~/types/course";
import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const store = useCourseStore();

async function openAdd() {
	await addModal.open();
}

async function openEdit(course: Course) {
	await editModal.open({ data: course });
}

async function openDelete(course: Course) {
	await deleteModal.open({ data: course });
}

const columns: TableColumn<Course>[] = [
	{
		accessorKey: "name",
		header: "Name",
		cell: ({ row }) => `${(row.getValue("name") as string).capitalize()}`,
	},
	{
		accessorKey: "abbreviation",
		header: "Abbreviation",
		cell: ({ row }) => `${(row.getValue("abbreviation") as string).toUpperCase()}`,
	},
	{
		accessorKey: "major",
		header: "Major",
		cell: ({ row }) => {
			const major = row.getValue("major") as string | undefined;
			return major?.trim() ? major.capitalize() : "—";
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const course = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "primary",
						variant: "soft",
						onClick: () => openEdit(course),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						variant: "soft",
						onClick: () => openDelete(course),
					},
					() => "Delete",
				),
			]);
		},
	},
];

onMounted(async () => {
	await store.getCourses();
});
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage course programs, abbreviations, and majors.
					</p>
				</div>
			</div>

			<UButton
				label="Add Course"
				icon="i-lucide-plus"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Courses</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ store.courses.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Active Records</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ store.courses.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/30">
				<p class="text-sm font-medium text-amber-700 dark:text-amber-300">Program Majors</p>
				<p class="mt-1 text-3xl font-bold text-amber-950 dark:text-amber-100">
					{{ new Set(store.courses.map((course) => course.major?.trim()).filter(Boolean)).size }}
				</p>
			</UCard>
		</div>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Course List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						All available course entries in the system.
					</p>
				</div>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					{{ store.courses.length }} records
				</span>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:loading="store.isLoading"
					:data="store.courses"
					:columns="columns"
					class="min-w-[700px]"
				/>
			</div>
		</UCard>
	</div>
</template>
