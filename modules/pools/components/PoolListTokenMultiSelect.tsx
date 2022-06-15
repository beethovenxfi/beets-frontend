import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useGetTokens } from '~/lib/global/useToken';
import TokenAvatar from '~/components/token/TokenAvatar';
import { MultiSelect } from '~/components/multi-select/MultiSelect';
import { usePoolList } from '~/modules/pools/usePoolList';

export function PoolListTokenMultiSelect() {
    const { tokens } = useGetTokens();
    const { state, refetch } = usePoolList();
    const selected = state.where?.tokensIn || [];

    return (
        <Box>
            <MultiSelect
                options={tokens.map((token) => ({
                    value: token.address,
                    label: token.symbol,
                    imageUrl: token.logoURI,
                    icon: <TokenAvatar address={token.address} size="xs" mr={2} />,
                }))}
                value={tokens
                    .filter((token) => selected.includes(token.address))
                    .map((token) => ({
                        value: token.address,
                        label: token.symbol,
                        imageUrl: token.logoURI,
                        icon: <TokenAvatar address={token.address} size="xs" mr={2} />,
                    }))}
                renderOption={(data, children) => (
                    <>
                        {data.icon} <Text fontSize="lg">{data.label}</Text>
                    </>
                )}
                renderMultiValue={(data, children) => (
                    <Flex alignItems="center">
                        {data.imageUrl ? <Image src={data.imageUrl} style={{ width: 20, height: 20 }} mr={1} /> : null}
                        {children}
                    </Flex>
                )}
                placeholder="Filter by token..."
                onChange={(selected) => {
                    refetch({
                        ...state,
                        where: {
                            ...state.where,
                            tokensIn: selected.length > 0 ? selected.map((item) => item.value) : null,
                        },
                    });
                }}
            />
        </Box>
    );
}
