import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { reliquaryService } from '~/lib/services/staking/reliquary.service';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { makeVar, useReactiveVar } from '@apollo/client';

const selectedRelicId = makeVar<string | null>(null);

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const networkConfig = useNetworkConfig();

    const { data: relicPositions = [], isLoading: isLoadingRelicPositions } = useQuery(
        ['reliquaryAllPositions', userAddress],
        async () => {
            const positions = await reliquaryService.getAllPositions({ userAddress: userAddress || '', provider });

            if (positions.length > 0 && selectedRelicId() === null) {
                selectedRelicId(positions[0].relicId);
            }

            return positions;
        },
        {
            enabled: !!userAddress,
        },
    );

    const { data: maturityThresholds = [], isLoading: isLoadingMaturityThresholds } = useQuery<string[]>(
        ['maturityThresholds', networkConfig.reliquary.fbeets.farmId],
        async () => {
            return await reliquaryService.getMaturityThresholds({
                pid: networkConfig.reliquary.fbeets.farmId.toString(),
                provider,
            });
        },
        {
            refetchOnWindowFocus: false,
        },
    );

    const selectedRelic = (relicPositions || []).find((position) => position.relicId === selectedRelicId());

    const isLoading = isLoadingRelicPositions || isLoadingMaturityThresholds;

    return {
        relicPositions,
        isLoadingRelicPositions,
        isLoading,
        reliquaryService,
        maturityThresholds,
        selectedRelicId: useReactiveVar(selectedRelicId),
        selectedRelic: selectedRelic || null,
    };
}
