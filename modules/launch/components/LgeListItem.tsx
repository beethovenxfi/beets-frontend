import { Box, Grid, GridItem, GridItemProps, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { BoxProps } from '@chakra-ui/layout';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';

interface Props extends BoxProps {
    lge: GqlLge;
}

export function LgeListItem({ lge, ...rest }: Props) {
    const { getToken } = useGetTokens();

    return (
        <Box mb={{ base: '4', lg: '0' }} borderRadius={{ base: 'md', lg: '0' }} {...rest}>
            <Link href={`/launch/${lge.id}`} passHref>
                <a>
                    <Grid
                        pl="4"
                        py={{ base: '4', lg: '0' }}
                        height={{ lg: '63.5px' }}
                        templateColumns={{
                            //base: '1fr 1fr',
                            lg: 'repeat(4, 1fr)',
                        }}
                        gap="0"
                        templateAreas={{
                            //   base: `"name boosted"
                            //          "apr tvl"
                            //          "fees volume"
                            //          "icons icons"`,
                            lg: `"project token status links"`,
                        }}
                    >
                        <GridItem area="project" mb={{ base: '4', lg: '0' }} alignItems="center" display="flex">
                            <Text fontSize={{ base: 'xl', lg: 'md' }} fontWeight={{ base: 'bold', lg: 'normal' }}>
                                {lge.name}
                            </Text>
                            {/* {warningMessage && <LgeListItemWarning ml="2" message={warningMessage} />} */}
                        </GridItem>
                        <GridItem area="token" alignItems="center" display="flex" mb={{ base: '4', lg: '0' }}>
                            {lge.address.toLowerCase()}
                        </GridItem>
                    </Grid>
                </a>
            </Link>
        </Box>
    );
}

function MobileLabel({ text }: { text: string }) {
    return (
        <Text fontSize="xs" color="gray.200" display={{ base: 'block', lg: 'none' }}>
            {text}
        </Text>
    );
}

function StatGridItem(props: GridItemProps) {
    return <GridItem area="fees" textAlign={{ base: 'left', lg: 'right' }} mb={{ base: '4', lg: '0' }} {...props} />;
}
