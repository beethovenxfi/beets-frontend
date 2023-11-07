import { useQuery } from 'react-query';
import { etherscanService } from '~/lib/services/util/etherscan.service';

export function useVerifyContract(contractaddress: string, constructorArguements: string) {
    return useQuery(
        ['verifyContract', contractaddress, constructorArguements],
        async () => {
            const result = await etherscanService.verifySourceCode({
                contractaddress,
                constructorArguements,
            });

            const status = await etherscanService.checkVerifyStatus({ guid: result.result });

            return status;
        },
        { enabled: contractaddress !== '' && constructorArguements !== '' },
    );
}
