<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`);

const schema = z.object({
	email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),

	first_name: requiredString("First name"),
	last_name: requiredString("Last name"),
	middle_name: z.string().trim().optional(),

	sex: z.enum(["male", "female"]),
	position: requiredString("Position"),
	department: requiredString("Department"),

	role: z.enum(["admin", "staff", "student"]), // ✅ FIXED
});
type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	email: "",
	password: "",
	first_name: "",
	last_name: "",
	middle_name: "",
	sex: "male",
	position: "",
	department: "",
	role: "staff",
});

const sexOptions = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const roleOptions = [
	{ label: "Admin", value: "admin" },
	{ label: "Staff", value: "staff" },
	{ label: "Student", value: "student" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	await store.addPersonnel(event.data);

	if (store.errorMessage) {
		errorMessage.value = store.errorMessage;

		toast.add({
			title: "Error",
			description: store.errorMessage,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Success",
		description: "Personnel added successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Add Personnel">
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
								Create personnel account
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Fill in the required details to add a personnel or admin user.
							</p>
						</div>
					</div>
				</div>
				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Unable to add personnel"
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
							label="Email"
							name="email"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.email"
								class="w-full"
								size="lg"
								icon="i-lucide-mail"
								placeholder="user@school.edu"
							/>
						</UFormField>

						<UFormField
							label="Password"
							name="password"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.password"
								class="w-full"
								size="lg"
								type="password"
								icon="i-lucide-lock"
								placeholder="Minimum 6 characters"
							/>
						</UFormField>

						<UFormField
							label="First Name"
							name="first_name"
						>
							<UInput
								v-model="state.first_name"
								class="w-full"
								size="lg"
								icon="i-lucide-user"
								placeholder="First name"
							/>
						</UFormField>

						<UFormField
							label="Last Name"
							name="last_name"
						>
							<UInput
								v-model="state.last_name"
								class="w-full"
								size="lg"
								icon="i-lucide-user"
								placeholder="Last name"
							/>
						</UFormField>

						<UFormField
							label="Middle Name"
							name="middle_name"
						>
							<UInput
								v-model="state.middle_name"
								class="w-full"
								size="lg"
								icon="i-lucide-user-round"
								placeholder="Optional"
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
							label="Position"
							name="position"
						>
							<UInput
								v-model="state.position"
								class="w-full"
								size="lg"
								icon="i-lucide-briefcase"
								placeholder="Instructor, Clerk, etc."
							/>
						</UFormField>

						<UFormField
							label="Department"
							name="department"
						>
							<UInput
								v-model="state.department"
								class="w-full"
								size="lg"
								icon="i-lucide-building-2"
								placeholder="IT, Registrar, etc."
							/>
						</UFormField>

						<UFormField
							label="Role"
							name="role"
							class="sm:col-span-2"
						>
							<USelect
								v-model="state.role"
								class="w-full"
								size="lg"
								:items="roleOptions"
								label-key="label"
								value-key="value"
								placeholder="Select role"
							/>
						</UFormField>
					</div>

					<div class="flex justify-end border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							type="submit"
							:loading="store.isLoading"
							icon="i-lucide-save"
							color="primary"
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Save Personnel
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
