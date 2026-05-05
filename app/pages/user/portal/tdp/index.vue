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

const currentStep = ref(1);

const steps = [
	"Student Information",
	"Address Information",
	"School Information",
	"Family Information",
];

/* =========================
   SAFE INIT
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
   DEBUG FORM DATA
========================= */
function debugFormData(form: FormData) {
	console.group("📦 FORM DATA DEBUG");

	for (const [key, value] of form.entries()) {
		console.log(key, value);
	}

	console.groupEnd();
}

/* =========================
   SUBMIT
========================= */
async function submit() {
	if (!offeringId.value) {
		toast.add({ title: "Missing offeringId", color: "error" });
		return;
	}

	if (!store.item.documentFile) {
		toast.add({
			title: "Missing document",
			description: "Upload Certificate of Registration",
			color: "error",
		});
		return;
	}

	try {
		const form = new FormData();
		const p = store.item.profile;

		form.append("studentId", store.item.studentId || "");
		form.append("offeringId", offeringId.value);

		// PROFILE
		form.append("profile.firstName", p.firstName);
		form.append("profile.lastName", p.lastName);
		form.append("profile.birthdate", p.birthdate);
		form.append("profile.birthplace", p.birthplace);
		form.append("profile.contactNumber", p.contactNumber);
		form.append("profile.sex", p.sex);
		form.append("profile.yearLevel", p.yearLevel);
		form.append("profile.courseId", p.courseId || "");

		// ADDRESS
		form.append("profile.address.street", p.address.street);
		form.append("profile.address.barangay", p.address.barangay);
		form.append("profile.address.city", p.address.city);
		form.append("profile.address.province", p.address.province);
		form.append("profile.address.zipcode", p.address.zipcode);

		// PARENTS
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
		// EXTRA ANSWERS
		if (p.family) {
			form.append("extraAnswers.income", p.family.income || "");
			form.append("extraAnswers.siblings", p.family.siblings || "");
			form.append("extraAnswers.financialAid", p.family.financialAid || "");
			form.append("extraAnswers.financialAidSpecify", p.family.financialAidSpecify || "");
		}

		// FILE
		form.append("documents.0.type", "certificate_of_registration");
		form.append("documents.0.file", store.item.documentFile as File);

		// 🔥 DEBUG PAYLOAD BEFORE SEND
		debugFormData(form);

		const payloadCheck = Object.fromEntries(form.entries());
		console.log("📤 FINAL PAYLOAD OBJECT:", payloadCheck);

		await store.submitApplication(form);

		toast.add({
			title: "Application Submitted",
			color: "success",
		});

		await navigateTo("/user/applications");
	} catch (e: any) {
		console.error("❌ SUBMIT ERROR:", e);
		console.log("📛 BACKEND RESPONSE:", e?.data);

		toast.add({
			title: "Submission Failed",
			description: e?.data?.message || e?.data?.error?.message || "Check console logs",
			color: "error",
		});
	}
}
</script>

<template>
	<div class="max-w-6xl mx-auto p-4 sm:p-6">
		<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
			<!-- SIDEBAR STEPPER -->
			<div class="md:col-span-4">
				<UCard class="border border-slate-200 dark:border-slate-800">
					<h2 class="font-semibold text-emerald-700 mb-4">Scholarship Application Wizard</h2>

					<div class="space-y-2">
						<div
							v-for="(step, i) in steps"
							:key="i"
							class="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition"
							:class="{
								'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200':
									currentStep === i + 1,
								'hover:bg-slate-50 dark:hover:bg-slate-800': currentStep !== i + 1,
							}"
							@click="currentStep = i + 1"
						>
							<!-- ICON -->
							<div
								class="p-2 rounded-lg"
								:class="{
									'bg-emerald-600 text-white': currentStep === i + 1,
									'bg-slate-100 dark:bg-slate-800 text-slate-500': currentStep !== i + 1,
								}"
							>
								<UIcon
									:name="
										['i-lucide-user', 'i-lucide-map-pin', 'i-lucide-school', 'i-lucide-users'][i]
									"
									class="size-5"
								/>
							</div>

							<!-- TITLE -->
							<div class="flex-1">
								<p class="text-sm font-medium">
									{{ step }}
								</p>
								<p class="text-xs text-slate-400">Step {{ i + 1 }}</p>
							</div>

							<!-- DONE ICON -->
							<UIcon
								v-if="currentStep > i + 1"
								name="i-lucide-check-circle"
								class="text-emerald-500 size-5"
							/>
						</div>
					</div>

					<!-- PROGRESS -->
					<div class="mt-5">
						<div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
							<div
								class="h-2 bg-emerald-500 transition-all"
								:style="{ width: (currentStep / steps.length) * 100 + '%' }"
							/>
						</div>

						<p class="text-xs text-slate-400 mt-2">Step {{ currentStep }} of {{ steps.length }}</p>
					</div>
				</UCard>
			</div>

			<!-- MAIN CONTENT -->
			<div class="md:col-span-8">
				<UCard class="min-h-[500px]">
					<h2 class="text-lg font-semibold mb-4">
						{{ steps[currentStep - 1] }}
					</h2>

					<!-- STEPS (UNCHANGED LOGIC) -->
					<StudentInformation v-if="currentStep === 1" />
					<AddressInformation v-if="currentStep === 2" />
					<SchoolInformation v-if="currentStep === 3" />
					<FamilyInformation v-if="currentStep === 4" />

					<!-- NAVIGATION -->
					<div class="flex justify-between mt-6 border-t pt-4">
						<UButton
							v-if="currentStep > 1"
							variant="soft"
							icon="i-lucide-arrow-left"
							@click="currentStep--"
						>
							Back
						</UButton>

						<div class="ml-auto flex gap-2">
							<UButton
								v-if="currentStep < steps.length"
								color="primary"
								icon="i-lucide-arrow-right"
								@click="currentStep++"
							>
								Next
							</UButton>

							<UButton
								v-else
								color="success"
								icon="i-lucide-send"
								@click="submit"
							>
								Submit Application
							</UButton>
						</div>
					</div>
				</UCard>
			</div>
		</div>
	</div>
</template>
