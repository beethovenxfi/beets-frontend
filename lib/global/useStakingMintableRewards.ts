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

    // temporary work around to claim all BAL from all boosted gauges (hardcoded below), even when user unstaked but forgot to claim them
    // this workaround will be removed when v6 of the batch relayer is released
    // const mintableGaugeAddresses = staking
    //     .filter((staking) => staking.type === 'GAUGE' && staking.gauge?.version === 2)
    //     .map((gauge) => gauge.address);
    const mintableGaugeAddresses = [
        '0xf27d53f21d024643d50de50183932f17638229f6', // rocket fuel
        '0x9f9f8d58496691d541c40dbc2b1b20f8c43e8d8c', // gyro eclp wsteth/weth
        '0xa30992b40a0cb4b2da081ddbd843f9cce25c2fe3', // shanghai shakedown
    ];

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
