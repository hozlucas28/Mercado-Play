import { includeIgnoreFile } from '@eslint/compat'
import pluginJs from '@eslint/js'
import pluginAstro from 'eslint-plugin-astro'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import globals from 'globals'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitIgnorePath = path.resolve(__dirname, '.gitignore')

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
	includeIgnoreFile(gitIgnorePath),
	{
		files: ['@(src|scripts)/**/*.{js,mjs,cjs,ts,astro,jsx,tsx}'],
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},

		rules: {
			'no-undef': 'off',
		},
	},
	...pluginAstro.configs.recommended,
	{
		rules: {
			'astro/sort-attributes': [
				'warn',
				{
					type: 'alphabetical',
					order: 'asc',
					ignoreCase: false,
				},
			],
		},
	},
	pluginReact.configs.flat.recommended,
	{
		rules: {
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
		},

		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		files: ['@(src|scripts)/**/*.astro'],
		rules: {
			'react/no-unknown-property': 'off',
		},
	},
])
