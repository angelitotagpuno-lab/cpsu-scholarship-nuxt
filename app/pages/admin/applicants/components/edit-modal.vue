<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { computed } from "vue";
import z from "zod";
import type { Student } from "~/types/student";

const store = useStudentStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();
const props = defineProps<{ data: Student }>();

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`);

const parentSchema = z.object({
	type: z.enum(["father", "mother", "guardian"]),
	firstName: requiredString("Parent first name"),
	lastName: requiredString("Parent last name"),
	middleName: z.string().trim().optional(),
	extName: z.string().trim().optional(),
	occupation: z.string().trim().optional(),
	monthlyIncome: z.string().trim().optional(),
	contactNumber: z.string().trim().optional(),
	email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
});

const schema = z.object({
	firstName: requiredString("First name").max(100),
	lastName: requiredString("Last name").max(100),
	middleName: z.string().trim().max(100).optional(),
	extName: z.string().trim().max(20).optional(),
	birthdate: requiredString("Birthdate"),
	contactNumber: z.string().regex(/^09\d{9}$/, "Invalid PH mobile number"),
	sex: z.enum(["male", "female"]),
	yearLevel: z.coerce.number().int().min(1).max(6),
	address: z.object({
		street: z.string().trim().optional(),
		barangay: requiredString("Barangay"),
		city: requiredString("City"),
		province: requiredString("Province"),
		zipcode: requiredString("Zipcode"),
	}),
	parents: z.array(parentSchema).min(1, "At least one parent is required"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	firstName: props.data.firstName || "",
	lastName: props.data.lastName || "",
	middleName: props.data.middleName || "",
	extName: props.data.extName || "",
	birthdate: props.data.birthdate || "",
	contactNumber: props.data.contactNumber?.replace(/^\+63/, "0") || "",
	sex: props.data.sex || "male",
	yearLevel: props.data.yearLevel || 1,
	address: {
		street: props.data.address?.street || "",
		barangay: props.data.address?.barangay || "",
		city: props.data.address?.city || "",
		province: props.data.address?.province || "",
		zipcode: props.data.address?.zipcode || "",
	},
	parents: [
		{
			type: props.data.parents?.[0]?.type || "father",
			firstName: props.data.parents?.[0]?.firstName || "",
			lastName: props.data.parents?.[0]?.lastName || "",
			middleName: props.data.parents?.[0]?.middleName || "",
			extName: props.data.parents?.[0]?.extName || "",
			occupation: props.data.parents?.[0]?.occupation || "",
			monthlyIncome: props.data.parents?.[0]?.monthlyIncome || "",
			contactNumber: props.data.parents?.[0]?.contactNumber || "",
			email: props.data.parents?.[0]?.email || "",
		},
	],
});

const parent = computed({
	get: () => state.parents[0]!,
	set: (value) => {
		state.parents[0] = value;
	},
});

const sexOptions = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const parentTypeOptions = [
	{ label: "Father", value: "father" },
	{ label: "Mother", value: "mother" },
	{ label: "Guardian", value: "guardian" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
	const studentId =
		props.data.userId || props.data.id || props.data.studentId || props.data.schoolId;

	if (!studentId) {
		toast.add({
			title: "Error",
			description: "Student ID is missing. Cannot update this record.",
			color: "error",
		});
		return;
	}

	const payload: Student = {
		...props.data,
		...event.data,
		id: props.data.id,
		userId: props.data.userId,
		studentId: props.data.studentId,
		schoolId: props.data.schoolId,
	};

	const updatedStudent = await store.editStudent(studentId, payload);

	if (!updatedStudent || store.errorMessage) {
		toast.add({
			title: "Error",
			description: store.errorMessage || "Student was not updated.",
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Success",
		description: "Student updated successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Student">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-blue-600 p-2 text-white">
							<UIcon
								name="i-lucide-user-pen"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Update student profile
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Edit personal, address, and parent information.
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
							label="First Name"
							name="firstName"
						>
							<UInput
								v-model="state.firstName"
								class="w-full"
								size="lg"
								icon="i-lucide-user"
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
								placeholder="Jr., Sr."
							/>
						</UFormField>

						<UFormField
							label="Birthdate"
							name="birthdate"
						>
							<UInput
								v-model="state.birthdate"
								class="w-full"
								size="lg"
								type="date"
							/>
						</UFormField>

						<UFormField
							label="Contact Number"
							name="contactNumber"
						>
							<UInput
								v-model="state.contactNumber"
								class="w-full"
								size="lg"
								icon="i-lucide-phone"
								placeholder="09123456789"
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
							/>
						</UFormField>

						<UFormField
							label="Year Level"
							name="yearLevel"
						>
							<UInput
								v-model.number="state.yearLevel"
								class="w-full"
								size="lg"
								type="number"
							/>
						</UFormField>
					</div>

					<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
						<h4 class="mb-4 font-semibold text-slate-900 dark:text-white">Address</h4>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<UFormField
								label="Street"
								name="address.street"
							>
								<UInput
									v-model="state.address.street"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Barangay"
								name="address.barangay"
							>
								<UInput
									v-model="state.address.barangay"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="City"
								name="address.city"
							>
								<UInput
									v-model="state.address.city"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Province"
								name="address.province"
							>
								<UInput
									v-model="state.address.province"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Zipcode"
								name="address.zipcode"
							>
								<UInput
									v-model="state.address.zipcode"
									class="w-full"
									size="lg"
								/>
							</UFormField>
						</div>
					</div>

					<div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
						<h4 class="mb-4 font-semibold text-slate-900 dark:text-white">Parent / Guardian</h4>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<UFormField
								label="Type"
								name="parents.0.type"
							>
								<USelect
									v-model="parent.type"
									class="w-full"
									size="lg"
									:items="parentTypeOptions"
									label-key="label"
									value-key="value"
								/>
							</UFormField>

							<UFormField
								label="First Name"
								name="parents.0.firstName"
							>
								<UInput
									v-model="parent.firstName"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Last Name"
								name="parents.0.lastName"
							>
								<UInput
									v-model="parent.lastName"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Middle Name"
								name="parents.0.middleName"
							>
								<UInput
									v-model="parent.middleName"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Extension"
								name="parents.0.extName"
							>
								<UInput
									v-model="parent.extName"
									class="w-full"
									size="lg"
									placeholder="Jr., Sr."
								/>
							</UFormField>

							<UFormField
								label="Occupation"
								name="parents.0.occupation"
							>
								<UInput
									v-model="parent.occupation"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Monthly Income"
								name="parents.0.monthlyIncome"
							>
								<UInput
									v-model="parent.monthlyIncome"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Contact Number"
								name="parents.0.contactNumber"
							>
								<UInput
									v-model="parent.contactNumber"
									class="w-full"
									size="lg"
								/>
							</UFormField>

							<UFormField
								label="Email"
								name="parents.0.email"
							>
								<UInput
									v-model="parent.email"
									class="w-full"
									size="lg"
									type="email"
								/>
							</UFormField>
						</div>
					</div>

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							color="neutral"
							variant="outline"
							@click="emit('close', false)"
						>
							Cancel
						</UButton>

						<UButton
							type="submit"
							:loading="store.isLoading"
							icon="i-lucide-save"
							color="primary"
							class="bg-blue-600 hover:bg-blue-700"
						>
							Update Student
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
