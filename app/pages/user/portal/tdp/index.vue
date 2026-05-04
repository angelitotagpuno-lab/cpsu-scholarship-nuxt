<script setup lang="ts">
import { ref, computed } from "vue";
import { useApplicationStore } from "~/stores/application.store";

import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";

definePageMeta({
	layout: "user-header",
});

const route = useRoute();
const toast = useToast();
const store = useApplicationStore();

const offeringId = computed(() => route.query.offeringId as string);

/* =========================
   STEPS
========================= */
const currentStep = ref(1);

const steps = [
	"Student Information",
	"Address Information",
	"School Information",
	"Family Information",
];

/* =========================
   SAFE STORE INIT
========================= */
if (!store.item) {
	store.item = {
		studentId: "",
		profile: {
			firstName: "",
			lastName: "",
			birthdate: "",
			birthplace: "",
			contactNumber: "",
			sex: "",
			yearLevel: "",
			courseId: "",
			address: {
				street: "",
				barangay: "",
				city: "",
				province: "",
				zipcode: "",
			},
			parents: [
				{ type: "father", firstName: "", lastName: "", status: "" },
				{ type: "mother", firstName: "", lastName: "", status: "" },
			],
			school: {
				schoolName: "",
				schoolAddress: "",
				schoolId: "",
				schoolSector: "",
			},
			family: {
				income: "",
				siblings: "",
				financialAid: "",
				financialAidSpecify: "",
			},
		},
		documentFile: null,
	};
}

/* =========================
   SUBMIT (PINIA ONLY)
========================= */
async function submit() {
	if (!offeringId.value) {
		toast.add({
			title: "Missing offering",
			color: "error",
		});
		return;
	}

	if (!store.item.documentFile) {
		toast.add({
			title: "Missing document",
			description: "Please upload Certificate of Registration",
			color: "error",
		});
		return;
	}

	try {
		const form = new FormData();
		const p = store.item.profile;

		/* =========================
		   TOP LEVEL
		========================= */
		form.append("studentId", store.item.studentId || "");
		form.append("offeringId", offeringId.value);

		/* =========================
		   PROFILE
		========================= */
		form.append("profile.firstName", p.firstName);
		form.append("profile.lastName", p.lastName);
		form.append("profile.birthdate", p.birthdate);
		form.append("profile.birthplace", p.birthplace);
		form.append("profile.contactNumber", p.contactNumber);
		form.append("profile.sex", p.sex);
		form.append("profile.yearLevel", p.yearLevel);
		form.append("profile.courseId", p.courseId || "");

		/* ADDRESS */
		form.append("profile.address.street", p.address.street);
		form.append("profile.address.barangay", p.address.barangay);
		form.append("profile.address.city", p.address.city);
		form.append("profile.address.province", p.address.province);
		form.append("profile.address.zipcode", p.address.zipcode);

		/* =========================
		   PARENTS
		========================= */
		p.parents.forEach(
			(
				parent: { type: string; firstName: string; lastName: string; status?: string },
				i: number,
			) => {
				form.append(`profile.parents.${i}.type`, parent.type || "");
				form.append(`profile.parents.${i}.firstName`, parent.firstName || "");
				form.append(`profile.parents.${i}.lastName`, parent.lastName || "");
				form.append(`profile.parents.${i}.status`, parent.status || "");
			},
		);
		/* =========================
		   FAMILY
		========================= */
		if (p.family) {
			form.append("extraAnswers.income", p.family.income || "");
			form.append("extraAnswers.siblings", p.family.siblings || "");
			form.append("extraAnswers.financialAid", p.family.financialAid || "");
			form.append("extraAnswers.financialAidSpecify", p.family.financialAidSpecify || "");
		}

		/* =========================
		   DOCUMENT (PINIA FIXED)
		========================= */
		form.append("documents.0.type", "certificate_of_registration");
		form.append("documents.0.file", store.item.documentFile as File);

		await store.submitApplication(form);

		toast.add({
			title: "Application Submitted Successfully",
			color: "success",
		});

		await navigateTo("/user/applications");
	} catch (e: any) {
		console.error(e);

		toast.add({
			title: "Failed to submit application",
			description: e?.data?.error?.message || "Validation error",
			color: "error",
		});
	}
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-6 grid grid-cols-12 gap-6">
		<!-- LEFT SIDEBAR -->
		<div class="col-span-4">
			<div class="bg-white p-4 rounded-xl shadow space-y-3">
				<h2 class="font-bold text-emerald-700">Application Steps</h2>

				<div
					v-for="(step, i) in steps"
					:key="i"
					class="p-3 rounded-lg cursor-pointer transition"
					:class="currentStep === i + 1 ? 'bg-emerald-100 font-semibold' : 'hover:bg-slate-50'"
					@click="currentStep = i + 1"
				>
					Step {{ i + 1 }} - {{ step }}
				</div>
			</div>
		</div>

		<!-- RIGHT CONTENT -->
		<div class="col-span-8 bg-white p-6 rounded-xl shadow space-y-6">
			<h2 class="text-xl font-semibold">
				{{ steps[currentStep - 1] }}
			</h2>

			<!-- STEPS -->
			<StudentInformation v-if="currentStep === 1" />
			<AddressInformation v-if="currentStep === 2" />
			<SchoolInformation v-if="currentStep === 3" />
			<FamilyInformation v-if="currentStep === 4" />

			<!-- NAVIGATION -->
			<div class="flex justify-between pt-6 border-t">
				<button
					v-if="currentStep > 1"
					class="px-4 py-2 bg-gray-200 rounded"
					@click="currentStep--"
				>
					Back
				</button>

				<div class="ml-auto flex gap-2">
					<button
						v-if="currentStep < 4"
						class="px-4 py-2 bg-emerald-600 text-white rounded"
						@click="currentStep++"
					>
						Next
					</button>

					<button
						v-else
						class="px-4 py-2 bg-emerald-700 text-white rounded"
						@click="submit"
					>
						Submit Application
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
