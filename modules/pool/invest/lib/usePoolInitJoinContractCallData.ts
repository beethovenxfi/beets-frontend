import { useQuery } from 'react-query';
import { PoolJoinData } from '~/lib/services/pool/pool-types';

import { PoolCreationToken } from '~/modules/compose/ComposeProvider';
import { weightedPoolComposeService } from '~/lib/services/pool/pool-weighted-compose.service';
import { useGetTokens } from '~/lib/global/useToken';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { TokenAmountHumanReadable } from '~/lib/services/token/token-types';

// This is a separate hook as the main contract call data hook relies on the pool context,
// which will not exist at the time of pool creation
export function usePoolInitJoinGetContractCallData(tokens: PoolCreationToken[]) {
    const { getToken } = useGetTokens();
    const inputAmountsArray = tokens.map((token) => {
        return {
            address: token.address,
            amount: token.amount,
        } as TokenAmountHumanReadable;
    });

    const tokenMetadata: GqlToken[] = tokens
        .map((token) => getToken(token.address))
        .filter((token) => token !== null) as GqlToken[];

    const initJoinData: PoolJoinData = {
        kind: 'Init',
        tokenAmountsIn: inputAmountsArray,
        maxAmountsIn: inputAmountsArray,
    } as PoolJoinData;

    return useQuery(
        ['initJoinGetContractCallData', initJoinData],
        async () => {
            const contractCallData = weightedPoolComposeService.joinGetContractCallData(tokenMetadata, initJoinData);
            return contractCallData;
        },
        { enabled: inputAmountsArray.length > 0, staleTime: 0, cacheTime: 0 },
    );
}
