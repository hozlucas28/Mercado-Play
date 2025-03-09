import { BRAND_NAME } from '@/constants'

interface BrandLogoProps
	extends Omit<
		React.ComponentProps<'img'>,
		'src' | 'alt' | 'loading' | 'referrerPolicy'
	> {}

function BrandLogo({ ...props }: BrandLogoProps) {
	return (
		<picture {...props}>
			<source
				srcSet='brand-logo.webp'
				type='image/webp'
			/>
			<img
				alt={`Logo de ${BRAND_NAME}.`}
				loading='eager'
				referrerPolicy='no-referrer'
				src='brand-logo.png'
				{...props}
			/>
		</picture>
	)
}

export type { BrandLogoProps }

export default BrandLogo
