import { Box, VStack, BoxProps } from '@chakra-ui/react';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useGetTokens } from '~/lib/global/useToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useReliquaryHarvestAllRewards } from '../reliquary/lib/useReliquaryHarvestAllRewards';
import { useReliquaryHarvestAllContractCallData } from '../reliquary/lib/useReliquaryHarvestAllContractCallData';
import { useReliquaryPendingRewards } from '../reliquary/lib/useReliquaryPendingRewards';
import { sumBy } from 'lodash';
import { useBatchRelayerHasApprovedForAll } from '../reliquary/lib/useBatchRelayerHasApprovedForAll';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { ReliquaryBatchRelayerApprovalButton } from '../reliquary/components/ReliquaryBatchRelayerApprovalButton';
import { useUserData } from '~/lib/user/useUserData';

export function NavbarPendingRewardsReliquary({ ...rest }: BoxProps) {
    const { priceForAmount, getToken } = useGetTokens();
    const { newFbeetsValueUSD } = useUserData();
    const { harvestAll, ...harvestQuery } = useReliquaryHarvestAllRewards();
    const { data: batchRelayerHasApprovedForAll, refetch } = useBatchRelayerHasApprovedForAll();
    const {
        data: rewards,
        refetch: refetchPendingRewards,
        isLoading: isLoadingPendingRewards,
    } = useReliquaryPendingRewards();

    const { data: harvestAllContractCallData } = useReliquaryHarvestAllContractCallData(rewards?.relicIds || []);

    const pendingRewardsTotalUSD = sumBy(rewards?.rewards.map((reward) => priceForAmount(reward)));

    return (
        <VStack {...rest} alignItems="stretch" spacing="4">
            <BeetsBox px="4" py="2" flexGrow="1">
                <Box color="gray.200" pb="2" fontSize="sm">
                    Pending maBEETS rewards
                </Box>
                {rewards?.rewards.map((item, index) => (
                    <Box key={index}>
                        <Box fontSize="xl" fontWeight="normal" lineHeight="26px">
                            {tokenFormatAmount(item.amount)} {getToken(item.address)?.symbol}
                        </Box>
                        <Box pt="2" color="gray.200">
                            {numberFormatUSDValue(priceForAmount(item))}
                        </Box>
                    </Box>
                ))}
            </BeetsBox>
            <BeetsBox mt="4" px="4" py="2">
                <Box color="gray.200" pb="2" fontSize="sm">
                    Total deposited
                </Box>
                <Box fontSize="xl" fontWeight="normal" lineHeight="26px">
                    {numberFormatUSDValue(newFbeetsValueUSD)}
                </Box>
                <Box color="gray.200" pt="2" fontSize="sm">
                    in {rewards?.numberOfRelics} relic(s)
                </Box>
            </BeetsBox>
            <Box mt="4" justifySelf="flex-end">
                {!batchRelayerHasApprovedForAll ? (
                    <BeetsTooltip label="To claim your pending rewards, you first need to approve the batch relayer.">
                        <Box w="full">
                            <ReliquaryBatchRelayerApprovalButton
                                buttonText="Approve Batch Relayer"
                                onConfirmed={() => {
                                    refetch();
                                }}
                            />
                        </Box>
                    </BeetsTooltip>
                ) : (
                    <BeetsSubmitTransactionButton
                        {...harvestQuery}
                        isDisabled={pendingRewardsTotalUSD < 0.01}
                        onClick={() => harvestAll(harvestAllContractCallData || [])}
                        width="full"
                        submittingText="Confirm..."
                        pendingText="Waiting..."
                        onConfirmed={() => refetchPendingRewards()}
                    >
                        Claim all maBEETS rewards
                    </BeetsSubmitTransactionButton>
                )}
            </Box>
        </VStack>
    );
}
