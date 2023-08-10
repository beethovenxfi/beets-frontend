import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useCompose } from './ComposeProvider';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { usePoolCreate } from './lib/usePoolCreate';
import useGetComposePoolId from './lib/useGetComposePoolId';
import { usePoolInitJoinGetContractCallData } from '../pool/invest/lib/usePoolInitJoinContractCallData';
import { useInitJoinPool } from '../pool/invest/lib/useInitJoinPool';
import { PoolJoinPoolContractCallData } from '~/lib/services/pool/pool-types';

interface Props {}

export default function FinalisePoolComposeActions(props: Props) {
    const { tokens, poolName, getPoolSymbol, currentFee, feeManager } = useCompose();
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const { getToken } = useGetTokens();
    const tokenBases = tokens.map((token) => {
        const _token = getToken(token.address);
        return {
            ..._token,
            amount: token.amount,
        } as TokenBaseWithAmount;
    });
    const { hasApprovalForAmount } = useUserAllowances(tokenBases, networkConfig.balancer.vault);
    const { create, ...createQuery } = usePoolCreate();
    const { poolId, isLoading: isLoadingPoolId } = useGetComposePoolId(createQuery.txResponse?.hash || '');
    const { initJoinPool, ...joinQuery } = useInitJoinPool(poolId?.id);
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

    console.log('req', {
        isLoadingPoolId,
        poolId,
        requiredApprovals,
        createQuery: createQuery.txResponse
    });

    function handleTransactionSubmit(txId: string) {
        if (txId === 'create-pool') {
            create({
                name: poolName || getPoolSymbol(),
                symbol: getPoolSymbol(),
                tokens,
                swapFee: currentFee,
                swapFeeManager: feeManager || '',
            });
        }
        if (txId === 'initialise-pool') {
            const tokenMetadata = tokens.map((token) => getToken(token.address));
            if (poolJoinContractCallData) {
                initJoinPool(poolJoinContractCallData as PoolJoinPoolContractCallData, tokenBases, tokenMetadata);
            }
        }
    }

    function handleCreateActionConfirmed(txId: string) {
        if (txId === 'create-pool') {
        }
    }

    useEffect(() => {
        const _steps: TransactionStep[] = [
            { id: 'create-pool', tooltipText: '', type: 'other', buttonText: 'Create pool' },
            { id: 'initialise-pool', tooltipText: '', type: 'other', buttonText: 'Initialise pool' },
        ];

        console.log('bstk', requiredApprovals);
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
    }, [requiredApprovals.length]);

    return (
        <Box width="full">
            <BeetsTransactionStepsSubmit
                buttonSize="lg"
                isLoading={false}
                loadingButtonText=""
                completeButtonText="Create"
                onCompleteButtonClick={() => false}
                onSubmit={handleTransactionSubmit}
                onConfirmed={async (id) => {}}
                steps={steps}
                queries={[{ ...createQuery, id: 'create-pool' }]}
                isDisabled={false}
            />
        </Box>
    );
}
