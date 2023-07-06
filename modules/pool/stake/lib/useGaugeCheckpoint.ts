import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import BeethovenCheckpointer from '~/lib/abi/BeethovenCheckpointer.json';

export function useGaugeCheckpoint() {
    const networkConfig = useNetworkConfig();

    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.gauge.checkpointHelper,
            contractInterface: BeethovenCheckpointer,
            functionName: 'checkpoint_my_gauges',
        },
        transactionType: 'CHECKPOINT',
    });

    function checkpoint(gauges: string[]) {
        return submit({
            args: [gauges],
            toastText: `Checkpoint my gauges`,
            walletText: `Checkpoint gauges to receive maximum boost`,
        });
    }

    return {
        checkpoint,
        ...rest,
    };
}
