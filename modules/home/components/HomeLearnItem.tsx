import { Box, Link, Text } from '@chakra-ui/react';

interface Props {
    title: string;
    description: string;
    url: string;
    last?: boolean;
}

export function HomeLearnItem({ title, description, url, last }: Props) {
    return (
        <Box borderBottomWidth={last ? 0 : 1} borderBottomColor="beets.base.500" mb="6" pb="6">
            <Box>
                <Link fontSize="lg" fontWeight="semibold" mb="4">
                    {title}
                </Link>
                <Box>{description}</Box>
            </Box>
        </Box>
    );
}
