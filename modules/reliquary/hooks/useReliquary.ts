import { Provider } from '@wagmi/core';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';
import { ReliquaryStakingService } from '~/lib/services/batch-relayer/extensions/reliquary-staking.service';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useUserData } from '~/lib/user/useUserData';
import { useBalances } from '~/lib/util/useBalances';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';

const reliquaryService = new ReliquaryService('0xb0FC43069089d0fA02baAa896ac2eFcb596D7D05', '250', '');

async function getRelicPositions(userAddress: string, provider: Provider) {
    const positions = await reliquaryService.getAllPositions({ userAddress, provider });
    return positions;
}

export const SBT_TEST_POOL = '0xfb2aeb7df228872de762694e2bc3525cf33b940d';
export const SBT_TEST_POOL_FULL = '0xfb2aeb7df228872de762694e2bc3525cf33b940d0002000000000000000005ce';

const bpt: TokenBase = {
    address: SBT_TEST_POOL,
    symbol: 'SBT',
    name: 'SBT',
    decimals: 18,
};

export default function useReliquary() {
    const { userAddress } = useUserAccount();
    const provider = useProvider();

    const { userBalances, isLoading: isLoadingUserBalances } = useUserBalances([SBT_TEST_POOL], [bpt]);
    const { data: relicPositions = [], isLoading: isLoadingRelicPositions } = useQuery(
        ['relicBalance', userAddress],
        async () => {
            return await getRelicPositions(userAddress || '', provider);
        },
        {
            enabled: userAddress !== '',
        },
    );

    const depositableBalance =
        userBalances.find((balance) => balance.address.toLowerCase() === SBT_TEST_POOL.toLowerCase())?.amount || '0';

        const isLoading = isLoadingUserBalances || isLoadingRelicPositions;
    return {
        relicPositions,
        isLoadingRelicPositions,
        depositableBalance,
        isLoading
    };
}
