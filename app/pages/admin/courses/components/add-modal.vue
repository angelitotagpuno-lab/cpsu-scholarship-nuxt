<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = useCourseStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	name: z.string("Name is required"),
	abbreviation: z.string("Abbreviation is required"),
	major: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	name: "",
	abbreviation: "",
	major: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.addCourse(event.data);

	if (store.errorMessage) {
		toast.add({
			title: "Error",
			description: store.errorMessage,
			color: "error",
		});
	} else {
		toast.add({
			title: "Success",
			description: "Course added successfully",
			color: "success",
		});
		emit("close", true);
	}
}
</script>

<template>
	<UModal title="Add New Course">
		<template #body>
			<div class="space-y-6">
				<!-- Header -->
				<div
					class="rounded-lg bg-emerald-50 p-4 ring-1 ring-emerald-100 dark:bg-emerald-950/30 dark:ring-emerald-900"
				>
					<div class="flex items-start gap-3">
						<div class="rounded-md bg-emerald-600 p-2 text-white">
							<UIcon
								name="i-lucide-book-open"
								class="size-5"
							/>
						</div>

						<div>
							<h3 class="text-base font-semibold text-slate-900 dark:text-white">
								Create course record
							</h3>
							<p class="text-sm text-slate-500 dark:text-slate-400">
								Add a new course with its abbreviation and optional major.
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
							class="bg-emerald-600 hover:bg-emerald-700"
						>
							Submit
						</UButton>
					</div>
				</UForm>
			</div>
		</template>
	</UModal>
</template>
