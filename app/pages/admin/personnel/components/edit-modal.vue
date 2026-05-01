<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { Personnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{ data: Personnel }>();

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`);

const schema = z.object({
	email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
	password: z.string().optional(),

	first_name: requiredString("First name"),
	last_name: requiredString("Last name"),
	middle_name: z.string().trim().optional(),

	sex: z.enum(["male", "female"]),
	position: requiredString("Position"),
	department: requiredString("Department"),
	role: z.enum(["admin", "personnel"]),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	email: props.data.email || "",
	password: "",

	first_name: props.data.first_name || "",
	last_name: props.data.last_name || "",
	middle_name: props.data.middle_name || "",

	sex: props.data.sex || "male",
	position: props.data.position || "",
	department: props.data.department || "",
	role: props.data.role === "admin" ? "admin" : "personnel",
});

const sexOptions = [
	{ label: "Male", value: "male" },
	{ label: "Female", value: "female" },
];

const roleOptions = [
	{ label: "Admin", value: "admin" },
	{ label: "Personnel", value: "personnel" },
	{ label: "Student", value: "student" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (!props.data.id) return;

	const d = event.data;

	const payload: any = {
		email: d.email.trim(),
		first_name: d.first_name.trim(),
		last_name: d.last_name.trim(),
		middle_name: d.middle_name?.trim() || null,
		sex: d.sex,
		position: d.position.trim(),
		department: d.department.trim(),
		role: d.role,
	};

	if (d.password && d.password.trim() !== "") {
		payload.password = d.password;
	}

	try {
		console.log("PAYLOAD:", payload);
		await store.editPersonnel(props.data.id, payload);

		if (store.errorMessage) {
			toast.add({
				title: "Error",
				description: store.errorMessage,
				color: "error",
			});
		} else {
			toast.add({
				title: "Updated",
				color: "success",
			});
			emit("close", true);
		}
	} catch (err) {
		console.error("UPDATE FAILED:", err);
		toast.add({
			title: "Request Failed",
			description: "Check console or backend validation",
			color: "error",
		});
	}
}
</script>

<template>
	<UModal title="Edit Personnel">
		<template #body>
			<div class="space-y-6">
				<!-- Header -->
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
								Update personnel account
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Edit account details, department, position, and role.
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
							label="New Password"
							name="password"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.password"
								class="w-full"
								size="lg"
								type="password"
								icon="i-lucide-lock"
								placeholder="Leave blank to keep current password"
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
							class="bg-blue-600 hover:bg-blue-700"
						>
							Update
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
