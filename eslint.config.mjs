// eslint.config.mjs
// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt([
	// 2️⃣ Disable stylistic rules (GLOBAL override)
	{
		rules: {
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
			// "@typescript-eslint/consistent-type-imports": "off",

			// stylistic
			"@stylistic/no-tabs": "off",
			"@stylistic/semi": "off",
			"@stylistic/indent": "off",
			"@stylistic/brace-style": "off",
			"@stylistic/operator-linebreak": "off",
			"@stylistic/indent-binary-ops": "off",
			"@stylistic/arrow-parens": "off",
			"@stylistic/quote-props": "off",
			"@stylistic/quotes": "off",
			"@stylistic/member-delimiter-style": "off",

			// vue
			"vue/html-indent": "off",
			"vue/no-multiple-template-root": "off",
			"vue/attribute-hyphenation": "off",
			"vue/v-on-event-hyphenation": "off",
			"vue/html-self-closing": "off",
			"vue/singleline-html-element-content-newline": "off",
		},
	},
]);
