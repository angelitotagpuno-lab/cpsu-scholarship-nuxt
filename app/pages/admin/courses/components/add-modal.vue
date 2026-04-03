<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const toast = useToast();
const store = useCourseStore();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	name: z.string("Name is required"),
	abbreviation: z.string("Abbreviation is required"),
	major: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
	name: undefined,
	abbreviation: undefined,
	major: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.addCourse({
		name: event.data.name,
		abbreviation: event.data.abbreviation,
		major: event.data.major,
	});
	if (store.errorMessage) {
		toast.add({ title: "Error", description: store.errorMessage, color: "error" });
	} else {
		toast.add({ title: "Success", description: "Successfully added course", color: "success" });
	}
	emit("close", true);
}
</script>

<template>
	<UModal title="Add New Course">
		<template #body>
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UFormField
					label="Name"
					name="name"
				>
					<UInput
						v-model="state.name"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Abbreviation"
					name="abbreviation"
				>
					<UInput
						v-model="state.abbreviation"
						class="w-full"
					/>
				</UFormField>

				<UFormField
					label="Major"
					name="major"
				>
					<UInput
						v-model="state.major"
						class="w-full"
					/>
				</UFormField>
				<div class="flex justify-end">
					<UButton
						type="submit"
						:loading="store.isLoading"
					>
						Submit
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
