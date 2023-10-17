import { Box, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { networkConfig } from '~/lib/config/network-config';
import { BeetsMigrationButton } from './BeetsMigrationButton';
import { useUserAllowances } from '~/lib/util/useUserAllowances';
import { useGetTokens } from '~/lib/global/useToken';

interface Props {
    beetsBalance: string;
}

export function BeetsMigration({ beetsBalance }: Props) {
    const { getToken } = useGetTokens();
    const tokenData = getToken(networkConfig.beets.address);
    const [isConfirmed, setIsConfirmed] = useState(false);

    const {
        hasApprovalForAmount,
        isLoading: isLoadingAllowances,
        refetch: refetchAllowances,
    } = useUserAllowances([tokenData], networkConfig.beets.migration);

    return (
        <HStack>
            {isConfirmed ? (
                <Text>You have successfully migrated (multi)BEETS to (lz)BEETS!</Text>
            ) : (
                <>
                    <Text>You have {beetsBalance} (multi)BEETS that you can migrate 1:1 to (lz)BEETS.</Text>
                    {!isLoadingAllowances && hasApprovalForAmount(tokenData?.address || '', beetsBalance) ? (
                        <BeetsMigrationButton
                            amount={beetsBalance}
                            onConfirmed={() => {
                                setIsConfirmed(true);
                            }}
                            inline
                            size="lg"
                        />
                    ) : (
                        tokenData && (
                            <Box w="200px">
                                <BeetsTokenApprovalButton
                                    contractToApprove={networkConfig.beets.migration}
                                    tokenWithAmount={{ ...tokenData, amount: beetsBalance }}
                                    onConfirmed={() => {
                                        refetchAllowances();
                                    }}
                                    inline
                                    size="lg"
                                />
                            </Box>
                        )
                    )}
                </>
            )}
        </HStack>
    );
}
