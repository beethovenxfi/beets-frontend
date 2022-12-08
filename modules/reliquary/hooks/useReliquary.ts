import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useMemo, useRef } from 'react';

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const networkConfig = useNetworkConfig();
    const reliquaryService = useRef(
        new ReliquaryService(networkConfig.reliquary.address, networkConfig.chainId, networkConfig.beets.address),
    ).current;

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

    const depositableBalance = getUserBalance(BPT.address);

    const isLoading = isLoadingUserBalances || isLoadingRelicPositions;
    return {
        relicPositions,
        isLoadingRelicPositions,
        depositableBalance,
        isLoading,
    };
}
