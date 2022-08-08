import ERC20Abi from '../../../abi/ERC20.json';
import { BigNumber, BigNumberish } from '@ethersproject/bignumber';
import { formatUnits } from '@ethersproject/units';
import { chunk, flatten } from 'lodash';
import { BaseProvider } from '@ethersproject/providers';
import { multicall } from '~/lib/services/util/multicaller.service';
import { TokenAmountHumanReadable, TokenBase } from '~/lib/services/token/token-types';

export class BalancesConcern {
    constructor(
        private readonly provider: BaseProvider,
        private readonly chainId: string,
        private readonly nativeAssetAddress: string,
        private readonly nativeAssetDecimals: number,
    ) {}

    public async getBalancesForAccount(account: string, tokens: TokenBase[]): Promise<TokenAmountHumanReadable[]> {
        const chunks = chunk(tokens, 1000);
        const multicalls: Promise<any>[] = [];

        chunks.forEach((chunk) => {
            const request = this.fetchBalances(account, chunk);
            multicalls.push(request);
        });

        const paginatedBalances = await Promise.all<TokenAmountHumanReadable[]>(multicalls);
        const validPages = paginatedBalances.filter((page) => !(page instanceof Error));

        return flatten(Object.values(validPages));
    }

    private async fetchBalances(account: string, tokens: TokenBase[]): Promise<TokenAmountHumanReadable[]> {
        try {
            const tokenBalances: TokenAmountHumanReadable[] = [];

            if (tokens.find((token) => token.address === this.nativeAssetAddress.toLowerCase())) {
                tokens = tokens.filter((token) => token.address !== this.nativeAssetAddress.toLowerCase());

                tokenBalances.push({
                    address: this.nativeAssetAddress.toLowerCase(),
                    amount: await this.fetchNativeBalance(account),
                });
            }
            const balances: BigNumber[] = (
                await multicall<BigNumberish>(
                    this.chainId,
                    this.provider,
                    ERC20Abi,
                    tokens.map((token) => [token.address, 'balanceOf', [account]]),
                )
            ).map((result) => BigNumber.from(result ?? '0')); // If we fail to read a tokenWithAmount's balance, treat it as zero

            return [...this.associateBalances(balances, tokens), ...tokenBalances];
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

    private associateBalances(balances: BigNumber[], tokens: TokenBase[]): TokenAmountHumanReadable[] {
        const formatted: TokenAmountHumanReadable[] = [];

        for (let i = 0; i < tokens.length; i++) {
            formatted.push({ address: tokens[i].address, amount: formatUnits(balances[i], tokens[i].decimals) });
        }

        return formatted;
    }
}
