import {
    Heading,
    ModalHeader,
    ModalOverlay,
    Box,
    Flex,
    Link,
    Skeleton,
    Text,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { ExternalLink } from 'react-feather';
import { FadeInBox } from '~/components/animation/FadeInBox';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { etherscanGetAddressUrl, etherscanTxShortenForDisplay } from '~/lib/util/etherscan';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useBridgeBeets, beetsOftProxy } from '~/modules/reliquary/lib/useBridgeBeets';
import { TransactionStep, BeetsTransactionStepsSubmit } from '../button/BeetsTransactionStepsSubmit';
import { useBeetsBalance } from './useBeetsBalance';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function Content({ onClose }: { onClose: () => void }) {
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();
    const [success, setSuccess] = useState(false);
    const [steps, setSteps] = useState<TransactionStep[] | null>(null);
    const { balance, isLoading, hasBalance, refetch: refetchBeetsBalance } = useBeetsBalance();

    const beetsTokenWithBalance: TokenBaseWithAmount = {
        address: networkConfig.beets.address,
        amount: balance,
        name: 'Beethoven X',
        symbol: 'BEETS',
        decimals: 18,
    };

    const { bridge, ...bridgeQuery } = useBridgeBeets();

    const {
        hasApprovalForAmount,
        isLoading: isLoadingAllowances,
        refetch: refetchUserAllowances,
    } = useUserAllowances([beetsTokenWithBalance], beetsOftProxy);

    useEffect(() => {
        const _steps: TransactionStep[] = [];

        if (!isLoadingAllowances) {
            if (!hasApprovalForAmount(beetsTokenWithBalance.address, beetsTokenWithBalance.amount)) {
                _steps.push({
                    id: 'approve',
                    type: 'tokenApproval',
                    buttonText: `Approve BEETS`,
                    tooltipText: `Approve BEETS for bridging`,
                    token: beetsTokenWithBalance,
                    contractToApprove: beetsOftProxy,
                });
            }

            _steps.push({
                id: 'bridge',
                type: 'other',
                buttonText: 'Bridge BEETS and receive lzBEETS on Sonic',
                tooltipText: 'Bridge BEETS and receive lzBEETS on Sonic',
            });

            setSteps(_steps);
        }
    }, [isLoadingAllowances]);

    return (
        <FadeInBox isVisible={true}>
            <Box p="8">
                <Heading size="md">Bridge your BEETS on Fantom to lzBEETS on Sonic</Heading>
                {isLoading && <Skeleton height="100px" width="full" mt="2" />}
                {/* {success && (
                    <>
                        <Text mb="2">
                            You&apos;ve started the bridging of your BEETS to lzBEETS on Sonic. You can check the bridge
                            transaction status on LayerZeroScan. Once complete, go to beets.fi to migrate to
                            (sonic)BEETS.
                        </Text>
                        <Box mb="4">
                            <Link href="https://beets.fi" target="_blank">
                                <Flex alignItems="center">
                                    <Text mr="1">beets.fi</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                            </Link>
                        </Box>
                    </>
                )} */}
                {/* {!hasBeetsBalance && !isLoading && !success && (
                    <>
                        <Text mb="2">You don&apos;t have any BEETS to bridge.</Text>
                        <Text mb="2">
                            If you&apos;ve already bridged your BEETS, you can check the bridge transaction status on
                            LayerZeroScan.
                        </Text>
                        <Box mb="4">
                            <Link href={`https://layerzeroscan.com/address/${userAddress}`} target="_blank">
                                <Flex alignItems="center">
                                    <Text mr="1">LayerZeroScan</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                            </Link>
                        </Box>
                    </>
                )} */}
                {!isLoading && (
                    <>
                        <Text mb="2">
                            Transfer your Fantom BEETS to lzBEETS via the LayerZero bridge. You&apos;ll be interacting
                            with the BEETSProxyOFTv2 contract. Please verify the address in all transactions.
                        </Text>
                        <Box mb="4">
                            <Link href={etherscanGetAddressUrl(beetsOftProxy)} target="_blank">
                                <Flex alignItems="center">
                                    <Text mr="1"> BeetsProxyOFTV2: {etherscanTxShortenForDisplay(beetsOftProxy)}</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                            </Link>
                        </Box>
                        <Text mb="2">
                            <Box as="span" fontWeight="bold">
                                Note:{' '}
                            </Box>
                            The BEETS will be sent to the same wallet address on Sonic. If you&apos;re using a multisig
                            wallet or any other non EOA, please wait for the stargate UI to come online.
                        </Text>
                        <Text mb="2">Once done you can check the bridge transaction status on LayerZeroScan.</Text>
                        <Box mb="4">
                            <Link href={`https://layerzeroscan.com/address/${userAddress}`} target="_blank">
                                <Flex alignItems="center">
                                    <Text mr="1">LayerZeroScan</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                            </Link>
                        </Box>
                        <Text mb="2">
                            After the (fantom)BEETS are bridged successfully go to beets.fi to migrate the received
                            lzBEETS to (sonic)BEETS.
                        </Text>
                        <Box mb="4">
                            <Link href="https://beets.fi" target="_blank">
                                <Flex alignItems="center">
                                    <Text mr="1">beets.fi</Text>
                                    <ExternalLink size={16} />
                                </Flex>
                            </Link>
                        </Box>
                        <BeetsTransactionStepsSubmit
                            isLoading={steps === null}
                            loadingButtonText="Bridge BEETS"
                            completeButtonText="Bridging complete"
                            onCompleteButtonClick={onClose}
                            steps={steps || []}
                            onSubmit={() => {
                                bridge(beetsTokenWithBalance.amount);
                            }}
                            onConfirmed={(id) => {
                                if (id !== 'bridge') {
                                    refetchUserAllowances();
                                } else {
                                    refetchBeetsBalance();
                                    setSuccess(true);
                                }
                            }}
                            queries={[{ ...bridgeQuery, id: 'bridge' }]}
                        />
                    </>
                )}
            </Box>
        </FadeInBox>
    );
}

export function BeetsBridgeModal({ isOpen, onClose }: Props) {
    const initialRef = useRef(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" initialFocusRef={initialRef}>
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader className="bg">
                    <Heading size="md" noOfLines={1}>
                        Migrate your BEETS to Sonic
                    </Heading>
                </ModalHeader>
                <ModalBody className="bg" p="0">
                    <Content onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
