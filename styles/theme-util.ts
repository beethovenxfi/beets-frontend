import { BoxProps } from '@chakra-ui/react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function protocolThemeProp({ balancer, beets }: { balancer: string; beets: string }) {
    const { protocol } = useNetworkConfig();

    if (protocol === 'balancer') {
        return balancer;
    } else {
        return beets;
    }
}
