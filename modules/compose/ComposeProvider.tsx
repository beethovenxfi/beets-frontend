import { bnum } from '@balancer-labs/sor';
import { isAddress } from 'ethers/lib/utils.js';
import { sum, sumBy } from 'lodash';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { networkConfig } from '~/lib/config/network-config';
import { useGetTokens } from '~/lib/global/useToken';

const POOL_TYPES = [
    {
        type: 'weighted',
        isEnabled: true,
        name: 'Weighted Pool',
    },
];

const MAX_TOKENS = 8;
const FEE_PRESETS = ['0.001', '0.003', '0.01'];

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
    amount: string;
    isLocked: boolean;
    weight: number;
}

export type ManagerOption = 'dao-managed' | 'other-manager';
export type OtherManagerOption = 'self-managed' | 'custom-eoa';

function _useCompose() {
    const { getToken } = useGetTokens();
    const [step, setStep] = useState<ComposeStep>('choose-tokens');
    const [creationExperience, _setCreationExperience] = useState<PoolCreationExperience | null>(null);
    // recommended fee is 0.3%
    const [currentFee, setCurrentFee] = useState(FEE_PRESETS[1]);
    const [isUsingCustomFee, setIsUsingCustomFee] = useState(false);
    const [feeManager, setFeeManager] = useState<string | null>(networkConfig.beetsPoolOwnerAddress);
    const [managerOption, setManagerOption] = useState<ManagerOption>('dao-managed');
    const [poolName, setPoolName] = useState<string>();
    const [otherManagerOption, setOtherManagerOption] = useState<OtherManagerOption | undefined>();
    const [progressValidatedTo, setProgressValidatedTo] = useState(-1);

    const [tokens, setTokens] = useState<PoolCreationToken[]>([
        { address: '', amount: '0.0', isLocked: false, weight: 50 },
        { address: '', amount: '0.0', isLocked: false, weight: 50 },
    ]);

    useEffect(() => {
        const cachedCreationExperience = localStorage.getItem(
            'poolCreation.experience',
        ) as PoolCreationExperience | null;
        setCreationExperience(cachedCreationExperience);
    }, []);

    useEffect(() => {
        setPoolName(getPoolSymbol());
    }, [tokens]);

    useEffect(() => {
        if (areTokensAndWeightsValid()) {
            setProgressValidatedTo(0);
        }
        if (areTokensAndWeightsValid() && isPoolFeeValid()) {
            setProgressValidatedTo(1);
        }
        if (areTokensAndWeightsValid() && isPoolFeeValid() && isFeeManagerValid()) {
            setProgressValidatedTo(2);
        }
        if (areTokensAndWeightsValid() && isPoolFeeValid() && isFeeManagerValid() && isPoolNameValid()) {
            setProgressValidatedTo(3);
        }
    }, [tokens, currentFee, feeManager, poolName]);

    function setCreationExperience(experience: PoolCreationExperience | null) {
        _setCreationExperience(experience);
        if (experience !== null) {
            localStorage.setItem('poolCreation.experience', experience);
        }
    }

    function addBlankToken() {
        const newTokens = [...tokens, { address: '', amount: '0.0', weight: 0, isLocked: false }];
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
        let lockedPct = sum(tokens.filter((token) => token.isLocked).map((token) => token.weight / 100));
        // makes it so that new allocations are set as 0
        if (lockedPct > 1) lockedPct = 1;
        const pctAvailableToDistribute = bnum(1).minus(lockedPct);
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

        const newTokens = tokens.map((token, i) => {
            if (unlockedWeights.find((uToken) => uToken.address === token.address)) {
                return {
                    ...token,
                    weight: Number((normalisedWeights[i] * 100).toFixed(2)) || 0,
                };
            } else {
                return token;
            }
        });
        setTokens(newTokens);
    }

    function areTokensAndWeightsValid() {
        const totalTokenWeight = sumBy(tokens, (token) => token.weight);
        const areTokenSelectionsValid = tokens.every((token) => isAddress(token.address));

        return totalTokenWeight === 100 && areTokenSelectionsValid;
    }

    function isPoolFeeValid() {
        return parseFloat(currentFee) < 0.1;
    }

    function isFeeManagerValid() {
        return isAddress(feeManager || '');
    }

    function isPoolNameValid() {
        return poolName != '';
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
        isFeeManagerValid,
        isPoolFeeValid,
        isPoolNameValid,
        areTokensAndWeightsValid,
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
    };
}
