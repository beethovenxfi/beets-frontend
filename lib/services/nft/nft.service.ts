import BeethovenxNftAbi from '~/lib/abi/BeethovenxNft.json';
import { BaseProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';
import { StaticJsonRpcBatchProvider } from '~/lib/services/rpc-provider/static-json-rpc-batch-provier';
import { fantomNetworkConfig } from '~/lib/config/fantom';

export default class NftService {
    constructor(private readonly contractAddress: string, private readonly provider: BaseProvider) {}

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
}

export const earlyLudwigNft = new NftService(
    '0xf2558d6a252C1041a3902870B1FdB0B7524B3098',
    new StaticJsonRpcBatchProvider('https://rpc.ftm.tools'),
);
