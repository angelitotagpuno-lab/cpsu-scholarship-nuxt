<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { Course } from "~/types/course";

const toast = useToast();
const store = useCourseStore();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{
	data: Course;
}>();

const schema = z.object({
	name: z.string().trim().min(1, "Name is required"),
	abbreviation: z.string().trim().min(1, "Abbreviation is required"),
	major: z.string().trim().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	name: (props.data.name || "").capitalize(),
	abbreviation: (props.data.abbreviation || "").toUpperCase(),
	major: (props.data.major || "").capitalize(),
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.editCourse(props.data.id ?? "", {
		name: event.data.name.trim(),
		abbreviation: event.data.abbreviation.trim(),
		major: event.data.major?.trim() || "",
	});

	if (store.errorMessage) {
		toast.add({
			title: "Error",
			description: store.errorMessage,
			color: "error",
		});
	} else {
		toast.add({
			title: "Success",
			description: "Course updated successfully",
			color: "success",
		});
		emit("close", true);
	}
}
</script>

<template>
	<UModal title="Edit Course">
		<template #body>
			<div class="space-y-6">
				<!-- Header -->
				<div
					class="rounded-lg bg-blue-50 p-4 ring-1 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-blue-600 p-2 text-white">
							<UIcon
								name="i-lucide-pencil"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Update course record
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Edit the course name, abbreviation, or assigned major.
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
					<UFormField
						label="Name"
						name="name"
					>
						<UInput
							v-model="state.name"
							class="w-full"
							size="lg"
							icon="i-lucide-graduation-cap"
							placeholder="e.g. Bachelor of Science in Information Technology"
						/>
					</UFormField>

					<UFormField
						label="Abbreviation"
						name="abbreviation"
					>
						<UInput
							v-model="state.abbreviation"
							class="w-full"
							size="lg"
							icon="i-lucide-badge"
							placeholder="e.g. BSIT"
						/>
					</UFormField>

					<UFormField
						label="Major"
						name="major"
					>
						<UInput
							v-model="state.major"
							class="w-full"
							size="lg"
							icon="i-lucide-bookmark"
							placeholder="e.g. Web Development"
						/>
					</UFormField>

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
