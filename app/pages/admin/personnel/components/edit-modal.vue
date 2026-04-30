<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import z from "zod";
import type { Personnel } from "~/types/personnel";

const store = usePersonnelStore();
const toast = useToast();
const emit = defineEmits<{ close: [boolean] }>();

const props = defineProps<{ data: Personnel }>();

const schema = z.object({
	email: z.string().email(),
	password: z.string().optional(),

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
	email: props.data.email || "",
	password: "",

	first_name: props.data.first_name || "",
	last_name: props.data.last_name || "",
	middle_name: props.data.middle_name || "",

	sex: props.data.sex || "male",
	position: props.data.position || "",
	department: props.data.department || "",
	role: props.data.role || "staff",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
	if (!props.data.id) return;

	const d = event.data;

	const payload: any = {
		email: d.email,
		first_name: d.first_name,
		last_name: d.last_name,
		middle_name: d.middle_name || null,
		sex: d.sex,
		position: d.position,
		department: d.department,
		role: d.role,
	};

	// only send password if not empty
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
			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4"
				@submit="onSubmit"
			>
				<UInput v-model="state.email" />
				<UInput
					v-model="state.password"
					type="password"
					placeholder="New Password (optional)"
				/>
				<UInput v-model="state.first_name" />
				<UInput v-model="state.last_name" />
				<UInput v-model="state.middle_name" />
				<USelect
					v-model="state.sex"
					:options="['male', 'female']"
				/>
				<UInput v-model="state.position" />
				<UInput v-model="state.department" />
				<USelect
					v-model="state.role"
					:options="['admin', 'staff']"
				/>

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
