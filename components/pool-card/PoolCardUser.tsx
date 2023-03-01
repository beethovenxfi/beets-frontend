import { Box, BoxProps, Flex, Text, Divider, LinkBox } from '@chakra-ui/react';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { GqlPoolCardDataFragment } from '~/apollo/generated/graphql-codegen-generated';
import numeral from 'numeral';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { NextLinkOverlay } from '~/components/link/NextLink';

interface Props extends BoxProps {
    pool: GqlPoolCardDataFragment;
    balance: string;
    balanceUSD: number;
}

export function PoolCardUser({ pool, balance, balanceUSD, ...rest }: Props) {
    const dailyApr = parseFloat(pool.dynamicData.apr.total) / 365;

    return (
        <LinkBox as="article" flex="1" {...rest}>
            <Flex bgColor="whiteAlpha.100" borderRadius="md" p="4" flexDirection="column" height="327px">
                <Box fontSize="lg" pb="6" flex="1">
                    <NextLinkOverlay href={`pool/${pool.id}`}>
                        <Text noOfLines={2}>{pool.name}</Text>
                    </NextLinkOverlay>
                </Box>
                <TokenAvatarSet
                    tokenData={pool.displayTokens.map((token) => ({
                        address: token.address,
                        ...(token.weight && { weight: token.weight }),
                    }))}
                    width={104}
                    imageSize={28}
                    renderPopover={false}
                />
                <Box mt="6" color="gray.200" fontSize="sm">
                    My balance:
                </Box>
                <Box fontSize="3xl" lineHeight="38px" color="white">
                    {numberFormatUSDValue(balanceUSD)}
                </Box>
                <Box color="gray.200">{balance !== '0' ? `${tokenFormatAmount(balance)} BPT` : ''}&nbsp;</Box>
                <Divider mt="4" mb="4" />
                <Box>
                    <AprTooltip
                        textProps={{ fontSize: 'lg', fontWeight: 'normal', mr: '0', lineHeight: '20px' }}
                        data={pool.dynamicData.apr}
                        placement="left"
                        aprLabel={true}
                    />
                    <Text color="gray.200">{numeral(dailyApr).format('0.00[0]%')} Daily</Text>
                </Box>
            </Flex>
        </LinkBox>
    );
}
