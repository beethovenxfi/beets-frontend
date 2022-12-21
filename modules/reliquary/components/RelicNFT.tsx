import { motion, useAnimation } from 'framer-motion';
import { Box, Image } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { getProvider } from '@wagmi/core';
import useReliquary from '~/modules/reliquary/hooks/useReliquary';
import { useToast } from '~/components/toast/BeetsToast';

export function RelicNFT() {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');
    const { reliquaryService } = useReliquary();

    const { showToast } = useToast();
    const hoverNFT = async (translate: number) => {
        controls.start({
            transform: `translateY(${translate}px)`,
            transition: { type: 'spring', mass: 15, damping: 15 },
        });
        setTimeout(() => {
            hoverNFT(translate > 0 ? -1 : 1);
        }, 1250);
    };

    const startAnimation = async () => {
        await controls.start({
            transform: 'scale(1)',
            opacity: 1,
            transition: { type: 'spring', mass: 0.5, damping: 15 },
        });
        hoverNFT(1);
    };

    const fetchNFT = async () => {
        //TODO: remove this hardcoded id
        const imageURI = await reliquaryService.getRelicNFT({ tokenId: '1', provider: getProvider() });
        setImageURI(imageURI);
    };

    useEffect(() => {
        fetchNFT();
        setTimeout(() => {
            startAnimation();
        }, 500);
    }, []);

    return (
        <Box initial={{ transform: 'scale(0)', opacity: 0 }} animate={controls} as={motion.div} className="relic-glow">
            <Box rounded="lg" overflow="hidden">
                {imageURI && <Image alt="Relic NFT" src={imageURI} width="400px" height="400px" />}
            </Box>
        </Box>
    );
}
