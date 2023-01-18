import { Box, VStack, BoxProps } from '@chakra-ui/react';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { useGetTokens } from '~/lib/global/useToken';
import { BeetsBox } from '~/components/box/BeetsBox';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useReliquaryHarvestAllRewards } from '../reliquary/lib/useReliquaryHarvestAllRewards';
import { useReliquaryHarvestAllContractCallData } from '../reliquary/lib/useReliquaryHarvestAllContractCallData';
import { useReliquaryPendingRewards } from '../reliquary/lib/useReliquaryPendingRewards';

export function NavbarPendingRewardsReliquary({ ...rest }: BoxProps) {
    const { getToken } = useGetTokens();
    const { harvestAll, ...harvestQuery } = useReliquaryHarvestAllRewards();
    const {
        data: pendingRewards = [],
        refetch: refetchPendingRewards,
        isLoading: isLoadingPendingRewards,
    } = useReliquaryPendingRewards();
    //const { data: harvestAllContractCallData } = useReliquaryHarvestAllContractCallData({ relicIds });

    return (
        <VStack {...rest} alignItems="stretch">
            <BeetsBox px="4" py="2" flexGrow="1">
                <Box color="gray.200" pb="2" fontSize="sm">
                    Pending Reliquary rewards
                </Box>
                {pendingRewards.map((item) => (
                    <Box fontSize="xl" fontWeight="normal" lineHeight="26px" key={item.address}>
                        {tokenFormatAmount(item.amount)} {getToken(item.address)?.symbol}
                    </Box>
                ))}
                {/* <Box pt="2" color="gray.200">
                    {numberFormatUSDValue(pendingRewardsTotalUSD)}
                </Box> */}
            </BeetsBox>
            <Box mt="4" justifySelf="flex-end">
                <BeetsSubmitTransactionButton
                    {...harvestQuery}
                    //onClick={() => harvestAll(harvestAllContractCallData || [])}
                    onClick={() => {
                        return null;
                    }}
                    width="full"
                >
                    Claim Reliquary rewards
                </BeetsSubmitTransactionButton>
            </Box>
        </VStack>
    );
}
