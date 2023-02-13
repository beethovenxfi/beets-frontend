import React, { useEffect, useRef, useState } from 'react';
import TokenRow from '~/components/token/TokenRow';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Heading,
    HStack,
    ListItem,
    Modal,
    ModalOverlay,
    Select,
    StackDivider,
    Text,
    UnorderedList,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { BeetsModalContent } from '~/components/modal/BeetsModal';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useStakingWithdraw } from '~/lib/global/useStakingWithdraw';
import { useGetTokens } from '~/lib/global/useToken';
import { useHasBatchRelayerApproval } from '~/lib/util/useHasBatchRelayerApproval';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useLegacyFBeetsBalance } from '../lib/useLegacyFbeetsBalance';
import { useReliquaryFbeetsMigrateContractCallData } from '../lib/useReliquaryFbeetsMigrateContractCallData';
import { useReliquaryZap } from '../lib/useReliquaryZap';
import useReliquary from '../lib/useReliquary';
import { BeetsBox } from '~/components/box/BeetsBox';
import { useToast } from '~/components/toast/BeetsToast';
import { useBatchRelayerHasApprovedForAll } from '../lib/useBatchRelayerHasApprovedForAll';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';

import Image from 'next/image';
import { ReliquaryInvestDepositImpact } from '../invest/components/ReliquaryInvestDepositImpact';
import { ReliquaryInvestImage } from '../invest/components/ReliquaryInvestImage';
import { useCurrentStep } from '../lib/useReliquaryCurrentStep';

