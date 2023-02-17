import { Button, HStack, ListItem, Text, UnorderedList, VStack, Stack, Heading, Box, Spacer } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { InfoButton } from '~/components/info-button/InfoButton';
import { RelicCarousel } from './components/RelicCarousel';
import Rq1Image from '~/assets/images/rq-1.png';
import Rq2Image from '~/assets/images/rq-2.png';
import Rq3Image from '~/assets/images/rq-3.png';
import Image from 'next/image';
import { ReliquaryInvestModal } from './invest/ReliquaryInvestModal';
import ReliquaryGlobalStats from './components/stats/ReliquaryGlobalStats';
import { motion } from 'framer-motion';
import { useUserAccount } from '~/lib/user/useUserAccount';
import ReliquaryConnectWallet from './components/ReliquaryConnectWallet';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { TokensProvider } from '~/lib/global/useToken';
import { PoolProvider, usePool } from '../pool/lib/usePool';
import ReliquaryMigrateModal from './components/ReliquaryMigrateModal';
import { useLegacyFBeetsBalance } from './lib/useLegacyFbeetsBalance';
import { CurrentStepProvider } from './lib/useReliquaryCurrentStep';
import { useTranslation } from 'next-i18next';

const infoButtonLabelProps = {
    lineHeight: '1rem',
    fontWeight: 'semibold',
    fontSize: 'sm',
    color: 'beets.base.50',
};

export default function ReliquaryLanding() {
    const { isConnected } = useUserAccount();
    const { total } = useLegacyFBeetsBalance();
    const { showToast } = useToast();
    const { pool } = usePool();
    const { t } = useTranslation('reliquary');

    const rqImages = [Rq1Image, Rq2Image, Rq3Image];

    const bulletPoints = t<string, string[]>('reliquary.landing.hero.bulletPoints', { returnObjects: true });

    useEffect(() => {
        if (total > 0) {
            showToast({
                id: 'migrate-fbeets',
                type: ToastType.Info,
                content: (
                    <HStack>
                        <Text>{t('reliquary.landing.migrateToReliquaryToast')}</Text>
                        <TokensProvider>
                            <PoolProvider pool={pool}>
                                <CurrentStepProvider>
                                    <ReliquaryMigrateModal />
                                </CurrentStepProvider>
                            </PoolProvider>
                        </TokensProvider>
                    </HStack>
                ),
            });
        } else {
            // removeToast('migrate-fbeets');
        }
    }, [total]);

    return (
        <Stack direction="column" width="full">
            <Stack
                bg="blackAlpha.500"
                px={{ base: '0', xl: '8' }}
                pt={{ base: '8', xl: '20' }}
                pb={{ base: '12', xl: '20' }}
                direction={['column', 'row']}
                spacing="12"
                width="full"
            >
                <VStack width="full" alignItems="flex-start">
                    <Heading color="white" fontSize={{ base: 'lg', lg: '2rem' }}>
                        {t('reliquary.landing.hero.title')}
                    </Heading>
                    <UnorderedList pl="5">
                        {bulletPoints.map((bulletPointText, index) => (
                            <ListItem key={index}>{bulletPointText}</ListItem>
                        ))}
                    </UnorderedList>
                    <Spacer />
                    <HStack w={{ base: 'full', xl: '90%' }}>
                        <ReliquaryInvestModal createRelic />
                        <Button variant="secondary" w="full" as="a" href="https://docs.beets.fi" target="_blank">
                            {t('reliquary.landing.hero.learnMoreButton')}
                        </Button>
                    </HStack>
                </VStack>
                <Stack display={{ base: 'none', md: 'flex' }} direction={['column', 'row']} spacing="8">
                    {rqImages.map((image, index) => (
                        <VStack spacing="4" key={index}>
                            <Box
                                as={motion.div}
                                whileHover={{ scale: 1.2, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
                            >
                                <Image
                                    src={image}
                                    alt={t(`reliquary.landing.hero.images.${index}.alt` as const) || ''}
                                    placeholder="blur"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Box>
                            <InfoButton
                                labelProps={infoButtonLabelProps}
                                label={t(`reliquary.landing.hero.images.${index}.alt` as const) || ''}
                                infoText={t(`reliquary.landing.hero.images.${index}.info` as const)}
                            />
                        </VStack>
                    ))}
                </Stack>
            </Stack>
            <Box width="full">
                <VStack width="full" py="4" spacing="8">
                    {!isConnected && (
                        <VStack minH="300px" justifyContent="center" alignItems="center">
                            <ReliquaryConnectWallet />
                        </VStack>
                    )}
                    {isConnected && (
                        <>
                            <VStack width="full" alignItems="flex-start">
                                <Heading size="lg">{t('reliquary.landing.section.title.myRelics')}</Heading>
                            </VStack>
                            <Box width="full">
                                <RelicCarousel />
                            </Box>
                        </>
                    )}
                </VStack>
                <VStack width="full" py="4" spacing="8" mt={{ base: '32rem', lg: '16' }}>
                    <VStack width="full" alignItems="flex-start">
                        <Heading size="lg">{t('reliquary.landing.section.title.allRelics')}</Heading>
                    </VStack>
                    <ReliquaryGlobalStats />
                </VStack>
            </Box>
        </Stack>
    );
}
