import { useGetTokenNamesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { Text } from '@chakra-ui/react';

function Withdraw() {
    return (
        <>
            <Text>withdraw</Text>
        </>
    );
}

/*export async function getStaticProps() {
    const client = initializeApolloClient();

    return loadApolloState({
        client,
    });
}*/

export default Withdraw;
