import pluginJs from '@eslint/js'
import pluginAstro from 'eslint-plugin-astro'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		files: ['@(src|scripts)/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
	},
	{
		languageOptions: {
			globals: globals.browser,
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	...pluginAstro.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		rules: {
			...pluginReact.configs.flat.recommended.rules,
			'react/react-in-jsx-scope': 'off',
			'react/jsx-sort-props': [
				'warn',
				{
					callbacksLast: true,
					ignoreCase: true,
					multiline: 'last',
					shorthandLast: true,
				},
			],
		},
	},
	{
		files: ['@(src|scripts)/**/*.astro'],
		rules: {
			'react/no-unknown-property': ['off'],
		},
	},
]
