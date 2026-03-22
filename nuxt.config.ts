export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@nuxt/icon", "@nuxt/image"],
	ssr: false,
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		baseUrl: process.env.NUXT_BASE_URL,
	},
	compatibilityDate: "2025-07-15",
	eslint: {
		config: {
			stylistic: true,
		},
	},
});
