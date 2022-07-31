import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { capitalize } from 'lodash';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconMedium } from '~/components/icons/IconMedium';
import { GqlConfigNewsItem } from '~/apollo/generated/graphql-codegen-generated';
import { formatDistanceToNow } from 'date-fns';

interface Props {
    item: GqlConfigNewsItem;
}

export function HomeNewsCard({ item }: Props) {
    const { image, source, text, timestamp, url } = item;

    return (
        <Box bgColor="whiteAlpha.100" borderRadius="md" p="4">
            {image && <Image width="full" src={image} borderRadius="md" />}
            <Flex mt="4" mb="6" alignItems="center">
                <Box color="gray.200" flex="1">
                    {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}{' '}
                    <Link color="beets.highlight" href={url} target="_blank">
                        via {capitalize(source)}
                    </Link>
                </Box>
                {source === 'twitter' && <IconTwitter />}
                {source === 'discord' && <IconDiscord />}
                {source === 'medium' && <IconMedium />}
            </Flex>
            <Box whiteSpace="pre-line">{text}</Box>
        </Box>
    );
}
