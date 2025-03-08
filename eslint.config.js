import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['@(src|scripts)/**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
	{ languageOptions: { globals: globals.browser } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		...pluginReact.configs.flat.recommended,
		rules: {
			...pluginReact.configs.flat.recommended.rules,
			'react/jsx-sort-props': [
				'warn',
				{
					callbacksLast: true,
					ignoreCase: true,
					multiline: 'last',
					shorthandLast: true,
				},
			],
			'react/react-in-jsx-scope': 'off',
		},
	},
]
