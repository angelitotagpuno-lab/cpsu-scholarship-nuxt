<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import { computed, reactive, ref } from "vue";
import z from "zod";

const store = useStudentStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`);

const parentSchema = z.object({
	type: z.enum(["father", "mother", "guardian"]),
	firstName: requiredString("Parent first name"),
	lastName: requiredString("Parent last name"),
	middleName: z.string().trim().optional(),
	contactNumber: z.string().trim().optional(),
	occupation: z.string().trim().optional(),
});

const schema = z.object({
	schoolId: requiredString("Student ID").max(50),
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
	schoolId: "",
	firstName: "",
	lastName: "",
	middleName: "",
	extName: "",
	birthdate: "",
	contactNumber: "",
	sex: "male",
	yearLevel: 1,
	address: {
		street: "",
		barangay: "",
		city: "",
		province: "",
		zipcode: "",
	},
	parents: [
		{
			type: "father",
			firstName: "",
			lastName: "",
			middleName: "",
			contactNumber: "",
			occupation: "",
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
	errorMessage.value = "";

	await store.addStudent(event.data);

	if (store.errorMessage) {
		let message = store.errorMessage;

		try {
			const parsed = JSON.parse(store.errorMessage);
			message = parsed?.message || parsed?.error?.message || store.errorMessage;
		} catch {
			message = store.errorMessage;
		}

		errorMessage.value = message;

		toast.add({
			title: "Unable to add student",
			description: message,
			color: "error",
		});

		return;
	}

	toast.add({
		title: "Success",
		description: "Student added successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Student">
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
								Create student profile
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Add personal, address, and parent information.
							</p>
						</div>
					</div>
				</div>

				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Unable to add student"
					:description="errorMessage"
				/>

				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<UFormField
							label="Student ID"
							name="schoolId"
						>
							<UInput
								v-model="state.schoolId"
								class="w-full"
								size="lg"
								icon="i-lucide-id-card"
								placeholder="SCHOOL-001"
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
								label="Occupation"
								name="parents.0.occupation"
							>
								<UInput
									v-model="parent.occupation"
									class="w-full"
									size="lg"
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
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Save Student
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
