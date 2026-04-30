<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const schema = z.object({
	email: z.string().email(),
	password: z.string().min(6),

	first_name: z.string(),
	last_name: z.string(),
	middle_name: z.string().optional(),

	sex: z.enum(["male", "female"]),
	position: z.string(),
	department: z.string(),
	role: z.enum(["admin", "staff"]),
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

async function onSubmit(event: FormSubmitEvent<Schema>) {
	await store.addPersonnel(event.data);

	if (store.errorMessage) {
		toast.add({ title: "Error", description: store.errorMessage, color: "error" });
	} else {
		toast.add({ title: "Success", description: "Added", color: "success" });
		emit("close", true);
	}
}
</script>

<template>
	<UModal title="Add Personnel">
		<template #body>
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UInput
					v-model="state.email"
					placeholder="Email"
				/>
				<UInput
					v-model="state.password"
					type="password"
					placeholder="Password"
				/>
				<UInput
					v-model="state.first_name"
					placeholder="Last Name"
				/>
				<UInput
					v-model="state.last_name"
					placeholder="Last Name"
				/>
				<UInput
					v-model="state.middle_name"
					placeholder="Middle Name"
				/>
				<USelect
					v-model="state.sex"
					:options="['male', 'female']"
				/>
				<UInput
					v-model="state.position"
					placeholder="Position"
				/>
				<UInput
					v-model="state.department"
					placeholder="Department"
				/>
				<USelect
					v-model="state.role"
					:options="['admin', 'staff']"
				/>

				<div class="flex justify-end">
					<UButton
						type="submit"
						:loading="store.isLoading"
					>
						Save
					</UButton>
				</div>
			</UForm>
		</template>
	</UModal>
</template>
