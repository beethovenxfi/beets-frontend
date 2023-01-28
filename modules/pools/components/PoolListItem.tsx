import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps } from '@chakra-ui/layout';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { TokenAvatarSetInList, TokenAvatarSetInListTokenData } from '~/components/token/TokenAvatarSetInList';
import { memo } from 'react';
import { BoostedBadgeSmall } from '~/components/boosted-badge/BoostedBadgeSmall';
import { BoostedByType } from '~/lib/config/network-config-type';
import { PoolListItemWarning } from '~/modules/pools/components/PoolListItemWarning';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
    userBalance?: AmountHumanReadable;
    showUserBalance: boolean;
    tokens: TokenAvatarSetInListTokenData[];
    hasUnstakedBpt?: boolean;
    boostedBy?: BoostedByType;
    warningMessage?: string;
}

const MemoizedTokenAvatarSetInList = memo(TokenAvatarSetInList);
const MemoizedAprTooltip = memo(AprTooltip);

export function PoolListItem({
    pool,
    userBalance,
    showUserBalance,
    tokens,
    hasUnstakedBpt,
    boostedBy,
    warningMessage,
    ...rest
}: Props) {
    return (
        <Box
            mb={{ base: '4', lg: '0' }}
            borderRadius={{ base: 'md', lg: '0' }}
            {...rest}
            bgColor={showUserBalance && hasUnstakedBpt ? 'rgba(251, 211, 141, 0.16)' : undefined}
        >
            <Link href={`/pool/${pool.id}`} passHref>
                <a>
                    <Grid
                        pl="4"
                        py={{ base: '4', lg: '0' }}
                        height={{ lg: '63.5px' }}
                        templateColumns={{
                            base: '1fr 1fr',
                            lg: showUserBalance ? '90px 1fr 150px 200px 0px 200px' : '90px 1fr 100px 146px 200px 200px',
                            xl: showUserBalance
                                ? '90px 1fr 150px 200px 200px 200px'
                                : '90px 1fr 100px 146px 200px 200px',
                        }}
                        gap="0"
                        templateAreas={
                            showUserBalance
                                ? {
                                      base: `"name name"
                                             "userBalance userBalance"
                                             "apr tvl"
                                             "fees volume"
                                             "icons icons"`,
                                      lg: `"icons name userBalance tvl volume apr"`,
                                  }
                                : {
                                      base: `"name boosted"
                                             "apr tvl"
                                             "fees volume"
                                             "icons icons"`,
                                      lg: `"icons name boosted tvl volume apr"`,
                                  }
                        }
                    >
                        <GridItem area="icons" alignItems="center" display="flex">
                            <MemoizedTokenAvatarSetInList
                                imageSize={25}
                                width={92}
                                tokens={tokens}
                                //renderPopover={false}
                            />
                        </GridItem>
                        <GridItem area="name" mb={{ base: '4', lg: '0' }} alignItems="center" display="flex">
                            <Text fontSize={{ base: 'xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                                {pool.name}
                            </Text>
                            {warningMessage && <PoolListItemWarning ml="2" message={warningMessage} />}
                        </GridItem>
                        {showUserBalance && (
                            <GridItem
                                area="userBalance"
                                display={{ base: 'block', lg: 'flex' }}
                                justifyContent="flex-end"
                                alignItems="center"
                                textAlign={{ base: 'left', lg: 'right' }}
                                mb={{ base: '4', lg: '0' }}
                            >
                                <MobileLabel text="My balance" />
                                <Text fontSize={{ base: '3xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                                    {numberFormatUSDValue(userBalance || '0')}
                                </Text>
                            </GridItem>
                        )}
                        <GridItem
                            area="boosted"
                            alignItems="center"
                            display={showUserBalance ? 'none' : 'flex'}
                            mb={{ base: '4', lg: '0' }}
                        >
                            {boostedBy && <BoostedBadgeSmall boostedBy={boostedBy} />}
                        </GridItem>
                        <StatGridItem
                            area="tvl"
                            display={{ base: 'block', lg: 'flex' }}
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <MobileLabel text="TVL" />
                            <Text fontSize={{ base: 'xl', lg: 'md' }}>
                                {numeral(pool.dynamicData.totalLiquidity).format('$0,0')}
                            </Text>
                        </StatGridItem>
                        <StatGridItem
                            area="volume"
                            display={
                                showUserBalance
                                    ? { base: 'block', lg: 'none', xl: 'flex' }
                                    : { base: 'block', lg: 'flex' }
                            }
                            justifyContent="flex-end"
                            alignItems="center"
                        >
                            <MobileLabel text="VOLUME (24H)" />
                            <Text fontSize={{ base: 'xl', lg: 'md' }}>
                                {numeral(pool.dynamicData.volume24h).format('$0,0')}
                            </Text>
                        </StatGridItem>
                        <StatGridItem
                            area="apr"
                            display={{ base: 'block', lg: 'flex' }}
                            justifyContent={{ base: 'flex-start', lg: 'end' }}
                            mr="4"
                        >
                            <MobileLabel text="APR" />
                            <MemoizedAprTooltip
                                data={pool.dynamicData.apr}
                                textProps={{ fontWeight: 'normal', fontSize: { base: 'xl', lg: 'md' } }}
                            />
                        </StatGridItem>
                        <StatGridItem area="fees" display={{ base: 'block', lg: 'none' }}>
                            <MobileLabel text="FEES (24H)" />
                            <Text fontSize={{ base: 'xl', lg: 'md' }}>
                                {numeral(pool.dynamicData.fees24h).format('$0,0')}
                            </Text>
                        </StatGridItem>
                    </Grid>
                </a>
            </Link>
        </Box>
    );
}

function MobileLabel({ text }: { text: string }) {
    return (
        <Text fontSize="xs" color="gray.200" display={{ base: 'block', lg: 'none' }}>
            {text}
        </Text>
    );
}

function StatGridItem(props: GridItemProps) {
    return <GridItem area="fees" textAlign={{ base: 'left', lg: 'right' }} mb={{ base: '4', lg: '0' }} {...props} />;
}
