import { Box, BoxProps, Flex, Text } from '@chakra-ui/react';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { GqlPoolCardDataFragment } from '~/apollo/generated/graphql-codegen-generated';
import numeral from 'numeral';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props extends BoxProps {
    pool: GqlPoolCardDataFragment;
    balance: string;
    balanceUSD: number;
}

export function PoolCardUser({ pool, balance, balanceUSD, ...rest }: Props) {
    const dailyApr = parseFloat(pool.dynamicData.apr.total) / 365;

    return (
        <Box flex="1" {...rest}>
            <Flex bgColor="beets.base.600" borderRadius="md" p="4" flexDirection="column" height="327px">
                <Box fontSize="lg" pb="6" flex="1">
                    <Text noOfLines={2}>{pool.name}</Text>
                </Box>
                <TokenAvatarSet
                    tokenData={pool.allTokens
                        .filter((token) => !token.isNested && !token.isPhantomBpt)
                        .map((token) => ({ address: token.address, ...(token.weight && { weight: token.weight }) }))}
                    width={104}
                    imageSize={28}
                />
                <Box mt="6" color="gray.200" fontSize="sm">
                    My balance:
                </Box>
                <Box fontSize="3xl" lineHeight="38px" color="white">
                    {numberFormatUSDValue(balanceUSD)}
                </Box>
                <Box color="gray.200">{tokenFormatAmount(balance)} BPT</Box>
                <Box pt="4" mt="4" borderTopWidth={1} borderTopColor="beets.base.800">
                    <AprTooltip
                        textProps={{ fontSize: 'lg', fontWeight: 'normal', mr: '0', lineHeight: '20px' }}
                        data={pool.dynamicData.apr}
                        placement="left"
                        aprLabel={true}
                    />
                    <Text color="gray.200">{numeral(dailyApr).format('0.00[0]%')} Daily</Text>
                </Box>
            </Flex>
        </Box>
    );
}
