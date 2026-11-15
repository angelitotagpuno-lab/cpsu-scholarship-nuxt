export default defineNuxtConfig({
	modules: ["@nuxt/ui", "@nuxt/eslint", "@pinia/nuxt", "@nuxt/icon", "@nuxt/image"],

	ssr: false,

	devtools: { enabled: true },

	css: ["~/assets/css/main.css"],

	runtimeConfig: {
		apiOrigin:
			process.env.NUXT_BASE_URL || "https://cpsu-scholarship-api-staging.tagpuno619.workers.dev",

		public: {
			baseUrl: "/proxy",
		},
	},

	routeRules: {
		"/proxy/**": {
			proxy: `${
				process.env.NUXT_BASE_URL || "https://cpsu-scholarship-api-staging.tagpuno619.workers.dev"
			}/**`,
		},
	},

	compatibilityDate: "2025-07-15",

	eslint: {
		config: {
			stylistic: true,
		},
	},
});
