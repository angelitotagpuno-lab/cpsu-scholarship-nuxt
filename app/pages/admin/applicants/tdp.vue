<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { ref, h, resolveComponent } from "vue";
import ApplicantsAddModal from "./components/applicants-add-modal.vue";
import ApplicantsEditModal from "./components/applicants-edit-modal.vue";

definePageMeta({
	layout: "admin",
});

type Applicant = {
	seq: number;
	awardNo: string;
	appId: string;
	batch: number;
	studentId: string;

	lastName: string;
	firstName: string;
	extName: string;
	middleName: string;

	sex: string;
	course: string;
	yearLevel: number;

	contactNo: string;
	email: string;

	city: string;
	province: string;
	zipcode: string;

	income: number;
	gpa: number;
	eligibility: string;
};

const applicants = ref<Applicant[]>([
	{
		seq: 1,
		awardNo: "TDP-20250421-044111000000-016515",
		appId: "06176-20250203-11855-TD",
		batch: 3,
		studentId: "0",
		lastName: "ABELLO",
		firstName: "SHIR JOHN",
		extName: "",
		middleName: "GARCIA",
		sex: "MALE",
		course: "BS AGRICULTURAL BUSINESS",
		yearLevel: 4,
		contactNo: "9104419504",
		email: "shirjohnabello@gmail.com",
		city: "SAN CARLOS CITY",
		province: "NEGROS OCCIDENTAL",
		zipcode: "6127",
		income: 12000,
		gpa: 1.75,
		eligibility: "Eligible",
	},
]);

const showEditModal = ref(false);
const selectedApplicant = ref<Applicant | null>(null);
const showAddModal = ref(false);

const newApplicant = ref<Applicant>({
	seq: 0,
	awardNo: "",
	appId: "",
	batch: 0,
	studentId: "",
	lastName: "",
	firstName: "",
	extName: "",
	middleName: "",
	sex: "",
	course: "",
	yearLevel: 1,
	contactNo: "",
	email: "",
	city: "",
	province: "",
	zipcode: "",
	income: 0,
	gpa: 0,
	eligibility: "Eligible",
});

function computeEligibility(gpa: number, income: number) {
	if (gpa <= 2.0 && income <= 20000) return "Eligible";
	return "Not Eligible";
}

function openEdit(applicant: Applicant) {
	selectedApplicant.value = { ...applicant };
	showEditModal.value = true;
}

function saveEditedApplicant(data: any) {
	if (!selectedApplicant.value) return;

	const index = applicants.value.findIndex((a) => a.seq === selectedApplicant.value!.seq);

	applicants.value[index] = {
		...applicants.value[index],
		...data,
		eligibility: computeEligibility(data.gpa, data.income),
	};
}

function openAdd() {
	newApplicant.value = {
		seq: applicants.value.length + 1,
		awardNo: "",
		appId: "",
		batch: 0,
		studentId: "",
		lastName: "",
		firstName: "",
		extName: "",
		middleName: "",
		sex: "",
		course: "",
		yearLevel: 1,
		contactNo: "",
		email: "",
		city: "",
		province: "",
		zipcode: "",
		income: 0,
		gpa: 0,
		eligibility: "Eligible",
	};
	showAddModal.value = true;
}

function addApplicant() {
	newApplicant.value.eligibility = computeEligibility(
		newApplicant.value.gpa,
		newApplicant.value.income,
	);

	applicants.value.unshift({ ...newApplicant.value });
	showAddModal.value = false;
}

