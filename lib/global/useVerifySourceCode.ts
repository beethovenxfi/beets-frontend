import { useQuery } from 'react-query';
import { etherscanService } from '~/lib/services/util/etherscan.service';

export function useVerifySourceCode(contractaddress: string, constructorArguements: string) {
    return useQuery(
        ['verifyContract', contractaddress, constructorArguements],
        async () => {
            const result = await etherscanService.verifySourceCode({
                contractaddress,
                constructorArguements,
            });

            return result.result;
        },
        { enabled: contractaddress !== '' && constructorArguements !== '' },
    );
}
