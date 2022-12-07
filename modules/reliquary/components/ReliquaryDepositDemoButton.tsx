import { useReliquaryZap } from '~/modules/reliquary/lib/useReliquaryZap';
import { Button } from '@chakra-ui/react';
import { useReliquaryDepositContractCallData } from '~/modules/reliquary/lib/useReliquaryDepositContractCallData';

export function ReliquaryDepositDemoButton() {
    const { data: contractCalls } = useReliquaryDepositContractCallData({
        beetsAmount: '1.0',
        ftmAmount: '1.0',
        isNativeFtm: false,
    });
    const { reliquaryZap } = useReliquaryZap();

    return (
        <Button
            onClick={() => {
                reliquaryZap(contractCalls || [], 'DEPOSIT');
            }}
        >
            Deposit ftm/beets to reliquary
        </Button>
    );
}
