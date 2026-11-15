<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { CreatePersonnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const errorMessage = ref("");

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`).max(100);

const schema = z.object({
	email: z.email("Enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	firstName: requiredString("First name"),
	lastName: requiredString("Last name"),
	department: requiredString("Department"),
	position: requiredString("Position"),
	contactNumber: z.string().trim().max(50).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	email: "",
	password: "",
	firstName: "",
	lastName: "",
	department: "",
	position: "",
	contactNumber: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	const data = event.data;

	const payload: CreatePersonnel = {
		email: data.email.trim(),
		password: data.password,
		firstName: data.firstName.trim(),
		lastName: data.lastName.trim(),
		department: data.department.trim(),
		position: data.position.trim(),
		contactNumber: data.contactNumber?.trim() || null,
	};

	const success = await store.addPersonnel(payload);

	if (!success) {
		errorMessage.value = store.errorMessage || "Failed to add personnel";

		toast.add({
			title: "Error",
			description: errorMessage.value,
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
								Fill in the required details to add a personnel account.
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
								type="email"
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
								placeholder="Minimum 8 characters"
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
							label="Contact Number"
							name="contactNumber"
							class="sm:col-span-2"
						>
							<UInput
								v-model="state.contactNumber"
								class="w-full"
								size="lg"
								icon="i-lucide-phone"
								placeholder="+639171234567 (Optional)"
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
