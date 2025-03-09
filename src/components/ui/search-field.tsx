import { IconSearch, IconX } from 'justd-icons'
import {
	SearchField as SearchFieldPrimitive,
	type SearchFieldProps as SearchFieldPrimitiveProps,
	type ValidationResult,
} from 'react-aria-components'
import { tv } from 'tailwind-variants'

import { Button } from './button'
import { Description, FieldError, FieldGroup, Input, Label } from './field'
import { Loader } from './loader'
import { ctr } from './primitive'

const searchFieldStyles = tv({
	slots: {
		base: 'group flex min-w-10 flex-col gap-y-1.5',
		searchIcon:
			'ml-2.5 size-4 shrink-0 text-muted-fg group-disabled:text-muted-fg forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]',
		clearButton: [
			'mr-1 size-8 text-muted-fg group-empty:invisible hover:bg-transparent hover:text-fg pressed:bg-transparent pressed:text-fg',
		],
		input: '[&::-webkit-search-cancel-button]:hidden',
	},
})

const { base, searchIcon, clearButton, input } = searchFieldStyles()

interface SearchFieldProps extends SearchFieldPrimitiveProps {
	label?: string
	placeholder?: string
	description?: string
	errorMessage?: string | ((validation: ValidationResult) => string)
	isPending?: boolean
}

const SearchField = ({
	className,
	placeholder,
	label,
	description,
	errorMessage,
	isPending,
	...props
}: SearchFieldProps) => {
	return (
		<SearchFieldPrimitive
			aria-label={placeholder ?? props['aria-label'] ?? 'Search...'}
			{...props}
			className={ctr(className, base())}
		>
			{label && <Label>{label}</Label>}
			<FieldGroup>
				<IconSearch
					aria-hidden
					className={searchIcon()}
				/>
				<Input
					className={input()}
					placeholder={placeholder ?? 'Search...'}
				/>
				{isPending ? (
					<Loader
						className='mr-2.5'
						variant='spin'
					/>
				) : (
					<Button
						appearance='plain'
						className={clearButton()}
						size='square-petite'
					>
						<IconX aria-hidden />
					</Button>
				)}
			</FieldGroup>
			{description && <Description>{description}</Description>}
			<FieldError>{errorMessage}</FieldError>
		</SearchFieldPrimitive>
	)
}

export { SearchField, type SearchFieldProps }
