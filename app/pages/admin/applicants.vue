<template>
	<div>Approved Applicants from the ADMIN's Perspective</div>
</template>
<script
	setup
	lang="ts"
>
	definePageMeta({
		layout: 'admin' // <-- Uses the admin layout
	})

	import { ref } from 'vue'

	const value = ref<File[]>([])
</script>