import { Box, BoxProps, Flex, VStack } from '@chakra-ui/layout';
import { motion } from 'framer-motion';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { relicGetMaturityProgress } from '~/modules/reliquary/lib/reliquary-helpers';
import useReliquary from '~/modules/reliquary/lib/useReliquary';

interface Props {}

export default function RelicLevelUpProgress({ ...rest }: Props & BoxProps) {
    const { maturityThresholds = [], selectedRelic } = useReliquary();
    const { progressToNextLevel } = relicGetMaturityProgress(selectedRelic, maturityThresholds);
    const progressContainer = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);
    const levels = maturityThresholds.length;

    useEffect(() => {
        if (progressContainer.current) {
            const width = progressContainer.current?.getBoundingClientRect()?.width;
            const levelWidth = width / levels;
            const levelProgressWidth = (progressToNextLevel / 100) * levelWidth;
            const overallProgress = (selectedRelic?.level || 0) / maturityThresholds.length;
            const x = overallProgress * width + levelProgressWidth;
            setProgress(x / width || 0);
        }
    }, []);

    return (
        <VStack width="full" spacing="0" ref={progressContainer}>
            <BeetsBox
                bg="beets.greenAlpha.100"
                position="relative"
                minWidth="100px"
                height="12.5px"
                rounded="md"
                overflow="hidden"
                {...rest}
            >
                <Box
                    position="absolute"
                    left="0"
                    width="100%"
                    transformOrigin="left"
                    initial={{ transform: `scaleX(0)` }}
                    animate={{ transform: `scaleX(${progress})`, transition: { delay: 0.5, duration: 2 } }}
                    bgColor="beets.highlight"
                    as={motion.div}
                    height="full"
                    zIndex={-1}
                />
            </BeetsBox>
            <Flex width="full" justifyContent="space-between">
                {[...Array(levels)].map((_, i) => (
                    <VStack spacing="0" key={`relic-progress-label-${i}`}>
                        <Box color={(selectedRelic?.level || 0) + 1 > i ? 'beets.green' : ''} position="relative">
                            {i + 1}
                        </Box>
                    </VStack>
                ))}
            </Flex>
        </VStack>
    );
}