export default function ReliquaryMigrateModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [migrationTarget, setMigrationTarget] = useState<number>(-1);
    const [migrateCompleted, setMigrateCompleted] = useState(false);
    const [migratableBalance, setMigratableBalance] = useState(0);
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const initialRef = useRef(null);
    const networkConfig = useNetworkConfig();
    const { removeToast } = useToast();
    const { getToken, priceForAmount } = useGetTokens();

    const legacyfBeets = getToken(networkConfig.fbeets.address);

    const { legacyFbeetsBalance, relicPositionsForFarmId, refetchRelicPositions, setSelectedRelicId, selectedRelic } =
        useReliquary();
    const { data: hasBatchRelayerApproval, isLoading: isLoadingBatchRelayerApproval } = useHasBatchRelayerApproval();
    const {
        staked,
        isLoading: isLoadingLegacyFbeetsBalance,
        unstaked,
        refetchLegacyFbeetsBalance,
        refetchStakedBalance,
    } = useLegacyFBeetsBalance();
    const { reliquaryZap, ...reliquaryMigrateQuery } = useReliquaryZap('MIGRATE');
    // TODO FIX TYPE
    const { withdraw, ...unstakeQuery } = useStakingWithdraw({
        farm: { id: networkConfig.fbeets.farmId, type: 'FRESH_BEETS' },
    } as any);
    const { hasApprovalForAmount, isLoading: isLoadingUserAllowances } = useUserAllowances(
        [legacyfBeets],
        networkConfig.balancer.vault,
    );
    const { data: batchRelayerHasApprovedForAll, isLoading: isLoadingBatchRelayerApprovalForAll } =
        useBatchRelayerHasApprovedForAll();
    const hasApprovalForFbeetsAmount = hasApprovalForAmount(networkConfig.fbeets.address, unstaked);

    const { data: reliquaryContractCalls } = useReliquaryFbeetsMigrateContractCallData(
        migrationTarget,
        isOpen && hasApprovalForFbeetsAmount && !!batchRelayerHasApprovedForAll && !!hasBatchRelayerApproval,
    );

    const { currentStep } = useCurrentStep();

    useEffect(() => {
        if (!migratableBalance) {
            setMigratableBalance(legacyFbeetsBalance);
        }
    }, [legacyFbeetsBalance]);

    useEffect(() => {
        const _steps: TransactionStep[] = [
            {
                id: 'reliquary-migrate',
                type: 'other',
                buttonText: 'Complete MIGRATION',
                tooltipText: 'Migrate your fBEETS to a new or existing relic',
            },
        ];

        // migrate pre-requisites
        if (!batchRelayerHasApprovedForAll) {
            _steps.unshift({
                id: 'batch-relayer-reliquary',
                type: 'other',
                buttonText: 'Approve TRANSACTIONS',
                tooltipText: 'Approve the batch relayer to deposit, withdraw & claim rewards for all relics',
            });
        }
        if (!hasBatchRelayerApproval) {
            _steps.unshift({
                id: 'batch-relayer',
                type: 'other',
                buttonText: 'Approve RELIC',
                tooltipText: 'Approve the batch relayer to create a new relic',
            });
        }

        // approve the vault to spend legacy fbeets
        if (!hasApprovalForFbeetsAmount && legacyfBeets) {
            _steps.unshift({
                id: 'approve-vault',
                tooltipText: 'Approve the vault to spend your fBEETS',
                type: 'tokenApproval',
                buttonText: 'Approve VAULT',
                token: {
                    ...(legacyfBeets || {}),
                    amount: unstaked,
                },
            });
        }

        // unstake fbeets
        if (parseFloat(staked || '0') > 0) {
            _steps.unshift({
                id: 'unstake',
                tooltipText: 'Unstake your fBEETS from the farm',
                type: 'other',
                buttonText: 'Unstake FBEETS',
            });
        }

        if (
            _steps.length < steps?.length ||
            isLoadingBatchRelayerApproval ||
            isLoadingBatchRelayerApprovalForAll ||
            isLoadingUserAllowances ||
            isLoadingLegacyFbeetsBalance
        ) {
            return;
        }
        setSteps(_steps);
    }, [
        hasBatchRelayerApproval,
        isLoadingBatchRelayerApproval,
        isLoadingBatchRelayerApprovalForAll,
        isLoadingLegacyFbeetsBalance,
        isLoadingUserAllowances,
        legacyfBeets,
    ]);

    const isComplete = !isLoadingLegacyFbeetsBalance && migrateCompleted;

    const handleOnClose = () => {
        if (isComplete) {
            removeToast('migrate-fbeets');
        }
        onClose();
    };

    const handleCompleteMigrate = () => {
        setMigrateCompleted(true);
    };

    const tooltipLabel = (
        <VStack spacing="1" width="full" alignItems="flex-start">
            <Text>To migrate your fBEETS the following steps are needed:</Text>
            <UnorderedList pl="4">
                <ListItem>(Optional) Unstake your fBEETS from the Beethoven X farm </ListItem>
                <ListItem>Approve the vault to spend your fBEETS</ListItem>
                <ListItem>Approve the batch relayer to create a new relic</ListItem>
                <ListItem>Approve the batch relayer to deposit, withdraw & claim rewards for all relics</ListItem>
                <ListItem>Migrate your fBEETS to a new or existing relic</ListItem>
            </UnorderedList>
        </VStack>
    );

    return (
        <Box width={{ base: 'full', md: 'fit-content' }}>
            <Button variant="primary" onClick={onOpen} width={{ base: 'full', md: 'fit-content' }}>
                Migrate
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} size="lg" initialFocusRef={initialRef}>
                <ModalOverlay bg="blackAlpha.900" />
                <BeetsModalContent width="full">
                    <AnimatePresence>
                        <Box p="4" width="full">
                            <VStack spacing="4" width="full">
                                <Heading fontSize="1.25rem">Migrate to a relic</Heading>
                                <ReliquaryInvestImage />
                                {isComplete && (
                                    <Alert status="success">
                                        <AlertIcon />
                                        You&apos;ve successfully migrated your fBeets to a relic. Click return and check
                                        it out.
                                    </Alert>
                                )}
                                {!isComplete && (
                                    <BeetsBox width="full">
                                        <VStack
                                            width="full"
                                            divider={<StackDivider borderColor="whiteAlpha.200" />}
                                            p="4"
                                        >
                                            {migratableBalance > 0 && (
                                                <TokenRow
                                                    address={networkConfig.fbeets.address}
                                                    amount={legacyFbeetsBalance.toString()}
                                                />
                                            )}
                                        </VStack>
                                    </BeetsBox>
                                )}
                                {!isComplete &&
                                    relicPositionsForFarmId.length > 0 &&
                                    currentStep === 'reliquary-migrate' && (
                                        <VStack width="full" alignItems="flex-start">
                                            <Text>Choose where to migrate your balance to:</Text>
                                            <Select
                                                value={migrationTarget}
                                                onChange={(e) =>
                                                    setMigrationTarget(parseInt(e.currentTarget.value, 10))
                                                }
                                                width="full"
                                                variant="filled"
                                            >
                                                <option value={-1}>New relic</option>
                                                {relicPositionsForFarmId.map((relic) => (
                                                    <option value={relic.relicId} key={`migrate-to-${relic.relicId}`}>
                                                        Relic {relic.relicId} - Level {relic.level + 1}
                                                    </option>
                                                ))}
                                            </Select>
                                        </VStack>
                                    )}
                                {!isComplete && migrationTarget !== -1 && (
                                    <ReliquaryInvestDepositImpact
                                        bptIn={legacyFbeetsBalance.toString()}
                                        totalInvestValue={priceForAmount({
                                            address: networkConfig.fbeets.address,
                                            amount: legacyFbeetsBalance.toString(),
                                        })}
                                        relicId={migrationTarget.toString()}
                                    />
                                )}
                                <Box width="full">
                                    <BeetsTransactionStepsSubmit
                                        // TODO implement hide hide modal
                                        onCompleteButtonClick={handleOnClose}
                                        onComplete={handleCompleteMigrate}
                                        loadingButtonText=""
                                        completeButtonText="Return"
                                        onSubmit={(id) => {
                                            if (id === 'unstake') {
                                                withdraw(staked.toString());
                                            }
                                            if (id === 'reliquary-migrate' && reliquaryContractCalls) {
                                                reliquaryZap(reliquaryContractCalls);
                                            }
                                        }}
                                        isLoading={false}
                                        steps={steps}
                                        // TODO redirect to relic UI if not already there
                                        onConfirmed={() => {
                                            refetchRelicPositions();
                                            refetchLegacyFbeetsBalance();
                                            refetchStakedBalance();
                                        }}
                                        queries={[
                                            { ...unstakeQuery, id: 'unstake' },
                                            { ...reliquaryMigrateQuery, id: 'reliquary-migrate' },
                                        ]}
                                    />
                                </Box>
                            </VStack>
                        </Box>
                    </AnimatePresence>
                </BeetsModalContent>
            </Modal>
        </Box>
    );
}
