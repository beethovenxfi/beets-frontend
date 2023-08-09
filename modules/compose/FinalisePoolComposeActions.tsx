import { Box, Button } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { BeetsTransactionStepsSubmit, TransactionStep } from '~/components/button/BeetsTransactionStepsSubmit';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useCompose } from './ComposeProvider';
import { useGetTokens } from '~/lib/global/useToken';
import { TokenBase, TokenBaseWithAmount } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { useUserSyncBalanceMutation } from '~/apollo/generated/graphql-codegen-generated';
import { usePoolCreate } from './lib/usePoolCreate';

interface Props {}

export default function FinalisePoolComposeActions(props: Props) {
    const { tokens, poolName, getPoolSymbol, currentFee, feeManager } = useCompose();
    const [steps, setSteps] = useState<TransactionStep[]>([]);
    const { getToken } = useGetTokens();
    const [userSyncBalance] = useUserSyncBalanceMutation();
    const tokenBases = tokens.map((token) => {
        const _token = getToken(token.address);
        return {
            ..._token,
            amount: token.amount,
        } as TokenBaseWithAmount;
    });
    const { hasApprovalForAmount, ...rest } = useUserAllowances(tokenBases, networkConfig.balancer.vault);
    const { create, ...createQuery } = usePoolCreate();

    const requiredApprovals = tokenBases
        .filter((token) => parseFloat(token.amount) > 0)
        .map((token) => {
            return {
                token,
                isApproved: hasApprovalForAmount(token.address, token.amount.toString()),
            };
        })
        .filter((token) => !token.isApproved);

    console.log('req', requiredApprovals);

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
    }

    useEffect(() => {
        const _steps: TransactionStep[] = [
            { id: 'create-pool', tooltipText: '', type: 'other', buttonText: 'Create pool' },
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

        // if (hasLegacyBptStaked) {
        //     _steps.unshift({ id: 'unstake', tooltipText: '', type: 'other', buttonText: 'Unstake' });
        // }
        if (_steps.length < steps?.length) return;
        setSteps(_steps);
    }, []);

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
                queries={[
                    { ...createQuery, id: 'create-pool' },
                    // { ...depositQuery, id: 'deposit' },
                ]}
                isDisabled={false}
            />
        </Box>
    );
}
