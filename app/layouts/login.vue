<script setup lang="ts"></script>

<template>
	<div class="flex flex-col min-h-screen">
		<!-- Header -->
		<UHeader toggle-side="left">
			<template #title>
				<div class="flex items-center gap-2">
					<span class="font-semibold">CPSU Scholarship</span>
				</div>
			</template>

			<template #right>
				<UColorModeButton />
			</template>
		</UHeader>

		<!-- Page Content -->
		<main class="flex-1">
			<slot />
		</main>

		<LoginFooter />
	</div>
</template>
