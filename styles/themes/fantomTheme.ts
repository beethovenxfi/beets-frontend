import { ChakraTheme } from '@chakra-ui/theme';

export const fantomTheme: Partial<ChakraTheme> = {
    styles: {
        global: {
            html: {
                background:
                    'radial-gradient(ellipse at top, #030622a8, #000004), radial-gradient(ellipse at bottom, #000004, #000004) !important',
            },
            body: {
                color: '#C1C1D1',
                background:
                    'radial-gradient(ellipse at top, #111111, #020202), radial-gradient(ellipse at bottom, #020202, #020202) !important',
            },
            '.bg': {
                background: `radial-gradient(ellipse at top, rgba(18, 14, 68, 1) 10%, transparent 80%),
                             radial-gradient(ellipse at bottom, rgba(18, 14, 68, 1) 10%, transparent 80%) !important`,
            },
        },
    },
    fonts: {
        heading: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        body: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
    },
    textStyles: {
        h1: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['3.0rem'],
            lineHeight: '100%',
            fontWeight: 'bold',
            letterSpacing: '-0.1rem',
        },
        h2: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['2.7rem'],
            fontWeight: '300',
            lineHeight: '100%',
            letterSpacing: '-0.1rem',
        },
        h3: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['1.8rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.05rem',
        },
        h4: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['1.8rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.05rem',
        },
        h5: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['1.5rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.03rem',
        },
        h6: {
            fontFamily: `'Gotham', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
            fontSize: ['1.2rem'],
            fontWeight: '300',
            lineHeight: '115%',
            letterSpacing: '-0.03rem',
        },
    },
    colors: {
        gray: {
            '100': '#C1C1D1',
            '200': '#828291',
            '300': '#54546C',
            '400': '#33334A',
            '500': '#212138',
            '600': '#141423',
            '700': '#10101E',
            '800': '#090911',
        },
        box: {
            '300': 'rgba(27,20,100,0.25)',
            '500': 'rgba(255,255,255,0.05)',
        },
        beets: {
            green: '#00F89C',
            red: '#FF0000',
            highlight: '#00FFFF',
            base: {
                '50': '#C3C5E9',
                '100': '#8F93D6',
                '200': '#585FC6',
                '300': '#3D3FA9',
                '400': '#292985',
                '500': '#1B1464',
                '600': '#1B1464',
                '700': '#100A49',
                '800': '#0B0737',
                '900': '#030024',
            },
            light: 'rgba(46,49,146, 1.0)',
            lightAlpha: {
                '50': 'rgba(46,49,146, 0.05)',
                '100': 'rgba(46,49,146, 0.1)',
                '200': 'rgba(46,49,146, 0.2)',
                '300': 'rgba(46,49,146, 0.3)',
                '500': 'rgba(46,49,146, 0.5)',
            },
            greenAlpha: {
                '50': 'rgba(0,248,156, 0.05)',
                '100': 'rgba(0,248,156, 0.1)',
                '200': 'rgba(0,248,156, 0.2)',
                '300': 'rgba(0,248,156, 0.3)',
                '400': 'rgba(0,248,156, 0.4)',
                '500': 'rgba(0,248,156, 0.5)',
                '600': 'rgba(0,248,156, 0.6)',
                '700': 'rgba(0,248,156, 0.7)',
                '800': 'rgba(0,248,156, 0.8)',
                '900': 'rgba(0,248,156, 0.9)',
            },
            highlightAlpha: {
                '50': 'rgba(0, 255, 255, 0.05)',
                '100': 'rgba(0, 255, 255, 0.1)',
                '200': 'rgba(0, 255, 255, 0.2)',
                '300': 'rgba(0, 255, 255, 0.3)',
                '400': 'rgba(0, 255, 255, 0.4)',
                '500': 'rgba(0, 255, 255, 0.5)',
                '600': 'rgba(0, 255, 255, 0.6)',
                '700': 'rgba(0, 255, 255, 0.7)',
                '800': 'rgba(0, 255, 255, 0.8)',
                '900': 'rgba(0, 255, 255, 0.9)',
            },
        },
        fmoney: {
            green: {
                '100': '#60e8a0',
                '400': '#51be84',
            },
        },
    },
    components: {
        Select: {
            parts: ['field'],
            variants: {
                filled: {
                    field: {
                        color: 'white',
                        bgColor: 'beets.lightAlpha.500',
                        borderColor: 'transparent',
                        _hover: {
                            borderColor: 'beets.base.200',
                            bgColor: 'beets.lightAlpha.500',
                        },
                        _focus: {
                            bgColor: 'beets.lightAlpha.500',
                        },
                    },
                },
            },
        },
        Input: {
            parts: ['field'],
            variants: {
                filled: {
                    field: {
                        color: 'gray.100',
                        bgColor: 'beets.lightAlpha.500',
                        borderColor: 'transparent',
                        //color: 'gray.100',
                        _hover: {
                            borderColor: 'beets.base.200',
                            bgColor: 'beets.lightAlpha.500',
                        },
                        _focus: {
                            bgColor: 'beets.lightAlpha.500',
                            borderColor: 'beets.base.200',
                        },
                        _placeholder: {
                            color: 'gray.200',
                        },
                    },
                },
            },
        },
        Tabs: {
            parts: ['tab'],
            baseStyle: {
                tab: {
                    _focus: {
                        boxShadow: 'none',
                    },
                },
            },
        },
        Link: {
            baseStyle: {
                color: 'beets.highlight',
            },
        },
        Tooltip: {
            baseStyle: {
                color: 'white',
            },
        },
        Alert: {
            parts: ['container'],
            baseStyle: {
                container: {
                    borderRadius: 'md',
                    alignItems: 'flex-start',
                },
            },
        },
        Button: {
            variants: {
                primary: {
                    background: 'beets.green',
                    color: 'gray.500',
                    _active: { bgColor: 'beets.green' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'xl',
                    _hover: {
                        bgColor: 'beets.highlight',
                        transform: 'scale(1.01)',
                        _disabled: {
                            transform: 'none',
                            background: 'gray.400',
                        },
                    },
                    _disabled: {
                        bgColor: 'gray.400',
                        opacity: 1,
                        color: 'whiteAlpha.700',
                        cursor: 'not-allowed',
                        _active: { bgColor: 'gray.400' },
                    },
                },
                secondary: {
                    bgColor: 'beets.greenAlpha.300',
                    color: 'white',
                    _active: { bgColor: 'beets.greenAlpha.300' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'xl',
                    _hover: {
                        transform: 'scale(1.01)',
                        bgColor: 'beets.highlightAlpha.200',
                        _disabled: {
                            transform: 'none',
                            background: 'gray.400',
                        },
                    },
                    _disabled: {
                        bgColor: 'gray.400',
                        opacity: 1,
                        color: 'whiteAlpha.700',
                        cursor: 'not-allowed',
                        _active: { bgColor: 'gray.400' },
                    },
                },
            },
        },
        Skeleton: {
            baseStyle: {
                borderRadius: 'md',
            },
            defaultProps: {
                startColor: 'gray.400',
                endColor: 'gray.500',
            },
        },
        Text: {
            variants: {
                cardHeadline: {
                    fontWeight: 'semibold',
                    fontSize: 'xl',
                    color: 'white',
                },
            },
        },
    },
};
