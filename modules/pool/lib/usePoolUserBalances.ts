import { usePool } from '~/modules/pool/lib/usePool';
import { useUserBalances } from '~/lib/global/useUserBalances';

export function usePoolUserBalances() {
    const { pool, allTokens, allTokenAddresses } = usePool();
    const { userBalances, loadingUserBalances } = useUserBalances(allTokenAddresses, allTokens);
}
