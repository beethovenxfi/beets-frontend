import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import MultiBeetsMigrationAbi from '~/lib/abi/MultiBeetsMigration.json';
import { AmountHumanReadable } from '~/lib/services/token/token-types';
import { parseUnits } from 'ethers/lib/utils.js';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useMigrateBeets() {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.beets.migration,
            contractInterface: MultiBeetsMigrationAbi,
            functionName: 'exchange',
        },
        transactionType: 'MIGRATE',
    });

    function migrate(amount: AmountHumanReadable) {
        submit({
            args: [parseUnits(amount, 18)],
            toastText: `Migrate ${amount} multiBEETS`,
        });
    }

    return {
        migrate,
        ...rest,
    };
}
