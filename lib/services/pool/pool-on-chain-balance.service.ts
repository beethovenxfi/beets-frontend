import { BaseProvider } from '@ethersproject/providers';
import {
    GqlPoolLinearNested,
    GqlPoolPhantomStableNested,
    GqlPoolUnion,
} from '~/apollo/generated/graphql-codegen-generated';
import { SorQueriesTotalSupplyType, sorQueryService, SorQueryService } from '~/lib/services/pool/sor-query.service';
import { AdditionalPoolData } from '~/lib/services/pool/pool-types';
import { formatFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';
import { cloneDeep, keyBy } from 'lodash';

export class PoolOnChainBalanceService {
    constructor(private readonly sorQueryService: SorQueryService) {}

    public async updatePoolWithOnChainBalanceData({
        pool,
        provider,
    }: {
        pool: GqlPoolUnion;
        provider: BaseProvider;
    }): Promise<GqlPoolUnion> {
        const balanceData = await this.getBalanceDataForPool({ pool, provider });
        const dataMap = keyBy(balanceData, 'poolId');
        const clone = cloneDeep(pool);

        clone.dynamicData.totalShares = formatFixed(dataMap[pool.id].totalSupply, 18);

        //TODO: finish building this out
        for (const token of clone.tokens) {
            if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
                token.pool.totalShares = formatFixed(dataMap[token.pool.id].totalSupply, 18);
            }

            const tokenBalance = formatFixed(dataMap[pool.id].balances[token.index], token.decimals);
            token.balance = tokenBalance;
            token.totalBalance = tokenBalance;

            if (token.__typename === 'GqlPoolTokenPhantomStable') {
                const percentOfNestedSupply =
                    parseFloat(tokenBalance) / parseFloat(formatFixed(dataMap[token.pool.id].totalSupply, 18));
                for (const nestedToken of token.pool.tokens) {
                    const nestedTokenBalance = formatFixed(
                        dataMap[token.pool.id].balances[nestedToken.index],
                        nestedToken.decimals,
                    );
                    nestedToken.balance = (percentOfNestedSupply * parseFloat(nestedTokenBalance)).toString();
                    nestedToken.totalBalance = nestedTokenBalance;

                    if (nestedToken.__typename === 'GqlPoolTokenLinear') {
                        const totalShares = formatFixed(dataMap[nestedToken.pool.id].totalSupply, 18);
                        nestedToken.pool.totalShares = totalShares;
                        const percentOfLinearSupplyNested = parseFloat(nestedTokenBalance) / parseFloat(totalShares);

                        for (const nestedLinearToken of nestedToken.pool.tokens) {
                            const nestedLinearTokenbalance = formatFixed(
                                dataMap[nestedToken.pool.id].balances[nestedLinearToken.index],
                                nestedLinearToken.decimals,
                            );

                            nestedLinearToken.balance = (
                                percentOfNestedSupply *
                                percentOfLinearSupplyNested *
                                parseFloat(nestedLinearTokenbalance)
                            ).toString();
                            nestedLinearToken.totalBalance = nestedLinearTokenbalance;
                        }
                    }
                }
            }
        }

        return clone;
    }

    private async getBalanceDataForPool({
        pool,
        provider,
    }: {
        pool: GqlPoolUnion;
        provider: BaseProvider;
    }): Promise<{ poolId: string; balances: BigNumber[]; totalSupply: BigNumber }[]> {
        const poolIds: string[] = [pool.id];
        const totalSupplyTypes: SorQueriesTotalSupplyType[] = [this.sorQueryService.getTotalSupplyType(pool)];

        for (const token of pool.tokens) {
            if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
                poolIds.push(token.pool.id);
                totalSupplyTypes.push(this.sorQueryService.getTotalSupplyType(token.pool));
            }

            if (token.__typename === 'GqlPoolTokenPhantomStable') {
                for (const nestedToken of token.pool.tokens) {
                    if (nestedToken.__typename === 'GqlPoolTokenLinear') {
                        poolIds.push(nestedToken.pool.id);
                        totalSupplyTypes.push(this.sorQueryService.getTotalSupplyType(nestedToken.pool));
                    }
                }
            }
        }

        const { balances, totalSupplies } = await this.sorQueryService.getPoolData({
            poolIds,
            provider,
            config: {
                loadTokenBalanceUpdatesAfterBlock: true,
                blockNumber: 0,
                loadTotalSupply: true,
                totalSupplyTypes,
            },
        });

        return poolIds.map((poolId, index) => ({
            poolId,
            balances: balances[index],
            totalSupply: totalSupplies[index],
        }));
    }
}

export const poolOnChainBalanceService = new PoolOnChainBalanceService(sorQueryService);
