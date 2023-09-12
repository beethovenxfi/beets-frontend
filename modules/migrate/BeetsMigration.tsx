import { Button, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { BeetsSubmitTransactionButton } from '~/components/button/BeetsSubmitTransactionButton';
import { BeetsTokenApprovalButton } from '~/components/button/BeetsTokenApprovalButton';
import { TokenBase } from '~/lib/services/token/token-types';

interface Props {
    beetsBalance: string;
    tokenData: TokenBase | null;
}

export function BeetsMigration({ beetsBalance, tokenData }: Props) {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    return (
        <HStack>
            {isConfirmed ? (
                <Text>You have successfully swapped BEETS for multiBEETS!</Text>
            ) : (
                <>
                    <Text>You have {beetsBalance} multiBEETS that you can swap 1:1 for BEETS.</Text>
                    {isApproved ? (
                        <Button>Swap</Button>
                    ) : (
                        tokenData && (
                            <BeetsTokenApprovalButton
                                tokenWithAmount={{ ...tokenData, amount: beetsBalance }}
                                onConfirmed={() => {
                                    setIsApproved(true);
                                }}
                                size="lg"
                            />
                        )
                    )}
                </>
            )}
        </HStack>
    );
}
