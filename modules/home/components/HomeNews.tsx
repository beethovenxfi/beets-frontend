import { Box, BoxProps, Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import { BeetsHeadline } from '~/components/typography/BeetsHeadline';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconMedium } from '~/components/icons/IconMedium';
import BeetsButton from '~/components/button/Button';
import { useBoolean } from '@chakra-ui/hooks';
import { BeetsSubHeadline } from '~/components/typography/BeetsSubHeadline';
import { HomeNewsCard } from '~/modules/home/components/HomeNewsCard';

export function HomeNews(props: BoxProps) {
    const [expanded, { on }] = useBoolean(false);

    return (
        <Box {...props}>
            <BeetsHeadline mb="10">What&apos;s new</BeetsHeadline>
            <BeetsSubHeadline mb="4">Latest community updates</BeetsSubHeadline>
            <Box>
                <Box maxHeight={!expanded ? '6xl' : undefined} overflowY={!expanded ? 'hidden' : undefined}>
                    <HomeNewsCard
                        image="https://beethoven-assets.s3.eu-central-1.amazonaws.com/fireside2.png"
                        source="twitter"
                        timestamp="123"
                        text={`With so much happening in the ecosystem we thought it would be a great time to check in and invite you all for a chat.\n\nIn the spirit of community and connection we are excited to be hosting a down-to-earth Fireside session this Tuesday at 12pm UTC.`}
                        url="https://beets.fi"
                    />
                    <HomeNewsCard
                        source="twitter"
                        timestamp="123"
                        text={`The bird of fire 🔥 has arrived on Beethoven x.\n\nLove for partnerships that keep evolving ❤️\n\nCan you hear the music? 🎸🚀`}
                        url="https://beets.fi"
                    />
                    <HomeNewsCard
                        source="medium"
                        timestamp="123"
                        text={`Symphony of the Week: The Grand Orchestra\n\nThis week we feature a pool whose thunderous sounds are arguably the most influential to us
                            and those around us.️\n\nAs the notes from three powerful master composers fill the sky and the melody ebbs and
                            flows, the audience hangs onto every beat. This week we feature the powerhouse that is The
                            Grand Orchestra.`}
                        url="https://beets.fi"
                    />
                    <HomeNewsCard
                        source="discord"
                        timestamp="123"
                        text={`Cue the Music! 🎉\n\nThe Balancer & Beethoven proposal is live on Optimism snapshot!\n\nCast your vote before July 6th and let’s see if we can turn the music up even louder.`}
                        url="https://beets.fi"
                    />
                </Box>
                {!expanded ? (
                    <Flex justifyContent="center" mt="8">
                        <BeetsButton buttonType="secondary" onClick={on}>
                            View more
                        </BeetsButton>
                    </Flex>
                ) : null}
            </Box>
        </Box>
    );
}
