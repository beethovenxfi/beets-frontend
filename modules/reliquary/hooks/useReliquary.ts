import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useRef } from 'react';

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();
    const networkConfig = useNetworkConfig();
    const reliquaryService = useRef(
        new ReliquaryService(networkConfig.reliquary.address, networkConfig.chainId, networkConfig.beets.address),
    ).current;

    const bpt: TokenBase = {
        address: networkConfig.reliquary.fbeets.poolAddress,
        symbol: 'fBEETS',
        name: 'fBEETS',
        decimals: 18,
    };

    const { isLoading: isLoadingUserBalances, getUserBalance } = useUserBalances([bpt.address], [bpt]);
    const { data: relicPositions = [], isLoading: isLoadingRelicPositions } = useQuery(
        ['relicBalance', userAddress],
        async () => {
            return reliquaryService.getAllPositions({ userAddress: userAddress || '', provider });
        },
        {
            enabled: !!userAddress,
        },
    );

    const depositableBalance = getUserBalance(bpt.address);

    const isLoading = isLoadingUserBalances || isLoadingRelicPositions;
    return {
        relicPositions,
        isLoadingRelicPositions,
        depositableBalance,
        isLoading,
    };
}
