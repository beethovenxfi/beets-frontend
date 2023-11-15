import { useQuery } from 'react-query';
import { etherscanService } from '~/lib/services/util/etherscan.service';

export function useCheckVerifyStatus(guid: string) {
    return useQuery(
        ['checkVerifyStatus', guid],
        async () => {
            const status = await etherscanService.checkVerifyStatus({ guid });

            return status;
        },
        { enabled: guid !== '' },
    );
}
