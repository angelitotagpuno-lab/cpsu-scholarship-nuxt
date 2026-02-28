<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { ref, h, resolveComponent } from "vue";
import ApplicantsAddModal from "./components/applicants-add-modal.vue";

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

<!-- <template>
	<div class="space-y-6">
		<h1 class="text-2xl font-bold">Scholarship Applicants Dashboard</h1>

		<UButton
			label="Add Applicant"
			icon="i-lucide-plus"
			color="success"
			@click="openAdd"
		/>

		<div class="w-full overflow-x-scroll border rounded-lg max-w-screen">
			<UTable
				:data="applicants"
				:columns="columns"
			/>
		</div>

		<div
			v-if="showAddModal"
			class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
		>
			<UCard class="w-[750px] p-6">
				<h2 class="text-lg font-semibold mb-4">Add New Applicant</h2>

				<div class="grid grid-cols-2 gap-4">
					<UInput
						v-model="newApplicant.awardNo"
						placeholder="Ex: TDP-20250421-044111000000-016515"
					/>
					<UInput
						v-model="newApplicant.appId"
						placeholder="Ex: 06176-20250203-11855-TD"
					/>

					<UInput
						v-model.number="newApplicant.batch"
						placeholder="Enter Batch (number)"
					/>
					<UInput
						v-model="newApplicant.studentId"
						placeholder="Enter Student ID"
					/>

					<UInput
						v-model="newApplicant.lastName"
						placeholder="Enter Last Name"
					/>
					<UInput
						v-model="newApplicant.firstName"
						placeholder="Enter First Name"
					/>

					<UInput
						v-model="newApplicant.middleName"
						placeholder="Enter Middle Name"
					/>
					<UInput
						v-model="newApplicant.extName"
						placeholder="Enter Extension Name (if any)"
					/>

					<UInput
						v-model="newApplicant.sex"
						placeholder="Enter Sex (Male / Female)"
					/>
					<UInput
						v-model="newApplicant.course"
						placeholder="Enter Course / Program"
					/>

					<UInput
						v-model.number="newApplicant.yearLevel"
						placeholder="Enter Year Level (number)"
					/>
					<UInput
						v-model="newApplicant.contactNo"
						placeholder="Enter Contact Number"
					/>

					<UInput
						v-model="newApplicant.email"
						placeholder="Enter Email Address"
					/>
					<UInput
						v-model="newApplicant.city"
						placeholder="Enter City"
					/>

					<UInput
						v-model="newApplicant.province"
						placeholder="Enter Province"
					/>
					<UInput
						v-model="newApplicant.zipcode"
						placeholder="Enter Zipcode"
					/>

					<UInput
						v-model.number="newApplicant.income"
						type="number"
						placeholder="Enter Income (numeric)"
					/>
					<UInput
						v-model.number="newApplicant.gpa"
						type="number"
						step="0.01"
						placeholder="Enter GPA (numeric)"
					/>
				</div>

				<div class="flex justify-end gap-2 mt-6">
					<UButton
						label="Cancel"
						variant="outline"
						@click="showAddModal = false"
					/>
					<UButton
						label="Submit Applicant"
						color="success"
						@click="addApplicant"
					/>
				</div>
			</UCard>
		</div>
	</div>
</template> -->

<template>
	<UDashboardPanel id="applicants">
		<template #header>
			<UDashboardNavbar title="Customers">
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
</template>
