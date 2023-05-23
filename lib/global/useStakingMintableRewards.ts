import { useQuery } from 'react-query';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { gaugeStakingService } from '../services/staking/gauge-staking.service';
import { useUserAccount } from '../user/useUserAccount';
import { useProvider } from 'wagmi';
import { useSubmitTransaction } from '../util/useSubmitTransaction';
import { useNetworkConfig } from './useNetworkConfig';
import BalancerPseudoMinterAbi from '~/lib/abi/BalancerPseudoMinter.json';

export default function useStakingMintableRewards(gauges: GqlPoolStaking[]) {
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();
    const provider = useProvider();

    const {
        submit: submitClaimBAL,
        submitAsync: submitClaimBALAsync,
        ...claimRest
    } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.gauge.balancerPseudoMinterAddress,
            contractInterface: BalancerPseudoMinterAbi,
            functionName: 'mint',
        },
        transactionType: 'HARVEST',
    });

    const {
        submit: submitClaimAllBAL,
        submitAsync: submitClaimAllBALAsync,
        ...claimAllRest
    } = useSubmitTransaction({
        config: {
            addressOrName: networkConfig.gauge.balancerPseudoMinterAddress,
            contractInterface: BalancerPseudoMinterAbi,
            functionName: 'mintMany',
        },
        transactionType: 'HARVEST',
    });

    function claimBAL(gaugeAddress: string) {
        return submitClaimBAL({
            args: [gaugeAddress],
            toastText: 'Claim BAL rewards',
        });
    }

    function claimAllBAL(gaugeAddresses: string[]) {
        return submitClaimBAL({
            args: [gaugeAddresses],
            toastText: 'Claim all BAL rewards',
        });
    }

    const { data: claimableBAL, isLoading } = useQuery(
        ['claimableBalRewards', gauges.map((gauge) => gauge.address), userAddress],
        async () => {
            if (userAddress) {
                const claimableBAL = gaugeStakingService.getPendingBALRewards({
                    userAddress,
                    provider,
                    gauges: gauges.map((gauge) => gauge.address),
                });
                return claimableBAL;
            }
            return {};
        },
        {
            enabled: !!userAddress,
        },
    );

    return {
        claimableBAL,
        isLoading,
        claim: {
            claimBAL,
            ...claimRest,
        },
        claimAll: {
            claimAllBAL,
            ...claimAllRest,
        },
    };
}