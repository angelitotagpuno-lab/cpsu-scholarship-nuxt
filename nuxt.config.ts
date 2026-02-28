export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@nuxt/icon", "@nuxt/image"],
	devtools: { enabled: true },

	css: ["~/assets/css/main.css"],
	runtimeConfig: {
		supabaseUrl: process.env.NUXT_SUPABASE_URL,
		supabaseKey: process.env.NUXT_SUPABASE_PUBLISHABLE_KEY,
	},
	compatibilityDate: "2025-07-15",
	eslint: {
		config: {
			stylistic: true,
		},
	},
});
