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

export function NavbarPendingRewardsReliquary({ ...rest }: BoxProps) {
    const { priceForAmount, getToken } = useGetTokens();
    const { harvestAll, ...harvestQuery } = useReliquaryHarvestAllRewards();
    const { data: batchRelayerHasApprovedForAll, refetch } = useBatchRelayerHasApprovedForAll();
    const {
        data: pendingRewards = [],
        refetch: refetchPendingRewards,
        isLoading: isLoadingPendingRewards,
    } = useReliquaryPendingRewards();

    const relicIds = pendingRewards.map((reward) => parseInt(reward.relicId || ''));
    const { data: harvestAllContractCallData } = useReliquaryHarvestAllContractCallData({ relicIds });

    const rewardTokens = Object.values(pendingRewards.map((reward) => reward.address)).filter(
        (v, i, a) => a.indexOf(v) === i,
    );
    const rewards = rewardTokens.map((address) => {
        const amount = sumBy(
            pendingRewards.filter((reward) => reward.address === address).map((reward) => parseFloat(reward.amount)),
        ).toString();
        return {
            address,
            amount,
        };
    });

    const pendingRewardsTotalUSD = sumBy(rewards.map((reward) => priceForAmount(reward)));

    return (
        <VStack {...rest} alignItems="stretch">
            <BeetsBox px="4" py="2" flexGrow="1">
                <Box color="gray.200" pb="2" fontSize="sm">
                    Pending Reliquary rewards
                </Box>
                {rewards.map((item, index) => (
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
            <Box mt="4" justifySelf="flex-end">
                {!batchRelayerHasApprovedForAll ? (
                    <BeetsTooltip label="To claim your pending rewards, you first need to approve the batch relayer.">
                        <Box w="full">
                            <ReliquaryBatchRelayerApprovalButton
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
                        Claim Reliquary rewards
                    </BeetsSubmitTransactionButton>
                )}
            </Box>
        </VStack>
    );
}
