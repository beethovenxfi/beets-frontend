import { GqlPoolApr } from '~/apollo/generated/graphql-codegen-generated';
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    Box,
    Flex,
    Text,
    TextProps,
    HStack,
    useTheme,
    Link,
} from '@chakra-ui/react';
import StarsIcon from '~/components/apr-tooltip/StarsIcon';
import numeral from 'numeral';
import { BeetsBox } from '~/components/box/BeetsBox';
import { AprText } from '~/components/apr-tooltip/AprText';
import { Info } from 'react-feather';

interface Props {
    iconSize?: number;
    infoText: string;
    moreInfoUrl?: string;
    moreInfoLinkText?: string;
    label?: string;
}

export function InfoButton({ iconSize, infoText, moreInfoUrl, moreInfoLinkText, label }: Props) {
    const theme = useTheme();
    return (
        <Popover trigger="hover">
            <HStack spacing="1">
                <Box>{label}</Box>
                {/*
                // @ts-ignore */}
                <PopoverTrigger>
                    <a>
                        <Info size={iconSize || 16} color={theme.colors.gray['100']} />
                    </a>
                </PopoverTrigger>
            </HStack>

            <PopoverContent w="fit-content" bg="black" borderColor="transparent">
                <Box p="2" className="bg" maxWidth="300px">
                    {infoText}
                    {moreInfoUrl ? ' ' : ''}
                    {moreInfoUrl ? (
                        <Link color="beets.cyan" href={moreInfoUrl} target="_blank">
                            {moreInfoLinkText || 'More info'}.
                        </Link>
                    ) : null}
                </Box>
            </PopoverContent>
        </Popover>
    );
}
