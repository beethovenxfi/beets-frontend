import { Box, BoxProps, Flex, Image, Link, Text } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconMedium } from '~/components/icons/IconMedium';

export function HomeNews(props: BoxProps) {
    return (
        <Box {...props}>
            <BeetsHeadline mb="10">What&apos;s new</BeetsHeadline>
            <Box mb="4">
                <Text fontSize="2xl" ml="2" color="white">
                    Latest community updates
                </Text>
            </Box>
            <Box bgColor="beets.base.600" borderRadius="md" p="4">
                <Box borderBottomWidth={2} borderBottomColor="gray.100" pb="8" mb="8">
                    <Image
                        width="full"
                        src="https://beethoven-assets.s3.eu-central-1.amazonaws.com/fireside2.png"
                        borderRadius="md"
                    />
                    <Flex mt="4" mb="6" alignItems="center">
                        <Box color="gray.200" flex="1">
                            A few minutes ago <Link color="beets.cyan">via Discord</Link>
                        </Box>
                        <IconDiscord />
                    </Flex>
                    <Box>
                        With so much happening in the ecosystem we thought it would be a great time to check in and
                        invite you all for a chat.
                        <br />
                        <br />
                        In the spirit of community and connection we are excited to be hosting a down-to-earth Fireside
                        session this Tuesday at 12pm UTC.
                    </Box>
                </Box>
                <Box borderBottomWidth={2} borderBottomColor="gray.100" pb="8" mb="8">
                    <Flex mt="4" mb="6" alignItems="center">
                        <Box color="gray.200" flex="1">
                            14 hours ago <Link color="beets.cyan">via Twitter</Link>
                        </Box>
                        <IconTwitter />
                    </Flex>
                    <Box>
                        The bird of fire 🔥 has arrived on Beethoven x.
                        <br />
                        <br />
                        Love for partnerships that keep evolving ❤️
                        <br />
                        <br />
                        Can you hear the music? 🎸🚀
                    </Box>
                </Box>
                <Box borderBottomWidth={2} borderBottomColor="gray.100" pb="8" mb="8">
                    <Flex mt="4" mb="6" alignItems="center">
                        <Box color="gray.200" flex="1">
                            14 hours ago <Link color="beets.cyan">via Medium</Link>
                        </Box>
                        <IconMedium />
                    </Flex>
                    <Box>
                        Symphony of the Week: The Grand Orchestra
                        <br />
                        <br />
                        This week we feature a pool whose thunderous sounds are arguably the most influential to us and
                        those arounds us.
                        <br />
                        <br />
                        As the notes from three powerful master composers fill the sky and the melody ebbs and flows,
                        the audience hangs onto every beat. This week we feature the powerhouse that is The Grand
                        Orchestra.
                    </Box>
                </Box>
                <Box pb="8">
                    <Flex mt="4" mb="6" alignItems="center">
                        <Box color="gray.200" flex="1">
                            14 hours ago <Link color="beets.cyan">via Discord</Link>
                        </Box>
                        <IconDiscord />
                    </Flex>
                    <Box>
                        Cue the Music! 🎉
                        <br />
                        <br />
                        The Balancer & Beethoven proposal is live on Optimism snapshot!
                        <br />
                        <br />
                        Cast your vote before July 6th and let’s see if we can turn the music up even louder.
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
