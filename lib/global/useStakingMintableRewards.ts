import { useQuery } from 'react-query';
import { GqlPoolStaking } from '~/apollo/generated/graphql-codegen-generated';
import { gaugeStakingService } from '../services/staking/gauge-staking.service';
import { useUserAccount } from '../user/useUserAccount';
import { useProvider } from 'wagmi';
import { useSubmitTransaction } from '../util/useSubmitTransaction';
import { useNetworkConfig } from './useNetworkConfig';
import BalancerPseudoMinterAbi from '~/lib/abi/BalancerPseudoMinter.json';
import { AddressZero } from '@ethersproject/constants';

export default function useStakingMintableRewards(staking: GqlPoolStaking[]) {
    const { userAddress } = useUserAccount();
    const networkConfig = useNetworkConfig();
    const provider = useProvider();

    const mintableGaugeAddresses = staking
        .filter((staking) => staking.type === 'GAUGE' && staking.gauge?.version === 2)
        .map((gauge) => gauge.address);

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

    function claimAllBAL() {
        return submitClaimAllBAL({
            args: [mintableGaugeAddresses],
            toastText: 'Claim all BAL rewards',
        });
    }

    const {
        data: claimableBALForGauges,
        isLoading,
        refetch,
    } = useQuery(
        ['claimableBalRewards', mintableGaugeAddresses, userAddress],
        async () => {
            if (userAddress) {
                const claimableBAL = gaugeStakingService.getPendingBALRewards({
                    userAddress,
                    provider,
                    gauges: mintableGaugeAddresses,
                });
                return claimableBAL;
            }
            return {};
        },
        {
            enabled: !!userAddress && networkConfig.gauge.balancerPseudoMinterAddress !== AddressZero,
        },
    );

    return {
        claimableBALForGauges,
        isLoading,
        claim: {
            claimBAL,
            ...claimRest,
        },
        claimAll: {
            claimAllBAL,
            ...claimAllRest,
        },
        refetch,
    };
}
