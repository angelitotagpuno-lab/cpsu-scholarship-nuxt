<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import StudentInformation from "./components/StudentInformation.vue";
import FatherInformation from "./components/FatherInformation.vue";
import MotherInformation from "./components/MotherInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import OtherInformation from "./components/OtherInformation.vue";
import ContactInformation from "./components/ContactInformation.vue";

import { useTesScholarFormStore } from "~/stores/tes-form.store";
import { useStudentApplicationStore } from "~/stores/student-application.store";
import { useScholarshipOfferingStore } from "~/stores/scholarship-offering.store";
import { useAuthStore } from "~/stores/auth.store";
import { useFileStore } from "~/stores/file.store";

import type { CreateApplicationPayload, ParentVitalStatus } from "~/types/application";

definePageMeta({
	layout: "user-header",
});

const route = useRoute();
const toast = useToast();

const formStore = useTesScholarFormStore();
const applicationStore = useStudentApplicationStore();
const offeringStore = useScholarshipOfferingStore();
const authStore = useAuthStore();
const fileStore = useFileStore();

const TES_PROGRAM_ID = "43bb7b99-8e50-4a5a-8e98-f6f1fef11385";

const currentStep = ref(1);
const isCheckingOffering = ref(true);
const offeringVerified = ref(false);
const isProcessing = ref(false);
const initializationError = ref<string | null>(null);

const steps = [
	{
		id: 1,
		title: "Student Information",
		icon: "i-lucide-user-round",
	},
	{
		id: 2,
		title: "Parents Information",
		icon: "i-lucide-heart-handshake",
	},
	{
		id: 3,
		title: "Address Information",
		icon: "i-lucide-home",
	},
	{
		id: 4,
		title: "Other Information",
		icon: "i-lucide-clipboard-list",
	},
	{
		id: 5,
		title: "Contact Information",
		icon: "i-lucide-phone",
	},
];

const totalSteps = steps.length;

const offeringId = computed(() => {
	const value = route.query.offeringId;
	return typeof value === "string" ? value : "";
});

const studentUuid = computed(() => authStore.currentAuth?.student?.id || "");

const studentNumber = computed(() => authStore.currentAuth?.student?.studentNumber || "");

const isSubmitting = computed(
	() => isProcessing.value || applicationStore.isSubmitting || fileStore.isLoading,
);

const progress = computed(() => (currentStep.value / totalSteps) * 100);

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// SAME STORAGE KEY AS SCHOLARSHIP OFFERINGS
function getApplicationKey(studentId: string, selectedOfferingId: string): string {
	return `scholarship-applied:${studentId}:${selectedOfferingId}`;
}

function hasAlreadyApplied(): boolean {
	if (!studentUuid.value || !offeringId.value) {
		return false;
	}

	return localStorage.getItem(getApplicationKey(studentUuid.value, offeringId.value)) === "true";
}

async function redirectIfApplied(): Promise<boolean> {
	if (!hasAlreadyApplied()) return false;

	toast.add({
		title: "Already Applied",
		description: "You have already submitted an application for this TES scholarship offering.",
		color: "warning",
	});

	await navigateTo("/user/scholarships");
	return true;
}

// LOAD AUTHENTICATED STUDENT
async function loadStudent(): Promise<boolean> {
	if (!authStore.currentAuth?.student?.id) {
		const authenticated = await authStore.getUser();

		if (!authenticated || !authStore.isStudent) {
			toast.add({
				title: "Authentication Required",
				description: "Please log in as a student.",
				color: "error",
			});

			await navigateTo("/user-login");
			return false;
		}
	}

	const student = authStore.currentAuth?.student;

	if (!student?.id || !uuidRegex.test(student.id)) {
		initializationError.value =
			"Your student database UUID is unavailable. Please contact the administrator.";

		return false;
	}

	// DISPLAY STUDENT NUMBER, BUT SEND UUID TO BACKEND
	formStore.student.studentId = student.studentNumber || "";

	return true;
}

// VERIFY THE SELECTED TES OFFERING
async function verifyOffering(): Promise<boolean> {
	if (!offeringId.value || !uuidRegex.test(offeringId.value)) {
		toast.add({
			title: "Invalid Offering",
			description: "Please select a valid TES scholarship offering.",
			color: "error",
		});
		return false;
	}

	const success = await offeringStore.getOfferings({
		page: 1,
		perPage: 100,
	});

	if (!success) {
		toast.add({
			title: "Unable to Load Offering",
			description: offeringStore.errorMessage || "Could not verify the selected TES offering.",
			color: "error",
		});
		return false;
	}

	const offering = offeringStore.offerings.find((item) => item.id === offeringId.value);

	if (
		!offering ||
		!offering.isActive ||
		offering.isArchived ||
		offering.scholarshipProgramId !== TES_PROGRAM_ID
	) {
		toast.add({
			title: "TES Offering Unavailable",
			description: "The selected offering is inactive, archived, or does not belong to TES.",
			color: "warning",
		});
		return false;
	}

	offeringVerified.value = true;
	return true;
}

