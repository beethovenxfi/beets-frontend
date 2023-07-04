import { BigNumber } from 'ethers';
import { WeiPerEther as ONE } from '@ethersproject/constants/lib/bignumbers';
import { Zero } from '@ethersproject/constants';

const MaxWeightedTokens = 100;

export function bnToNormalizedWeights(weights: BigNumber[]): BigNumber[] {
    // When the number is exactly equal to the max, normalizing with common inputs
    // leads to a value < 0.01, which reverts. In this case fill in the weights exactly.
    if (weights.length == MaxWeightedTokens) {
        return Array(MaxWeightedTokens).fill(ONE.div(MaxWeightedTokens));
    }

    const sum = weights.reduce((total, weight) => total.add(weight), Zero);
    if (sum.eq(ONE)) return weights;

    const normalizedWeights: BigNumber[] = [];
    let normalizedSum = Zero;
    for (let index = 0; index < weights.length; index++) {
        if (index < weights.length - 1) {
            normalizedWeights[index] = weights[index].mul(ONE).div(sum);
            normalizedSum = normalizedSum.add(normalizedWeights[index]);
        } else {
            normalizedWeights[index] = ONE.sub(normalizedSum);
        }
    }

    return normalizedWeights;
}
