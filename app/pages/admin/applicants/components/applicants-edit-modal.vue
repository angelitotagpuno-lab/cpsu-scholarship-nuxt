<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, watch, computed } from "vue";

const props = defineProps<{
	modelValue: boolean;
	applicant: unknown | null;
}>();

const emit = defineEmits(["update:modelValue", "save"]);

const open = computed({
	get: () => props.modelValue,
	set: (val) => emit("update:modelValue", val),
});

const schema = z.object({
	awardNo: z.string().optional(),
	appId: z.string().optional(),
	batch: z.number().optional(),
	studentId: z.string().optional(),

	lastName: z.string().min(1),
	firstName: z.string().min(1),
	middleName: z.string().optional(),
	extName: z.string().optional(),

	sex: z.enum(["MALE", "FEMALE"]),
	course: z.string(),
	yearLevel: z.number(),

	contactNo: z.string(),
	email: z.string().email(),

	city: z.string(),
	province: z.string(),
	zipcode: z.string(),

	income: z.number(),
	gpa: z.number(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({});

const sexOptions = [
	{ label: "Male", value: "MALE" },
	{ label: "Female", value: "FEMALE" },
];

watch(
	() => props.applicant,
	(val) => {
		if (val) Object.assign(state, val);
	},
	{ immediate: true },
);

function onSubmit(event: FormSubmitEvent<Schema>) {
	emit("save", event.data);
	open.value = false;
}
</script>

<template>
	<UModal
		v-model:open="open"
		title="Edit Applicant"
	>
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
								Update applicant record
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Edit the student ID, personal details, academic information, and eligibility data.
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
							label="Family Income"
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
							label="Save Changes"
							icon="i-lucide-save"
							color="primary"
							class="bg-blue-600 hover:bg-blue-700"
							type="submit"
						/>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
