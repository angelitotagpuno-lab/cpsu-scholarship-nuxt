<template>
	<div class="min-h-screen bg-gray-100">
		<!-- NAVBAR -->
		<nav class="bg-green-700 text-white shadow">
			<div class="container mx-auto flex justify-between items-center p-4">
				<!-- Logo / Title -->
				<h1 class="text-xl font-bold">CPSU Scholarship System</h1>

				<!-- Navigation Buttons -->
				<div class="space-x-4">
					<!-- Dashboard Button -->
					<NuxtLink
						to="/scholars"
						class="bg-white text-green-700 px-4 py-2 rounded hover:bg-gray-200">
						Dashboard
					</NuxtLink>

					<!-- Login Button -->
					<NuxtLink
						to="/admin/dashboard"
						class="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300">
						Login
					</NuxtLink>
				</div>
			</div>
		</nav>

		<!-- HERO / CONTENT -->
		<section class="text-center py-20">
			<h2 class="text-4xl font-bold mb-4">Automated Scholarship Eligibility</h2>

			<p class="text-gray-600">CPSU San Carlos Campus</p>
		</section>
	</div>
</template>
