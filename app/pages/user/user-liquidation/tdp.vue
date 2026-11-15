<script setup lang="ts">
import StudentPayoutPortal from "~/components/StudentPayoutPortal.vue";

definePageMeta({
	layout: "user-header",
});
</script>

<template>
	<StudentPayoutPortal program="TDP" />
	<LoginFooter />
</template>
