<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { Personnel, UpdatePersonnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{ data: Personnel }>();

const errorMessage = ref("");

const requiredString = (field: string) => z.string().trim().min(1, `${field} is required`).max(100);

const schema = z.object({
	firstName: requiredString("First name"),
	lastName: requiredString("Last name"),
	position: requiredString("Position"),
	department: requiredString("Department"),
	contactNumber: z.string().trim().max(50).optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	firstName: props.data.firstName,
	lastName: props.data.lastName,
	position: props.data.position,
	department: props.data.department,
	contactNumber: props.data.contactNumber || "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	errorMessage.value = "";

	const data = event.data;

	const payload: UpdatePersonnel = {
		firstName: data.firstName.trim(),
		lastName: data.lastName.trim(),
		position: data.position.trim(),
		department: data.department.trim(),
		contactNumber: data.contactNumber?.trim() || null,
	};

	const success = await store.editPersonnel(props.data.id, payload);

	if (!success) {
		errorMessage.value = store.errorMessage || "Failed to update personnel";

		toast.add({
			title: "Error",
			description: errorMessage.value,
			color: "error",
		});
		return;
	}

	toast.add({
		title: "Updated",
		description: "Personnel updated successfully",
		color: "success",
	});

	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Personnel">
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
								Update personnel account
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Edit personnel details, department, and position.
							</p>
						</div>
					</div>
				</div>

				<UAlert
					v-if="errorMessage"
					icon="i-lucide-circle-alert"
					color="error"
					variant="soft"
					title="Unable to update personnel"
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
								placeholder="Optional"
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
