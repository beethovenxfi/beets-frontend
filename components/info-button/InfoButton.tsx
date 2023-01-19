import { Box, HStack, Link, Popover, PopoverContent, PopoverTrigger, Text, TextProps } from '@chakra-ui/react';
import { Info } from 'react-feather';
import Image from 'next/image';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';

interface Props {
    iconSize?: number;
    infoText: string;
    moreInfoUrl?: string;
    moreInfoLinkText?: string;
    label?: string;
    labelProps?: TextProps;
}

export function InfoButton({ iconSize, infoText, moreInfoUrl, moreInfoLinkText, label, labelProps }: Props) {
    return (
        <Popover trigger="hover">
            <HStack spacing="1">
                <Text {...labelProps}>{label}</Text>
                {/*
                // @ts-ignore */}
                <PopoverTrigger>
                    <a>
                        <Info size={iconSize || 16} color="currentColor" />
                    </a>
                </PopoverTrigger>
            </HStack>

            <PopoverContent
                color="white"
                fontSize=".925rem"
                border="0"
                maxWidth="400px"
                bg="beets.base.400"
                shadow="2xl"
                borderRadius="md"
                p="2"
            >
                <HStack spacing="2">
                    <Image width="120px" height="120px" src={BeetsThinking} alt="thinking-emoji" />
                    <Box>
                        {infoText}
                        {moreInfoUrl ? ' ' : ''}
                        {moreInfoUrl ? (
                            <Link color="beets.highlight" href={moreInfoUrl} target="_blank">
                                {moreInfoLinkText || 'More info'}.
                            </Link>
                        ) : null}
                    </Box>
                </HStack>
            </PopoverContent>
        </Popover>
    );
}
