<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { useAuthStore } from "~/stores/auth.store";
import { useTdpFormStore } from "~/stores/tdp-form.store";
import { useStudentApplicationStore } from "~/stores/student-application.store";
import { useScholarshipOfferingStore } from "~/stores/scholarship-offering.store";
import { useFileStore } from "~/stores/file.store";

import type { CreateApplicationPayload, ParentVitalStatus } from "~/types/application";

import StudentInformation from "./components/StudentInformation.vue";
import AddressInformation from "./components/AddressInformation.vue";
import SchoolInformation from "./components/SchoolInformation.vue";
import FamilyInformation from "./components/FamilyInformation.vue";

definePageMeta({
	layout: "user-header",
});

const route = useRoute();
const toast = useToast();

const authStore = useAuthStore();
const formStore = useTdpFormStore();
const applicationStore = useStudentApplicationStore();
const offeringStore = useScholarshipOfferingStore();
const fileStore = useFileStore();

// TDP PROGRAM ID
const TDP_PROGRAM_ID = "72bbaec2-ead3-47be-b547-7a2f82ccf183";

// GET OFFERING ID FROM ROUTE
const offeringId = computed(() => {
	const value = route.query.offeringId;
	return typeof value === "string" ? value : "";
});

// AUTHENTICATED STUDENT UUID
const studentUuid = computed(() => authStore.currentAuth?.student?.id || "");

// STUDENT NUMBER FOR DISPLAY
const studentNumber = computed(() => authStore.currentAuth?.student?.studentNumber || "");

// STATE
const currentStep = ref(1);
const isCheckingOffering = ref(true);
const offeringVerified = ref(false);
const isProcessing = ref(false);
const studentProfileError = ref("");

const steps = [
	"Student Information",
	"Address Information",
	"School Information",
	"Family Information",
];

const stepIcons = ["i-lucide-user", "i-lucide-map-pin", "i-lucide-school", "i-lucide-users"];

const isSubmitting = computed(
	() => isProcessing.value || applicationStore.isSubmitting || fileStore.isLoading,
);

const progress = computed(() => (currentStep.value / steps.length) * 100);

// UUID VALIDATION
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// LOCAL STORAGE KEY
function applicationStorageKey(): string {
	return `scholarship-applied:${studentUuid.value}:${offeringId.value}`;
}

// CHECK IF STUDENT ALREADY APPLIED
function hasAlreadyApplied(): boolean {
	if (!studentUuid.value || !offeringId.value) {
		return false;
	}

	return localStorage.getItem(applicationStorageKey()) === "true";
}

// REDIRECT IF ALREADY APPLIED
async function checkAlreadyApplied(): Promise<boolean> {
	if (!hasAlreadyApplied()) {
		return false;
	}

	toast.add({
		title: "Already Applied",
		description: "You have already submitted an application for this scholarship offering.",
		color: "warning",
	});

	await navigateTo("/user/scholarships");

	return true;
}

// LOAD AUTHENTICATED STUDENT
async function loadStudent(): Promise<boolean> {
	studentProfileError.value = "";

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

	if (!student?.id) {
		studentProfileError.value =
			"Your authenticated session does not contain a student database ID. Please contact the administrator.";

		toast.add({
			title: "Student Profile Not Found",
			description: studentProfileError.value,
			color: "error",
		});

		return false;
	}

	if (!uuidRegex.test(student.id)) {
		studentProfileError.value = "The student database ID returned by the server is invalid.";

		toast.add({
			title: "Invalid Student ID",
			description: studentProfileError.value,
			color: "error",
		});

		return false;
	}

	// KEEP SCHOOL-ISSUED STUDENT NUMBER
	formStore.item.studentId = student.studentNumber;

	return true;
}

// VERIFY SCHOLARSHIP OFFERING
async function verifyOffering(): Promise<boolean> {
	offeringVerified.value = false;
	isCheckingOffering.value = true;

	try {
		if (!offeringId.value) {
			toast.add({
				title: "Missing Scholarship Offering",
				description: "Please select a TDP offering first.",
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
				title: "Unable to Verify Offering",
				description: offeringStore.errorMessage || "Unable to load scholarship offerings.",
				color: "error",
			});

			return false;
		}

		const offering = offeringStore.offerings.find((item) => item.id === offeringId.value);

		if (
			!offering ||
			!offering.isActive ||
			offering.isArchived ||
			offering.scholarshipProgramId !== TDP_PROGRAM_ID
		) {
			toast.add({
				title: "Application Unavailable",
				description: "This TDP offering is inactive, archived, or invalid.",
				color: "warning",
			});

			return false;
		}

		offeringVerified.value = true;
		return true;
	} catch (error) {
		console.error("Offering verification failed:", error);

		toast.add({
			title: "Offering Verification Failed",
			description: "Unable to verify the selected scholarship offering.",
			color: "error",
		});

		return false;
	} finally {
		isCheckingOffering.value = false;
	}
}

