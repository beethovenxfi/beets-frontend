import { ChakraTheme } from '@chakra-ui/theme';

const _isSelected = '.isSelected &';
export const balancerTheme: Partial<ChakraTheme> = {
    styles: {
        global: {
            html: {
                background:
                    'radial-gradient(ellipse at top, #030622a8, #FFFFFF), radial-gradient(ellipse at bottom, #FFFFFF, #FFFFFF) !important',
            },
            body: {
                color: '#292524',
                background:
                    'radial-gradient(ellipse at top, #111111, #FFFFFF), radial-gradient(ellipse at bottom, #FFFFFF, #FFFFFF) !important',
            },
            '.bg': {
                background: 'white',
                // background: `radial-gradient(ellipse at top, rgba(0, 0, 0, 1) 10%, transparent 80%),
                //  radial-gradient(ellipse at bottom, rgba(0, 0, 0, 1) 10%, transparent 80%) !important`,
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
            '500': 'rgba(0,0,0,0.1)',
        },
        navbar: 'beets.base.800',
        beets: {
            green: '#00F89C',
            red: '#FF0000',
            highlight: '#00FFFF',
            gray: '#292524',
            base: {
                50: '#53555e',
                100: '#494b54',
                200: '#3f414a',
                300: '#353740',
                400: '#2b2d36',
                500: '#21232c',
                600: '#171922',
                700: '#0d0f18',
                800: '#03050e',
                900: '#000004',
            },
            secondary: {
                50: '#6a7cff',
                100: '#6072ff',
                200: '#5668ff',
                300: '#4c5eff',
                400: '#4254ff',
                500: '#384aff',
                600: '#2e40f5',
                700: '#2436eb',
                800: '#1a2ce1',
                900: '#1022d7',
            },
            light: 'rgba(46,49,146, 1.0)',
            lightAlpha: {
                '50': 'rgba(56, 74, 255, 0.05)',
                '100': 'rgba(56, 74, 255, 0.1)',
                '200': 'rgba(56, 74, 255, 0.2)',
                '300': 'rgba(56, 74, 255, 0.3)',
                '500': 'rgba(56, 74, 255, 0.5)',
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
    },
    semanticTokens: {
        colors: {
            headline: 'beets.base',
        },
    },
    components: {
        TableRow: {
            baseStyle: {
                bg: 'white',
                _hover: {
                    bg: 'beets.lightAlpha.100',
                },
            },
        },
        PoolCard: {
            baseStyle: {
                bgColor: 'blackAlpha.100',
                _hover: {
                    bgColor: 'blackAlpha.200',
                },
            },
        },
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
                    background: '#000000',
                    color: 'white',
                    _active: { bgColor: 'beets.green' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'xl',
                    shadow: 'dark-lg',
                    _hover: {
                        transform: 'scale(1.01)',
                        background: '#000000',
                        _disabled: {
                            transform: 'none',
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
                    bgColor: 'transparent',
                    color: 'beets.gray',
                    _active: { bgColor: 'beets.greenAlpha.300' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'xl',
                    _hover: {
                        transform: 'scale(1.01)',
                        bgColor: 'blackAlpha.300',
                        // bgColor: 'beets.highlightAlpha.200',
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
                tab: {
                    fontSize: 'sm',
                    rounded: 'full',
                    color: 'white',
                    bgColor: 'beets.secondary.50',
                    _hover: { bgColor: 'beets.secondary.700' },
                    _focus: { outline: 'none !important' },
                    height: 'fit-content',
                    paddingY: '3',
                    paddingX: '4',
                    [_isSelected]: {
                        color: 'gray.100 !important',
                        bgColor: 'beets.base.300 !important',
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
                hero: {
                    color: 'beets.gray',
                },
            },
        },
    },
};
