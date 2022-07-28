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
import { AnimatePresence, motion } from 'framer-motion';
import { BatchSwapRoute } from '~/components/batch-swap/components/BatchSwapRoute';

interface Props {
    swaps: GqlSorGetSwapsResponseFragment;
}

export function BatchSwapSorRoute({ swaps }: Props) {
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
                        <AnimatePresence key={index}>
                            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <BatchSwapRoute route={route} />
                            </motion.div>
                        </AnimatePresence>
                    ))}
                </Box>
                <BatchSwapTokenMarker token={swaps.tokenOut} position="end" />
            </Flex>
        </Box>
    );
}
