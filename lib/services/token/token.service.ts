import { MetadataConcern } from './concerns/metadata.concern';
import { BalancesConcern } from './concerns/balances.concern';
import { AllowancesConcern, ContractAllowancesMap } from './concerns/allowances.concern';
import { networkConfig } from '~/lib/config/network-config';
import { parseUnits } from '@ethersproject/units';
import { formatFixed } from '@ethersproject/bignumber';
import { TokenAmountHumanReadable, TokenAmountScaled, TokenBase } from '~/lib/services/token/token-types';
import { BaseProvider, TransactionResponse } from '@ethersproject/providers';
import { networkProvider } from '~/lib/global/network';

export default class TokenService {
    private allTokens: Map<string, TokenBase> = new Map<string, TokenBase>();

    constructor(
        private readonly provider: BaseProvider,
        private readonly metadataConcern: MetadataConcern,
        private readonly balancesConcern: BalancesConcern,
        private readonly allowancesConcern: AllowancesConcern,
    ) {}

    public async approveToken(spender: string, token: string): Promise<TransactionResponse> {
        throw new Error('TODO');
    }

    /**
     * Appends tokens to the set
     */
    public addTokens(tokens: TokenBase[]) {
        for (const token of tokens) {
            this.allTokens.set(token.address, token);
        }
    }

    public async loadOnChainTokenData(addresses: string[]): Promise<TokenBase[]> {
        const tokens = await this.metadataConcern.loadOnChainTokenData(addresses);

        this.addTokens(tokens);

        return tokens;
    }

    public async getBalancesForAccount(account: string, tokens: TokenBase[]): Promise<TokenAmountHumanReadable[]> {
        return this.balancesConcern.getBalancesForAccount(account, tokens);
    }

    public async getAllowancesForAccount(
        account: string,
        contractAddresses: string[],
        tokens: TokenBase[],
    ): Promise<ContractAllowancesMap> {
        return this.allowancesConcern.getAllowancesForAccount(account, contractAddresses, tokens);
    }

    public humanReadableToScaled(inputs: TokenAmountHumanReadable[]): TokenAmountScaled[] {
        return inputs.map((input) => {
            const token = this.getRequiredToken(input.address);

            return {
                address: input.address,
                amount: parseUnits(input.amount, token.decimals),
            };
        });
    }

    public scaledToHumanReadable(inputs: TokenAmountScaled[]): TokenAmountHumanReadable[] {
        return inputs.map((input) => {
            const token = this.getRequiredToken(input.address);

            return {
                address: input.address,
                amount: formatFixed(input.amount, token.decimals),
            };
        });
    }

    private getRequiredToken(address: string) {
        const token = this.allTokens.get(address);

        if (!token) {
            throw new Error('Did not find tokenWithAmount for address: ' + address);
        }

        return token;
    }
}

export const tokenService = new TokenService(
    networkProvider,
    new MetadataConcern(networkProvider, networkConfig.chainId),
    new BalancesConcern(networkProvider, networkConfig.chainId, networkConfig.eth.address, networkConfig.eth.decimals),
    new AllowancesConcern(networkProvider, networkConfig.chainId),
);