const columns: TableColumn<Applicant>[] = [
	{ accessorKey: "seq", header: "SEQ" },
	{ accessorKey: "studentId", header: "Student ID" },
	{ accessorKey: "batch", header: "Batch" },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleName", header: "Middle Name" },
	{ accessorKey: "extName", header: "Ext." },
	{
		accessorKey: "sex",
		header: "Sex",
		cell: ({ row }) => {
			const sex = row.original.sex;

			return h(
				"span",
				{
					class:
						sex === "MALE"
							? "inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
							: "inline-flex rounded bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 dark:bg-pink-900 dark:text-pink-200",
				},
				sex || "—",
			);
		},
	},
	{ accessorKey: "course", header: "Course" },
	{ accessorKey: "yearLevel", header: "Year Level" },
	{ accessorKey: "contactNo", header: "Contact" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "city", header: "City" },
	{ accessorKey: "province", header: "Province" },
	{ accessorKey: "zipcode", header: "Zipcode" },
	{
		accessorKey: "income",
		header: "Income",
		cell: ({ row }) =>
			`₱${Number(row.original.income).toLocaleString("en-PH", {
				minimumFractionDigits: 2,
			})}`,
	},
	{ accessorKey: "gpa", header: "GPA" },
	{
		accessorKey: "eligibility",
		header: "Eligibility",
		cell: ({ row }) => {
			const eligibility = row.original.eligibility;

			const className =
				eligibility === "Approved"
					? "inline-flex rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200"
					: eligibility === "Eligible"
						? "inline-flex rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
						: "inline-flex rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 dark:bg-rose-900 dark:text-rose-200";

			return h("span", { class: className }, eligibility);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const applicant = row.original;

			return h("div", { class: "flex gap-2 justify-end" }, [
				h(resolveComponent("UButton"), {
					label: "Approve",
					size: "xs",
					color: "success",
					variant: "soft",
					icon: "i-lucide-check",
					onClick: () => {
						applicant.eligibility = "Approved";
					},
				}),
				h(resolveComponent("UButton"), {
					label: "Edit",
					size: "xs",
					color: "primary",
					variant: "soft",
					icon: "i-lucide-pencil",
					onClick: () => openEdit(applicant),
				}),
				h(resolveComponent("UButton"), {
					label: "Delete",
					size: "xs",
					color: "error",
					variant: "soft",
					icon: "i-lucide-trash-2",
					onClick: () => {
						applicants.value = applicants.value.filter((a) => a.seq !== applicant.seq);
					},
				}),
			]);
		},
	},
];
</script>

<template>
	<div class="h-full overflow-y-auto bg-slate-50 p-6 space-y-6 dark:bg-slate-950">
		<div
			class="flex flex-col gap-4 rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-2xl font-bold text-slate-900 dark:text-white">TDP Applicants</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Review, approve, edit, and manage TDP scholarship applicants.
					</p>
				</div>
			</div>

			<ApplicantsAddModal />
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
			<UCard class="border-l-4 border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30">
				<p class="text-sm font-medium text-blue-700 dark:text-blue-300">Total Applicants</p>
				<p class="mt-1 text-3xl font-bold text-blue-950 dark:text-blue-100">
					{{ applicants.length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30">
				<p class="text-sm font-medium text-emerald-700 dark:text-emerald-300">Approved</p>
				<p class="mt-1 text-3xl font-bold text-emerald-950 dark:text-emerald-100">
					{{ applicants.filter((applicant) => applicant.eligibility === "Approved").length }}
				</p>
			</UCard>

			<UCard class="border-l-4 border-l-rose-500 bg-rose-50/80 dark:bg-rose-950/30">
				<p class="text-sm font-medium text-rose-700 dark:text-rose-300">Not Eligible</p>
				<p class="mt-1 text-3xl font-bold text-rose-950 dark:text-rose-100">
					{{ applicants.filter((applicant) => applicant.eligibility === "Not Eligible").length }}
				</p>
			</UCard>
		</div>

		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex items-center justify-between gap-3">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Applicant List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Student ID is used as the main applicant reference.
					</p>
				</div>

				<span
					class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200"
				>
					{{ applicants.length }} records
				</span>
			</div>
			<div class="rounded-md border border-slate-200 dark:border-slate-800">
				<UTable
					:data="applicants"
					:columns="columns"
					class="w-full"
				/>
			</div>
		</UCard>

		<ApplicantsEditModal
			v-model="showEditModal"
			:applicant="selectedApplicant"
			@save="saveEditedApplicant"
		/>
	</div>
</template>
