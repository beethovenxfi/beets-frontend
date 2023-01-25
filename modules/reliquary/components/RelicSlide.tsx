import { useSwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Badge, Box, Heading, HStack, VStack, Flex, Stack, Spacer } from '@chakra-ui/react';
import useReliquary from '../lib/useReliquary';
import { AnimatePresence, motion } from 'framer-motion';
import { ReliquaryFarmPosition } from '~/lib/services/staking/reliquary.service';
import { relicGetMaturityProgress } from '../lib/reliquary-helpers';
import RelicLevelUpButton from './RelicLevelUpButton';
import RelicSlideApr from './RelicSlideApr';
import RelicSlideInfo from './RelicSlideInfo';
import RelicSlideMainInfo from './RelicSlideMainInfo';
import Image from 'next/image';
import RelicLevel1 from '~/assets/images/reliquary/1.jpg';
import RelicLevel2 from '~/assets/images/reliquary/2.jpg';
import RelicLevel3 from '~/assets/images/reliquary/3.jpg';
import RelicLevel4 from '~/assets/images/reliquary/4.jpg';

export interface RelicSlideProps {
    relic: ReliquaryFarmPosition;
    openInvestModal: () => void;
    openWithdrawModal: () => void;
}

export default function RelicSlide({ relic, openInvestModal, openWithdrawModal }: RelicSlideProps) {
    const { isActive } = useSwiperSlide();

    const { maturityThresholds, isLoadingRelicPositions, setSelectedRelicId, relicPositions } = useReliquary();
    const { canUpgrade } = relicGetMaturityProgress(relic, maturityThresholds);
    const [_isLoadingRelicPositions, setIsLoadingRelicPositions] = useState(false);

    const relicLevelNames = [
        'The Initiate',
        'The Neophyte',
        'The Wanderer',
        'The Rebel',
        'The Skeptic',
        'The Apprentice',
        'The Journeyman',
        'The Savant',
        'The Creator',
        'The Scholar',
        'The Awakened',
    ];

    // hack to get around next.js hydration issues with swiper
    useEffect(() => {
        setIsLoadingRelicPositions(isLoadingRelicPositions);
    }, [isLoadingRelicPositions]);

    const hasNoRelics = relicPositions.length === 0;

    if (isActive) {
        setSelectedRelicId(relic.relicId);
    }

    function getImage(level: number) {
        switch (level) {
            case 1:
                return RelicLevel1;
            case 2:
                return RelicLevel2;
            case 3:
                return RelicLevel3;
            case 4:
                return RelicLevel4;
            default:
                return RelicLevel1;
        }
    }

    function getContainerOpacity() {
        if (hasNoRelics) {
            return 0.25;
        }
        if (isActive) {
            return 1;
        } else {
            return 0.35;
        }
    }

    function getUnderglowClass() {
        if (isActive) return '';
        if (isActive) {
            return 'relic-glow';
        }
        return '';
    }

    return (
        <AnimatePresence>
            <VStack
                filter="auto"
                blur={hasNoRelics ? '10px' : '0'}
                as={motion.div}
                animate={{
                    opacity: getContainerOpacity(),
                    transform: isActive ? 'scale(1)' : 'scale(0.5)',
                    transition: { type: 'spring', mass: 0.1 },
                }}
                rounded="lg"
                spacing="8"
                zIndex={isActive ? 1 : -1}
            >
                <Flex justifyContent="center" width={{ base: '100%', lg: '50%' }} rounded="lg">
                    <HStack
                        spacing="4"
                        width="full"
                        alignItems="start"
                        justifyContent={{ base: 'space-between', xl: undefined }}
                    >
                        <Badge rounded="md" colorScheme="green" p="2">
                            <Heading textAlign="center" size="sm">
                                Level {relic?.level + 1} - {relicLevelNames[relic.level]}
                            </Heading>
                        </Badge>
                        <Badge p="2" rounded="md" colorScheme="purple">
                            <Heading size="sm">Relic #{relic?.relicId}</Heading>
                        </Badge>
                    </HStack>
                </Flex>
                <Flex position="relative" className={getUnderglowClass()} as={motion.div}>
                    {canUpgrade && isActive && (
                        <Flex
                            animate={{ opacity: 1 }}
                            initial={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            alignItems="center"
                            justifyContent="center"
                            rounded="lg"
                            width="full"
                            height="full"
                            position="absolute"
                            bg="blackAlpha.500"
                            as={motion.div}
                            zIndex={2}
                        >
                            <RelicLevelUpButton />
                        </Flex>
                    )}

                    <Box
                        filter="auto"
                        blur={isActive && canUpgrade && !_isLoadingRelicPositions ? '10px' : '0px'}
                        style={{ marginTop: '0 !important' }}
                        rounded="lg"
                        overflow="hidden"
                    >
                        <Image src={getImage(relic?.level + 1)} alt="reliquary" placeholder="blur" />
                    </Box>
                </Flex>
                <Stack direction={{ base: 'column', lg: 'row' }} position="relative" height="310px" width="full">
                    <RelicSlideMainInfo
                        openInvestModal={openInvestModal}
                        openWithdrawModal={openWithdrawModal}
                        isLoading={_isLoadingRelicPositions}
                    />
                    <RelicSlideApr />
                    <RelicSlideInfo />
                </Stack>
            </VStack>
        </AnimatePresence>
    );
}
