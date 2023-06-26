import { Text, Box, HStack } from '@chakra-ui/react';
import { GqlLge, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import Card from '~/components/card/Card';
import { CardRow } from '~/components/card/CardRow';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import { useGetTokens } from '~/lib/global/useToken';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useGetLgeToken } from '~/modules/lges/components/lib/useGetLgeToken';

interface Props {
    lge: GqlLge;
    pool: GqlPoolUnion;
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

export function LgeDetailAboutStats({ lge, pool }: Props) {
    const { token } = useGetLgeToken(lge.tokenContractAddress);
    const { priceForAmount, priceFor } = useGetTokens();

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
        <>
            <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                Live stats
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
    );
}
