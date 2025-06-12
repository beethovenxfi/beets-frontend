import React, { ReactNode } from 'react';
import { Box, HStack, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';
import Image from 'next/image';

interface Props {
    children: ReactNode | ReactNode[];
    label: ReactNode | ReactNode[] | null;
    noImage?: boolean;
    hasArrow?: boolean;
}

function BeetsTooltipLabel({ label, noImage }: { label: ReactNode | ReactNode[]; noImage: boolean }) {
    return (
        <HStack alignItems="flex-start">
            {!noImage && (
                <Box>
                    <Image src={BeetsThinking} alt="thinking-emoji" />
                </Box>
            )}
            <Box>{label}</Box>
        </HStack>
    );
}

export default function BeetsTooltip({ children, label, noImage, hasArrow = false }: Props) {
    if (!label) return <>{children}</>;

    return (
        <Box display="inline-block" position="relative">
            <Tooltip
                bg="beets.base.400"
                shadow="2xl"
                borderRadius="md"
                p="2"
                placement="bottom"
                label={<BeetsTooltipLabel noImage={!!noImage} label={label} />}
                hasArrow={hasArrow}
                shouldWrapChildren
                offset={[0, 16]}
            >
                <Box display="inline-block" width="100%">
                    {children}
                </Box>
            </Tooltip>
        </Box>
    );
}
