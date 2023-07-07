import { orderBy } from 'lodash';
import { parseUnits } from '@ethersproject/units';
import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { ConfigurationFormData } from '~/modules/lge/create/forms/components/LgeCreateConfigurationForm';
import { bnToNormalizedWeights } from '~/lib/util/numbers';
import { DetailsFormData } from '~/modules/lge/create/forms/components/LgeCreateDetailsForm';
import { WeightedPoolEncoder } from '@balancer-labs/sdk';
import { networkConfig } from '~/lib/config/network-config';

interface PoolTokenInput {
    address: string;
    startWeight: BigNumber;
    endWeight: BigNumber;
    amount: BigNumber;
}

export type TokenInfoMap = {
    [address: string]: number | undefined;
};

export interface LgeFormData extends ConfigurationFormData, DetailsFormData {}
export interface LgeData {
    name: string;
    symbol: string;
    tokens: string[];
    amounts: BigNumber[];
    weights: BigNumber[];
    endWeights: BigNumber[];
    isCorrectOrder: boolean;
    //swap fee come in as 1 = 1%, so its base 16
    swapFeePercentage: BigNumber;
    userData: string;
    startTime: number;
    endTime: number;
}

export class CopperProxyService {
    constructor(private readonly copperProxyContractAddress: string) {}

    public createLgeGetLgeData(data: LgeFormData, tokenInfoMap: TokenInfoMap): LgeData {
        const sorted = this.toSortedTokens(data, tokenInfoMap);

        return {
            name: data.poolName,
            symbol: `BPT-${data.poolSymbol}`,
            tokens: sorted.map((token) => token.address),
            amounts: sorted.map((token) => token.amount),
            weights: bnToNormalizedWeights(sorted.map((token) => token.startWeight)),
            endWeights: bnToNormalizedWeights(sorted.map((token) => token.endWeight)),
            isCorrectOrder: this.isCorrectOrder(sorted, data.collateralAddress),
            //swap fee come in as 1 = 1%, so its base 16
            swapFeePercentage: parseUnits(`${data.swapFee}`, 16),
            userData: WeightedPoolEncoder.joinInit(sorted.map((token) => token.amount.toString())),
            startTime: new Date(data.startDate).getTime(),
            endTime: new Date(data.endDate).getTime(),
        };
    }

    // public async setSwapEnabled(
    //     provider: BaseProvider,
    //     poolAddress: string,
    //     enabled: boolean,
    // ): Promise<TransactionResponse> {
    //     return await sendTransaction(provider, this.copperProxyAddress, CopperProxyAbi, 'setSwapEnabled', [
    //         getAddress(poolAddress),
    //         enabled,
    //     ]);
    // }

    // public async exitPool(provider: BaseProvider, poolAddress: string): Promise<TransactionResponse> {
    //     return await sendTransaction(provider, this.copperProxyAddress, CopperProxyAbi, 'exitPool', [
    //         getAddress(poolAddress),
    //         [0, 0],
    //         0,
    //     ]);
    // }

    private toSortedTokens(data: LgeFormData, tokenInfoMap: TokenInfoMap): PoolTokenInput[] {
        const collateralAddress = getAddress(data.collateralAddress);
        const tokenAddress = getAddress(data.tokenAddress);

        return this.sortTokens([
            {
                address: collateralAddress,
                amount: parseUnits(data.collateralAmount, tokenInfoMap[collateralAddress]),
                //weights come in as 1 = 1%, so its base 16
                startWeight: parseUnits(`${data.collateralStartWeight}`, 16),
                endWeight: parseUnits(`${data.collateralEndWeight}`, 16),
            },
            {
                address: tokenAddress,
                amount: parseUnits(data.tokenAmount, tokenInfoMap[tokenAddress]),
                startWeight: parseUnits(`${data.tokenStartWeight}`, 16),
                endWeight: parseUnits(`${data.tokenEndWeight}`, 16),
            },
        ]);
    }

    private sortTokens(tokens: PoolTokenInput[]): PoolTokenInput[] {
        return orderBy(tokens, (token) => token.address.toLowerCase(), 'asc');
    }

    //true if, collateral token is index 0
    private isCorrectOrder(sortedTokens: PoolTokenInput[], collateralAddress: string) {
        return sortedTokens[0].address.toLowerCase() === collateralAddress.toLowerCase();
    }
}

export const copperProxyService = new CopperProxyService(networkConfig.copperProxyAddress);
