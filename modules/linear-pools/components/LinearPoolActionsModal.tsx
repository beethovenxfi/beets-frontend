import { BeetsModalBody, BeetsModalContent, BeetsModalHeader, BeetsModalHeadline } from '~/components/modal/BeetsModal';
import { Box, Flex, Link, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import { ModalCloseButton } from '@chakra-ui/modal';
import { GqlPoolLinearFragment } from '~/apollo/generated/graphql-codegen-generated';
import { CardRow } from '~/components/card/CardRow';
import { etherscanGetContractReadUrl, etherscanGetContractWriteUrl } from '~/lib/util/etherscan';
import { ExternalLink } from 'react-feather';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useLinearPoolRebalance } from '~/modules/linear-pools/lib/useLinearPoolRebalance';
import { useLinearPoolRebalanceWithExtraMain } from '~/modules/linear-pools/lib/useLinearPoolRebalanceWithExtraMain';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { AddressZero } from '@ethersproject/constants';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { Input } from '@chakra-ui/input';
import { useState } from 'react';
import { useReaperLinearPoolLoopingWrap } from '~/modules/linear-pools/lib/useReaperLinearPoolLoopingWrap';
import { useReaperLinearPoolLoopingUnwrap } from '~/modules/linear-pools/lib/userReaperLinearPoolLoopingUnwrap';
import { useUserBalances } from '~/lib/user/useUserBalances';
import { useUserTokenBalances } from '~/lib/user/useUserTokenBalances';
import { oldBnumScale } from '~/lib/services/pool/lib/old-big-number';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pool: GqlPoolLinearFragment | null;
}

