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
        <HStack alignItems='flex-start'>
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
        <Tooltip
            bg="beets.base.400"
            shadow="2xl"
            borderRadius="md"
            p="2"
            label={<BeetsTooltipLabel noImage={!!noImage} label={label} />}
            hasArrow={hasArrow}
        >
            {children}
        </Tooltip>
    );
}
