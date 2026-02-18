<template>
	<UTable :data="applicants" :columns="columns" sticky class="w-full h-[600px]" />
</template>

<script
	setup
	lang="ts"
>
	definePageMeta({
		layout: 'admin' // <-- Use the admin layout
	})

	import { ref } from 'vue'
	import type { TableColumn } from '@nuxt/ui'

	type Applicant = {
		id: number
		name: string
		email: string
		income: number
		gpa: number
		eligibility: string
	}

	const applicants = ref<Applicant[]>([
		{ id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', income: 20000, gpa: 3.75, eligibility: 'Eligible' },
		{ id: 2, name: 'Maria Santos', email: 'maria@example.com', income: 15000, gpa: 3.90, eligibility: 'Eligible' },
		{ id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', income: 10000, gpa: 2.80, eligibility: 'Not Eligible' }
	])

	const columns: TableColumn<Applicant>[] = [
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'email', header: 'Email' },
		{ accessorKey: 'income', header: 'Income' },
		{ accessorKey: 'gpa', header: 'GPA' },
		{ accessorKey: 'eligibility', header: 'Eligibility' }
	]
</script>
