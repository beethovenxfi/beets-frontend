import BeethovenxNftAbi from '~/lib/abi/BeethovenxNft.json';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { StaticJsonRpcBatchProvider } from '~/lib/services/rpc-provider/static-json-rpc-batch-provier';
import { fantomNetworkConfig } from '~/lib/config/fantom';
import { networkConfig } from '~/lib/config/network-config';
import { networkProvider } from '~/lib/global/network';

export default class NftService {
    private _provider: BaseProvider | null = null;
    constructor(private readonly contractAddress: string) {}

    public async balanceOf(user: string): Promise<string> {
        const contract = new Contract(this.contractAddress, BeethovenxNftAbi, this.provider);
        const result = await contract.balanceOf(user);

        return result.toString();
    }

    public async tokenOfOwnerByIndex(user: string, index: number) {
        const contract = new Contract(this.contractAddress, BeethovenxNftAbi, this.provider);
        const result = await contract.tokenOfOwnerByIndex(user, index);

        return result.toString();
    }

    public async tokenURI(tokenId: number) {
        const contract = new Contract(this.contractAddress, BeethovenxNftAbi, this.provider);
        const result = await contract.tokenURI(tokenId);

        return result.toString();
    }

    get provider(): BaseProvider {
        if (this._provider === null) {
            if (networkConfig.chainId === '250') {
                this._provider = networkProvider;
            } else {
                this._provider = new StaticJsonRpcBatchProvider('https://rpc.ftm.tools');
            }
        }

        return this._provider;
    }
}

export const earlyLudwigNft = new NftService('0xf2558d6a252C1041a3902870B1FdB0B7524B3098');
