import { Box, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { TokenBase } from '~/lib/services/token/token-types';
import { networkConfig } from '~/lib/config/network-config';
import { BeetsMigrationButton } from './BeetsMigrationButton';
import { useUserAllowances } from '~/lib/util/useUserAllowances';

interface Props {
    oldBeetsBalance: string;
    tokenData: TokenBase | null;
}

export function BeetsMigration({ oldBeetsBalance, tokenData }: Props) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { hasApprovalForAmount, isLoading, refetch } = useUserAllowances([tokenData], networkConfig.beets.migration);
    const hasApprovedToken = hasApprovalForAmount(tokenData?.address || '', oldBeetsBalance);

    return (
        <HStack>
            {isConfirmed && <Text>You have successfully migrated lzBEETS to BEETS!</Text>}
            {!isConfirmed && (
                <>
                    <Text>You have {oldBeetsBalance} lzBEETS that you can migrate 1:1 to BEETS.</Text>
                    {hasApprovedToken && (
                        <BeetsMigrationButton
                            amount={oldBeetsBalance}
                            onConfirmed={() => {
                                setIsConfirmed(true);
                            }}
                            inline
                            size="md"
                            isLoading={isLoading}
                        />
                    )}
                    {!hasApprovedToken && tokenData && (
                        <Box w="225px">
                            <BeetsTokenApprovalButton
                                contractToApprove={networkConfig.beets.migration}
                                tokenWithAmount={{ ...tokenData, amount: oldBeetsBalance }}
                                onConfirmed={() => {
                                    refetch();
                                }}
                                inline
                                size="md"
                                isLoading={isLoading}
                            />
                        </Box>
                    )}
                </>
            )}
        </HStack>
    );
}
