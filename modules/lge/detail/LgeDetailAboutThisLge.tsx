import { Grid, GridItem, Text, Img, Divider, Box, HStack, Link } from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';
import { GqlLge, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import Card from '~/components/card/Card';
import { CardRow } from '~/components/card/CardRow';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { useGetTokens } from '~/lib/global/useToken';
import { addressShortDisplayName } from '~/lib/util/address';
import { etherscanGetAddressUrl } from '~/lib/util/etherscan';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { LgeIconLinks } from '~/modules/lges/components/LgeIconLinks';
import { useGetLgeToken } from '~/modules/lges/components/lib/useGetLgeToken';

interface Props {
    lge: GqlLge;
    status: 'active' | 'upcoming' | 'ended';
    pool: GqlPoolUnion;
}

function formatWeight(weight: number): string {
    return (weight / 100).toString();
}

function calculateLbpTokenPrice({
    tokenWeight,
    tokenBalance,
    collateralTokenPrice,
    collateralBalance,
    collateralWeight,
}: {
    tokenWeight: number;
    collateralWeight: number;
    tokenBalance: number;
    collateralBalance: number;
    collateralTokenPrice: number;
}) {
    return (((tokenWeight / collateralWeight) * collateralBalance) / tokenBalance) * collateralTokenPrice;
}

export function LgeDetailAboutThisLge({ lge, status, pool }: Props) {
    const { token } = useGetLgeToken(lge.tokenContractAddress);
    const { getToken, priceForAmount, priceFor } = useGetTokens();

    const tokenStartWeight = formatWeight(lge.tokenStartWeight);
    const collateralStartWeight = formatWeight(lge.collateralStartWeight);
    const tokenEndWeight = formatWeight(lge.tokenEndWeight);
    const collateralEndWeight = formatWeight(lge.collateralEndWeight);
    const poolLaunchToken = pool.tokens.find((token) => token.address === lge.tokenContractAddress.toLowerCase());
    const poolCollateralToken = pool.tokens.find((token) => token.address === lge.collateralTokenAddress.toLowerCase());
    const poolCollateralTokenBalance = parseFloat(poolCollateralToken?.balance || '');
    const fundsRaised = poolCollateralTokenBalance - parseFloat(lge.collateralAmount);
    const fundsRaisedUsdValue = priceForAmount({
        address: poolCollateralToken?.address || '',
        amount: fundsRaised.toString(),
    });
    const fundsRemoved = poolCollateralTokenBalance < 0.0001;

    const collateralTokenPrice = priceFor(poolCollateralToken?.address || '');
    const tokenPrice = calculateLbpTokenPrice({
        tokenWeight: parseFloat(poolLaunchToken?.weight || ''),
        collateralBalance: parseFloat(poolCollateralToken?.balance || ''),
        collateralTokenPrice,
        collateralWeight: parseFloat(poolCollateralToken?.weight || ''),
        tokenBalance: parseFloat(poolLaunchToken?.balance || ''),
    });
    const predictedPrice = calculateLbpTokenPrice({
        tokenWeight: lge.tokenEndWeight,
        collateralWeight: lge.collateralEndWeight,
        collateralBalance: parseFloat(poolCollateralToken?.balance || ''),
        collateralTokenPrice,
        tokenBalance: parseFloat(poolLaunchToken?.balance || ''),
    });

    return (
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="4" width="full">
            <GridItem>
                <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                    Details
                </Text>
                <Img src={lge.bannerImageUrl} mb="8" />
                <Text style={{ whiteSpace: 'pre-line' }}>{lge.description}</Text>
                <Divider my="8" />
                <LgeIconLinks lge={lge} />
            </GridItem>

            <GridItem>
                {status === 'active' && (
                    <>
                        <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                            Stats
                        </Text>
                        <Card padding="2" mb="8">
                            <CardRow alignItems="center">
                                <Box flex="1">Current weights</Box>
                                <HStack>
                                    <PoolTokenPill
                                        token={{
                                            address: lge.tokenContractAddress,
                                            weight: poolLaunchToken?.weight,
                                            logoUri: lge.tokenIconUrl,
                                        }}
                                    />
                                    <PoolTokenPill
                                        token={{
                                            address: lge.collateralTokenAddress,
                                            weight: poolCollateralToken?.weight,
                                        }}
                                    />
                                </HStack>
                            </CardRow>
                            <CardRow>
                                <Box flex="1">{`Current ${token?.symbol} price`}</Box>
                                <Box>{fundsRemoved ? '-' : numberFormatUSDValue(tokenPrice.toString())}</Box>
                            </CardRow>
                            <CardRow>
                                <Box flex="1">{`Predicted ${token?.symbol} price`}</Box>
                                <Box>{fundsRemoved ? '-' : numberFormatUSDValue(predictedPrice.toString())}</Box>
                            </CardRow>
                            <CardRow>
                                <Box flex="1">Funds raised</Box>
                                <Box>{numberFormatUSDValue(fundsRaisedUsdValue.toString())}</Box>
                            </CardRow>
                            <CardRow>
                                <Box flex="1">Volume</Box>
                                <Box>{numberFormatUSDValue(pool.dynamicData.lifetimeVolume)}</Box>
                            </CardRow>
                            <CardRow>
                                <Box flex="1">Liquidity</Box>
                                <Box>{numberFormatUSDValue(pool.dynamicData.totalLiquidity)}</Box>
                            </CardRow>
                        </Card>
                    </>
                )}
                <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                    Info
                </Text>
                <Card padding="2">
                    <CardRow>
                        <Box flex="1">{status === 'upcoming' ? 'Starts' : 'Started'}</Box>
                        <Box>{lge.startDate}</Box>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">{status === 'ended' ? 'Ended' : 'Ends'}</Box>
                        <Box>{lge.endDate}</Box>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Launch token symbol</Box>
                        <Box>{token?.symbol}</Box>
                    </CardRow>
                    <CardRow alignItems="center">
                        <Box flex="1">Initial launch token supply</Box>
                        <TokenAmountPill
                            fontSize="md"
                            amount={lge.tokenAmount}
                            address={lge.tokenContractAddress}
                            logoUri={lge.tokenIconUrl}
                        />
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Collateral token symbol</Box>
                        <Box>{getToken(lge.collateralTokenAddress)?.symbol}</Box>
                    </CardRow>
                    <CardRow alignItems="center">
                        <Box flex="1">Initial collateral token supply</Box>
                        <TokenAmountPill
                            fontSize="md"
                            amount={lge.collateralAmount}
                            address={lge.collateralTokenAddress}
                        />
                    </CardRow>
                    <CardRow alignItems="center">
                        <Box flex="1">Start weights</Box>
                        <HStack>
                            <PoolTokenPill
                                token={{
                                    address: lge.tokenContractAddress,
                                    weight: tokenStartWeight,
                                    logoUri: lge.tokenIconUrl,
                                }}
                            />
                            <PoolTokenPill
                                token={{
                                    address: lge.collateralTokenAddress,
                                    weight: collateralStartWeight,
                                }}
                            />
                        </HStack>
                    </CardRow>
                    <CardRow alignItems="center">
                        <Box flex="1">End weights</Box>
                        <HStack>
                            <PoolTokenPill
                                token={{
                                    address: lge.tokenContractAddress,
                                    weight: tokenEndWeight,
                                    logoUri: lge.tokenIconUrl,
                                }}
                            />
                            <PoolTokenPill
                                token={{
                                    address: lge.collateralTokenAddress,
                                    weight: collateralEndWeight,
                                }}
                            />
                        </HStack>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Swap fee</Box>
                        <Box>{lge.swapFeePercentage}%</Box>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Protocol fee</Box>
                        <Box>2%</Box>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Token address</Box>
                        <Link href={etherscanGetAddressUrl(lge.tokenContractAddress)} target="_blank">
                            <HStack spacing="1">
                                <Box>{addressShortDisplayName(lge.tokenContractAddress)}</Box>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">Owner address</Box>
                        <Link href={etherscanGetAddressUrl(lge.adminAddress)} target="_blank">
                            <HStack spacing="1">
                                <Box>{addressShortDisplayName(lge.adminAddress)}</Box>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </CardRow>
                    <CardRow>
                        <Box flex="1">LBP address</Box>
                        <Link href={etherscanGetAddressUrl(lge.address)} target="_blank">
                            <HStack spacing="1">
                                <Box>{addressShortDisplayName(lge.address)}</Box>
                                <ExternalLink size={16} />
                            </HStack>
                        </Link>
                    </CardRow>
                </Card>
            </GridItem>
        </Grid>
    );
}
