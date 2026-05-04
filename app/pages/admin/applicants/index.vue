<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useApplicationStore } from "~/stores/application.store";
import type { Application } from "~/types/application";

definePageMeta({
	layout: "admin",
});

const store = useApplicationStore();

const selected = ref<Application | null>(null);
const showModal = ref(false);

const status = ref<Application["status"]>("pending");
const reason = ref<string>("");

onMounted(async () => {
	await store.fetchApplications();
});

function openView(item: Application) {
	selected.value = item;
	status.value = item.status;
	reason.value = item.reason ?? "";
	showModal.value = true;
}

async function updateApplication() {
	if (!selected.value) return;

	await store.updateStatus(selected.value.id, {
		status: status.value,
		reason: reason.value,
	});

	showModal.value = false;
	selected.value = null;
}

function getStatusColor(status: Application["status"]) {
	switch (status) {
		case "approved":
			return "green";
		case "rejected":
			return "red";
		case "under_review":
			return "yellow";
		case "pending":
		case "cancelled":
		default:
			return "gray";
	}
}

const columns = [
	{ id: "name", header: "Name" },
	{ id: "course", header: "Course" },
	{ id: "yearLevel", header: "Year Level" },
	{ id: "status", header: "Status" },
	{ id: "actions", header: "Actions" },
];
</script>

<template>
	<div class="p-6 space-y-6">
		<h1 class="text-xl font-bold">Applicants</h1>

		<UCard>
			<UTable
				:data="store.items ?? []"
				:columns="columns"
				:loading="store.isLoading"
			>
				<template #name-data="{ row }">
					{{ row.original.profile?.firstName ?? "-" }}
					{{ row.original.profile?.lastName ?? "-" }}
				</template>

				<template #course-data="{ row }">
					{{ row.original.profile?.courseId ?? "N/A" }}
				</template>

				<template #yearLevel-data="{ row }">
					{{ row.original.profile?.yearLevel ?? "N/A" }}
				</template>

				<template #status-data="{ row }">
					<UBadge :color="getStatusColor(row.original.status)">
						{{ row.original.status }}
					</UBadge>
				</template>

				<template #actions-data="{ row }">
					<UButton
						size="sm"
						color="primary"
						@click="openView(row.original)"
					>
						View
					</UButton>
				</template>
			</UTable>
		</UCard>

		<UModal v-model="showModal">
			<UCard v-if="selected">
				<div class="space-y-5">
					<h2 class="text-lg font-bold">Application Details</h2>

					<div class="space-y-1">
						<p><b>Name:</b> {{ selected.profile?.firstName }} {{ selected.profile?.lastName }}</p>
						<p><b>Birthdate:</b> {{ selected.profile?.birthdate }}</p>
						<p><b>Birthplace:</b> {{ selected.profile?.birthplace }}</p>
						<p><b>Contact:</b> {{ selected.profile?.contactNumber }}</p>
						<p><b>Sex:</b> {{ selected.profile?.sex }}</p>
						<p><b>Year Level:</b> {{ selected.profile?.yearLevel }}</p>
					</div>

					<div>
						<p class="font-semibold">Address</p>
						<p>
							{{ selected.profile?.address?.street }}, {{ selected.profile?.address?.barangay }},
							{{ selected.profile?.address?.city }}, {{ selected.profile?.address?.province }},
							{{ selected.profile?.address?.zipcode }}
						</p>
					</div>

					<div>
						<p class="font-semibold">Parents</p>

						<div
							v-for="(p, i) in selected.profile?.parents ?? []"
							:key="i"
							class="text-sm"
						>
							{{ p.type }}: {{ p.firstName }} {{ p.lastName }}
							<span class="text-gray-500">({{ p.status ?? "N/A" }})</span>
						</div>
					</div>

					<div v-if="selected.extraAnswers">
						<p class="font-semibold">Extra Answers</p>
						<pre class="text-xs bg-gray-100 p-2 rounded whitespace-pre-wrap"
							>{{ selected.extraAnswers }}
						</pre
						>
					</div>

					<div v-if="selected.documents?.length">
						<p class="font-semibold">Documents</p>
						<ul class="text-sm list-disc ml-5">
							<li
								v-for="(doc, i) in selected.documents"
								:key="i"
							>
								{{ doc?.name || doc?.fileName || "Document" }}
							</li>
						</ul>
					</div>

					<div class="space-y-2">
						<UFormField label="Status">
							<USelect
								v-model="status"
								:items="[
									{ label: 'Pending', value: 'pending' },
									{ label: 'Under Review', value: 'under_review' },
									{ label: 'Approved', value: 'approved' },
									{ label: 'Rejected', value: 'rejected' },
									{ label: 'Cancelled', value: 'cancelled' },
								]"
								option-attribute="label"
								value-attribute="value"
							/>
						</UFormField>

						<UFormField label="Reason">
							<UTextarea v-model="reason" />
						</UFormField>
					</div>

					<div class="flex justify-end gap-2">
						<UButton
							color="primary"
							@click="showModal = false"
						>
							Close
						</UButton>

						<UButton
							color="primary"
							@click="updateApplication"
						>
							Save
						</UButton>
					</div>
				</div>
			</UCard>
		</UModal>
	</div>
</template>
