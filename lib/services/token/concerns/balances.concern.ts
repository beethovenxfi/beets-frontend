import ERC20Abi from '../../../abi/ERC20.json';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { chunk } from 'lodash';
import { JsonRpcProvider } from '@ethersproject/providers';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { multicall } from '~/lib/services/util/multicaller.service';
import { AmountHumanReadable } from '~/lib/services/token/token-types';

// TYPES
export type BalanceMap = Map<string, AmountHumanReadable>;

export class BalancesConcern {
    constructor(
        private readonly provider: JsonRpcProvider,
        private readonly chainId: string,
        private readonly nativeAssetAddress: string,
        private readonly nativeAssetDecimals: number,
    ) {}

    public async getBalancesForAccount(account: string, tokens: GqlToken[]): Promise<BalanceMap> {
        const chunks = chunk(tokens, 1000);
        const multicalls: Promise<any>[] = [];

        chunks.forEach((chunk) => {
            const request = this.fetchBalances(account, chunk);
            multicalls.push(request);
        });

        const paginatedBalances = await Promise.all<BalanceMap>(multicalls);
        const validPages = paginatedBalances.filter((page) => !(page instanceof Error));

        return validPages.reduce((result, current) => Object.assign(result, current));
    }

    private async fetchBalances(account: string, tokens: GqlToken[]): Promise<BalanceMap> {
        try {
            const balanceMap: BalanceMap = new Map<string, string>();

            // If native asset included in addresses, filter out for
            // multicall, but fetch indpendently and inject.
            if (tokens.find((token) => token.address === this.nativeAssetAddress)) {
                tokens = tokens.filter((token) => token.address !== this.nativeAssetAddress);
                balanceMap.set(this.nativeAssetAddress.toLowerCase(), await this.fetchNativeBalance(account));
            }

            const balances: BigNumber[] = (
                await multicall<BigNumberish>(
                    this.chainId,
                    this.provider,
                    ERC20Abi,
                    tokens.map((token) => [token.address, 'balanceOf', [account]]),
                )
            ).map((result) => BigNumber.from(result ?? '0')); // If we fail to read a token's balance, treat it as zero

            return {
                ...this.associateBalances(balances, tokens),
                ...balanceMap,
            };
        } catch (error) {
            console.error(
                'Failed to fetch balances for:',
                tokens.map((token) => token.address),
            );
            throw error;
        }
    }

    private async fetchNativeBalance(account: string): Promise<string> {
        const balance = await this.provider.getBalance(account);
        return formatUnits(balance.toString(), this.nativeAssetDecimals);
    }

    private associateBalances(balances: BigNumber[], tokens: GqlToken[]): BalanceMap {
        const balanceMap: BalanceMap = new Map<string, string>();

        for (let i = 0; i < tokens.length; i++) {
            balanceMap.set(tokens[i].address, formatUnits(balances[i], tokens[i].decimals));
        }

        return balanceMap;
    }
}
