<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { reactive, watch, computed } from "vue";

const props = defineProps<{
	modelValue: boolean;
	applicant: any | null;
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
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<!-- 🔹 Identification -->
				<UFormField label="Award No">
					<UInput v-model="state.awardNo" />
				</UFormField>

				<UFormField label="App ID">
					<UInput v-model="state.appId" />
				</UFormField>

				<UFormField label="Batch">
					<UInput
						type="number"
						v-model="state.batch"
					/>
				</UFormField>

				<UFormField label="Student ID">
					<UInput v-model="state.studentId" />
				</UFormField>

				<!-- 🔹 Name -->
				<UFormField
					label="Last Name"
					name="lastName"
				>
					<UInput v-model="state.lastName" />
				</UFormField>

				<UFormField
					label="First Name"
					name="firstName"
				>
					<UInput v-model="state.firstName" />
				</UFormField>

				<UFormField label="Middle Name">
					<UInput v-model="state.middleName" />
				</UFormField>

				<UFormField label="Extension">
					<UInput
						v-model="state.extName"
						placeholder="Jr., Sr."
					/>
				</UFormField>

				<!-- 🔹 Academic -->
				<UFormField
					label="Sex"
					name="sex"
				>
					<USelect
						v-model="state.sex"
						:options="['MALE', 'FEMALE']"
					/>
				</UFormField>

				<UFormField label="Course">
					<UInput v-model="state.course" />
				</UFormField>

				<UFormField label="Year Level">
					<UInput
						type="number"
						v-model="state.yearLevel"
					/>
				</UFormField>

				<!-- 🔹 Contact -->
				<UFormField label="Contact Number">
					<UInput v-model="state.contactNo" />
				</UFormField>

				<UFormField label="Email">
					<UInput v-model="state.email" />
				</UFormField>

				<!-- 🔹 Address -->
				<UFormField label="City">
					<UInput v-model="state.city" />
				</UFormField>

				<UFormField label="Province">
					<UInput v-model="state.province" />
				</UFormField>

				<UFormField label="Zipcode">
					<UInput v-model="state.zipcode" />
				</UFormField>

				<!-- 🔹 Financial -->
				<UFormField label="Family Income">
					<UInput
						type="number"
						v-model="state.income"
					/>
				</UFormField>

				<UFormField label="GPA">
					<UInput
						type="number"
						step="0.01"
						v-model="state.gpa"
					/>
				</UFormField>

				<div class="flex justify-end gap-2">
					<UButton
						label="Cancel"
						color="neutral"
						@click="open = false"
					/>
					<UButton
						label="Save Changes"
						type="submit"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
