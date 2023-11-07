import { Alert, Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { PoolCreationToken, useCompose } from './ComposeProvider';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { usePoolCreate } from './lib/usePoolCreate';
import { usePoolInitJoinGetContractCallData } from '../pool/invest/lib/usePoolInitJoinContractCallData';
import { useInitJoinPool } from '../pool/invest/lib/useInitJoinPool';
import { PoolJoinPoolContractCallData } from '~/lib/services/pool/pool-types';
import { GqlToken } from '~/apollo/generated/graphql-codegen-generated';
import { useRouter } from 'next/router';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { PoolVerification } from './PoolVerificationToast';

const POOL_REGISTERED_LOG_TOPIC = '0x3c13bc30b8e878c53fd2a36b679409c073afd75950be43d8858768e956fbc20e';

interface Props {}

function sortTokensByAddress(tokens: PoolCreationToken[]) {
    return tokens.sort((tokenA, tokenB) => {
        return tokenA.address.toLowerCase() > tokenB.address.toLowerCase() ? 1 : -1;
    });
}

export default function FinalisePoolComposeActions(props: Props) {
    const { tokens, poolName, getPoolSymbol, currentFee, feeManager, setPoolId, poolId, isUsingCustomFee } =
        useCompose();
    const router = useRouter();
    const { showToast, removeToast } = useToast();
    const isRabby = (window as any).web3.currentProvider.isRabby;
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const [isVerifying, setIsVerifying] = useState(false);

    const { getToken } = useGetTokens();
    const tokenBases = tokens.map((token) => {
        const _token = getToken(token.address);
        return {
            ..._token,
            amount: token.amount,
        } as TokenBaseWithAmount;
    });
    const { hasApprovalForAmount, isLoading: isLoadingAllowances } = useUserAllowances(
        tokenBases,
        networkConfig.balancer.vault,
    );
    const { create, ...createQuery } = usePoolCreate();
    const { initJoinPool, ...joinQuery } = useInitJoinPool(poolId || '');
    const { data: poolJoinContractCallData, isLoading: isLoadingPoolJoinContractCallData } =
        usePoolInitJoinGetContractCallData(tokens);

    const requiredApprovals = tokenBases
        .filter((token) => parseFloat(token.amount) > 0)
        .map((token) => {
            return {
                token,
                isApproved: hasApprovalForAmount(token.address, token.amount.toString()),
            };
        })
        .filter((token) => !token.isApproved);

    function handleTransactionSubmit(txId: string) {
        const formattedFee = isUsingCustomFee ? parseFloat(currentFee) / 100 : currentFee;
        if (txId === 'create-pool') {
            create({
                name: poolName || getPoolSymbol(),
                symbol: getPoolSymbol(),
                tokens: sortTokensByAddress(tokens),
                swapFee: (parseFloat(currentFee) / 100).toString(),
                swapFeeManager: feeManager || '',
            });
        }
        if (txId === 'initialise-pool') {
            const tokenMetadata = tokens.map((token) => getToken(token.address));
            if (poolJoinContractCallData) {
                initJoinPool(
                    poolJoinContractCallData as PoolJoinPoolContractCallData,
                    tokenBases,
                    tokenMetadata.filter((token) => token !== null) as GqlToken[],
                );
            }
        }
    }

    function handleCreateActionConfirmed(txId: string) {
        if (txId === 'create-pool' && createQuery.txReceipt) {
            const poolId = createQuery.txReceipt.logs.find(
                (log) => log.topics[0] === POOL_REGISTERED_LOG_TOPIC, // PoolRegistered event
            )?.topics[1];
            poolId && setPoolId(poolId);
        }
    }

    function navigateToPool() {
        router.replace(`/pool/${poolId}`);
    }

    const updateIsVerifying = (newValue: boolean) => {
        setIsVerifying(newValue);
    };

    useEffect(() => {
        if (isLoadingAllowances) {
            return;
        }
        const _steps: TransactionStep[] = [
            { id: 'create-pool', tooltipText: '', type: 'other', buttonText: 'Create pool' },
            { id: 'initialise-pool', tooltipText: '', type: 'other', buttonText: 'Initialise pool' },
        ];

        for (const requiredApproval of requiredApprovals) {
            _steps.unshift({
                id: 'approve',
                tooltipText: 'Approve the vault to spend this token',
                type: 'tokenApproval',
                buttonText: 'Approve this token',
                contractToApprove: networkConfig.balancer.vault,
                token: requiredApproval.token,
            });
        }
        if (_steps.length < steps?.length) return;
        setSteps(_steps);
    }, [requiredApprovals.length, isLoadingAllowances]);

    useEffect(() => {
        if (joinQuery.isConfirmed && poolId) {
            showToast({
                id: 'verify-pool',
                content: <PoolVerification poolAddress={poolId.slice(32)} updateIsVerifying={updateIsVerifying} />,
                type: ToastType.Warn,
            });
        }
    }, [JSON.stringify(joinQuery)]);

    return (
        <Box width="full">
            {isRabby && networkConfig.chainName === 'FANTOM' && (
                <Alert status="warning">
                    {`We've recognised that you are using Rabby. Due to an issue with Rabby's gas estimation, you will need to adjust the gas limit to be 1x instead of the default of 2x that Rabby assigns to the create transaction.`}
                </Alert>
            )}
            <Box width="full" pt="4">
                <BeetsTransactionStepsSubmit
                    buttonSize="lg"
                    isLoading={createQuery.isPending}
                    loadingButtonText=""
                    completeButtonText={`Go to ${poolName}`}
                    onCompleteButtonClick={() => navigateToPool()}
                    onSubmit={handleTransactionSubmit}
                    onConfirmed={handleCreateActionConfirmed}
                    steps={steps}
                    queries={[
                        { ...createQuery, id: 'create-pool' },
                        { ...joinQuery, id: 'initialise-pool' },
                    ]}
                    isDisabled={isVerifying}
                />
            </Box>
        </Box>
    );
}
