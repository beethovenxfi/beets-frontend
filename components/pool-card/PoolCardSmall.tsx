import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';

interface Props extends BoxProps {
    tokenSize?: number;
}

export function PoolCardSmall({ tokenSize = 40, ...rest }: Props) {
    return (
        <Box p="4" borderRadius="md" display="flex" flexDirection="column" {...rest}>
            <Box pb="4">
                <Text noOfLines={2}>All you need is a really long pool name</Text>
            </Box>
            <Box flex="1">
                <TokenAvatarSet
                    addresses={[
                        '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
                        '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
                        '0xf24bcf4d1e507740041c9cfd2dddb29585adce1e',
                    ]}
                    width={140}
                    imageSize={tokenSize}
                />
            </Box>
            <Flex pt="8" alignItems="center">
                {/*<Text fontSize="xl" lineHeight="30px" mr="1">
                        123.23%
                    </Text>*/}
                <AprTooltip
                    //onlySparkles={true}
                    textProps={{ fontSize: 'xl', fontWeight: 'normal', mr: '0', lineHeight: '26px' }}
                    data={{
                        __typename: 'GqlPoolApr',
                        total: '1.2323',
                        items: [
                            { title: 'Swap APR', apr: '0.22', __typename: 'GqlBalancePoolAprItem' },
                            { title: 'BEETS reward APR', apr: '0.22', __typename: 'GqlBalancePoolAprItem' },
                        ],
                        hasRewardApr: false,
                        nativeRewardApr: '',
                        swapApr: '0',
                        thirdPartyApr: '0',
                    }}
                />
            </Flex>
            <Text color="gray.200" fontSize="sm">
                0.33% Daily
            </Text>
        </Box>
    );
}
