import { Box, Heading, VStack, Text, Link } from '@chakra-ui/react';
import Head from 'next/head';

function TermsOfService() {
    return (
        <>
            <Head>
                <title>Beethoven X - Terms of Service</title>
            </Head>
            <VStack my={{ base: '8', xl: '32' }} w="full">
                <VStack w={{ base: undefined, xl: '50%' }} alignItems="flex-start" spacing="6">
                    <Heading as="h1">Terms of service</Heading>
                    <Text>BeethovenX DAO Reliquary NFT Terms</Text>
                    <Text>Protocol & Entity Participation.</Text>
                    <Text>
                        Unless otherwise indicated, the defined and capitalized terms used below incorporate the same
                        meaning as the terms used in the BeethovenX DAO LLC operating agreement (the “Agreement”),
                        available{' '}
                        <Link
                            color="white"
                            _hover={{ color: 'beets.highlight', textDecoration: 'underline' }}
                            href="https://docs.beets.fi/operating-agreement"
                            target="_blank"
                        >
                            here
                        </Link>
                        . The NFT is referred to as the “Token” in the Agreement.
                    </Text>
                    <Text>
                        By using this NFT to participate in the governance and operations of the BeethovenX, the holder
                        of this NFT agrees to be subject to the terms of the Agreement, including as a Member of its
                        entity structure. BeethovenX formed a nonprofit LLC under the laws of the Republic of the
                        Marshall Islands on <Text as="i">TBD</Text>. Participation in the governance and operations of
                        BeethovenX includes, but is not limited to, utilizing the NFT to: (1) vote on Proposals to
                        become Governance Resolutions, (2) attend events and otherwise communicate with the BeethovenX
                        community, and (3) interact with the BeethovenX protocol.
                    </Text>
                    <Text>
                        Except as otherwise provided in the Agreement, a Token Holder’s membership interest or rights
                        thereunder in relation to this NFT are freely transferable to another person through its
                        conveyance. Except as otherwise provided in the Agreement, a Member shall be deemed to have
                        resigned from the BeethovenX DAO LLC upon the disposal or transfer of this NFT.
                    </Text>
                </VStack>
            </VStack>
        </>
    );
}

export default TermsOfService;