// INITIALIZE FORM
onMounted(async () => {
	isCheckingOffering.value = true;

	try {
		const validStudent = await loadStudent();
		if (!validStudent) return;

		if (await redirectIfApplied()) return;

		const validOffering = await verifyOffering();

		if (!validOffering) {
			await navigateTo("/user/scholarships");
		}
	} catch (error) {
		initializationError.value =
			error instanceof Error ? error.message : "Unable to initialize TES application.";
	} finally {
		isCheckingOffering.value = false;
	}
});

function nextStep() {
	if (currentStep.value < totalSteps) {
		currentStep.value++;
	}
}

function prevStep() {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
}

// BUILD APPLICATION PAYLOAD
function buildPayload(): CreateApplicationPayload {
	const s = formStore.student;
	const f = formStore.father;
	const m = formStore.mother;
	const a = formStore.address;
	const c = formStore.contact;

	if (!studentUuid.value) {
		throw new Error("Student database UUID not found.");
	}

	return {
		// DATABASE UUID, NOT SCHOOL STUDENT NUMBER
		studentId: studentUuid.value,
		offeringId: offeringId.value,
		courseId: s.courseId.trim(),

		firstName: s.firstName.trim(),
		lastName: s.lastName.trim(),
		middleName: s.middleName.trim(),
		extName: s.extName.trim(),

		gender: s.sex.toLowerCase(),
		birthdate: s.birthdate,
		birthplace: s.birthplace.trim(),
		citizenship: s.citizenship.trim(),

		email: c.email.trim(),
		contactNumber: c.contactNumber.trim(),

		yearLevel: s.yearLevel,
		gwa: s.gwa.trim(),
		numberOfSiblings: s.numberOfSiblings.trim(),

		schoolSector: s.schoolSector,
		schoolName: s.schoolName.trim(),
		schoolAddress: s.schoolAddress.trim(),

		otherFinancialAssistance: null,

		addresses: [
			{
				type: "permanent",
				province: a.province.trim(),
				cityMunicipality: a.cityMunicipality.trim(),
				barangay: a.barangay.trim(),
				street: a.street.trim() || null,
				zipCode: a.zipcode.trim(),
			},
		],

		parents: [
			{
				type: "father",
				vitalStatus: (f.fatherStatus || "unknown") as ParentVitalStatus,
				firstName: f.fatherFirstName.trim(),
				lastName: f.fatherLastName.trim(),
				middleName: f.fatherMiddleName.trim(),
				occupation: f.fatherOccupation.trim(),
				monthlyIncome: String(f.fatherIncome).trim(),
			},
			{
				type: "mother",
				vitalStatus: (m.motherStatus || "unknown") as ParentVitalStatus,
				firstName: m.motherFirstName.trim(),
				lastName: m.motherLastName.trim(),
				middleName: m.motherMiddleName.trim(),
				occupation: m.motherOccupation.trim(),
				monthlyIncome: String(m.motherIncome).trim(),
			},
		],
	};
}

