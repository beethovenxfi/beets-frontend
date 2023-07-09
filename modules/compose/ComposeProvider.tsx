import React, { ReactNode, useContext, useEffect, useState } from 'react';

const POOL_TYPES = [
    {
        type: 'weighted',
        isEnabled: true,
        name: 'Weighted Pool',
    },
    {
        type: 'boosted',
        isEnabled: false,
        name: 'Boosted Pool',
    },
    {
        type: 'stable',
        isEnabled: false,
        name: 'Stable Pool',
    },
];

const MAX_TOKENS = 8;

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

export type ComposeStep = 'choose-tokens';
export type PoolCreationExperience = 'simple' | 'advanced';
export interface PoolCreationToken {
    address: string;
    amount: string;
}

function _useCompose() {
    const [step, setStep] = useState<ComposeStep>('choose-tokens');
    const [creationExperience, _setCreationExperience] = useState<PoolCreationExperience | null>(null);
    const [tokens, setTokens] = useState<PoolCreationToken[]>([
        { address: '', amount: '0.0' },
        { address: '', amount: '0.0' },
    ]);

    useEffect(() => {
        const cachedCreationExperience = localStorage.getItem(
            'poolCreation.experience',
        ) as PoolCreationExperience | null;
        setCreationExperience(cachedCreationExperience);
    }, []);

    function setCreationExperience(experience: PoolCreationExperience | null) {
        _setCreationExperience(experience);
        if (experience !== null) {
            localStorage.setItem('poolCreation.experience', experience);
        }
    }

    function addBlankToken() {
        setTokens([...tokens, { address: '', amount: '0.0' }]);
    }

    function removeTokenByIndex(index: number) {
        setTokens(tokens.filter((_, i) => i !== index));
    }

    function removeTokenByAddress(address: string) {
        setTokens(tokens.filter((token) => token.address !== address));
    }

    return {
        activeStep: step,
        setActiveStep: setStep,
        setCreationExperience,
        creationExperience,
        poolTypes: POOL_TYPES,
        addBlankToken,
        removeTokenByAddress,
        removeTokenByIndex,
        tokens,
        MAX_TOKENS,
    };
}