import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import Head from 'next/head';
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
import { Heading, VStack } from '@chakra-ui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
    pool: GqlPoolUnion | null;
}
function MaBEETS({ pool }: Props) {
    const TITLE = 'Beethoven X | Reliquary';
    const DESCRIPTION = '';

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
            {pool ? (
                <PoolProvider pool={pool}>
                    <PoolUserBptBalanceProvider>
                        <PoolUserTokenBalancesInWalletProvider>
                            <UserTokenBalancesProvider>
                                <PoolUserDepositBalanceProvider>
                                    <RelicDepositBalanceProvider>
                                        <ReliquaryLanding />
                                    </RelicDepositBalanceProvider>
                                </PoolUserDepositBalanceProvider>
                            </UserTokenBalancesProvider>
                        </PoolUserTokenBalancesInWalletProvider>
                    </PoolUserBptBalanceProvider>
                </PoolProvider>
            ) : (
                <VStack minH="300px" justifyContent="center">
                    <Heading>MaBEETS is not supported on this chain.</Heading>
                </VStack>
            )}
        </>
    );
}

export async function getStaticProps({ locale }: { locale: string }) {
    const client = initializeApolloClient();
    const response = networkConfig.maBeetsEnabled
        ? await client.query<GetPoolQuery, GetPoolQueryVariables>({
              query: GetPool,
              variables: { id: networkConfig.reliquary.fbeets.poolId },
          })
        : null;

    return loadApolloState({
        client,
        props: {
            pool: response?.data.pool || null,
            ...(await serverSideTranslations(locale, ['reliquary', 'common'])),
        },
    });
}

export default MaBEETS;
