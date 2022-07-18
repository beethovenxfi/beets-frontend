import { MetadataConcern } from './concerns/metadata.concern';
import { BalancesConcern } from './concerns/balances.concern';
import { AllowancesConcern, ContractAllowancesMap } from './concerns/allowances.concern';
import { rpcProviderService } from '~/lib/services/rpc-provider/rpc-provider.service';
import { networkConfig } from '~/lib/config/network-config';
import { parseUnits } from '@ethersproject/units';
import { formatFixed } from '@ethersproject/bignumber';
import { TokenAmountHumanReadable, TokenAmountScaled, TokenBase } from '~/lib/services/token/token-types';
import { JsonRpcProvider, TransactionResponse } from '@ethersproject/providers';
import { MaxUint256 } from '@ethersproject/constants';
import { web3SendTransaction } from '~/lib/services/util/web3';
import ERC20Abi from '../../abi/ERC20.json';

export default class TokenService {
    private allTokens: Map<string, TokenBase> = new Map<string, TokenBase>();

    constructor(
        private readonly provider: JsonRpcProvider,
        private readonly metadataConcern: MetadataConcern,
        private readonly balancesConcern: BalancesConcern,
        private readonly allowancesConcern: AllowancesConcern,
    ) {}

    public async approveToken(spender: string, token: string): Promise<TransactionResponse> {
        return web3SendTransaction({
            web3: this.provider,
            contractAddress: token,
            abi: ERC20Abi,
            action: 'approve',
            params: [spender, MaxUint256.toString()],
        });
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

const provider = rpcProviderService.getJsonProvider();

export const tokenService = new TokenService(
    provider,
    new MetadataConcern(provider, networkConfig.chainId),
    new BalancesConcern(provider, networkConfig.chainId, networkConfig.eth.address, networkConfig.eth.decimals),
    new AllowancesConcern(provider, networkConfig.chainId),
);
