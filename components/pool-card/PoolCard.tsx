import { Box, BoxProps, Flex, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import { GqlPoolCardDataFragment } from '~/apollo/generated/graphql-codegen-generated';
import numeral from 'numeral';
import { NextLinkOverlay } from '~/components/link/NextLink';

interface Props extends BoxProps {
    pool: GqlPoolCardDataFragment;
}

export function PoolCard({ pool, ...rest }: Props) {
    const dailyApr = parseFloat(pool.dynamicData.apr.total) / 365;

    return (
        <LinkBox as="article" flex="1" {...rest}>
            <Flex bgColor="whiteAlpha.100" height="216px" borderRadius="md" p="4" flexDirection="column">
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
                    width={140}
                    imageSize={32}
                    renderPopover={false}
                />
                <Box flex="1" pt="6">
                    <AprTooltip
                        textProps={{ fontSize: '2xl', fontWeight: 'normal', mr: '0', lineHeight: '26px' }}
                        data={pool.dynamicData.apr}
                        placement="left"
                    />
                    <Text color="gray.200">{numeral(dailyApr).format('0.00[0]%')} Daily</Text>
                </Box>
            </Flex>
        </LinkBox>
    );
}
