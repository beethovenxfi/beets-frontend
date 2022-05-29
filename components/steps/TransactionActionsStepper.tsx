import { Flex, FlexProps } from '@chakra-ui/react';
import { Steps, Step } from '~/components/steps/index';
import { TokenBase } from '~/lib/services/token/token-types';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { networkConfig } from '~/lib/config/network-config';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { useEffect, useState } from 'react';
import { useBoolean } from '@chakra-ui/hooks';
import BeetsButton from '~/components/button/Button';

interface TokenApproval {
    token: TokenBase;
    amount: string;
    buttonText: string;
    infoText: string;
}

interface Props extends FlexProps {
    tokenApprovals: TokenApproval[];
    requiresBatchRelayerApproval?: boolean;
    contractAddress?: string;
    submit: {
        disabled?: boolean;
        submitTransaction: () => void;
        isSubmitting: boolean;
        infoText: string;
        buttonText: string;
    };
}

export function TransactionActionsStepper({
    tokenApprovals,
    contractAddress = networkConfig.balancer.vault,
    requiresBatchRelayerApproval,
    submit,
    ...rest
}: Props) {
    const [approvalsInitialized, { on }] = useBoolean(false);
    const [requiredApprovals, setRequiredApprovals] = useState<TokenApproval[]>([]);
    const { hasApprovalForAmount, data, isLoading, isSuccess } = useUserAllowances(
        tokenApprovals.map((approval) => approval.token),
        contractAddress,
    );

    useEffect(() => {
        if (isSuccess && !approvalsInitialized) {
            setRequiredApprovals(
                tokenApprovals.filter((approval) => !hasApprovalForAmount(approval.token.address, approval.amount)),
            );

            console.log('approvals', data);

            on();
        }
    }, [isSuccess]);

    return (
        <Flex flexDir="column" width="100%" {...rest}>
            <Steps activeStep={0}>
                {requiredApprovals.map(({ infoText, buttonText }, index) => {
                    return (
                        <Step key={index} infoText={infoText}>
                            <BeetsButton mt={4} onClick={() => {}} isLoading={false} disabled={false}>
                                {buttonText}
                            </BeetsButton>
                        </Step>
                    );
                })}
                {/*steps.map(({ buttonText, infoText, onClick, loading, disabled }, index) => {
                    return (
                        <Step key={index} infoText={infoText}>
                            <BeetsButton mt={4} onClick={onClick} isLoading={loading} disabled={disabled}>
                                {buttonText}
                            </BeetsButton>
                        </Step>
                    );
                })*/}
            </Steps>
        </Flex>
    );
}
