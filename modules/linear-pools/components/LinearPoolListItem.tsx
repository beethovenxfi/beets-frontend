import { BoxProps } from '@chakra-ui/layout';
import { GqlPoolLinearFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Button, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import numeral from 'numeral';
import { memo } from 'react';
import { TokenAvatarSetInList, TokenAvatarSetInListTokenData } from '~/components/token/TokenAvatarSetInList';
import AprTooltip from '~/components/apr-tooltip/AprTooltip';
import { networkConfig } from '~/lib/config/network-config';
import { oldBnumScale } from '~/lib/services/pool/lib/old-big-number';
import { tokenFormatAmount } from '~/lib/services/token/token-util';

interface Props extends BoxProps {
    pool: GqlPoolLinearFragment;
    tokens: TokenAvatarSetInListTokenData[];
    onClick: () => void;
}

const MemoizedTokenAvatarSetInList = memo(TokenAvatarSetInList);
const MemoizedAprTooltip = memo(AprTooltip);

export function LinearPoolListItem({ pool, tokens, onClick, ...rest }: Props) {
    const apr = parseFloat(pool.dynamicData.apr.total) < 0.0000001 ? '0' : pool.dynamicData.apr.total;
    const mainToken = pool.tokens.find((token) => token.index === pool.mainIndex)!;
    const wrappedToken = pool.tokens.find((token) => token.index === pool.wrappedIndex)!;
    const isReaperPool = networkConfig.balancer.linearFactories.reaper.includes(pool.factory || '');
    const smallWrappedBalanceIn18Decimals = isReaperPool && mainToken.decimals < 18;
    const wrappedTokenBalance = !wrappedToken
        ? '0'
        : smallWrappedBalanceIn18Decimals
        ? oldBnumScale(wrappedToken.balance, 18 - mainToken.decimals).toString()
        : wrappedToken.balance;

    const amountWrapped = parseFloat(wrappedToken?.balance || '0') * parseFloat(wrappedToken?.priceRate || '1');
    const amountUnwrapped = parseFloat(mainToken.balance);
    const boost = amountWrapped / (amountUnwrapped + amountWrapped);
    const upperTarget = parseFloat(pool.upperTarget);
    const lowerTarget = parseFloat(pool.lowerTarget);
    const rangeSize = upperTarget - lowerTarget;
    const inRange = amountUnwrapped > lowerTarget && amountUnwrapped < upperTarget;
    const upperRangeDiff = upperTarget - amountUnwrapped;
    const lowerRangeDiff = amountUnwrapped - lowerTarget;
    const nearRange = inRange && (upperRangeDiff / rangeSize < 0.05 || lowerRangeDiff / rangeSize < 0.05);
    const rangeDiff = amountUnwrapped < lowerTarget ? amountUnwrapped - lowerTarget : amountUnwrapped - upperTarget;

    return (
        <Box {...rest}>
            <Grid
                px="4"
                py="4"
                gap="0"
                templateColumns="70px 1fr 130px 130px 130px 130px 130px 130px 130px 130px 120px"
            >
                <GridItem>
                    <MemoizedTokenAvatarSetInList imageSize={25} width={92} tokens={tokens} />
                </GridItem>
                <GridItem>
                    <Text fontSize="md" fontWeight="normal">
                        {pool.symbol}
                    </Text>
                </GridItem>
                {inRange && !nearRange && (
                    <GridItem textAlign="center" color="beets.green">
                        in range
                    </GridItem>
                )}
                {nearRange && (
                    <GridItem textAlign="center" color="orange">
                        near range
                    </GridItem>
                )}
                {!inRange && (
                    <GridItem textAlign="center" color="red">
                        {numeral(rangeDiff).format('$0.00a')}
                    </GridItem>
                )}
                <StatGridItem>{tokenFormatAmount(mainToken.balance)}</StatGridItem>
                <StatGridItem>{tokenFormatAmount(wrappedTokenBalance)}</StatGridItem>
                <StatGridItem>{numeral(boost < 0.00001 ? 0 : boost).format('0.00%')}</StatGridItem>
                <StatGridItem>{numeral(pool.lowerTarget).format('0a')}</StatGridItem>
                <StatGridItem>{numeral(pool.upperTarget).format('0a')}</StatGridItem>
                <StatGridItem>{numeral(apr).format('0.00%')}</StatGridItem>
                <StatGridItem>{numeral(pool.dynamicData.totalLiquidity).format('$0.00a')}</StatGridItem>{' '}
                <GridItem textAlign="right">
                    <Button onClick={onClick} variant="outline" size="xs" color="beets.green">
                        Actions
                    </Button>
                </GridItem>
            </Grid>
        </Box>
    );
}

function StatGridItem(props: GridItemProps) {
    return <GridItem textAlign={{ base: 'left', lg: 'right' }} mb={{ base: '4', lg: '0' }} {...props} />;
}
