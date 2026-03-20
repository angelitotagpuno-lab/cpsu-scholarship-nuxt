<script setup lang="ts">
import { useTdpScholarFormStore } from "~/stores/TdpScholarForm.store";

const formStore = useTdpScholarFormStore();
</script>

<template>
	<div class="space-y-4">
		<h3 class="text-white font-semibold mb-4">Requirements</h3>

		<div class="space-y-3">
			<UFormField label="COR / COE">
				<UInput
					type="file"
					@change="(e) => (formStore.requirements.corCoe = e.target.files?.[0] || null)"
				/>
			</UFormField>

			<UFormField label="Certificate of Indigency">
				<UInput
					type="file"
					@change="
						(e) => (formStore.requirements.certificateOfIndigency = e.target.files?.[0] || null)
					"
				/>
			</UFormField>
		</div>
	</div>
</template>
