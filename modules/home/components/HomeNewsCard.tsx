import { Box, Flex, Image, Link } from '@chakra-ui/react';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { capitalize } from 'lodash';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconMedium } from '~/components/icons/IconMedium';

interface Props {
    image?: string;
    source: 'twitter' | 'discord' | 'medium';
    timestamp: string;
    text: string;
    url: string;
}

export function HomeNewsCard({ image, source, text, timestamp, url }: Props) {
    return (
        <Box bgColor="beets.base.600" borderRadius="md" p="4" mb="4">
            {image && <Image width="full" src={image} borderRadius="md" />}
            <Flex mt="4" mb="6" alignItems="center">
                <Box color="gray.200" flex="1">
                    A few minutes ago{' '}
                    <Link color="beets.cyan" href={url} target="_blank">
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