// VALIDATE APPLICATION
function getMissingFields(payload: CreateApplicationPayload): string[] {
	const missing: string[] = [];

	const requiredFields: Record<string, string> = {
		"Student UUID": payload.studentId,
		"Scholarship Offering": payload.offeringId,
		Course: payload.courseId,
		"First Name": payload.firstName,
		"Last Name": payload.lastName,
		Sex: payload.gender,
		Birthdate: payload.birthdate,
		Birthplace: payload.birthplace,
		Citizenship: payload.citizenship,
		"Year Level": payload.yearLevel,
		GWA: payload.gwa,
		"Number of Siblings": payload.numberOfSiblings,
		"School Sector": payload.schoolSector,
		"School Name": payload.schoolName,
		"School Address": payload.schoolAddress,
		"Contact Number": payload.contactNumber,
		Email: payload.email,
	};

	for (const [label, value] of Object.entries(requiredFields)) {
		if (!value.trim()) missing.push(label);
	}

	if (!uuidRegex.test(payload.studentId)) {
		missing.push("Valid Student UUID");
	}

	if (!uuidRegex.test(payload.offeringId)) {
		missing.push("Valid Offering UUID");
	}

	if (!uuidRegex.test(payload.courseId)) {
		missing.push("Valid Course UUID");
	}

	if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
		missing.push("Valid Email Address");
	}

	if (payload.contactNumber && !/^09\d{9}$/.test(payload.contactNumber)) {
		missing.push("Valid Contact Number");
	}

	if (payload.gwa && (!Number.isFinite(Number(payload.gwa)) || Number(payload.gwa) < 0)) {
		missing.push("Valid GWA");
	}

	if (payload.numberOfSiblings && !/^\d+$/.test(payload.numberOfSiblings)) {
		missing.push("Valid Number of Siblings");
	}

	const address = payload.addresses[0];

	if (!address) {
		missing.push("Permanent Address");
	} else {
		if (!address.barangay) missing.push("Barangay");
		if (!address.cityMunicipality) {
			missing.push("City / Municipality");
		}
		if (!address.province) missing.push("Province");
		if (!address.zipCode) missing.push("Zip Code");
	}

	if (!formStore.father.fatherStatus) {
		missing.push("Father Status");
	}

	if (!formStore.mother.motherStatus) {
		missing.push("Mother Status");
	}

	payload.parents.forEach((parent, index) => {
		const label = index === 0 ? "Father" : "Mother";

		if (!parent.firstName) {
			missing.push(`${label} First Name`);
		}

		if (!parent.lastName) {
			missing.push(`${label} Last Name`);
		}

		if (!parent.occupation) {
			missing.push(`${label} Occupation`);
		}

		if (!parent.monthlyIncome.trim()) {
			missing.push(`${label} Monthly Income`);
		} else if (!Number.isFinite(Number(parent.monthlyIncome)) || Number(parent.monthlyIncome) < 0) {
			missing.push(`${label} Valid Monthly Income`);
		}
	});

	const o = formStore.other;

	if (o.disability === "Yes" && !o.pwdFile) {
		missing.push("PWD Proof");
	}

	if (o.indigenous === "Yes" && !o.ipFile) {
		missing.push("IP Proof");
	}

	if (o.fourPs === "Yes" && !o.fourPsFile) {
		missing.push("4Ps Proof");
	}

	return missing;
}

// UPLOAD OPTIONAL PROOF FILES
async function uploadProofFiles(payload: CreateApplicationPayload): Promise<void> {
	const o = formStore.other;

	const documents: {
		field: "pwdUrl" | "ipUrl" | "fourPsUrl";
		file: File;
	}[] = [];

	if (o.disability === "Yes" && o.pwdFile) {
		documents.push({
			field: "pwdUrl",
			file: o.pwdFile,
		});
	}

	if (o.indigenous === "Yes" && o.ipFile) {
		documents.push({
			field: "ipUrl",
			file: o.ipFile,
		});
	}

	if (o.fourPs === "Yes" && o.fourPsFile) {
		documents.push({
			field: "fourPsUrl",
			file: o.fourPsFile,
		});
	}

	for (const document of documents) {
		const file = document.file;

		const validType =
			file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/png";

		if (!validType) {
			throw new Error(`${file.name}: Only PDF, JPG, and PNG files are allowed.`);
		}

		if (file.size > 5 * 1024 * 1024) {
			throw new Error(`${file.name}: File must not exceed 5 MB.`);
		}

		const uploaded = await fileStore.uploadFiles([file]);

		if (!uploaded) {
			throw new Error(fileStore.errorMessage || `Unable to upload ${file.name}.`);
		}

		const result = fileStore.uploadResults[0];

		// EXPECTED FILE UPLOAD RESPONSE: { url: "..." }
		const uploadData = result?.data as { url?: string; data?: { url?: string } } | undefined;

		const url = uploadData?.url || uploadData?.data?.url;

		if (!url) {
			throw new Error(`Upload completed but no document URL was returned for ${file.name}.`);
		}

		payload[document.field] = url;
	}
}

// SUBMIT TES APPLICATION
async function submitForm() {
	if (isSubmitting.value || !offeringVerified.value) return;

	isProcessing.value = true;

	try {
		if (await redirectIfApplied()) return;

		const payload = buildPayload();
		const missing = getMissingFields(payload);

		if (missing.length > 0) {
			toast.add({
				title: "Incomplete TES Application",
				description: `Please complete: ${missing.slice(0, 5).join(", ")}`,
				color: "error",
			});
			return;
		}

		// UPLOAD DOCUMENTS BEFORE APPLICATION
		await uploadProofFiles(payload);

		console.log("TES application IDs:", {
			studentId: payload.studentId,
			studentNumber: studentNumber.value,
			offeringId: payload.offeringId,
			courseId: payload.courseId,
		});

		// SEND TO SAME APPLICATION API AS TDP
		const success = await applicationStore.submitApplication(payload);

		if (!success) {
			toast.add({
				title: "Submission Failed",
				description: applicationStore.errorMessage || "Unable to submit TES application.",
				color: "error",
			});
			return;
		}

		// SAVE ONLY AFTER SUCCESSFUL BACKEND SUBMISSION
		const storageKey = getApplicationKey(payload.studentId, payload.offeringId);

		localStorage.setItem(storageKey, "true");

		console.log("TES application saved:", {
			key: storageKey,
			value: localStorage.getItem(storageKey),
		});

		toast.add({
			title: "TES Application Submitted",
			description: "Your application was successfully submitted for review.",
			color: "success",
		});

		formStore.resetAll();
		fileStore.reset();

		await navigateTo("/user/scholarships");
	} catch (error) {
		console.error("TES submission failed:", error);

		toast.add({
			title: "TES Submission Failed",
			description: error instanceof Error ? error.message : "An unexpected error occurred.",
			color: "error",
		});
	} finally {
		isProcessing.value = false;
	}
}
</script>

