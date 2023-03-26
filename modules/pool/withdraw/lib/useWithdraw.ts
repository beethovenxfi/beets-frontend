import { GqlPoolToken } from '~/apollo/generated/graphql-codegen-generated';
import { useWithdrawState } from '~/modules/pool/withdraw/lib/useWithdrawState';
import { usePool } from '~/modules/pool/lib/usePool';
import { sumBy } from 'lodash';
import { useGetTokens } from '~/lib/global/useToken';

export function useWithdraw() {
    const { pool } = usePool();
    const { selectedOptions, proportionalAmounts } = useWithdrawState();

    const selectedWithdrawTokens: GqlPoolToken[] = pool.withdrawConfig.options.map((option) =>
        selectedOptions[`${option.poolTokenIndex}`]
            ? option.tokenOptions.find(
                  (tokenOption) => tokenOption.address === selectedOptions[`${option.poolTokenIndex}`],
              )!
            : option.tokenOptions[0],
    );

    const selectedWithdrawTokenAddresses = selectedWithdrawTokens.map((token) => token.address);

    return {
        selectedWithdrawTokens,
        selectedWithdrawTokenAddresses,
    };
}
