<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref, reactive } from "vue";

const open = ref(false);

const schema = z.object({
	awardNo: z.string().optional(),
	appId: z.string().optional(),
	batch: z.number().min(1, "Batch is required"),
	studentId: z.string().min(1, "Student ID is required"),
	lastName: z.string().min(1, "Required"),
	firstName: z.string().min(1, "Required"),
	middleName: z.string().optional(),
	extName: z.string().optional(),
	sex: z.enum(["MALE", "FEMALE"]),
	course: z.string().min(1, "Required"),
	yearLevel: z.number().min(1, "Invalid year level"),
	contactNo: z.string().min(7, "Invalid contact number"),
	email: z.string().email("Invalid email"),
	city: z.string(),
	province: z.string(),
	zipcode: z.string(),
	income: z.number().min(0, "Income cannot be negative"),
	gpa: z.number().min(0).max(5, "GPA must be 0-5"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	awardNo: "",
	appId: "",
	batch: 1,
	studentId: "",
	lastName: "",
	firstName: "",
	middleName: "",
	extName: "",
	sex: "MALE",
	course: "",
	yearLevel: 1,
	contactNo: "",
	email: "",
	city: "",
	province: "",
	zipcode: "",
	income: 0,
	gpa: 0,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
	toast.add({
		title: "Success",
		description: `New applicant ${event.data.firstName} ${event.data.lastName} added`,
		color: "success",
	});

	open.value = false;

	Object.keys(state).forEach((key) => {
		(state as any)[key] =
			key === "sex"
				? "MALE"
				: key === "yearLevel"
					? 1
					: key === "batch"
						? 1
						: key === "income" || key === "gpa"
							? 0
							: "";
	});
}

const sexOptions = [
	{ label: "Male", value: "MALE" },
	{ label: "Female", value: "FEMALE" },
];
</script>

<template>
	<UModal
		v-model:open="open"
		title="New Applicant"
		description="Add a new applicant to the database"
	>
		<UButton
			label="New Applicant"
			icon="i-lucide-plus"
			size="lg"
			color="primary"
			class="bg-emerald-600 hover:bg-emerald-700"
		/>

		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-user-plus"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Create applicant record
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Enter the student ID, personal details, academic information, and eligibility data.
							</p>
						</div>
					</div>
				</div>

				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<UFormField
							label="Student ID"
							name="studentId"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.studentId"
								class="w-full"
								size="lg"
								icon="i-lucide-id-card"
								placeholder="Student ID"
							/>
						</UFormField>

						<UFormField
							label="Batch"
							name="batch"
						>
							<UInput
								v-model="state.batch"
								class="w-full"
								size="lg"
								type="number"
								icon="i-lucide-layers"
							/>
						</UFormField>

						<UFormField
							label="Last Name"
							name="lastName"
						>
							<UInput
								v-model="state.lastName"
								class="w-full"
								size="lg"
								icon="i-lucide-user"
								placeholder="Last name"
							/>
						</UFormField>

						<UFormField
							label="First Name"
							name="firstName"
						>
							<UInput
								v-model="state.firstName"
								class="w-full"
								size="lg"
								icon="i-lucide-user"
								placeholder="First name"
							/>
						</UFormField>

						<UFormField
							label="Middle Name"
							name="middleName"
						>
							<UInput
								v-model="state.middleName"
								class="w-full"
								size="lg"
								icon="i-lucide-user-round"
								placeholder="Optional"
							/>
						</UFormField>

						<UFormField
							label="Extension"
							name="extName"
						>
							<UInput
								v-model="state.extName"
								class="w-full"
								size="lg"
								icon="i-lucide-badge"
								placeholder="Jr., Sr., etc."
							/>
						</UFormField>

						<UFormField
							label="Sex"
							name="sex"
						>
							<USelect
								v-model="state.sex"
								class="w-full"
								size="lg"
								:items="sexOptions"
								label-key="label"
								value-key="value"
								placeholder="Select sex"
							/>
						</UFormField>

						<UFormField
							label="Course"
							name="course"
						>
							<UInput
								v-model="state.course"
								class="w-full"
								size="lg"
								icon="i-lucide-book-open"
								placeholder="Course"
							/>
						</UFormField>

						<UFormField
							label="Year Level"
							name="yearLevel"
						>
							<UInput
								v-model="state.yearLevel"
								class="w-full"
								size="lg"
								type="number"
								icon="i-lucide-graduation-cap"
							/>
						</UFormField>

						<UFormField
							label="Contact Number"
							name="contactNo"
						>
							<UInput
								v-model="state.contactNo"
								class="w-full"
								size="lg"
								icon="i-lucide-phone"
								placeholder="09123456789"
							/>
						</UFormField>

						<UFormField
							label="Email"
							name="email"
						>
							<UInput
								v-model="state.email"
								class="w-full"
								size="lg"
								icon="i-lucide-mail"
								placeholder="example@gmail.com"
							/>
						</UFormField>

						<UFormField
							label="City"
							name="city"
						>
							<UInput
								v-model="state.city"
								class="w-full"
								size="lg"
								icon="i-lucide-map-pin"
								placeholder="City"
							/>
						</UFormField>

						<UFormField
							label="Province"
							name="province"
						>
							<UInput
								v-model="state.province"
								class="w-full"
								size="lg"
								icon="i-lucide-map"
								placeholder="Province"
							/>
						</UFormField>

						<UFormField
							label="Zipcode"
							name="zipcode"
						>
							<UInput
								v-model="state.zipcode"
								class="w-full"
								size="lg"
								icon="i-lucide-map-pinned"
								placeholder="Zipcode"
							/>
						</UFormField>

						<UFormField
							label="Income"
							name="income"
						>
							<UInput
								v-model="state.income"
								class="w-full"
								size="lg"
								type="number"
								icon="i-lucide-wallet"
							/>
						</UFormField>

						<UFormField
							label="GPA"
							name="gpa"
						>
							<UInput
								v-model="state.gpa"
								class="w-full"
								size="lg"
								type="number"
								step="0.01"
								icon="i-lucide-chart-no-axes-column"
							/>
						</UFormField>
					</div>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							label="Cancel"
							color="neutral"
							variant="outline"
							@click="open = false"
						/>

						<UButton
							label="Create"
							icon="i-lucide-save"
							color="primary"
							class="bg-emerald-600 hover:bg-emerald-700"
							type="submit"
						/>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
