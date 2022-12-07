import { GqlSorGetSwapsResponseFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Box, Flex } from '@chakra-ui/react';
import { BatchSwapTokenMarker } from '~/components/batch-swap/components/BatchSwapTokenMarker';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useGetTokens } from '~/lib/global/useToken';
import { AnimatePresence, motion } from 'framer-motion';
import { BatchSwapRoute } from '~/components/batch-swap/components/BatchSwapRoute';

interface Props {
    swapInfo: GqlSorGetSwapsResponseFragment;
    minimalWidth?: boolean;
}

export function BatchSwapSorRoute({ swapInfo, minimalWidth }: Props) {
    const { getToken } = useGetTokens();
    const tokenIn = getToken(swapInfo.tokenIn);
    const tokenOut = getToken(swapInfo.tokenOut);

    return (
        <Flex justifyContent="space-between">
            <BatchSwapTokenMarker token={swapInfo.tokenIn} position="start" />
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
                        {tokenFormatAmount(swapInfo.tokenInAmount)} {tokenIn?.symbol}
                    </Box>
                    <Box>
                        {tokenFormatAmount(swapInfo.tokenOutAmount)} {tokenOut?.symbol}
                    </Box>
                </Flex>
                {swapInfo.routes.map((route, index) => (
                    <AnimatePresence key={index}>
                        <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <BatchSwapRoute route={route} minimalWidth={minimalWidth} />
                        </motion.div>
                    </AnimatePresence>
                ))}
            </Box>
            <BatchSwapTokenMarker token={swapInfo.tokenOut} position="end" />
        </Flex>
    );
}
