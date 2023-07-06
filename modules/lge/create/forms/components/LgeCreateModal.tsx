import { Box, Button, Modal, ModalOverlay, ModalCloseButton, useDisclosure } from '@chakra-ui/react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { BeetsModalContent, BeetsModalHeader, BeetsModalBody } from '~/components/modal/BeetsModal';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useLGeCreateGetLgeData } from '~/modules/lge/create/forms/lib/useLgeCreateGetLgeData';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useLgeCreate } from '~/modules/lge/create/forms/lib/useLgeCreate';
import { LgeFormData } from '~/lib/services/lge/copper-proxy.service';
import { useCreateLgeMutation } from '~/apollo/generated/graphql-codegen-generated';
import { useRouter } from 'next/router';

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
    const { createLge, txReceipt, ...createQuery } = useLgeCreate();
    const [createLgeMutation] = useCreateLgeMutation();
    const router = useRouter();

    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const [isLoadingLbpData, setIsLoadingLbpData] = useState(false);

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

    const POOL_CREATED_TOPIC_ID = '0x3c13bc30b8e878c53fd2a36b679409c073afd75950be43d8858768e956fbc20e';
    const lgeId = useRef<string>();

    function onModalClose() {
        onClose();
        if (lgeId.current) {
            router.push(`/lge/${lgeId.current}`);
        }
    }

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

    useEffect(() => {
        if (txReceipt) {
            const topics = txReceipt.logs.find((log) => log.topics[0] === POOL_CREATED_TOPIC_ID)?.topics;
            if (topics) {
                lgeId.current = topics[1];
                const address = `0x${topics[2].slice(26)}`;
                createLgeMutation({
                    variables: {
                        input: {
                            address,
                            bannerImageUrl: lgeData.bannerImageUrl,
                            collateralAddress: lgeData.collateralAddress,
                            collateralAmount: lgeData.collateralAmount,
                            collateralEndWeight: parseInt(lgeData.collateralEndWeight),
                            collateralStartWeight: parseInt(lgeData.collateralStartWeight),
                            description: lgeData.description,
                            discordUrl: lgeData.discordUrl,
                            endTimestamp: new Date(lgeData.endDate).getTime() / 1000,
                            id: lgeId.current,
                            mediumUrl: lgeData.mediumUrl,
                            name: lgeData.name,
                            startTimestamp: new Date(lgeData.startDate).getTime() / 1000,
                            swapFee: lgeData.swapFee,
                            telegramUrl: lgeData.telegramUrl,
                            tokenAddress: lgeData.tokenAddress,
                            tokenAmount: lgeData.tokenAmount,
                            tokenEndWeight: parseInt(lgeData.tokenEndWeight),
                            tokenIconUrl: lgeData.tokenIconUrl,
                            tokenStartWeight: parseInt(lgeData.tokenStartWeight),
                            twitterUrl: lgeData.twitterUrl,
                            websiteUrl: lgeData.websiteUrl,
                        },
                    },
                });
                setIsLoadingLbpData(false);
            }
        }
    }, [txReceipt]);

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
                                isLoading={steps === null || isLoadingLbpData}
                                loadingButtonText="Create LBP"
                                completeButtonText="Go to LBP"
                                onCompleteButtonClick={onModalClose}
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
                                        setIsLoadingLbpData(true);
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
