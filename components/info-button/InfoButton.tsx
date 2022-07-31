import { Box, HStack, Link, Popover, PopoverContent, PopoverTrigger, Text, TextProps } from '@chakra-ui/react';
import { Info } from 'react-feather';

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

            <PopoverContent w="fit-content" bg="black" borderColor="transparent">
                <Box p="2" className="bg" maxWidth="300px" fontWeight="normal">
                    {infoText}
                    {moreInfoUrl ? ' ' : ''}
                    {moreInfoUrl ? (
                        <Link color="beets.highlight" href={moreInfoUrl} target="_blank">
                            {moreInfoLinkText || 'More info'}.
                        </Link>
                    ) : null}
                </Box>
            </PopoverContent>
        </Popover>
    );
}
