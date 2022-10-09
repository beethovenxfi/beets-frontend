import React, { ReactNode } from 'react';
import { Box, HStack, Text } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';
import Image from 'next/image';

interface Props {
    children: ReactNode | ReactNode[];
    label: string;
}

function BeetsTooltipLabel({ label }: { label: string }) {
    return (
        <HStack>
            <Box>
                <Image src={BeetsThinking} alt="thinking-emoji" />
            </Box>
            <Text>{label}</Text>
        </HStack>
    );
}

export default function BeetsTooltip({ children, label }: Props) {
    return (
        <Tooltip bg='beets.base.400' shadow='2xl' borderRadius="md" p="2" label={<BeetsTooltipLabel label={label} />} hasArrow>
            {children}
        </Tooltip>
    );
}