<template>
	<div class="mx-auto max-w-6xl p-4 sm:p-6">
		<!-- INITIAL LOADING -->
		<div
			v-if="isCheckingOffering"
			class="flex min-h-[400px] items-center justify-center"
		>
			<div class="text-center">
				<UIcon
					name="i-lucide-loader-circle"
					class="mx-auto size-10 animate-spin text-emerald-600"
				/>
				<p class="mt-3 text-sm text-slate-500">Verifying TES scholarship offering...</p>
			</div>
		</div>

		<!-- INITIALIZATION ERROR -->
		<UAlert
			v-else-if="initializationError"
			color="error"
			variant="soft"
			icon="i-lucide-circle-alert"
			title="Unable to Open TES Application"
			:description="initializationError"
		/>

		<!-- APPLICATION WIZARD -->
		<div
			v-else-if="offeringVerified"
			class="grid grid-cols-1 gap-6 md:grid-cols-12"
		>
			<!-- SIDEBAR -->
			<div class="md:col-span-4">
				<UCard class="border border-slate-200 dark:border-slate-800">
					<h2 class="mb-4 font-semibold text-emerald-700">TES Application Wizard</h2>

					<div class="space-y-2">
						<div
							v-for="step in steps"
							:key="step.id"
							class="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition"
							:class="{
								'border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40':
									currentStep === step.id,
								'hover:bg-slate-50 dark:hover:bg-slate-800': currentStep !== step.id,
							}"
							@click="currentStep = step.id"
						>
							<div
								class="rounded-lg p-2"
								:class="{
									'bg-emerald-600 text-white': currentStep === step.id,
									'bg-slate-100 text-slate-500 dark:bg-slate-800': currentStep !== step.id,
								}"
							>
								<UIcon
									:name="step.icon"
									class="size-5"
								/>
							</div>

							<div class="flex-1">
								<p class="text-sm font-medium">
									{{ step.title }}
								</p>
								<p class="text-xs text-slate-400">Step {{ step.id }}</p>
							</div>

							<UIcon
								v-if="currentStep > step.id"
								name="i-lucide-check-circle"
								class="size-5 text-emerald-500"
							/>
						</div>
					</div>

					<!-- PROGRESS -->
					<div class="mt-5">
						<div class="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
							<div
								class="h-2 bg-emerald-500 transition-all"
								:style="{ width: `${progress}%` }"
							/>
						</div>

						<p class="mt-2 text-xs text-slate-400">Step {{ currentStep }} of {{ totalSteps }}</p>
					</div>
				</UCard>
			</div>

			<!-- MAIN CONTENT -->
			<div class="md:col-span-8">
				<UCard class="min-h-[500px]">
					<h2 class="mb-4 text-lg font-semibold">
						{{ steps[currentStep - 1]?.title }}
					</h2>

					<StudentInformation v-if="currentStep === 1" />

					<div v-if="currentStep === 2">
						<FatherInformation />
						<MotherInformation />
					</div>

					<AddressInformation v-if="currentStep === 3" />

					<OtherInformation v-if="currentStep === 4" />

					<ContactInformation v-if="currentStep === 5" />

					<!-- NAVIGATION -->
					<div class="mt-6 flex justify-between border-t pt-4">
						<UButton
							v-if="currentStep > 1"
							variant="soft"
							icon="i-lucide-arrow-left"
							:disabled="isSubmitting"
							@click="prevStep"
						>
							Back
						</UButton>

						<div class="ml-auto flex gap-2">
							<UButton
								v-if="currentStep < totalSteps"
								color="primary"
								icon="i-lucide-arrow-right"
								:disabled="isSubmitting"
								@click="nextStep"
							>
								Next
							</UButton>

							<UButton
								v-else
								color="success"
								icon="i-lucide-send"
								:loading="isSubmitting"
								:disabled="isSubmitting"
								@click="submitForm"
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