// INITIALIZE PAGE
onMounted(async () => {
	try {
		// LOAD STUDENT
		const validStudent = await loadStudent();

		if (!validStudent) {
			return;
		}

		// PREVENT REOPENING AN ALREADY SUBMITTED APPLICATION
		if (await checkAlreadyApplied()) {
			return;
		}

		// VERIFY OFFERING
		const validOffering = await verifyOffering();

		if (!validOffering) {
			await navigateTo("/user/scholarships");
		}
	} catch (error) {
		console.error("TDP initialization failed:", error);

		studentProfileError.value = "Unable to initialize the scholarship application.";

		toast.add({
			title: "Initialization Failed",
			description: studentProfileError.value,
			color: "error",
		});
	} finally {
		isCheckingOffering.value = false;
	}
});

// BUILD APPLICATION PAYLOAD
function buildPayload(): CreateApplicationPayload {
	const item = formStore.item;
	const p = item.profile;

	if (!studentUuid.value) {
		throw new Error("Student database ID not found. Please log in again.");
	}

	return {
		// DATABASE UUID, NOT STUDENT NUMBER
		studentId: studentUuid.value,

		offeringId: offeringId.value,
		courseId: p.courseId.trim(),

		firstName: p.firstName.trim(),
		lastName: p.lastName.trim(),

		gender: p.sex,
		birthdate: p.birthdate,
		birthplace: p.birthplace.trim(),
		citizenship: p.citizenship.trim(),
		email: p.email.trim(),
		contactNumber: p.contactNumber.trim(),

		yearLevel: p.yearLevel,
		gwa: p.gwa.trim(),
		numberOfSiblings: p.family.siblings.trim(),

		schoolSector: p.school.schoolSector,
		schoolName: p.school.schoolName.trim(),
		schoolAddress: p.school.schoolAddress.trim(),

		otherFinancialAssistance:
			p.family.financialAid === "Yes" ? p.family.financialAidSpecify.trim() : null,

		addresses: [
			{
				type: "permanent",
				province: p.address.province.trim(),
				cityMunicipality: p.address.city.trim(),
				barangay: p.address.barangay.trim(),
				street: p.address.street.trim() || null,
				zipCode: p.address.zipcode.trim(),
			},
		],

		parents: p.parents.map((parent) => ({
			type: parent.type,
			vitalStatus: (parent.status || "unknown") as ParentVitalStatus,
			firstName: parent.firstName.trim(),
			lastName: parent.lastName.trim(),
			occupation: parent.occupation.trim(),
			monthlyIncome: parent.monthlyIncome.trim(),
		})),
	};
}

