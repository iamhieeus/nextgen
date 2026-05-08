export const FONT_SIZES = { sm: '15px', md: '17px', lg: '20px' } as const
export const LINE_HEIGHTS = { tight: '1.7', normal: '2', loose: '2.4' } as const

export type FontKey = keyof typeof FONT_SIZES
export type LhKey = keyof typeof LINE_HEIGHTS
