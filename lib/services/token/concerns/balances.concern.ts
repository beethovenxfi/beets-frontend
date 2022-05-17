import ERC20Abi from '../../../abi/ERC20.json';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { getAddress } from '@ethersproject/address';
import { formatUnits } from '@ethersproject/units';
import { chunk } from 'lodash';
import { JsonRpcProvider } from '@ethersproject/providers';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { multicall } from '~/lib/services/util/multicaller.service';

// TYPES
export type BalanceMap = { [address: string]: string };

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
        let addresses = tokens.map((token) => token.address);

        try {
            const balanceMap: BalanceMap = {};

            // If native asset included in addresses, filter out for
            // multicall, but fetch indpendently and inject.
            if (addresses.includes(this.nativeAssetAddress)) {
                addresses = addresses.filter((address) => address !== this.nativeAssetAddress);
                balanceMap[this.nativeAssetAddress] = await this.fetchNativeBalance(account);
            }

            const balances: BigNumber[] = (
                await multicall<BigNumberish>(
                    this.chainId,
                    this.provider,
                    ERC20Abi,
                    addresses.map((address) => [address, 'balanceOf', [account]]),
                )
            ).map((result) => BigNumber.from(result ?? '0')); // If we fail to read a token's balance, treat it as zero

            return {
                ...this.associateBalances(balances, tokens),
                ...balanceMap,
            };
        } catch (error) {
            console.error('Failed to fetch balances for:', addresses);
            throw error;
        }
    }

    private async fetchNativeBalance(account: string): Promise<string> {
        const balance = await this.provider.getBalance(account);
        return formatUnits(balance.toString(), this.nativeAssetDecimals);
    }

    private associateBalances(balances: BigNumber[], tokens: GqlToken[]): BalanceMap {
        return Object.fromEntries(
            tokens.map((token, i) => [getAddress(token.address), formatUnits(balances[i], token.decimals)]),
        );
    }
}
