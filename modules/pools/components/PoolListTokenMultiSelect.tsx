import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { chakraComponents, ChakraStylesConfig, Select } from 'chakra-react-select';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';

const chakraStyles: ChakraStylesConfig = {
    dropdownIndicator: (provided, state) => ({
        ...provided,
        background: 'rgba(255,255,255,0.08)',
        p: 0,
        w: '40px',
    }),
    option: (provided, state) => ({
        ...provided,
        background: state.isFocused ? 'beets.base.800' : 'transparent',
        //background: 'beets.base.800',
    }),
    menuList: (provided, state) => ({
        ...provided,
        //background: state.isFocused ? 'blue.100' : 'black',
        background: 'beets.base.700',
    }),
    multiValue: (provided, state) => ({
        ...provided,
        background: 'beets.box.500',
    }),
    multiValueLabel: (provided, state) => ({
        ...provided,
        color: 'white',
    }),
    multiValueRemove: (provided, state) => ({
        ...provided,
        color: 'white',
    }),
};

export function PoolListTokenMultiSelect() {
    const { tokens } = useGetTokens();

    const customComponents = {
        Option: ({ children, ...props }: any) => (
            <chakraComponents.Option {...props}>
                {props.data.icon} <Text fontSize="lg">{props.data.label}</Text>
            </chakraComponents.Option>
        ),
        MultiValue: ({ children, ...props }: any) => {
            return (
                <chakraComponents.MultiValue {...props}>
                    <Flex alignItems="center">
                        {props.data.imageUrl ? (
                            <Image src={props.data.imageUrl} style={{ width: 20, height: 20 }} mr={1} />
                        ) : null}
                        {children}
                    </Flex>
                </chakraComponents.MultiValue>
            );
        },
    };

    return (
        <Box>
            <Select
                options={tokens.map((token) => ({
                    value: token.address,
                    label: token.symbol,
                    imageUrl: token.logoURI,
                    icon: <TokenAvatar address={token.address} size="xs" mr={2} />,
                }))}
                isMulti
                chakraStyles={chakraStyles}
                placeholder="Filter by token..."
                components={customComponents}
            />
        </Box>
    );
}
