import { bnum } from '@balancer-labs/sor';
import BigNumber from 'bignumber.js';
import { isAddress } from 'ethers/lib/utils.js';
import { sum, sumBy } from 'lodash';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from '~/lib/global/useToken';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';

const POOL_TYPES = [
    {
        type: 'weighted',
        isEnabled: true,
        name: 'Weighted Pool',
    },
];

const MAX_TOKENS = 8;
const FEE_PRESETS = ['0.1', '0.3', '1'];

const ComposeProviderContext = React.createContext<ReturnType<typeof _useCompose> | null>(null);
export const useCompose: () => ReturnType<typeof _useCompose> = () => {
    return useContext(ComposeProviderContext) as ReturnType<typeof _useCompose>;
};

interface Props {
    children: ReactNode | ReactNode[];
}
export default function ComposeProvider({ children }: Props) {
    const providerValue = _useCompose();
    return <ComposeProviderContext.Provider value={providerValue}>{children}</ComposeProviderContext.Provider>;
}

export type ComposeStep = 'choose-tokens' | 'preview';
export type PoolCreationExperience = 'simple' | 'advanced';
export interface PoolCreationToken {
    address: string;
    amount: string | null;
    isLocked: boolean;
    weight: number;
}

export type ManagerOption = 'dao-managed' | 'other-manager';
export type OtherManagerOption = 'self-managed' | 'custom-eoa';
export type OptimisedLiquidity = {
    liquidityRequired: string;
    balanceRequired: string;
};

