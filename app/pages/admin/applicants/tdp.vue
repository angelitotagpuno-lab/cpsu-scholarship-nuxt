<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { useApplicationStore } from "~/stores/application.store";

definePageMeta({ layout: "admin" });

const store = useApplicationStore();

onMounted(() => {
	store.getApplications();
});

const columns: TableColumn<any>[] = [
	{ accessorKey: "studentId", header: "Student ID" },
	{ accessorKey: "offeringId", header: "Offering ID" },

	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const s = (row.getValue("status") as string | undefined)?.toUpperCase() ?? "UNKNOWN";

			return h(
				"span",
				{
					class:
						s === "APPROVED"
							? "text-green-600"
							: s === "REJECTED"
								? "text-red-600"
								: s === "PENDING"
									? "text-yellow-600"
									: "text-slate-500",
				},
				s,
			);
		},
	},

	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const a = row.original;

			return h("div", { class: "flex gap-2" }, [
				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "success",
						onClick: () => store.updateStatus(a.id, { status: "approved" }),
					},
					() => "Approve",
				),

				h(
					resolveComponent("UButton"),
					{
						size: "sm",
						color: "error",
						onClick: () =>
							store.updateStatus(a.id, {
								status: "rejected",
								reason: "Not qualified",
							}),
					},
					() => "Reject",
				),
			]);
		},
	},
];
</script>

<template>
	<div class="p-6">
		<h1 class="text-2xl font-bold mb-4">Applications</h1>

		<UTable
			:data="store.items"
			:columns="columns"
			:loading="store.isLoading"
		/>
	</div>
</template>
