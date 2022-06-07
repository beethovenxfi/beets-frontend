import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import ERC20Abi from '../abi/ERC20.json';
import { networkConfig } from '~/lib/config/network-config';
import { MaxUint256 } from '@ethersproject/constants';

export function useApproveToken(tokenAddress: string) {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: tokenAddress,
            contractInterface: ERC20Abi,
        },
        functionName: 'approve',
        toastType: 'APPROVE',
    });

    function approve(contractToApprove = networkConfig.balancer.vault) {
        submit({
            args: [contractToApprove, MaxUint256.toString()],
            toastText: 'Approve token',
        });
    }

    return {
        approve,
        ...rest,
    };
}
