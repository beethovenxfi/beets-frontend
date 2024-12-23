import { Box, Button, Divider, Flex, Heading, Skeleton, StackDivider, Text, VStack } from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import TokenRow from '~/components/token/TokenRow';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useAllRelicsDepositBalances } from '../../lib/useAllRelicsDepositBalances';
import useReliquary from '../../lib/useReliquary';
import { useAllRelicsWithdrawAndHarvestContractCallData } from '../../lib/useAllRelicsWithdrawAndHarvestContractCallData';
import { ReliquaryTransactionStepsSubmit, TransactionStep } from '../../components/ReliquaryTransactionStepsSubmit';
import { useReliquaryZap } from '../../lib/useReliquaryZap';

export function ReliquarySonicMigrateExitRelics() {
    const networkConfig = useNetworkConfig();
    const { refetchRelicPositions } = useReliquary();
    const {
        relics: relicsToFilter,
        allRelicsUsdValue,
        allRelicsBeetsAmount,
        allRelicsWftmAmount,
        alllRelicsBptTotal,
        isLoading,
    } = useAllRelicsDepositBalances();

    const relics = relicsToFilter.filter((relic) => relic.amount !== '0.0');
    const relicNumbersString = relics.map((relic, idx) => `${idx !== 0 ? ', #' : '#'}${relic.relicId}`);

    const { data: contractCallData, isLoading: isLoadingReliquaryContractCallData } =
        useAllRelicsWithdrawAndHarvestContractCallData();
    const { reliquaryZap, ...reliquaryZapQuery } = useReliquaryZap('WITHDRAW');

    const steps: TransactionStep[] = [{ id: 'exit', tooltipText: '', type: 'other', buttonText: 'Exit relics' }];
    const hasRelics = !isLoading && relics.length > 0;

    return (
        <Box>
            <Heading size="md">1. Exit Your Relics</Heading>
            {isLoading ? <Skeleton width="full" height="200px" /> : null}
            {!hasRelics && <Text mb="4">You have no relics in this wallet.</Text>}
            {hasRelics && (
                <>
                    <Text mb="4">
                        In this wallet, you have {relics.length} relics with a total value of{' '}
                        {numberFormatUSDValue(allRelicsUsdValue)}.
                    </Text>

                    <BeetsBox mb="6">
                        <Flex p="2">
                            <Text fontSize="lg" fontWeight="semibold" flex="1">
                                Relic IDs
                            </Text>
                            <Skeleton isLoaded={!isLoading}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {relicNumbersString}
                                </Text>
                            </Skeleton>
                        </Flex>
                        <Divider borderColor="whiteAlpha.200" />
                        <Flex p="2">
                            <Text fontSize="lg" fontWeight="semibold" flex="1">
                                Total value
                            </Text>
                            <Skeleton isLoaded={!isLoading}>
                                <Text fontSize="lg" fontWeight="semibold">
                                    {numberFormatUSDValue(allRelicsUsdValue)}
                                </Text>
                            </Skeleton>
                        </Flex>
                        <Divider borderColor="whiteAlpha.200" />

                        <Text fontSize="lg" fontWeight="semibold" p="2">
                            Tokens breakdown
                        </Text>
                        <VStack width="full" divider={<StackDivider borderColor="whiteAlpha.200" />}>
                            <Box width="full" p="2">
                                <TokenRow address={networkConfig.wethAddress} amount={allRelicsWftmAmount} />
                            </Box>
                            <Box width="full" p="2">
                                <TokenRow address={networkConfig.beets.address} amount={allRelicsBeetsAmount} />
                            </Box>
                        </VStack>
                    </BeetsBox>

                    <ReliquaryTransactionStepsSubmit
                        isLoading={isLoadingReliquaryContractCallData}
                        loadingButtonText=""
                        completeButtonText="Successfully exited relics"
                        onCompleteButtonClick={() => {}}
                        onSubmit={() => {
                            if (contractCallData) {
                                reliquaryZap(contractCallData);
                            }
                        }}
                        onConfirmed={async (id) => {
                            /* if (id === 'exit') {
                        onWithdrawComplete();
                        refetchRelicPositions();
                    } */

                            refetchRelicPositions();
                        }}
                        steps={steps || []}
                        queries={[{ ...reliquaryZapQuery, id: 'exit' }]}
                    />
                </>
            )}
        </Box>
    );
}
