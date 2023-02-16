import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { UserTokenBalancesProvider } from '~/lib/user/useUserTokenBalances';
import { GetPoolQuery, GetPoolQueryVariables, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { GetPool } from '~/apollo/generated/operations';
import { PoolProvider } from '~/modules/pool/lib/usePool';
import { PoolUserTokenBalancesInWalletProvider } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { PoolUserBptBalanceProvider } from '~/modules/pool/lib/usePoolUserBptBalance';
import { networkConfig } from '~/lib/config/network-config';
import React from 'react';
import { RelicDepositBalanceProvider } from '~/modules/reliquary/lib/useRelicDepositBalance';
import { PoolUserDepositBalanceProvider } from '~/modules/pool/lib/usePoolUserDepositBalance';
import ReliquaryLanding from '~/modules/reliquary/ReliquaryLanding';
import Compose, { ProviderWithProps } from '~/components/providers/Compose';

interface Props {
    pool: GqlPoolUnion;
}
function MaBEETS({ pool }: Props) {
    const { chainId } = useNetworkConfig();

    const TITLE = 'Beethoven X | Reliquary';
    const DESCRIPTION = '';

    const MaBeetsProviders: ProviderWithProps[] = [
        [PoolProvider, { pool }],
        [PoolUserBptBalanceProvider, {}],
        [PoolUserTokenBalancesInWalletProvider, {}],
        [UserTokenBalancesProvider, {}],
        [PoolUserDepositBalanceProvider, {}],
        [RelicDepositBalanceProvider, {}],
    ];

    return (
        <>
            <Head>
                <title>{TITLE}</title>
                <meta name="title" content={TITLE} />
                <meta property="og:title" content={TITLE} />
                <meta property="twitter:title" content={TITLE} />

                <meta name="description" content={DESCRIPTION} />
                <meta property="og:description" content={DESCRIPTION} />
                <meta property="twitter:description" content={DESCRIPTION} />
            </Head>
            <Compose providers={MaBeetsProviders}>
                <ReliquaryLanding />
            </Compose>
        </>
    );
}

export async function getStaticProps({ params }: { params: { poolId: string } }) {
    const client = initializeApolloClient();
    const { data } = await client.query<GetPoolQuery, GetPoolQueryVariables>({
        query: GetPool,
        variables: { id: networkConfig.reliquary.fbeets.poolId },
    });

    //pre-load the fbeets ratio for fidelio duetto
    /*if (params.poolId === networkConfig.fbeets.poolId) {
        await client.query({ query: GetFbeetsRatio });
    }*/

    return loadApolloState({
        client,
        props: { pool: data.pool },
    });
}

export default MaBEETS;
