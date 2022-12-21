import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { ReliquaryFarmPosition, ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useMemo, useRef } from 'react';

function getMaturityProgress(relic: ReliquaryFarmPosition, maturities: string[]) {
    const relicMaturityStart = relic.entry;
    const timeElapsedSinceStart = Date.now() / 1000 - relicMaturityStart;
    const nextLevelMaturityIndex = maturities.findIndex((maturity) => timeElapsedSinceStart < parseInt(maturity, 10));
    const canUpgrade = nextLevelMaturityIndex > 0 && nextLevelMaturityIndex > relic.level;

    const currentLevelMaturity = parseInt(maturities[relic.level], 10);
    const timeElapsedSinceCurrentLevel = Date.now() - currentLevelMaturity;
    const timeBetweenCurrentAndNextLevel = parseInt(maturities[relic.level + 1], 10) - currentLevelMaturity;
    const progressToNextLevel = canUpgrade
        ? 100
        : (timeElapsedSinceCurrentLevel / timeBetweenCurrentAndNextLevel) * 100;
    return {
        canUpgrade,
        canUpgradeTo: nextLevelMaturityIndex - 1,
        progressToNextLevel,
    };
}

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const networkConfig = useNetworkConfig();
    const reliquaryService = useRef(
        new ReliquaryService(networkConfig.reliquary.address, networkConfig.chainId, networkConfig.beets.address),
    ).current;
    const farmId = useRef(1);
    const BPT: TokenBase = useMemo(() => {
        return { address: networkConfig.reliquary.fbeets.poolAddress, symbol: 'fBEETS', name: 'fBEETS', decimals: 18 };
    }, [networkConfig]);

    const { isLoading: isLoadingUserBalances, getUserBalance } = useUserBalances([BPT.address], [BPT]);
    const { data: relicPositions = [], isLoading: isLoadingRelicPositions } = useQuery(
        ['relicBalance', userAddress],
        async () => {
            return reliquaryService.getAllPositions({ userAddress: userAddress || '', provider });
        },
        {
            enabled: !!userAddress,
        },
    );

    const { data: maturityThresholds = [], isLoading: isLoadingMaturityThresholds } = useQuery<string[]>(
        ['maturityThresholds', farmId],
        async () => {
            return await reliquaryService.getMaturityThresholds({ pid: farmId.current.toString(), provider });
        },
        {
            refetchOnWindowFocus: false,
        },
    );

    const depositableBalance = getUserBalance(BPT.address);
    const isLoading = isLoadingUserBalances || isLoadingRelicPositions || isLoadingMaturityThresholds;

    return {
        relicPositions,
        isLoadingRelicPositions,
        depositableBalance,
        isLoading,
        reliquaryService,
        maturityThresholds,
    };
}
