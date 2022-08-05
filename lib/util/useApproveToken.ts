import { useSubmitTransaction } from '~/lib/util/useSubmitTransaction';
import ERC20Abi from '../abi/ERC20.json';
import { MaxUint256 } from '@ethersproject/constants';
import { TokenBase } from '~/lib/services/token/token-types';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function useApproveToken(token: TokenBase) {
    const networkConfig = useNetworkConfig();
    const { submit, submitAsync, ...rest } = useSubmitTransaction({
        config: {
            addressOrName: token.address || '',
            contractInterface: ERC20Abi,
            functionName: 'approve',
        },
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
