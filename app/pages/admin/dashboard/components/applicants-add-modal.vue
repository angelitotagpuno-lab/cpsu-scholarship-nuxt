<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { ref, reactive } from "vue";

const open = ref(false);

const schema = z.object({
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

	// Reset form
	Object.keys(state).forEach((key) => {
		(state as any)[key] =
			key === "sex" ? "MALE" : key === "yearLevel" ? 1 : key === "income" || key === "gpa" ? 0 : "";
	});
}
</script>

<template>
	<UModal
		v-model:open="open"
		title="New Applicant"
		description="Add a new applicant to the database"
	>
		<UButton
			label="New applicant"
			icon="i-lucide-plus"
		/>

		<template #body>
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Last Name"
					name="lastName"
				>
					<UInput
						v-model="state.lastName"
						class="w-full"
						placeholder="Last Name"
					/>
				</UFormField>

				<UFormField
					label="First Name"
					name="firstName"
				>
					<UInput
						v-model="state.firstName"
						class="w-full"
						placeholder="First Name"
					/>
				</UFormField>

				<UFormField
					label="Middle Name"
					name="middleName"
				>
					<UInput
						v-model="state.middleName"
						class="w-full"
						placeholder="Middle Name"
					/>
				</UFormField>

				<UFormField
					label="Ext Name"
					name="extName"
				>
					<UInput
						v-model="state.extName"
						class="w-full"
						placeholder="Jr., Sr., etc."
					/>
				</UFormField>

				<UFormField
					label="Sex"
					name="sex"
				>
					<USelect
						v-model="state.sex"
						:options="['MALE', 'FEMALE']"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Course"
					name="course"
				>
					<UInput
						v-model="state.course"
						class="w-full"
						placeholder="Course"
					/>
				</UFormField>

				<UFormField
					label="Year Level"
					name="yearLevel"
				>
					<UInput
						v-model="state.yearLevel"
						type="number"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Contact Number"
					name="contactNo"
				>
					<UInput
						v-model="state.contactNo"
						class="w-full"
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
						placeholder="Zipcode"
					/>
				</UFormField>

				<UFormField
					label="Income"
					name="income"
				>
					<UInput
						v-model="state.income"
						type="number"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="GPA"
					name="gpa"
				>
					<UInput
						v-model="state.gpa"
						type="number"
						step="0.01"
						class="w-full"
					/>
				</UFormField>

				<div class="flex justify-end gap-2">
					<UButton
						label="Cancel"
						color="neutral"
						variant="subtle"
						@click="open = false"
					/>
					<UButton
						label="Create"
						color="primary"
						variant="solid"
						type="submit"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
