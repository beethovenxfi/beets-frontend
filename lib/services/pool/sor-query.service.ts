import { Contract } from '@ethersproject/contracts';
import { networkConfig } from '~/lib/config/network-config';
import { BaseProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import BalancerSorQueriesAbi from '~/lib/abi/BalancerSorQueries.json';
import { GqlPoolComposableStableNested, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';

export enum SorQueriesTotalSupplyType {
    TOTAL_SUPPLY = 0,
    VIRTUAL_SUPPLY,
    ACTUAL_SUPPLY,
}

export enum SorQueriesSwapFeeType {
    SWAP_FEE_PERCENTAGE = 0,
    PERCENT_FEE,
}

export interface SorPoolDataQueryConfig {
    loadTokenBalanceUpdatesAfterBlock: boolean;
    loadTotalSupply: boolean;
    loadSwapFees: boolean;
    loadLinearWrappedTokenRates: boolean;
    loadNormalizedWeights: boolean;
    loadScalingFactors: boolean;
    loadAmps: boolean;
    blockNumber: number;
    totalSupplyTypes: SorQueriesTotalSupplyType[];
    swapFeeTypes: SorQueriesSwapFeeType[];
    linearPoolIdxs: number[];
    weightedPoolIdxs: number[];
    scalingFactorPoolIdxs: number[];
    ampPoolIdxs: number[];
}

const defaultPoolDataQueryConfig: SorPoolDataQueryConfig = {
    loadTokenBalanceUpdatesAfterBlock: false,
    loadTotalSupply: false,
    loadSwapFees: false,
    loadLinearWrappedTokenRates: false,
    loadNormalizedWeights: false,
    loadScalingFactors: false,
    loadAmps: false,
    blockNumber: 0,
    totalSupplyTypes: [],
    swapFeeTypes: [],
    linearPoolIdxs: [],
    weightedPoolIdxs: [],
    scalingFactorPoolIdxs: [],
    ampPoolIdxs: [],
};

export class SorQueryService {
    constructor(private readonly sorQueriesContractAddress: string) {}

    public async getPoolData({
        poolIds,
        provider,
        config,
    }: {
        poolIds: string[];
        provider: BaseProvider;
        config: Partial<SorPoolDataQueryConfig>;
    }): Promise<{
        balances: BigNumber[][];
        totalSupplies: BigNumber[];
        swapFees: BigNumber[];
        linearWrappedTokenRates: BigNumber[];
        weights: BigNumber[][];
        scalingFactors: BigNumber[][];
        amps: BigNumber[];
    }> {
        const contract = new Contract(this.sorQueriesContractAddress, BalancerSorQueriesAbi, provider);

        const response = await contract.getPoolData(poolIds, {
            ...defaultPoolDataQueryConfig,
            ...config,
        });

        return {
            balances: response[0],
            totalSupplies: response[1],
            swapFees: response[2],
            linearWrappedTokenRates: response[3],
            weights: response[4],
            scalingFactors: response[5],
            amps: response[6],
        };
    }

    public getTotalSupplyType(pool: GqlPoolUnion | GqlPoolComposableStableNested): SorQueriesTotalSupplyType {
        const isComposableStable = ['GqlPoolComposableStable', 'GqlPoolComposableStableNested'].includes(
            pool.__typename,
        );

        if ((pool.__typename === 'GqlPoolWeighted' && pool.version >= 2) || (isComposableStable && pool.version > 0)) {
            return SorQueriesTotalSupplyType.ACTUAL_SUPPLY;
        } else if (isComposableStable && pool.version === 0) {
            return SorQueriesTotalSupplyType.VIRTUAL_SUPPLY;
        } else {
            return SorQueriesTotalSupplyType.TOTAL_SUPPLY;
        }
    }
}

export const sorQueryService = new SorQueryService(networkConfig.balancer.sorQueries);
