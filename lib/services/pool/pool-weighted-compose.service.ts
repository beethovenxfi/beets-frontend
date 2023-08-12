import { PoolCreationToken } from '~/modules/compose/ComposeProvider';
import { PoolJoinContractCallData, PoolJoinData } from './pool-types';
import { poolScaleTokenAmounts } from './lib/util';
import { GqlPoolTokenBase, GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { WeightedPoolEncoder } from '@balancer-labs/balancer-js';

export class WeightedPoolComposeService {
    constructor() {}

    public joinGetContractCallData(tokenMetadata: GqlToken[], data: PoolJoinData): PoolJoinContractCallData {
        const assets = data.maxAmountsIn.map((token) => token.address);
        const maxAmountsIn = poolScaleTokenAmounts(data.maxAmountsIn, tokenMetadata);
        const userData = WeightedPoolEncoder.joinInit(maxAmountsIn);

        return {
            assets,
            maxAmountsIn,
            userData,
            type: 'JoinPool',
        };
    }
}

export const weightedPoolComposeService = new WeightedPoolComposeService();
