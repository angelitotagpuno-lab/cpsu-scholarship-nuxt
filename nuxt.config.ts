export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@nuxt/icon"],
	devtools: { enabled: true },

	css: ["~/assets/css/main.css"],
	compatibilityDate: "2025-07-15",
	eslint: {
		config: {
			stylistic: true,
		},
	},
});
