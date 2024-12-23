import { Box, Flex, Heading, Link, Skeleton, Text } from '@chakra-ui/react';
import { parseUnits } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { ExternalLink } from 'react-feather';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { etherscanGetAddressUrl } from '~/lib/util/etherscan';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { beetsOftProxy, useBridgeBeets } from '../../lib/useBridgeBeets';

export function ReliquarySonicMigrateBridgeBeets() {
    const networkConfig = useNetworkConfig();
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const { userBalances, isLoading, refetch: refetchUserBalances } = useUserTokenBalances();
    const beetsBalance = userBalances.find((balance) => balance.address === networkConfig.beets.address)?.amount || '0';
    const hasBeetsBalance = parseUnits(beetsBalance, 18).gt(0);
    const beetsTokenWithBalance: TokenBaseWithAmount = {
        address: networkConfig.beets.address,
        amount: beetsBalance,
        name: 'Beethoven X',
        symbol: 'BEETS',
        decimals: 18,
    };

    const { bridge, ...bridgeQuery } = useBridgeBeets();

    const {
        hasApprovalForAmount,
        isLoading: isLoadingAllowances,
        refetch: refetchUserAllowances,
    } = useUserAllowances([beetsTokenWithBalance], beetsOftProxy);

    useEffect(() => {
        const _steps: TransactionStep[] = [];

        if (!isLoadingAllowances) {
            if (!hasApprovalForAmount(beetsTokenWithBalance.address, beetsTokenWithBalance.amount)) {
                _steps.push({
                    id: 'approve',
                    type: 'tokenApproval',
                    buttonText: `Approve BEETS`,
                    tooltipText: `Approve BEETS for bridging`,
                    token: beetsTokenWithBalance,
                    contractToApprove: beetsOftProxy,
                });
            }

            _steps.push({
                id: 'bridge',
                type: 'other',
                buttonText: 'Bridge BEETS and receive lzBEETS on Sonic',
                tooltipText: 'Bridge BEETS and receive lzBEETS on Sonic',
            });

            setSteps(_steps);
        }
    }, [isLoadingAllowances]);

    return (
        <Box>
            <Heading size="md">3. Bridge your BEETS on Fantom for lzBEETS on Sonic</Heading>
            {isLoading && <Skeleton height="100px" width="full" mt="2" />}
            {!hasBeetsBalance && !isLoading && <Text>You don't have any BEETS to bridge.</Text>}
            {hasBeetsBalance && !isLoading && (
                <>
                    <Text mb="2">
                        You'll bridge your BEETS using Layer Zero. You'll be interacting with the BeetsProxyOFTV2
                        contract. Verify the address in all transactions.
                    </Text>
                    <Box mb="4">
                        <Link href={etherscanGetAddressUrl(beetsOftProxy)} target="_blank">
                            <Flex alignItems="center">
                                <Text mr="1"> BeetsProxyOFTV2: {beetsOftProxy}</Text>
                                <ExternalLink size={16} />
                            </Flex>
                        </Link>
                    </Box>

                    <BeetsTransactionStepsSubmit
                        isLoading={steps === null}
                        loadingButtonText="Bridge BEETS"
                        completeButtonText="Bridging complete"
                        onCompleteButtonClick={() => {}}
                        steps={steps || []}
                        onSubmit={() => {
                            //bridge(beetsBalance);
                            bridge('1');
                        }}
                        onConfirmed={(id) => {
                            if (id !== 'bridge') {
                                refetchUserAllowances();
                            } else {
                                refetchUserBalances();
                            }
                        }}
                        queries={[{ ...bridgeQuery, id: 'bridge' }]}
                    />
                </>
            )}
        </Box>
    );
}
