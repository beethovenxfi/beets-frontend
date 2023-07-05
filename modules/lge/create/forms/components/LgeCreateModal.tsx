import { Box, Button, Modal, ModalOverlay, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { BeetsModalContent, BeetsModalHeader, BeetsModalBody } from '~/components/modal/BeetsModal';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useLGeCreateGetLgeData } from '~/modules/lge/create/forms/lib/useLgeCreateGetLgeData';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useLgeCreateLge } from '~/modules/lge/create/forms/lib/useLgeCreate';
import { LgeFormData } from '~/lib/services/lge/copper-proxy.service';
import { useCreateLgeMutation } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    lgeData: LgeFormData;
}

export function LgeCreateModal({ lgeData }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const containerControls = useAnimation();
    const modalContainerRef = useRef<HTMLDivElement | null>(null);
    const networkConfig = useNetworkConfig();
    const { data, tokens, lgeTokens, isLoading: isLoadingLgeData } = useLGeCreateGetLgeData(lgeData);
    const {
        hasApprovalForAmount,
        isLoading: isLoadingUserAllowances,
        refetch: refetchUserAllowances,
    } = useUserAllowances(tokens, networkConfig.copperProxyAddress);
    const { createLge, ...createQuery } = useLgeCreateLge();
    const [createLgeMutation] = useCreateLgeMutation();

    const [steps, setSteps] = useState<TransactionStep[] | null>(null);

    const isLoading = isLoadingLgeData || isLoadingUserAllowances;
    const allLgeTokens = lgeTokens.map((token) => {
        const tokenData = tokens.find((t) => t.address.toLowerCase() === token.address.toLowerCase());
        return {
            ...token,
            symbol: tokenData?.symbol || '',
            name: tokenData?.name || '',
            decimals: tokenData?.decimals || 18,
        };
    });

    console.log({ receipt: createQuery.txReceipt, response: createQuery.txResponse });

    useEffect(() => {
        if (!isLoading) {
            const tokensRequiringApproval = allLgeTokens.filter(
                (tokenWithAmount) =>
                    parseFloat(tokenWithAmount.amount) > 0 &&
                    !hasApprovalForAmount(tokenWithAmount.address.toLowerCase(), tokenWithAmount.amount),
            );

            const createStep: TransactionStep = {
                id: 'create',
                type: 'other',
                buttonText: 'Create',
                tooltipText: 'Create your LBP',
            };

            const steps: TransactionStep[] = [
                ...tokensRequiringApproval.map((token) => ({
                    id: token.symbol,
                    type: 'tokenApproval' as const,
                    buttonText: `Approve ${token.symbol}`,
                    tooltipText: `Approve ${token.symbol} for LBP creation`,
                    token,
                    contractToApprove: networkConfig.copperProxyAddress,
                })),
                createStep,
            ];

            setSteps(steps);
        }
    }, [isLoading]);

    return (
        <>
            <Button colorScheme="teal" onClick={onOpen} width={{ base: 'full', md: '140px' }}>
                Create LBP
            </Button>
            <Modal motionPreset="none" isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay bg="blackAlpha.900" />
                <AnimatePresence exitBeforeEnter>
                    <BeetsModalContent position="relative" isTransparent={true}>
                        <Box
                            as={motion.div}
                            width="full"
                            height="full"
                            position="absolute"
                            top="0"
                            left="0"
                            right="0"
                            zIndex={-1}
                            animate={containerControls}
                            ref={modalContainerRef}
                            rounded="md"
                            transformOrigin="top"
                            background="gray.700"
                        >
                            <Box transformOrigin="top" width="full" height="full" background="blackAlpha.400">
                                <Box width="full" height="full" className="bg" />
                            </Box>
                        </Box>
                        <ModalCloseButton />
                        <BeetsModalHeader>TEST</BeetsModalHeader>
                        <BeetsModalBody p="0">
                            <BeetsTransactionStepsSubmit
                                isLoading={steps === null}
                                loadingButtonText="Create LBP"
                                completeButtonText="Return to pool"
                                onCompleteButtonClick={onClose}
                                steps={steps || []}
                                onSubmit={(id) => {
                                    if (id === 'create' && data) {
                                        createLge(data, lgeTokens, tokens);
                                    }
                                }}
                                onConfirmed={(id) => {
                                    if (id !== 'create') {
                                        refetchUserAllowances();
                                    } else {
                                        createLgeMutation({
                                            variables: {
                                                input: {
                                                    ...lgeData,
                                                    address: lgeData.tokenAddress,
                                                    startTimestamp: new Date(lgeData.startDate).getTime(),
                                                    endTimestamp: new Date(lgeData.endDate).getTime(),
                                                    id: 'test',
                                                    collateralStartWeight: parseInt(lgeData.collateralStartWeight),
                                                    collateralEndWeight: parseInt(lgeData.collateralEndWeight),
                                                    tokenStartWeight: parseInt(lgeData.tokenStartWeight),
                                                    tokenEndWeight: parseInt(lgeData.tokenEndWeight),
                                                },
                                            },
                                        });
                                        console.log('Done!!');
                                    }
                                }}
                                queries={[{ ...createQuery, id: 'create' }]}
                            />
                        </BeetsModalBody>
                    </BeetsModalContent>
                </AnimatePresence>
            </Modal>
        </>
    );
}