export function LinearPoolActionsModal({ isOpen, onClose, pool }: Props) {
    const { balancer } = useNetworkConfig();
    const [numLoops, setNumLoops] = useState('');
    const [amountToLoopWith, setAmountToLoopWith] = useState('');
    const rebalancer = balancer.linearRebalancers[pool?.address || ''];
    const reaperManualRebalancer = balancer.reaperManualRebalancer || AddressZero;
    const isReaperPool = balancer.linearFactories.reaper.includes(pool?.factory || '');
    const mainToken = pool?.tokens.find((token) => token.index === pool.mainIndex);
    const { rebalance, ...rebalanceQuery } = useLinearPoolRebalance(pool);
    const { rebalanceWithExtraMain, ...rebalanceWithExtraMainQuery } = useLinearPoolRebalanceWithExtraMain(pool);

    const rebalancerAllowance = useUserAllowances(mainToken ? [mainToken] : [], rebalancer || AddressZero);
    const hasRebalancerAllowance = rebalancerAllowance.hasApprovalForAmount(mainToken?.address || '', '10');
    const { approve: approveRebalancer, ...approveRebalancerQuery } = useApproveToken(
        mainToken || { address: AddressZero, name: '', decimals: 18, symbol: '' },
    );

    const manualRebalancerAllowance = useUserAllowances(mainToken ? [mainToken] : [], reaperManualRebalancer);
    const hasManualRebalancerAllowance = manualRebalancerAllowance.hasApprovalForAmount(
        mainToken?.address || '',
        oldBnumScale('10000', mainToken?.decimals || 18).toString(10),
    );
    const { approve: approveManualRebalancer, ...approveManualRebalancerQuery } = useApproveToken(
        mainToken || { address: AddressZero, name: '', decimals: 18, symbol: '' },
    );
    const { wrap, ...wrapQuery } = useReaperLinearPoolLoopingWrap(pool);
    const { unwrap, ...unwrapQuery } = useReaperLinearPoolLoopingUnwrap(pool);
    const { getUserBalance } = useUserTokenBalances();

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay bg="blackAlpha.700" />
            {pool && (
                <BeetsModalContent>
                    <ModalCloseButton />
                    <BeetsModalHeader>
                        <BeetsModalHeadline>{pool.name}</BeetsModalHeadline>
                    </BeetsModalHeader>
                    <BeetsModalBody>
                        <CardRow fontSize="sm">{pool.id}</CardRow>
                        <CardRow alignItems="center" fontSize="sm">
                            <Box flex="1">Address:</Box>
                            <Box mr="1">{pool.address}</Box>
                            <Link href={etherscanGetContractReadUrl(pool.address)} target="_blank">
                                <ExternalLink size={16} />
                            </Link>
                        </CardRow>
                        <CardRow alignItems="center" fontSize="sm">
                            <Box flex="1">Vault:</Box>
                            <Box mr="1">{balancer.vault}</Box>
                            <Link href={etherscanGetContractReadUrl(balancer.vault)} target="_blank">
                                <ExternalLink size={16} />
                            </Link>
                        </CardRow>
                        {rebalancer && (
                            <CardRow alignItems="center" fontSize="sm">
                                <Box flex="1">Rebalancer:</Box>
                                <Box mr="1">{rebalancer}</Box>
                                <Link href={etherscanGetContractWriteUrl(rebalancer)} target="_blank">
                                    <ExternalLink size={16} />
                                </Link>
                            </CardRow>
                        )}
                        {isReaperPool && balancer.reaperManualRebalancer && (
                            <CardRow alignItems="center" fontSize="sm">
                                <Box flex="1">Looping rebalancer:</Box>
                                <Box mr="1">{balancer.reaperManualRebalancer}</Box>
                                <Link
                                    href={etherscanGetContractWriteUrl(balancer.reaperManualRebalancer)}
                                    target="_blank"
                                >
                                    <ExternalLink size={16} />
                                </Link>
                            </CardRow>
                        )}

                        <Box mt="4">
                            <Text fontSize="lg" fontWeight="semibold">
                                Rebalancer
                            </Text>
                            <Flex mt="2">
                                <Box flex="1">
                                    <BeetsSubmitTransactionButton onClick={rebalance} {...rebalanceQuery} width="full">
                                        Rebalance
                                    </BeetsSubmitTransactionButton>
                                </Box>
                                <Box flex="1" ml="2">
                                    {hasRebalancerAllowance ? (
                                        <BeetsSubmitTransactionButton
                                            onClick={() => {
                                                rebalanceWithExtraMain('10');
                                            }}
                                            {...rebalanceWithExtraMainQuery}
                                            width="full"
                                        >
                                            Rebalance with extra main
                                        </BeetsSubmitTransactionButton>
                                    ) : (
                                        <BeetsSubmitTransactionButton
                                            onClick={() => {
                                                approveRebalancer(rebalancer);
                                            }}
                                            {...approveRebalancerQuery}
                                            width="full"
                                            onConfirmed={() => {
                                                rebalancerAllowance.refetch();
                                            }}
                                        >
                                            Approve extra main
                                        </BeetsSubmitTransactionButton>
                                    )}
                                </Box>
                            </Flex>
                        </Box>

                        {isReaperPool && (
                            <Box mt="8">
                                <Text fontSize="lg" fontWeight="semibold">
                                    Looping rebalancer
                                </Text>
                                <Text>
                                    {mainToken?.symbol} balance: {getUserBalance(mainToken?.address || '')}
                                </Text>
                                <Box mb="2" mt="2">
                                    <Input
                                        variant="filled"
                                        placeholder="Number of loops"
                                        size="md"
                                        value={numLoops}
                                        onChange={(e) => setNumLoops(e.currentTarget.value)}
                                    />
                                </Box>
                                <Box>
                                    <Input
                                        variant="filled"
                                        placeholder="Amount to loop with or 0 (scaled)"
                                        size="md"
                                        value={amountToLoopWith}
                                        onChange={(e) => setAmountToLoopWith(e.currentTarget.value)}
                                    />
                                </Box>
                                {!hasManualRebalancerAllowance && (
                                    <Box mt="4">
                                        <BeetsSubmitTransactionButton
                                            onClick={() => {
                                                approveManualRebalancer(reaperManualRebalancer);
                                            }}
                                            {...approveManualRebalancerQuery}
                                            width="full"
                                            onConfirmed={() => {
                                                manualRebalancerAllowance.refetch();
                                            }}
                                        >
                                            Approve {mainToken?.symbol}
                                        </BeetsSubmitTransactionButton>
                                    </Box>
                                )}
                                {hasManualRebalancerAllowance && (
                                    <Flex mt="4">
                                        <Box flex="1">
                                            <BeetsSubmitTransactionButton
                                                onClick={() => wrap(numLoops, amountToLoopWith)}
                                                {...wrapQuery}
                                                width="full"
                                                disabled={!numLoops || !amountToLoopWith}
                                            >
                                                Wrap
                                            </BeetsSubmitTransactionButton>
                                        </Box>
                                        <Box flex="1" ml="2">
                                            <BeetsSubmitTransactionButton
                                                onClick={() => unwrap(numLoops, amountToLoopWith)}
                                                {...unwrapQuery}
                                                width="full"
                                                disabled={!numLoops || !amountToLoopWith}
                                            >
                                                Unwrap
                                            </BeetsSubmitTransactionButton>
                                        </Box>
                                    </Flex>
                                )}
                            </Box>
                        )}
                    </BeetsModalBody>
                </BeetsModalContent>
            )}
        </Modal>
    );
}
