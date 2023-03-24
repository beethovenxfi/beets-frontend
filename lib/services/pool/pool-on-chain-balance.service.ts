import { BaseProvider } from '@ethersproject/providers';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { SorQueriesTotalSupplyType, sorQueryService, SorQueryService } from '~/lib/services/pool/sor-query.service';
import { formatFixed } from '@ethersproject/bignumber';
import { BigNumber } from 'ethers';
import { cloneDeep, keyBy, sumBy } from 'lodash';
import { oldBnumFromBnum } from './lib/old-big-number';

export class PoolOnChainBalanceService {
    constructor(private readonly sorQueryService: SorQueryService) {}

    public async updatePoolWithOnChainBalanceData({
        pool,
        provider,
        tokenPrices,
    }: {
        pool: GqlPoolUnion;
        provider: BaseProvider;
        tokenPrices: { address: string; price: number }[];
    }): Promise<GqlPoolUnion> {
        const balanceData = await this.getBalanceDataForPool({ pool, provider });
        const dataMap = keyBy(balanceData, 'poolId');
        const pricesMap = keyBy(tokenPrices, 'address');
        const clone = cloneDeep(pool);

        clone.dynamicData.totalShares = formatFixed(dataMap[pool.id].totalSupply, 18);

        for (const token of clone.tokens) {
            if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
                token.pool.totalShares = formatFixed(dataMap[token.pool.id].totalSupply, 18);
            }

            const tokenBalance = formatFixed(dataMap[pool.id].balances[token.index], token.decimals);
            token.balance = tokenBalance;
            token.totalBalance = tokenBalance;

            if (token.__typename === 'GqlPoolTokenLinear' || token.__typename === 'GqlPoolTokenPhantomStable') {
                const percentOfNestedSupply =
                    parseFloat(tokenBalance) / parseFloat(formatFixed(dataMap[token.pool.id].totalSupply, 18));

                for (const nestedToken of token.pool.tokens) {
                    const nestedTokenBalance = formatFixed(
                        dataMap[token.pool.id].balances[nestedToken.index],
                        nestedToken.decimals,
                    );

                    nestedToken.balance = formatFixed(
                        oldBnumFromBnum(dataMap[token.pool.id].balances[nestedToken.index])
                            .times(percentOfNestedSupply)
                            .toFixed(0)
                            .toString(),
                        nestedToken.decimals,
                    );

                    nestedToken.totalBalance = nestedTokenBalance;

                    if (nestedToken.__typename === 'GqlPoolTokenLinear') {
                        const totalShares = formatFixed(dataMap[nestedToken.pool.id].totalSupply, 18);
                        nestedToken.pool.totalShares = totalShares;

                        const percentOfLinearSupplyNested = parseFloat(nestedTokenBalance) / parseFloat(totalShares);

                        for (const nestedLinearToken of nestedToken.pool.tokens) {
                            const nestedLinearTokenbalance =
                                dataMap[nestedToken.pool.id].balances[nestedLinearToken.index];

                            nestedLinearToken.balance = formatFixed(
                                oldBnumFromBnum(nestedLinearTokenbalance)
                                    .times(percentOfNestedSupply)
                                    .times(percentOfLinearSupplyNested)
                                    .toFixed(0)
                                    .toString(),
                                nestedLinearToken.decimals,
                            );
                            nestedLinearToken.totalBalance = formatFixed(
                                nestedLinearTokenbalance,
                                nestedLinearToken.decimals,
                            );
                        }
                    }
                }
            }
        }

        clone.dynamicData.totalLiquidity = sumBy(
            clone.tokens.map((token) => pricesMap[token.address].price * parseFloat(token.balance)),
        ).toString();

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
