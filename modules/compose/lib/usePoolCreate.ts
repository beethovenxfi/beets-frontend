import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import WeightedPoolFactoryV4 from '~/lib/abi/WeightedPoolFactoryV4.json';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { PoolCreationToken } from '../ComposeProvider';
import { BigNumber as EPBigNumber } from 'ethers';
import BigNumber from 'bignumber.js';
import { toNormalizedWeights } from '@balancer-labs/balancer-js';
import { useGetTokens } from '~/lib/global/useToken';
import { BytesLike, randomBytes, toUtf8Bytes } from 'ethers/lib/utils.js';
import { generateSalt } from '~/lib/util/random';
import { scale } from '~/lib/util/number-formats';
import { AddressZero } from '@ethersproject/constants';

export interface CreateWeightedPoolRequest {
    name: string;
    symbol: string;
    tokens: PoolCreationToken[];
    swapFee: string;
    swapFeeManager: string;
}

function scaleTokenWeights(tokens: PoolCreationToken[]): string[] {
    const weights: EPBigNumber[] = tokens.map((token: PoolCreationToken) => {
        const normalizedWeight = new BigNumber(token.weight).multipliedBy(new BigNumber(1e16));
        return EPBigNumber.from(normalizedWeight.toString());
    });
    const normalizedWeights = toNormalizedWeights(weights);
    const weightStrings = normalizedWeights.map((weight: EPBigNumber) => {
        return weight.toString();
    });

    return weightStrings;
}

export function usePoolCreate() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.balancer.weightedPoolFactory,
            contractInterface: WeightedPoolFactoryV4,
            functionName: 'create',
        },
        transactionType: 'CREATE_POOL',
    });

    function create({ name, symbol, tokens, swapFee, swapFeeManager }: CreateWeightedPoolRequest) {
        const tokenAddresses = tokens.map((token: PoolCreationToken) => token.address);
        const scaledTokenWeights = scaleTokenWeights(tokens);
        const swapFeeScaled = scale(new BigNumber(swapFee), 18);
        return submit({
            args: [
                name,
                symbol,
                tokenAddresses,
                scaledTokenWeights,
                tokens.map(_ => AddressZero), // rate providers TODO VERIFY
                swapFeeScaled.toString(),
                swapFeeManager,
                generateSalt(), // TODO VERIFY
            ],
            toastText: `Create weighted pool ${name} - ${symbol}`,
            walletText: `Create weighted pool ${name} - ${symbol} `,
        });
    }

    return {
        create,
        ...rest,
    };
}
