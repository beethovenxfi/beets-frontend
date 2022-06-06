import { Box, Flex } from '@chakra-ui/react';
import { GqlSorGetSwapsResponse, GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { TradeRoute } from '~/modules/trade/components/TradeRoute';

interface Props {
    swaps: GqlSorGetSwapsResponseFragment;
}

export function TradeRoutePreview({ swaps }: Props) {
    const { getToken, getRequiredToken } = useGetTokens();
    const tokenIn = getRequiredToken(swaps.tokenIn);
    const tokenOut = getRequiredToken(swaps.tokenOut);

    return (
        <Box>
            <Flex mb="4">
                <Box>
                    <TokenAmountPill address={swaps.tokenIn} amount={swaps.tokenInAmount} amountFormat="precise" />
                </Box>
                <Box flex={1} />
                <Box>
                    <TokenAmountPill address={swaps.tokenOut} amount={swaps.tokenOutAmount} amountFormat="precise" />
                </Box>
            </Flex>
            {swaps.routes.map((route, index) => (
                <TradeRoute route={route} key={index} mb={index < swaps.routes.length - 1 ? '4' : '0'} />
            ))}
        </Box>
    );
}
