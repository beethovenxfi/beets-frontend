import { useRouter } from 'next/router';
import { GetLgeQuery, GetLgeQueryVariables } from '~/apollo/generated/graphql-codegen-generated';
import { initializeApolloClient, loadApolloState } from '~/apollo/client';
import { GetLge } from '~/apollo/generated/operations';
import Head from 'next/head';
import { FallbackPlaceholder } from '~/components/fallback/FallbackPlaceholder';

import { Img, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';

interface Props {
    lge: any;
}

const LgePage = ({ lge }: Props) => {
    const router = useRouter();
    if (router.isFallback) {
        return <FallbackPlaceholder />;
    }

    return (
        <>
            <Head>
                <title>Beethoven X | {lge.name} LBP</title>
                <meta name="title" content={`Beethoven X | ${lge.name} LBP`} />
                <meta property="og:title" content={`Beethoven X | ${lge.name} LBP`} />
                <meta property="twitter:title" content={`Beethoven X | ${lge.name} LBP`} />
            </Head>
            <Text>Under construction</Text>
        </>
    );
};

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export async function getStaticProps({ params }: { params: { lgeId: string } }) {
    const client = initializeApolloClient();
    const { data } = await client.query<GetLgeQuery, GetLgeQueryVariables>({
        query: GetLge,
        variables: { id: params.lgeId },
    });

    return loadApolloState({
        client,
        props: { lge: data.lge },
    });
}

export default LgePage;
