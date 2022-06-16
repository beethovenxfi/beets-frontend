import { Box, Flex, Text } from '@chakra-ui/react';
import { IconDiscord } from '~/components/icons/IconDiscord';

export function HomeSocialCarouselCard({ height }: { height: string }) {
    return (
        <Box mx="2" p="3" bgColor="beets.base.800" borderRadius="md" height={height}>
            <Flex alignItems="center" mb="3">
                <Box flex="1" fontSize="sm">
                    12 hours ago
                </Box>
                <IconDiscord />
            </Flex>
            <Box>
                <Text noOfLines={4}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et arcu nec
                    ullamcorper. Donec rutrum auctor rutrum. Suspendisse ut velit eleifend, ultrices leo non, pulvinar
                    metus. Sed nec odio enim. Integer nec condimentum felis, nec hendrerit nulla. Duis rhoncus tincidunt
                    magna, id vulputate neque rutrum vel. Quisque lacinia lectus ut facilisis accumsan. Praesent a felis
                    porta, volutpat ligula elementum, hendrerit odio.
                </Text>
            </Box>
        </Box>
    );
}
