<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const props = defineProps<{ data: any }>();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	studentId: z.string().min(1, "Student ID required"),
	fullName: z.string().min(1, "Full name required"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	studentId: props.data?.studentId ?? "",
	fullName: props.data?.fullName ?? "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	console.log("✏️ UPDATE:", event.data);

	// TODO API later
	emit("close", true);
}
</script>

<template>
	<UModal title="Edit Student ID">
		<template #body>
			<div class="space-y-6">
				<div
					class="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-blue-600 p-2 text-white">
							<UIcon
								name="i-lucide-edit"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold">Edit roster entry</h3>
							<p class="text-sm text-slate-500">Update student ID or full name</p>
						</div>
					</div>
				</div>

				<UForm
					:schema="schema"
					:state="state"
					class="space-y-5"
					@submit="onSubmit"
				>
					<UFormField
						label="Student ID"
						name="studentId"
					>
						<UInput
							v-model="state.studentId"
							class="w-full"
						/>
					</UFormField>

					<UFormField
						label="Full Name"
						name="fullName"
					>
						<UInput
							v-model="state.fullName"
							class="w-full"
						/>
					</UFormField>

					<div class="flex justify-end border-t pt-4">
						<UButton
							type="submit"
							color="primary"
						>
							Save Changes
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
