import { Box, Image } from '@chakra-ui/react';
import { getProvider } from '@wagmi/core';
import { motion, useAnimation } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { ReliquaryService } from '~/lib/services/staking/reliquary.service';

interface Props {}

const reliquaryService = new ReliquaryService('0xb0FC43069089d0fA02baAa896ac2eFcb596D7D05', '250', '');

export default function ReliquaryNFT(props: Props) {
    const controls = useAnimation();
    const [imageURI, setImageURI] = useState('');

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
        <Box
            initial={{ transform: 'scale(0)', opacity: 0 }}
            animate={controls}
            as={motion.div}
            rounded="lg"
            background='green.400'
            width='300px'
            height='300px'
        >
            {/* {imageURI && <img src={imageURI} width="200px" height="200px" />} */}
        </Box>
    );
}
