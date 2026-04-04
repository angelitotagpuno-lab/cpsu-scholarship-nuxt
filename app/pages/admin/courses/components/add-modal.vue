<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { Course } from "~/types/course";

const toast = useToast();
const store = useCourseStore();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{
	isEdit?: boolean;
	data?: Course;
}>();

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

watch(
	() => props.data,
	(val) => {
		if (val) {
			state.name = val.name;
			state.abbreviation = val.abbreviation;
			state.major = val.major || "";
		}
	},
	{ immediate: true },
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
	try {
		if (props.isEdit && props.data?.id) {
			await store.editCourse(props.data.id, {
				name: event.data.name,
				abbreviation: event.data.abbreviation,
				major: event.data.major,
			});

			toast.add({
				title: "Success",
				description: "Course updated successfully",
				color: "success",
			});
		} else {
			await store.addCourse({
				name: event.data.name,
				abbreviation: event.data.abbreviation,
				major: event.data.major,
			});

			toast.add({
				title: "Success",
				description: "Successfully added course",
				color: "success",
			});
		}

		if (emit) {
			emit("close", true);
		}
	} catch (error: unknown) {
		console.error(error);

		const message =
			error instanceof Error ? error.message : store.errorMessage || "Something went wrong";

		toast.add({
			title: "Error",
			description: message,
			color: "error",
		});
	}
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
