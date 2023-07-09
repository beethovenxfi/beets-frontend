import React from 'react';
import { useCompose } from './ComposeProvider';
import ComposeChooseFlowType from './ComposeChooseFlowType';
import AdvancedPoolCreation from './AdvancedPoolCreation';
import SimpleCreationChooseTokens from './SimpleCreationChooseTokens.tsx';

interface Props {}

export default function ComposeFlow(props: Props) {
    const { activeStep, creationExperience } = useCompose();
    switch (creationExperience) {
        case 'simple':
            switch (activeStep) {
                case 'choose-tokens':
                    return <SimpleCreationChooseTokens />;
                default:
                    return <SimpleCreationChooseTokens />;
            }
        case 'advanced':
            return <AdvancedPoolCreation />;
        default:
            return <ComposeChooseFlowType />;
    }
}
