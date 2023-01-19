import { Box, Flex } from '@chakra-ui/react';
import { motion, useAnimation } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react';

interface CarouselProps {
    children: ReactNode[];
}

interface CarouselItemProps {
    children: ReactNode;
}

export function BeetsCarouselItem({ children }: CarouselItemProps) {
    return <Box as={motion.div}>{children}</Box>;
}

export default function BeetsCarousel({ children = [] }: CarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (children.length > 1) {
            setActiveIndex(1);
        }
    }, []);

    const controls = useAnimation();
    useEffect(() => {
        if (activeIndex) {
            controls.start({
                transform: 'scale(1)',
                opacity: 1,
            });
        } else {
            controls.start({
                transform: 'scale(0.5)',
                opacity: 0.4,
            });
        }
    }, [activeIndex]);

    return (
        <Flex
            overflow="hidden"
            flexDirection="row"
            as={motion.div}
            width="full"
            height="full"
            minHeight="500px"
            justifyContent="center"
        >
            {(children || []).map((child, i) => {
                return (
                    <Box animate={controls} onClick={() => setActiveIndex(i)} as={motion.div} key={i}>
                        <BeetsCarouselItem>{child}</BeetsCarouselItem>
                    </Box>
                );
            })}
        </Flex>
    );
}
