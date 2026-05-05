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

function getStatusColor(status: string) {
	switch (status) {
		case "approved":
			return "success";

		case "rejected":
			return "error";

		case "under_review":
			return "warning"; // ❗ replace yellow

		case "pending":
		case "cancelled":
		default:
			return "neutral";
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
	<div class="h-full space-y-6 overflow-y-auto bg-slate-50 p-6 dark:bg-slate-950">
		<!-- PAGE HEADER -->
		<div
			class="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
		>
			<div class="flex items-center gap-3">
				<UDashboardSidebarCollapse />

				<div>
					<h1 class="text-xl font-bold text-slate-900 dark:text-white">Applicants</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						View and manage scholarship applications
					</p>
				</div>
			</div>
		</div>

		<!-- TABLE CARD (same structure style as Scholars page, NO extra cards added) -->
		<UCard class="bg-white shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
			<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="font-semibold text-slate-900 dark:text-white">Application List</h2>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						TDP and TES applicants with status tracking
					</p>
				</div>
			</div>

			<div class="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
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
							variant="soft"
							@click="openView(row.original)"
						>
							View
						</UButton>
					</template>
				</UTable>
			</div>
		</UCard>

		<!-- MODAL (UNCHANGED FUNCTIONALITY) -->
		<UModal v-model="showModal">
			<UCard v-if="selected">
				<div class="space-y-5">
					<h2 class="text-lg font-bold text-slate-900 dark:text-white">Application Details</h2>

					<div class="space-y-1 text-sm text-slate-700 dark:text-slate-300">
						<p><b>Name:</b> {{ selected.profile?.firstName }} {{ selected.profile?.lastName }}</p>
						<p><b>Birthdate:</b> {{ selected.profile?.birthdate }}</p>
						<p><b>Birthplace:</b> {{ selected.profile?.birthplace }}</p>
						<p><b>Contact:</b> {{ selected.profile?.contactNumber }}</p>
						<p><b>Sex:</b> {{ selected.profile?.sex }}</p>
						<p><b>Year Level:</b> {{ selected.profile?.yearLevel }}</p>
					</div>

					<div>
						<p class="font-semibold text-slate-900 dark:text-white">Address</p>
						<p class="text-sm text-slate-600 dark:text-slate-300">
							{{ selected.profile?.address?.street }}, {{ selected.profile?.address?.barangay }},
							{{ selected.profile?.address?.city }}, {{ selected.profile?.address?.province }},
							{{ selected.profile?.address?.zipcode }}
						</p>
					</div>

					<div>
						<p class="font-semibold text-slate-900 dark:text-white">Parents</p>

						<div
							v-for="(p, i) in selected.profile?.parents ?? []"
							:key="i"
							class="text-sm text-slate-600 dark:text-slate-300"
						>
							{{ p.type }}: {{ p.firstName }} {{ p.lastName }}
							<span class="text-gray-500">({{ p.status ?? "N/A" }})</span>
						</div>
					</div>

					<div v-if="selected.extraAnswers">
						<p class="font-semibold text-slate-900 dark:text-white">Extra Answers</p>
						<pre class="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded whitespace-pre-wrap">
							{{ selected.extraAnswers }}
						</pre
						>
					</div>

					<div v-if="selected.documents?.length">
						<p class="font-semibold text-slate-900 dark:text-white">Documents</p>
						<ul class="text-sm list-disc ml-5 text-slate-600 dark:text-slate-300">
							<li
								v-for="(doc, i) in selected.documents"
								:key="i"
							>
								{{ doc?.name || doc?.fileName || "Document" }}
							</li>
						</ul>
					</div>

					<div class="space-y-2 pt-2">
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

					<div class="flex justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
						<UButton
							variant="soft"
							color="neutral"
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
