<template>
	<div class="p-6 bg-gray-100 min-h-screen">
		<h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

		<!-- Analytics Cards -->
		<div class="grid md:grid-cols-3 gap-6 mb-8">
			<div class="bg-white p-6 rounded-xl shadow">
				<h2 class="text-gray-500">Total Applicants</h2>
				<p class="text-3xl font-bold text-green-700">120</p>
			</div>

			<div class="bg-white p-6 rounded-xl shadow">
				<h2 class="text-gray-500">Eligible Students</h2>
				<p class="text-3xl font-bold text-blue-600">45</p>
			</div>

			<div class="bg-white p-6 rounded-xl shadow">
				<h2 class="text-gray-500">Approved Scholars</h2>
				<p class="text-3xl font-bold text-purple-600">30</p>
			</div>
		</div>

		<!-- Ranking Table -->
		<div class="bg-white rounded-xl shadow p-6">
			<h2 class="text-xl font-bold mb-4">Scholarship Ranking</h2>

			<table class="w-full border">
				<thead class="bg-green-600 text-white">
					<tr>
						<th class="p-3">Rank</th>
						<th>Name</th>
						<th>GPA</th>
						<th>Income</th>
						<th>Eligibility %</th>
						<th>Actions</th>
					</tr>
				</thead>

				<tbody>
					<tr class="text-center border-b">
						<td>1</td>
						<td>Juan Dela Cruz</td>
						<td>1.5</td>
						<td>5000</td>
						<td class="text-green-600 font-bold">92%</td>

						<td>
							<button class="bg-green-500 text-white px-3 py-1 rounded mr-2">
								Approve
							</button>

							<button class="bg-red-500 text-white px-3 py-1 rounded">
								Reject
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
