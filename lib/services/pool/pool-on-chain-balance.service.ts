import { BaseProvider } from '@ethersproject/providers';
import { GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { SorQueriesTotalSupplyType, sorQueryService, SorQueryService } from '~/lib/services/pool/sor-query.service';

export class PoolOnChainBalanceService {
    constructor(private readonly sorQueryService: SorQueryService) {}

    public async updatePoolWithOnChainBalanceData({
        pool,
        provider,
    }: {
        pool: GqlPoolUnion;
        provider: BaseProvider;
    }): Promise<GqlPoolUnion> {
        throw new Error('TODO');
    }

    private async getBalanceDataForPool({ pool, provider }: { pool: GqlPoolUnion; provider: BaseProvider }) {
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
                        poolIds.push(token.pool.id);
                        totalSupplyTypes.push(this.sorQueryService.getTotalSupplyType(token.pool));
                    }
                }
            }
        }

        return this.sorQueryService.getPoolData({
            poolIds,
            provider,
            config: {
                loadTokenBalanceUpdatesAfterBlock: true,
                loadTotalSupply: true,
                totalSupplyTypes,
            },
        });
    }
}

export const poolOnChainBalanceService = new PoolOnChainBalanceService(sorQueryService);
