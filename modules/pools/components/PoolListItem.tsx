import { GqlPoolMinimalFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import TokenAvatarSet from '~/components/token/TokenAvatarSet';
import Link from 'next/link';
import numeral from 'numeral';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { BoxProps } from '@chakra-ui/layout';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

interface Props extends BoxProps {
    pool: GqlPoolMinimalFragment;
    userBalance?: AmountHumanReadable;
    showUserBalance: boolean;
}

export function PoolListItem({ pool, userBalance, showUserBalance, ...rest }: Props) {
    const tokenData = pool.allTokens
        .filter((token) => !token.isNested && !token.isPhantomBpt)
        .map((token) => ({ address: token.address, ...(token.weight && { weight: token.weight }) }));

    return (
        <Box mb={{ base: '4', lg: '0' }} borderRadius={{ base: 'md', lg: '0' }} {...rest}>
            <Link href={`/pool/${pool.id}`} passHref>
                <a>
                    <Grid
                        pl="4"
                        py="4"
                        alignItems="center"
                        templateColumns={{
                            base: '1fr 1fr',
                            lg: showUserBalance ? '90px 1fr 150px 200px 0px 200px' : '90px 1fr 200px 200px 200px',
                            xl: showUserBalance ? '90px 1fr 150px 200px 200px 200px' : '90px 1fr 200px 200px 200px',
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
                                      base: `"name name"
                                             "apr tvl"
                                             "fees volume"
                                             "icons icons"`,
                                      lg: `"icons name tvl volume apr"`,
                                  }
                        }
                    >
                        <GridItem area="icons">
                            <TokenAvatarSet
                                imageSize={25}
                                width={92}
                                tokenData={tokenData}
                                display={{ base: 'none', lg: 'block' }}
                            />
                            <TokenAvatarSet
                                imageSize={32}
                                width={124}
                                tokenData={tokenData}
                                display={{ base: 'block', lg: 'none' }}
                            />
                        </GridItem>
                        <GridItem area="name" mb={{ base: '4', lg: '0' }}>
                            <Text fontSize={{ base: 'xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                                {pool.name}
                            </Text>
                        </GridItem>
                        {showUserBalance && (
                            <GridItem
                                area="userBalance"
                                textAlign={{ base: 'left', lg: 'right' }}
                                mb={{ base: '4', lg: '0' }}
                            >
                                <MobileLabel text="My balance" />
                                <Text fontSize={{ base: '3xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                                    {numberFormatUSDValue(userBalance || '0')}
                                </Text>
                            </GridItem>
                        )}
                        <StatGridItem area="tvl">
                            <MobileLabel text="TVL" />
                            <Text fontSize={{ base: 'xl', lg: 'md' }}>
                                {numeral(pool.dynamicData.totalLiquidity).format('$0,0')}
                            </Text>
                        </StatGridItem>
                        <StatGridItem
                            area="volume"
                            display={showUserBalance ? { base: 'block', lg: 'none', xl: 'block' } : 'block'}
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
                            <AprTooltip
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