function _useCompose() {
    const { getToken, priceFor } = useGetTokens();
    const { getUserBalance } = useUserTokenBalances();
    const [step, setStep] = useState<ComposeStep>('choose-tokens');
    const [creationExperience, _setCreationExperience] = useState<PoolCreationExperience | null>('advanced');
    // recommended fee is 0.3%
    const [currentFee, setCurrentFee] = useState(FEE_PRESETS[1]);
    const [isUsingCustomFee, setIsUsingCustomFee] = useState(false);
    const [feeManager, setFeeManager] = useState<string | null>(networkConfig.beetsPoolOwnerAddress);
    const [managerOption, setManagerOption] = useState<ManagerOption>('dao-managed');
    const [poolName, setPoolName] = useState<string>();
    const [otherManagerOption, setOtherManagerOption] = useState<OtherManagerOption | undefined>();
    const [progressValidatedTo, setProgressValidatedTo] = useState(-1);
    const [poolId, setPoolId] = useState<string | null>(null);
    const [isCreationComplete, setIsCreationComplete] = useState(false);

    const [tokens, setTokens] = useState<PoolCreationToken[]>([
        { address: networkConfig.beets.address, amount: null, isLocked: false, weight: 50 },
        {
            address:
                networkConfig.chainName === 'OPTIMISM' ? networkConfig.balancer.balToken : networkConfig.sftmx.address,
            amount: null,
            isLocked: false,
            weight: 50,
        },
    ]);

    useEffect(() => {
        setPoolName(getPoolSymbol());
    }, [tokens]);

    useEffect(() => {
        if (getTokenAndWeightValidations().isValid) {
            setProgressValidatedTo(0);
        } else {
            setProgressValidatedTo(-1);
            return;
        }
        if (getTokenAndWeightValidations().isValid && getPoolFeeValidations().isValid) {
            setProgressValidatedTo(1);
        } else {
            setProgressValidatedTo(0);
            return;
        }
        if (getTokenAndWeightValidations().isValid && getPoolFeeValidations().isValid && isFeeManagerValid()) {
            setProgressValidatedTo(2);
        } else {
            setProgressValidatedTo(1);
            return;
        }
        if (
            getTokenAndWeightValidations().isValid &&
            getPoolFeeValidations().isValid &&
            isFeeManagerValid() &&
            isPoolNameValid()
        ) {
            setProgressValidatedTo(4);
        } else {
            setProgressValidatedTo(3);
            return;
        }
    }, [tokens, currentFee, feeManager, poolName]);

    function setCreationExperience(experience: PoolCreationExperience | null) {
        _setCreationExperience(experience);
        if (experience !== null) {
            localStorage.setItem('poolCreation.experience', experience);
        }
    }

    function addBlankToken() {
        const newTokens = [...tokens, { address: '', amount: null, weight: 0, isLocked: false }];
        setTokens(newTokens);
        distributeTokenWeights(newTokens);
    }

    function removeTokenByIndex(index: number) {
        const newTokens = tokens.filter((_, i) => i !== index);
        setTokens(newTokens);
        distributeTokenWeights(newTokens);
    }

    function removeTokenByAddress(address: string) {
        const newTokens = tokens.filter((token) => token.address !== address);
        setTokens(newTokens);
        distributeTokenWeights(newTokens);
    }

    function getPoolSymbol() {
        let valid = true;

        const tokenSymbols = tokens.map((token) => {
            const weightRounded = Math.round(token.weight);
            const tokenInfo = getToken(token.address);
            if (!tokenInfo) {
                valid = false;
            }
            return tokenInfo ? `${Math.round(weightRounded)}${tokenInfo.symbol}` : '';
        });

        return valid ? tokenSymbols.join('-') : '';
    }

    function toggleLockTokenByIndex(index: number) {
        const newTokens = tokens.map((token, i) => {
            if (i === index) {
                return {
                    ...token,
                    isLocked: !token.isLocked,
                };
            }
            return token;
        });
        setTokens(newTokens);
        distributeTokenWeights(newTokens);
    }

    function toggleLockTokenByAddress(address: string) {
        const newTokens = tokens.map((token) => {
            if (token.address === address) {
                return {
                    ...token,
                    isLocked: !token.isLocked,
                };
            }
            return token;
        });
        setTokens(newTokens);
        distributeTokenWeights(newTokens);
    }

    function distributeTokenWeights(tokens: PoolCreationToken[]) {
        // get all the locked weights and sum those bad boys
        let lockedPct = parseFloat(
            sum(tokens.filter((token) => token.isLocked).map((token) => token.weight / 100)).toFixed(4),
        );
        // makes it so that new allocations are set as 0
        if (lockedPct > 1) lockedPct = 1;
        const pctAvailableToDistribute = bnum(bnum(1).minus(lockedPct));
        const unlockedWeights = tokens.filter((token) => !token.isLocked);
        const evenDistributionWeight = pctAvailableToDistribute.div(unlockedWeights.length);

        const error = pctAvailableToDistribute.minus(evenDistributionWeight.times(unlockedWeights.length));
        const isErrorDivisible = error.mod(unlockedWeights.length).eq(0);
        const distributableError = isErrorDivisible ? error.div(unlockedWeights.length) : error;

        const normalisedWeights = unlockedWeights.map((_, i) => {
            const evenDistributionWeight4DP = Number(evenDistributionWeight.toFixed(4));
            const errorScaledTo4DP = Number(distributableError.toString()) * 1e14;
            if (!isErrorDivisible && i === 0) {
                return evenDistributionWeight4DP + errorScaledTo4DP;
            } else if (isErrorDivisible) {
                return evenDistributionWeight4DP + errorScaledTo4DP;
            } else {
                return evenDistributionWeight4DP;
            }
        });

        const updatedUnlockedTokens = unlockedWeights.map((token, i) => {
            return {
                ...token,
                weight: Number((normalisedWeights[i] * 100).toFixed(2)) || 0,
            };
        });

        const updatedTokens = [...tokens.filter((token) => token.isLocked), ...updatedUnlockedTokens];
        setTokens(updatedTokens);
    }

    function getTokensScaledByBIP(bip: BigNumber): Record<string, OptimisedLiquidity> {
        const optimizedLiquidity: Record<string, OptimisedLiquidity> = {};
        for (const token of tokens) {
            // get the price for a single token
            const tokenPrice = bnum(priceFor(token.address));
            // the usd value needed for its weight
            const liquidityRequired: BigNumber = bip.times(token.weight);
            const balanceRequired: BigNumber = liquidityRequired.div(tokenPrice);
            optimizedLiquidity[token.address] = {
                liquidityRequired: liquidityRequired.toString(),
                balanceRequired: balanceRequired.toString(),
            };
        }
        return optimizedLiquidity;
    }

    function getOptimizedLiquidity(): Record<string, OptimisedLiquidity> {
        // need to filter out the empty tokens just in case
        if (!tokens.length) return {};
        const validTokens = tokens.filter((t) => t?.address !== '');
        const optimizedLiquidity: Record<string, OptimisedLiquidity> = {};
        if (!validTokens.length) return {};

        // token with the lowest balance is the bottleneck
        let bottleneckToken = validTokens[0];
        // keeping track of the lowest amt
        let currentMin = bnum(getUserBalance(validTokens[0].address)).times(priceFor(validTokens[0].address));

        // find the bottleneck token
        for (const token of validTokens) {
            const value = bnum(getUserBalance(token.address)).times(priceFor(token.address));
            if (value.lt(currentMin)) {
                currentMin = value;
                bottleneckToken = token;
            }
        }
        let bottleneckWeight = tokens.find((t) => t.address === bottleneckToken.address)?.weight || 0;
        let bottleneckPrice = priceFor(bottleneckToken.address);

        if (!bottleneckToken) return optimizedLiquidity;

        const bip = bnum(bottleneckPrice).times(getUserBalance(bottleneckToken.address)).div(bottleneckWeight);

        return getTokensScaledByBIP(bip);
    }

    function getTokenAndWeightValidations() {
        const totalTokenWeight = sumBy(tokens, (token) => token.weight);
        const areTokenSelectionsValid = tokens.every((token) => isAddress(token.address)) && tokens.length >= 2;
        const hasInvalidTokenWeights = tokens.some((token) => token.weight < 1);
        const totalLiquidityUSD = sumBy(tokens, (token) => priceFor(token.address) * parseFloat(token.amount || '0'));
        const areTokenAmountsValid = tokens.every(
            (token) => token.amount !== null && parseFloat(token.amount || '0') > 0,
        );
        const hasInsufficientBalances = tokens.some(
            (token) => parseFloat(token.amount || '0') > parseFloat(getUserBalance(token.address)),
        );
        const hasMoreThanMaxTotalLiquidity = totalLiquidityUSD > 100;
        return {
            areTokenSelectionsValid,
            hasInvalidTokenWeights,
            invalidTotalWeight: totalTokenWeight !== 100,
            hasMoreThanMaxTotalLiquidity,
            areTokenAmountsValid,
            hasInsufficientBalances,
            isValid:
                totalTokenWeight === 100 &&
                areTokenSelectionsValid &&
                !hasInvalidTokenWeights &&
                !hasMoreThanMaxTotalLiquidity &&
                !hasInsufficientBalances &&
                areTokenAmountsValid,
        };
    }

    function getPoolFeeValidations() {
        let isFeeValid = parseFloat(currentFee) <= 1;
        if (isUsingCustomFee) {
            isFeeValid = parseFloat(currentFee) <= 10;
        }
        const isFeeEmpty = currentFee === null || currentFee === '' || isNaN(parseFloat(currentFee));
        const isFeeZero = parseFloat(currentFee) === 0;
        return {
            isFeeEmpty,
            isFeeZero,
            isFeeValid,
            isValid: !isFeeEmpty && !isFeeZero && isFeeValid,
        };
    }

    function isFeeManagerValid() {
        return isAddress(feeManager || '');
    }

    function isPoolNameValid() {
        return poolName != '';
    }

    function resetPoolCreationState() {
        setStep('choose-tokens');
        setCurrentFee(FEE_PRESETS[1]);
        setIsUsingCustomFee(false);
        setFeeManager(networkConfig.beetsPoolOwnerAddress);
        setManagerOption('dao-managed');
        setPoolName(undefined);
        setOtherManagerOption(undefined);
        setProgressValidatedTo(-1);
        setPoolId(null);
        setIsCreationComplete(false);
        setTokens([
            { address: networkConfig.beets.address, amount: null, isLocked: false, weight: 50 },
            { address: networkConfig.balancer.balToken, amount: null, isLocked: false, weight: 50 },
        ]);
    }

    return {
        activeStep: step,
        creationExperience,
        poolTypes: POOL_TYPES,
        tokens,
        MAX_TOKENS,
        FEE_PRESETS,
        isUsingCustomFee,
        currentFee,
        feeManager,
        managerOption,
        otherManagerOption,
        poolName,
        progressValidatedTo,
        poolId,
        isCreationComplete,
        resetPoolCreationState,
        setIsCreationComplete,
        setPoolId,
        isFeeManagerValid,
        getTokenAndWeightValidations,
        isPoolNameValid,
        getPoolFeeValidations,
        setProgressValidatedTo,
        setPoolName,
        setOtherManagerOption,
        setManagerOption,
        setFeeManager,
        setCurrentFee,
        setIsUsingCustomFee,
        setActiveStep: setStep,
        setCreationExperience,
        addBlankToken,
        removeTokenByAddress,
        removeTokenByIndex,
        setTokens,
        distributeTokenWeights,
        toggleLockTokenByAddress,
        toggleLockTokenByIndex,
        getPoolSymbol,
        getOptimizedLiquidity,
    };
}
