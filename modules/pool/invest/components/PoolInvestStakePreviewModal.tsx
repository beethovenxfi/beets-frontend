import { Box, BoxProps } from '@chakra-ui/react';
import { usePool } from '~/modules/pool/lib/usePool';
import { usePoolUserStakingAllowance } from '~/modules/pool/lib/usePoolUserStakingAllowance';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { useApproveToken } from '~/lib/util/useApproveToken';
import { useEffect } from 'react';
import { tokenFormatAmount } from '~/lib/services/token/token-util';
import { useMasterChefDepositIntoFarm } from '~/lib/global/useMasterChefDepositIntoFarm';
import { VerticalStepsPreviewModal } from '~/components/preview-modal/VerticalStepsPreviewModal';
import { usePoolUserPoolTokenBalances } from '~/modules/pool/lib/usePoolUserPoolTokenBalances';

interface Props extends BoxProps {
    amountIsValid: boolean;
    amount: AmountHumanReadable | null;
}

export function PoolInvestStakePreviewModal({ amount, amountIsValid, ...rest }: Props) {
    const { pool } = usePool();
    const poolUserPoolTokenBalances = usePoolUserPoolTokenBalances();
    const { hasApprovalToStakeAmount, isLoading, refetch, isRefetching } = usePoolUserStakingAllowance();
    const hasApproval = amount ? hasApprovalToStakeAmount(amount) : false;

    const { approve, ...approveToken } = useApproveToken(pool.address);
    const { stake, ...masterChefDepositIntoFarm } = useMasterChefDepositIntoFarm();

    useEffect(() => {
        if (approveToken.isConfirmed) {
            refetch();
        }
    }, [approveToken.isConfirmed]);

    useEffect(() => {
        if (masterChefDepositIntoFarm.isConfirmed) {
            poolUserPoolTokenBalances.refetch();
        }
    }, [masterChefDepositIntoFarm.isConfirmed]);

    return (
        <Box {...rest}>
            <VerticalStepsPreviewModal
                onModalClose={() => {
                    approveToken.reset();
                    masterChefDepositIntoFarm.reset();
                }}
                onModalOpen={() => {}}
                showModalButton={{
                    text: 'Preview',
                    disabled: !amount || !amountIsValid,
                }}
                header={`Stake ${tokenFormatAmount(amount || '0')} BPT`}
                button={
                    !hasApproval
                        ? {
                              children: 'Approve BPT',
                              isLoading,
                              isSubmitting: approveToken.isSubmitting,
                              isPending:
                                  approveToken.isPending || (approveToken.isConfirmed && (isRefetching || isLoading)),
                              loadingText: 'Loading approvals...',
                              onClick: () => {
                                  approve(pool.staking?.address || '');
                              },
                          }
                        : {
                              children: 'Stake BPT',
                              disabled: masterChefDepositIntoFarm.isConfirmed,
                              isSubmitting: masterChefDepositIntoFarm.isSubmitting,
                              isPending: masterChefDepositIntoFarm.isPending,
                              onClick: () => {
                                  stake(pool.staking?.id || '', amount || '0');
                              },
                          }
                }
                steps={[
                    { text: 'Approve BPT', complete: hasApproval },
                    { text: 'Stake BPT', complete: masterChefDepositIntoFarm.isConfirmed },
                ]}
            />
        </Box>
    );
}
