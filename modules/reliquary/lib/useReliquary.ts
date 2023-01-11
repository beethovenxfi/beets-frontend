import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { reliquaryService } from '~/lib/services/staking/reliquary.service';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { makeVar, useReactiveVar } from '@apollo/client';
import { usePool } from '~/modules/pool/lib/usePool';
import { sumBy } from 'lodash';

const selectedRelicId = makeVar<string | undefined>(undefined);
const createRelic = makeVar<boolean>(false);

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();

    const { data: relicPositions = [], isLoading: isLoadingRelicPositions } = useQuery(
        ['reliquaryAllPositions', userAddress],
        async () => {
            const positions = await reliquaryService.getAllPositions({ userAddress: userAddress || '', provider });

            if (positions.length > 0 && selectedRelicId() === undefined) {
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

    const beetsPerSecond = pool.staking?.reliquary?.beetsPerSecond || '0';
    const reliquaryLevels = pool.staking?.reliquary?.levels || [];
    const selectedRelicLevel = reliquaryLevels.find((level) => level.level === selectedRelic?.level);
    const weightedTotalBalance = sumBy(reliquaryLevels, (level) => parseFloat(level.balance) * level.allocationPoints);

    function setCreateRelic(value: boolean) {
        createRelic(value);
    }

    function setSelectedRelicId(value: string) {
        selectedRelicId(value);
    }

    return {
        relicPositions,
        isLoadingRelicPositions,
        isLoading,
        reliquaryService,
        maturityThresholds,
        selectedRelicId: useReactiveVar(selectedRelicId),
        selectedRelic: selectedRelic || null,
        selectedRelicApr: selectedRelicLevel?.apr || '0',
        beetsPerSecond,
        beetsPerDay: parseFloat(beetsPerSecond) * 86400,
        selectedRelicLevel,
        weightedTotalBalance,
        createRelic: useReactiveVar(createRelic),

        setCreateRelic,
        setSelectedRelicId,
    };
}
