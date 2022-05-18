import { networkConfig } from '~/lib/config/network-config';
import { addressesMatch } from '~/lib/util/address';
import { rpcProviderService } from '~/lib/services/rpc-provider/rpc-provider.service';
import { JsonRpcProvider } from '@ethersproject/providers';
import { web3SendTransaction } from '~/lib/services/util/web3';
import { AmountScaled } from '~/lib/services/token/token-types';

type EthWrapAction = 'none' | 'wrap' | 'unwrap';

export class EthWrapperService {
    constructor(
        private readonly provider: JsonRpcProvider,
        private readonly ethAddress: string,
        private readonly wethAddress: string,
    ) {}

    public isNativeAssetWrap(tokenIn: string, tokenOut: string): boolean {
        return addressesMatch(tokenIn, this.ethAddress) && addressesMatch(tokenOut, this.wethAddress);
    }

    public isNativeAssetUnWrap(tokenIn: string, tokenOut: string): boolean {
        return addressesMatch(tokenIn, this.wethAddress) && addressesMatch(tokenOut, this.ethAddress);
    }

    public getWrapAction(tokenIn: string, tokenOut: string): EthWrapAction {
        if (this.isNativeAssetWrap(tokenIn, tokenOut)) {
            return 'wrap';
        } else if (this.isNativeAssetUnWrap(tokenIn, tokenOut)) {
            return 'unwrap';
        }

        return 'none';
    }

    public async wrapEth(amount: AmountScaled) {
        return web3SendTransaction({
            web3: this.provider,
            contractAddress: this.wethAddress,
            abi: ['function deposit() payable'],
            action: 'deposit',
            params: [],
            overrides: { value: amount },
        });
    }

    public async unwrapEth(amount: AmountScaled) {
        return web3SendTransaction({
            web3: this.provider,
            contractAddress: this.wethAddress,
            abi: ['function withdraw(uint256 wad)'],
            action: 'withdraw',
            params: [amount],
        });
    }
}

export const ethWrapperService = new EthWrapperService(
    rpcProviderService.getJsonProvider(),
    networkConfig.eth.address,
    networkConfig.wethAddress,
);
