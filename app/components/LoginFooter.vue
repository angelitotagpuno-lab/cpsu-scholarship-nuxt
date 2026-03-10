<script setup lang="ts"></script>

<template>
	<UFooter class="border-t border-gray-200 dark:border-gray-700 mt-8">
		<template #left>
			<p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
		</template>

		<template #right>
			<UButton
				icon="i-simple-icons-discord"
				color="neutral"
				variant="ghost"
				to="https://go.nuxt.com/discord"
				target="_blank"
				aria-label="Discord"
			/>
			<UButton
				icon="i-simple-icons-x"
				color="neutral"
				variant="ghost"
				to="https://go.nuxt.com/x"
				target="_blank"
				aria-label="X"
			/>
			<UButton
				icon="i-simple-icons-github"
				color="neutral"
				variant="ghost"
				to="https://github.com/nuxt/nuxt"
				target="_blank"
				aria-label="GitHub"
			/>
		</template>
	</UFooter>
</template>
