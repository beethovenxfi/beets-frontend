import ERC20Abi from '../../../abi/ERC20.json';
import { set } from 'lodash';
import { Multicaller } from '~/lib/services/util/multicaller.service';
import { BaseProvider } from '@ethersproject/providers';
import { TokenBase } from '~/lib/services/token/token-types';

export class MetadataConcern {
    constructor(private readonly provider: BaseProvider, private readonly chainId: string) {}

    /**
     * Perform an onchain multicall to load tokenWithAmount data
     */
    public async loadOnChainTokenData(addresses: string[]): Promise<TokenBase[]> {
        try {
            const multi = new Multicaller(this.chainId, this.provider, ERC20Abi);
            const metaDict = {};

            addresses.forEach((address) => {
                set(metaDict, `${address}.address`, address);
                set(metaDict, `${address}.chainId`, parseInt(this.chainId));
                multi.call(`${address}.name`, address, 'name');
                multi.call(`${address}.symbol`, address, 'symbol');
                multi.call(`${address}.decimals`, address, 'decimals');
            });

            //TODO: figure out what this looks like
            const response = await multi.execute(metaDict);

            return Object.values(response);
        } catch (error) {
            console.error('Failed to fetch onchain meta', addresses, error);
            return [];
        }
    }
}
