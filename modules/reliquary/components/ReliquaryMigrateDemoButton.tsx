import { Button } from '@chakra-ui/react';
import { useReliquaryFbeetsMigrateContractCallData } from '~/modules/reliquary/lib/useReliquaryFbeetsMigrateContractCallData';
import { useReliquaryFbeetsZap } from '~/modules/reliquary/lib/useReliquaryFbeetsZap';

export function ReliquaryMigrateDemoButton() {
    const { data: contractCalls, fbeetsBalance } = useReliquaryFbeetsMigrateContractCallData();
    const { reliquaryFbeetsZap } = useReliquaryFbeetsZap();

    return (
        <Button
            onClick={() => {
                reliquaryFbeetsZap(contractCalls || []);
            }}
        >
            Migrate fBeets to reliquary {fbeetsBalance}
        </Button>
    );
}
