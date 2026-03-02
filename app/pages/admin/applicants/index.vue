<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { ref, h, resolveComponent } from "vue";
import ApplicantsAddModal from "./components/applicants-add-modal.vue";
import ApplicantsEditModal from "./components//applicants-edit-modal.vue";

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

// ✅ NEW: Edit modal state
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

// ✅ NEW: open edit modal
function openEdit(applicant: Applicant) {
	selectedApplicant.value = { ...applicant };
	showEditModal.value = true;
}

// ✅ NEW: save edited applicant
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
	{ accessorKey: "awardNo", header: "Award No" },
	{ accessorKey: "appId", header: "App ID" },
	{ accessorKey: "batch", header: "Batch" },
	{ accessorKey: "studentId", header: "Student ID" },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleName", header: "Middle Name" },
	{ accessorKey: "extName", header: "Ext." },
	{ accessorKey: "sex", header: "Sex" },
	{ accessorKey: "course", header: "Course" },
	{ accessorKey: "yearLevel", header: "Year Level" },
	{ accessorKey: "contactNo", header: "Contact" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "city", header: "City" },
	{ accessorKey: "province", header: "Province" },
	{ accessorKey: "zipcode", header: "Zipcode" },
	{ accessorKey: "income", header: "Income" },
	{ accessorKey: "gpa", header: "GPA" },
	{ accessorKey: "eligibility", header: "Eligibility" },
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
					onClick: () => {
						applicant.eligibility = "Approved";
					},
				}),
				h(resolveComponent("UButton"), {
					label: "Edit",
					size: "xs",
					color: "primary",
					onClick: () => openEdit(applicant), // ✅ UPDATED
				}),
				h(resolveComponent("UButton"), {
					label: "Delete",
					size: "xs",
					color: "error",
					variant: "outline",
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
	<UDashboardPanel id="applicants">
		<template #header>
			<UDashboardNavbar title="Applicants">
				<template #leading>
					<UDashboardSidebarCollapse />
				</template>

				<template #right>
					<ApplicantsAddModal />
				</template>
			</UDashboardNavbar>
		</template>

		<template #body>
			<UTable
				:data="applicants"
				:columns="columns"
			/>
		</template>
	</UDashboardPanel>

	<!-- ✅ NEW: Edit Modal -->
	<ApplicantsEditModal
		v-model="showEditModal"
		:applicant="selectedApplicant"
		@save="saveEditedApplicant"
	/>
</template>
