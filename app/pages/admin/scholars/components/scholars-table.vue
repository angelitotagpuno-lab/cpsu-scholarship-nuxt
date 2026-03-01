<script setup lang="ts">
import { h, resolveComponent } from "vue";
import type { TableColumn } from "@nuxt/ui";

type Scholar = {
	no: number;
	lastName: string;
	firstName: string;
	middleInitial: string;
};

const props = defineProps<{
	scholars: Scholar[];
	onRemove: (scholar: Scholar) => void;
}>();

const columns: TableColumn<Scholar>[] = [
	{ accessorKey: "no", header: "No.", size: 60 },
	{ accessorKey: "lastName", header: "Last Name" },
	{ accessorKey: "firstName", header: "First Name" },
	{ accessorKey: "middleInitial", header: "M.I.", size: 60 },
	{
		id: "actions",
		header: "Actions",
		size: 120,
		cell: ({ row }) => {
			const scholar = row.original;
			return h(
				"div",
				{ class: "flex justify-center" },
				h(resolveComponent("UButton"), {
					label: "Remove",
					size: "xs",
					color: "error",
					variant: "outline",
					onClick: () => props.onRemove(scholar),
				}),
			);
		},
	},
];
</script>

<template>
	<div class="border rounded-lg overflow-x-auto">
		<UTable
			:data="scholars"
			:columns="columns"
			class="min-w-[600px]"
		/>
	</div>
</template>