// VALIDATE APPLICATION
function validatePayload(payload: CreateApplicationPayload): string[] {
	const errors: string[] = [];

	const requiredFields: Record<string, string> = {
		"Student Database ID": payload.studentId,
		"Offering ID": payload.offeringId,
		"Course ID": payload.courseId,
		"First Name": payload.firstName,
		"Last Name": payload.lastName,
		Gender: payload.gender,
		Birthdate: payload.birthdate,
		Birthplace: payload.birthplace,
		Citizenship: payload.citizenship,
		Email: payload.email,
		"Contact Number": payload.contactNumber,
		"Year Level": payload.yearLevel,
		GWA: payload.gwa,
		"Number of Siblings": payload.numberOfSiblings,
		"School Sector": payload.schoolSector,
		"School Name": payload.schoolName,
		"School Address": payload.schoolAddress,
	};

	// REQUIRED FIELDS
	for (const [label, value] of Object.entries(requiredFields)) {
		if (!value?.trim()) {
			errors.push(label);
		}
	}

	// UUID VALIDATION
	if (!uuidRegex.test(payload.studentId)) {
		errors.push("Invalid Student Database ID");
	}

	if (!uuidRegex.test(payload.offeringId)) {
		errors.push("Invalid Scholarship Offering ID");
	}

	if (!uuidRegex.test(payload.courseId)) {
		errors.push("Please select a valid course");
	}

	// EMAIL VALIDATION
	if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
		errors.push("Valid Email Address");
	}

	// CONTACT NUMBER VALIDATION
	if (payload.contactNumber && !/^09\d{9}$/.test(payload.contactNumber)) {
		errors.push("Valid Contact Number");
	}

	// GWA VALIDATION
	if (payload.gwa && !Number.isFinite(Number(payload.gwa))) {
		errors.push("Valid GWA");
	}

	// SIBLINGS VALIDATION
	if (payload.numberOfSiblings && !/^\d+$/.test(payload.numberOfSiblings)) {
		errors.push("Valid Number of Siblings");
	}

	// ADDRESS VALIDATION
	const address = payload.addresses[0];

	if (!address) {
		errors.push("Address");
	} else {
		if (!address.province) {
			errors.push("Province");
		}

		if (!address.cityMunicipality) {
			errors.push("City");
		}

		if (!address.barangay) {
			errors.push("Barangay");
		}

		if (!address.zipCode) {
			errors.push("Zip Code");
		}
	}

	// PARENT VALIDATION
	if (payload.parents.length !== 2) {
		errors.push("Father and Mother Information");
	}

	payload.parents.forEach((parent, index) => {
		const label = index === 0 ? "Father" : "Mother";

		if (!parent.firstName) {
			errors.push(`${label} First Name`);
		}

		if (!parent.lastName) {
			errors.push(`${label} Last Name`);
		}

		if (!parent.occupation) {
			errors.push(`${label} Occupation`);
		}

		if (!parent.monthlyIncome) {
			errors.push(`${label} Monthly Income`);
		} else if (!Number.isFinite(Number(parent.monthlyIncome)) || Number(parent.monthlyIncome) < 0) {
			errors.push(`${label} Valid Monthly Income`);
		}

		if (!formStore.item.profile.parents[index]?.status) {
			errors.push(`${label} Status`);
		}
	});

	// FINANCIAL ASSISTANCE VALIDATION
	const family = formStore.item.profile.family;

	if (family.financialAid === "Yes" && !family.financialAidSpecify.trim()) {
		errors.push("Financial Assistance Details");
	}

	return errors;
}

