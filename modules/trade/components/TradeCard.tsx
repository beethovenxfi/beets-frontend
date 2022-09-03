import { Box, Button, useDisclosure, VStack } from '@chakra-ui/react';
import { useAnimation } from 'framer-motion';
import { TokenInput } from '~/components/inputs/TokenInput';
import Card from '~/components/card/Card';

import { TokenInputSwapButton } from '~/modules/trade/components/TokenInputSwapButton';
import { TradeCardSwapBreakdown } from '~/modules/trade/components/TradeCardSwapBreakdown';
import { useTradeCard } from '~/modules/trade/lib/useTradeCard';
import { TokenSelectModal } from '~/components/token-select/TokenSelectModal';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { WalletConnectButton } from '~/components/button/WalletConnectButton';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { useGetTokens } from '~/lib/global/useToken';
import { TradePreviewModal } from '~/modules/trade/components/TradePreviewModal';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { TradeCardRefreshButton } from '~/modules/trade/components/TradeCardRefreshButton';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { useWrapEth } from '~/lib/util/useWrapEth';
import { useUnwrapEth } from '~/lib/util/useUnwrapEth';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useRef } from 'react';

export function TradeCard() {
    const networkConfig = useNetworkConfig();
    const { isConnected } = useUserAccount();
    const { isAmountLessThanEqUserBalance, refetch: refetchUserBalances } = useUserTokenBalances();
    const controls = useAnimation();
    const tokenSelectDisclosure = useDisclosure();
    const tradePreviewDisclosure = useDisclosure();
    const { getToken, tokens } = useGetTokens();

    const {
        sellAmount,
        buyAmount,
        isLoadingOrFetching,
        tokenIn,
        tokenOut,
        setTokenSelectKey,
        handleBuyAmountChanged,
        handleSellAmountChanged,
        handleTokensSwitched,
        refetchTrade,
        sorResponse,
        isNotEnoughLiquidity,
        tradeStartPolling,
        tradeStopPolling,
        isNativeAssetWrap,
        isNativeAssetUnwrap,
        tokenSelectKey,
    } = useTradeCard();

    const wrapEthQuery = useWrapEth();
    const unwrapEthQuery = useUnwrapEth();

    const {
        hasApprovalForAmount,
        isLoading: isLoadingAllowances,
        refetch: refetchAllowances,
    } = useUserAllowances(tokens.filter((token) => token.address === tokenIn.toLowerCase()));

    const tokenInData = getToken(tokenIn);
    const isAmountMoreThanUserBalance = !isAmountLessThanEqUserBalance({ address: tokenIn, amount: sellAmount });
    const isReviewDisabled =
        isLoadingOrFetching ||
        parseFloat(sellAmount || '0') === 0.0 ||
        parseFloat(buyAmount || '0') === 0.0 ||
        isAmountMoreThanUserBalance;
    const hasApprovalForSellAmount =
        isLoadingAllowances || !isConnected || (isConnected && hasApprovalForAmount(tokenIn, sellAmount));

    const finalRefTokenIn = useRef(null);
    const finalRefTokenOut = useRef(null);

    function showTokenSelect(tokenKey: 'tokenIn' | 'tokenOut') {
        setTokenSelectKey(tokenKey);
        tokenSelectDisclosure.onOpen();
    }

    return (
        <Box width="full" position="relative">
            <Card
                animate={controls}
                position="relative"
                shadow="lg"
                topRight={sorResponse ? <TradeCardRefreshButton onClick={() => refetchTrade()} /> : null}
            >
                <VStack spacing="2" padding="4" width="full">
                    <Box position="relative" width="full">
                        <TokenInput
                            ref={finalRefTokenIn}
                            label="Sell"
                            address={tokenIn}
                            toggleTokenSelect={() => showTokenSelect('tokenIn')}
                            onChange={handleSellAmountChanged}
                            value={sellAmount}
                            showPresets
                            requiresApproval={!hasApprovalForSellAmount && !isNativeAssetUnwrap}
                        />
                    </Box>
                    <TokenInputSwapButton onSwap={handleTokensSwitched} isLoading={isLoadingOrFetching} />
                    <TokenInput
                        ref={finalRefTokenOut}
                        label="Buy"
                        address={tokenOut}
                        toggleTokenSelect={() => showTokenSelect('tokenOut')}
                        onChange={handleBuyAmountChanged}
                        value={buyAmount}
                    />
                    <Box width="full" paddingTop="2">
                        {!isConnected ? (
                            <WalletConnectButton width="full" size="lg" />
                        ) : isNativeAssetWrap ? (
                            <BeetsSubmitTransactionButton
                                {...wrapEthQuery}
                                isDisabled={isAmountMoreThanUserBalance}
                                onClick={() => wrapEthQuery.wrap(sellAmount)}
                                onConfirmed={() => refetchUserBalances()}
                                width="full"
                                size="lg"
                            >
                                {isAmountMoreThanUserBalance
                                    ? `Insufficient ${networkConfig.eth.symbol} balance`
                                    : `Wrap ${networkConfig.eth.symbol}`}
                            </BeetsSubmitTransactionButton>
                        ) : isNativeAssetUnwrap ? (
                            <BeetsSubmitTransactionButton
                                {...unwrapEthQuery}
                                isDisabled={isAmountMoreThanUserBalance}
                                onClick={() => unwrapEthQuery.unwrap(sellAmount)}
                                onConfirmed={() => refetchUserBalances()}
                                width="full"
                                size="lg"
                            >
                                {isAmountMoreThanUserBalance
                                    ? `Insufficient ${networkConfig.eth.symbol} balance`
                                    : `Unwrap ${networkConfig.eth.symbol}`}
                            </BeetsSubmitTransactionButton>
                        ) : !hasApprovalForSellAmount && tokenInData ? (
                            <BeetsTokenApprovalButton
                                tokenWithAmount={{ ...tokenInData, amount: sellAmount }}
                                onConfirmed={() => {
                                    refetchAllowances();
                                }}
                                size="lg"
                            />
                        ) : (
                            <Button
                                variant="primary"
                                disabled={isReviewDisabled}
                                onClick={() => {
                                    tradeStopPolling();
                                    tradePreviewDisclosure.onOpen();
                                }}
                                width="full"
                                size="lg"
                            >
                                {isNotEnoughLiquidity
                                    ? 'Not enough liquidity'
                                    : isAmountMoreThanUserBalance
                                    ? `Insufficient ${getToken(tokenIn)?.symbol} balance`
                                    : 'Review swap'}
                            </Button>
                        )}
                    </Box>
                </VStack>
                {!isNativeAssetWrap && !isNativeAssetUnwrap && <TradeCardSwapBreakdown />}
            </Card>
            <TokenSelectModal
                finalFocusRef={tokenSelectKey === 'tokenIn' ? finalRefTokenIn : finalRefTokenOut}
                isOpen={tokenSelectDisclosure.isOpen}
                onOpen={tokenSelectDisclosure.onOpen}
                onClose={tokenSelectDisclosure.onClose}
            />
            <TradePreviewModal
                isOpen={tradePreviewDisclosure.isOpen}
                onClose={() => {
                    tradePreviewDisclosure.onClose();
                    tradeStartPolling();
                }}
            />
        </Box>
    );
}
