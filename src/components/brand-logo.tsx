import { BRAND_NAME } from '@/constants'

interface BrandLogoProps extends Omit<React.ComponentProps<'img'>, 'src' | 'alt' | 'loading' | 'referrerPolicy'> {}

function BrandLogo({ ...props }: BrandLogoProps) {
	return (
		<picture {...props}>
			<source srcSet='brand-logo.webp' type='image/webp' />
			<img
				src='brand-logo.png'
				alt={`Logo de ${BRAND_NAME}.`}
				loading='eager'
				referrerPolicy='no-referrer'
				{...props}
			/>
		</picture>
	)
}

export type { BrandLogoProps }

export default BrandLogo
