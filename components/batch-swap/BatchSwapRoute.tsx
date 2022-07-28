import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex } from '@chakra-ui/react';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import {
    BatchSwapDashedLine,
    BatchSwapRouteDashedLineArrowSpacer,
    BatchSwapRouteDashedLineLeftSide,
    BatchSwapRouteDashedLineRightSide,
} from '~/components/batch-swap/components/BatchSwapDashedLine';
import { BatchSwapTokenAmount } from '~/components/batch-swap/components/BatchSwapTokenAmount';
import { BatchSwapHop } from '~/components/batch-swap/components/BatchSwapHop';
import { BatchSwapTokenMarker } from '~/components/batch-swap/components/BatchSwapTokenMarker';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    swaps: GqlSorGetSwapsResponseFragment;
}

export function BatchSwapRoute({ swaps }: Props) {
    const { getToken } = useGetTokens();
    const tokenIn = getToken(swaps.tokenIn);
    const tokenOut = getToken(swaps.tokenOut);

    return (
        <Box>
            <Flex justifyContent="space-between">
                <BatchSwapTokenMarker token={swaps.tokenIn} position="start" />
                <Box flex="1">
                    <Flex
                        height="44px"
                        justifyContent="space-between"
                        position="relative"
                        top="-2px"
                        mx="2"
                        fontWeight="bold"
                    >
                        <Box>
                            {tokenFormatAmount(swaps.tokenInAmount)} {tokenIn?.symbol}
                        </Box>
                        <Box>
                            {tokenFormatAmount(swaps.tokenOutAmount)} {tokenOut?.symbol}
                        </Box>
                    </Flex>
                    {swaps.routes.map((route, index) => (
                        <Box key={index} height="64px">
                            <Flex flex="1" flexDirection="column" justifyContent="space-around">
                                <Flex position="relative" columnGap="5px">
                                    <BatchSwapRouteDashedLineLeftSide />
                                    <BatchSwapRouteDashedLineRightSide />
                                    <BatchSwapDashedLine />
                                    <BatchSwapTokenAmount address={route.tokenIn} amount={route.tokenInAmount} />
                                    <Flex flex="1" height="64px" alignItems="center" position="relative" top="2px">
                                        <Box flex="1">
                                            <BatchSwapRouteDashedLineArrowSpacer />
                                        </Box>
                                        {route.hops
                                            .filter((hop) => hop.pool.type !== 'LINEAR')
                                            .map((hop, index) => (
                                                <>
                                                    <BatchSwapHop key={index} hop={hop} />
                                                    <BatchSwapRouteDashedLineArrowSpacer key={`spacer-${index}`} />
                                                </>
                                            ))}
                                    </Flex>
                                    <BatchSwapTokenAmount address={route.tokenOut} amount={route.tokenOutAmount} />
                                </Flex>
                            </Flex>
                        </Box>
                    ))}
                </Box>
                <BatchSwapTokenMarker token={swaps.tokenOut} position="end" />
            </Flex>
        </Box>
    );
}
