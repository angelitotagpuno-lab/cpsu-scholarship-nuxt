<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Student } from "~/types/student";
import { h, resolveComponent } from "vue";

import AddModal from "./components/add-modal.vue";
import EditModal from "./components/edit-modal.vue";
import DeleteModal from "./components/delete-modal.vue";

definePageMeta({ layout: "admin" });

const overlay = useOverlay();
const addModal = overlay.create(AddModal);
const editModal = overlay.create(EditModal);
const deleteModal = overlay.create(DeleteModal);

const store = useStudentStore();

async function openAdd() {
	const result = await addModal.open();

	if (result) {
		await store.getStudents();
	}
}

async function openEdit(student: Student) {
	const result = await editModal.open({ data: student });

	if (result) {
		await store.getStudents();
	}
}

async function openDelete(student: Student) {
	const result = await deleteModal.open({ data: student });

	if (result) {
		await store.getStudents();
	}
}

function fullName(student: Student) {
	return [student.firstName, student.middleName, student.lastName, student.extName]
		.filter(Boolean)
		.join(" ");
}

function displayStudentId(student: Student) {
	return student.schoolId || student.studentId || student.id || "—";
}

const columns: TableColumn<Student>[] = [
	{
		accessorKey: "schoolId",
		header: "Student ID",
		cell: ({ row }) => displayStudentId(row.original),
	},
	{
		accessorKey: "lastName",
		header: "Name",
		cell: ({ row }) => fullName(row.original),
	},
	{
		accessorKey: "contactNumber",
		header: "Contact",
	},
	{
		accessorKey: "sex",
		header: "Sex",
		cell: ({ row }) => {
			const sex = row.original.sex;

			return h(
				"span",
				{
					class:
						sex === "male"
							? "rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
							: "rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900 dark:text-pink-200",
				},
				sex?.toUpperCase() || "—",
			);
		},
	},
	{
		accessorKey: "yearLevel",
		header: "Year Level",
		cell: ({ row }) => `Year ${row.original.yearLevel}`,
	},
	{
		accessorKey: "address",
		header: "Address",
		cell: ({ row }) => {
			const address = row.original.address;

			if (!address) return "—";

			return [address.barangay, address.city, address.province].filter(Boolean).join(", ");
		},
	},
	{
		accessorKey: "parents",
		header: "Parent/Guardian",
		cell: ({ row }) => {
			const parent = row.original.parents?.[0];

			if (!parent) return "—";

			return [parent.firstName, parent.lastName].filter(Boolean).join(" ");
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const student = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "primary",
						variant: "soft",
						icon: "i-lucide-pencil",
						onClick: () => openEdit(student),
					},
					() => "Edit",
				),
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						variant: "soft",
						icon: "i-lucide-trash-2",
						onClick: () => openDelete(student),
					},
					() => "Delete",
				),
			]);
		},
	},
];

onMounted(async () => {
	await store.getStudents();
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
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">Students</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Manage student profiles, address details, and parent information.
					</p>
				</div>
			</div>

			<UButton
				label="Add Student"
				icon="i-lucide-plus"
				size="lg"
				color="primary"
				class="bg-emerald-600 hover:bg-emerald-700"
				@click="openAdd"
			/>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Students</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ store.students.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Male</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ store.students.filter((student) => student.sex === "male").length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-pink-500 bg-pink-50/80 dark:bg-pink-950/30">
				<p class="text-sm font-medium text-pink-700 dark:text-pink-300">Female</p>
				<p class="mt-1 text-3xl font-bold text-pink-950 dark:text-pink-100">
					{{ store.students.filter((student) => student.sex === "female").length }}
				</p>
			</UCard>
		</div>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Student List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						All registered students in the system.
					</p>
				</div>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					{{ store.students.length }} records
				</span>
			</div>

			<div class="rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:loading="store.isLoading"
					:data="store.students"
					:columns="columns"
					class="w-full"
				/>
			</div>
		</UCard>
	</div>
</template>
