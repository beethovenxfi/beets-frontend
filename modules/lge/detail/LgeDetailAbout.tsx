import { Grid, GridItem, Text, Img, Divider } from '@chakra-ui/react';
import { GqlLge, GqlPoolUnion } from '~/apollo/generated/graphql-codegen-generated';
import { LgeIconLinks } from '~/modules/lges/components/LgeIconLinks';
import { LgeDetailAboutStats } from './LgeDetailAboutStats';
import { LgeDetailAboutInfo } from './LgeDetailAboutInfo';

interface Props {
    lge: GqlLge;
    status: 'active' | 'upcoming' | 'ended';
    pool: GqlPoolUnion;
}

export function LgeDetailAbout({ lge, status, pool }: Props) {
    return (
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap="4" width="full">
            <GridItem>
                <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                    Details
                </Text>
                <Img src={lge.bannerImageUrl} mb="8" />
                <Text style={{ whiteSpace: 'pre-line' }}>{lge.description}</Text>
                <Divider my="8" />
                <LgeIconLinks lge={lge} />
            </GridItem>

            <GridItem>
                {status === 'active' && <LgeDetailAboutStats lge={lge} pool={pool} />}
                <LgeDetailAboutInfo lge={lge} status={status} />
            </GridItem>
        </Grid>
    );
}
