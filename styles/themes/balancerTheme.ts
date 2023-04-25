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
                color: '#334155',
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
            50: '#F8FAFC',
            100: '#EAF0F6',
            200: '#E2E8F0',
            300: '#CBD5E1',
            400: '#94A3B8',
            500: '#64748B',
            600: '#475569',
            700: '#334155',
            800: '#1E293B',
            850: '#162031',
            900: '#0F172A',
        },
        blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
        },
        pink: {
            50: '#ff4dff',
            100: '#ff43ff',
            200: '#ff39ff',
            300: '#ff2fff',
            400: '#fc25ff',
            500: '#f21bf6',
            600: '#e811ec',
            700: '#de07e2',
            800: '#d400d8',
            900: '#ca00ce',
        },
        box: {
            '300': 'rgba(27,20,100,0.25)',
            '500': '#EAF0F6',
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
                '50': 'rgba(104, 126, 255, 0.05)',
                '100': 'rgba(104, 126, 255, 0.1)',
                '200': 'rgba(104, 126, 255, 0.2)',
                '300': 'rgba(104, 126, 255, 0.3)',
                '500': 'rgba(104, 126, 255, 0.5)',
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
            heading: 'gray.800',
            subheading: 'gray.600',
            loading: 'white',
            walletConnectPortfolio: 'white',
            statistic: 'gray.800',
            statisticHeader: 'gray.600',
            statsDivider: 'gray.300',
            aprStripe: 'beets.secondary.400',
            secondaryTableRow: 'gray.50',
            progressBg: 'gray.200',
            popoverTrigger: 'pink.800',
        },
    },
    components: {
        TableRow: {
            baseStyle: {
                bg: 'white',
                _hover: {
                    bg: 'gray.50',
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
        PoolListTableHeader: {
            baseStyle: {
                bgColor: 'gray.100',
                borderBottom: '0',
                borderColor: 'beets.base.500',
            },
        },
        PageMasthead: {
            baseStyle: {
                borderBottomWidth: 5,
                borderColor: 'orange',
            },
        },
        BeetsBox: {
            baseStyle: {
                rounded: 'md',
            },
            variants: {
                normal: {
                    bg: 'box.500',
                },
                elevated: {
                    bg: 'white !important',
                    borderWidth: 1,
                    borderColor: 'gray.200',
                    shadow: 'sm',
                },
            },
        },
        Select: {
            parts: ['field'],
            variants: {
                filled: {
                    field: {
                        color: 'gray.700',
                        bgColor: 'gray.100',
                        borderColor: 'transparent',
                        _hover: {
                            borderColor: 'beets.base.200',
                            bgColor: 'gray.200',
                        },
                        _focus: {
                            bgColor: 'gray.200',
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
                        color: 'gray.600',
                        bgColor: 'gray.100',
                        shadow: 'inner',
                        borderColor: 'transparent',
                        borderWidth: 0,
                        //color: 'gray.100',
                        _hover: {
                            bgColor: 'gray.200',
                        },
                        _focus: {
                            bgColor: 'gray.100',
                        },
                        _placeholder: {
                            color: 'gray.600',
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
                color: 'beets.secondary.500',
            },
        },
        Tooltip: {
            baseStyle: {
                color: 'white',
            },
            variants: {
                beets: {
                    bg: 'gray.800',
                    color: 'white',
                },
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
                    bgGradient: 'linear(to-tr, blue.700, pink.700)',
                    color: 'white',
                    _active: { bgColor: 'beets.green' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'lg',
                    shadow: 'lg',
                    _hover: {
                        transform: 'scale(1.01)',
                        bgGradient: 'linear(to-tr, blue.600, pink.600)',
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
                    _active: { bgColor: 'beets.greenAlpha.300' },
                    _focus: { outline: 'none', boxShadow: 'none' },
                    rounded: 'lg',
                    _hover: {
                        transform: 'scale(1.01)',
                        bgColor: 'gray.100',
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
                    bgColor: 'beets.lightAlpha.500',
                    _hover: { bgColor: 'beets.secondary.700' },
                    _focus: { outline: 'none !important' },
                    height: 'fit-content',
                    paddingY: '3',
                    paddingX: '4',
                    _selected: {
                        bgColor: 'beets.secondary.500',
                    },
                },
                tableSort: {
                    _hover: { backgroundColor: 'transparent', color: 'beets.secondary.500' },
                    _focus: { outline: 'none' },
                    _active: { backgroundColor: 'transparent' },
                    padding: '0',
                    height: 'fit-content',
                    color: 'beets.base.100',
                    userSelect: 'none',
                    _selected: {
                        color: 'beets.secondary.500',
                    },
                },
                paginationNumber: {
                    rounded: 'md',
                    _selected: {
                        bgColor: 'beets.secondary.500',
                        color: 'white',
                    },
                    _hover: {
                        bgColor: 'beets.secondary.200',
                        color: 'white',
                    },
                },
                filter: {
                    color: 'beets.secondary.500',
                    bgColor: 'white',
                    _hover: { bgColor: 'beets.secondary.400', color: 'white' },
                    _selected: {
                        color: 'white',
                        bgColor: 'beets.secondary.500',
                    },
                },
                navbarIconTrigger: {
                    bgColor: 'gray.100',
                    _hover: {
                        bgColor: 'gray.200',
                        transform: 'scale(1.1)',
                    },
                },
            },
        },
        SubNavBar: {
            baseStyle: {
                shadow: '2xl',
                width: 'fit-content',
            },
        },
        PopoverContent: {
            baseStyle: {
                backgroundColor: 'white',
                background: 'white',
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
                apr: {
                    color: 'gray.500',
                },
                highlight: {
                    bgGradient: 'linear(to-tr, blue.700, pink.700)',
                    bgClip: 'text',
                },
            },
        },
    },
};