// SUBMIT TDP APPLICATION
async function submit() {
	if (isSubmitting.value) return;

	isProcessing.value = true;

	try {
		// VERIFY STUDENT
		const validStudent = await loadStudent();

		if (!validStudent) {
			return;
		}

		// PREVENT DUPLICATE SUBMISSION
		if (await checkAlreadyApplied()) {
			return;
		}

		// VERIFY OFFERING
		const validOffering = await verifyOffering();

		if (!validOffering) {
			toast.add({
				title: "Application Unavailable",
				description: "The selected TDP offering is no longer available.",
				color: "error",
			});

			return;
		}

		// BUILD APPLICATION
		const payload = buildPayload();

		// DEBUG IDS
		console.log("TDP Application IDs:", {
			studentId: payload.studentId,
			studentNumber: studentNumber.value,
			courseId: payload.courseId,
			offeringId: payload.offeringId,
		});

		// VALIDATE PAYLOAD
		const missingFields = validatePayload(payload);

		if (missingFields.length > 0) {
			toast.add({
				title: "Incomplete Application",
				description: `Please complete: ${missingFields.slice(0, 5).join(", ")}`,
				color: "error",
			});

			return;
		}

		// CERTIFICATE OF REGISTRATION
		const documentFile = formStore.item.documentFile;

		if (!documentFile) {
			toast.add({
				title: "Certificate of Registration Required",
				description: "Please upload your Certificate of Registration.",
				color: "error",
			});

			return;
		}

		// VALIDATE FILE TYPE
		const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];

		if (!allowedTypes.includes(documentFile.type)) {
			toast.add({
				title: "Invalid File Type",
				description: "Only PDF, JPG, and PNG files are allowed.",
				color: "error",
			});

			return;
		}

		// VALIDATE FILE SIZE: 5 MB
		if (documentFile.size > 5 * 1024 * 1024) {
			toast.add({
				title: "File Too Large",
				description: "The Certificate of Registration must not exceed 5 MB.",
				color: "error",
			});

			return;
		}

		// UPLOAD CERTIFICATE
		const uploaded = await fileStore.uploadFiles([documentFile]);

		if (!uploaded) {
			toast.add({
				title: "Document Upload Failed",
				description: fileStore.errorMessage || "Unable to upload the Certificate of Registration.",
				color: "error",
			});

			return;
		}

		// GET UPLOADED DOCUMENT URL
		const uploadResult = fileStore.uploadResults.find(
			(result) => result.success && result.name === documentFile.name,
		);

		const documentUrl = uploadResult?.data?.url;

		if (!documentUrl) {
			toast.add({
				title: "Upload Error",
				description: "The backend did not return a document URL.",
				color: "error",
			});

			return;
		}

		console.log("Certificate of Registration uploaded:", documentUrl);

		// SUBMIT APPLICATION TO BACKEND
		const success = await applicationStore.submitApplication(payload);

		if (!success) {
			toast.add({
				title: "Submission Failed",
				description: applicationStore.errorMessage || "Unable to submit your application.",
				color: "error",
			});

			return;
		}

		// SAVE SUCCESSFUL APPLICATION IN LOCAL STORAGE
		// SAME KEY USED BY SCHOLARSHIP OFFERINGS PAGE
		localStorage.setItem(`scholarship-applied:${payload.studentId}:${payload.offeringId}`, "true");

		// SUCCESS
		toast.add({
			title: "Application Submitted",
			description: "Your TDP application has been submitted for review.",
			color: "success",
		});

		// RESET FORM
		formStore.reset();
		fileStore.reset();

		// RETURN TO OFFERINGS PAGE
		await navigateTo("/user/scholarships");
	} catch (error) {
		console.error("TDP submission failed:", error);

		toast.add({
			title: "Submission Error",
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
		<!-- VERIFYING STUDENT / OFFERING -->
		<div
			v-if="isCheckingOffering && !offeringVerified"
			class="py-16 text-center"
		>
			<UIcon
				name="i-lucide-loader-circle"
				class="mx-auto size-10 animate-spin text-emerald-600"
			/>

			<p class="mt-3 text-sm text-slate-500">Verifying scholarship application...</p>
		</div>

		<!-- STUDENT PROFILE ERROR -->
		<div
			v-else-if="studentProfileError"
			class="mx-auto max-w-xl py-12"
		>
			<UAlert
				color="error"
				variant="soft"
				icon="i-lucide-circle-alert"
				title="Student Profile Error"
				:description="studentProfileError"
			/>

			<UButton
				to="/user/scholarships"
				color="neutral"
				variant="outline"
				class="mt-4"
			>
				Back to Scholarships
			</UButton>
		</div>

		<!-- APPLICATION WIZARD -->
		<div
			v-else-if="offeringVerified"
			class="grid grid-cols-1 gap-6 md:grid-cols-12"
		>
			<!-- SIDEBAR -->
			<div class="md:col-span-4">
				<UCard class="border border-slate-200 dark:border-slate-800">
					<h2 class="mb-4 font-semibold text-emerald-700">Scholarship Application Wizard</h2>

					<div class="space-y-2">
						<div
							v-for="(step, i) in steps"
							:key="i"
							class="flex cursor-pointer items-center gap-3 rounded-xl p-3 transition"
							:class="{
								'border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40':
									currentStep === i + 1,
								'hover:bg-slate-50 dark:hover:bg-slate-800': currentStep !== i + 1,
							}"
							@click="currentStep = i + 1"
						>
							<div
								class="rounded-lg p-2"
								:class="{
									'bg-emerald-600 text-white': currentStep === i + 1,
									'bg-slate-100 text-slate-500 dark:bg-slate-800': currentStep !== i + 1,
								}"
							>
								<UIcon
									:name="stepIcons[i] || 'i-lucide-circle'"
									class="size-5"
								/>
							</div>

							<div class="flex-1">
								<p class="text-sm font-medium">
									{{ step }}
								</p>

								<p class="text-xs text-slate-400">Step {{ i + 1 }}</p>
							</div>

							<UIcon
								v-if="currentStep > i + 1"
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

						<p class="mt-2 text-xs text-slate-400">Step {{ currentStep }} of {{ steps.length }}</p>
					</div>
				</UCard>
			</div>

			<!-- MAIN CONTENT -->
			<div class="md:col-span-8">
				<UCard class="min-h-[500px]">
					<h2 class="mb-4 text-lg font-semibold">
						{{ steps[currentStep - 1] }}
					</h2>

					<StudentInformation v-if="currentStep === 1" />

					<AddressInformation v-if="currentStep === 2" />

					<SchoolInformation v-if="currentStep === 3" />

					<FamilyInformation v-if="currentStep === 4" />

					<!-- NAVIGATION -->
					<div class="mt-6 flex justify-between border-t pt-4">
						<UButton
							v-if="currentStep > 1"
							variant="soft"
							icon="i-lucide-arrow-left"
							:disabled="isSubmitting"
							@click="currentStep--"
						>
							Back
						</UButton>

						<div class="ml-auto flex gap-2">
							<UButton
								v-if="currentStep < steps.length"
								color="primary"
								icon="i-lucide-arrow-right"
								:disabled="isSubmitting"
								@click="currentStep++"
							>
								Next
							</UButton>

							<UButton
								v-else
								color="success"
								icon="i-lucide-send"
								:loading="isSubmitting"
								:disabled="isSubmitting"
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
