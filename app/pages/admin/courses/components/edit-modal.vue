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
	name: z.string(),
	abbreviation: z.string(),
	major: z.string().optional(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	name: (props.data.name || "").capitalize(),
	abbreviation: (props.data.abbreviation || "").toUpperCase(),
	major: (props.data.major || "").capitalize(),
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.editCourse(props.data.id!, event.data);

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
						Update
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
