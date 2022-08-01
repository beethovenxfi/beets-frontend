import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import ERC20Abi from '../abi/ERC20.json';
import { networkConfig } from '~/lib/config/network-config';
import { MaxUint256 } from '@ethersproject/constants';
import { TokenBase } from '~/lib/services/token/token-types';

export function useApproveToken(token: TokenBase) {
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        contractConfig: {
            addressOrName: token.address || '',
            contractInterface: ERC20Abi,
        },
        functionName: 'approve',
        transactionType: 'APPROVE',
    });

    function approve(contractToApprove = networkConfig.balancer.vault) {
        submit({
            args: [contractToApprove, MaxUint256.toString()],
            toastText: `Approve ${token.symbol}`,
        });
    }

    return {
        approve,
        ...rest,
    };
}
