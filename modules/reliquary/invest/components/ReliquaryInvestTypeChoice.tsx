import React from 'react';
import { Box, Button, HStack, Text, VStack, Heading, StackDivider, Link, Stack } from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePoolGetMaxProportionalInvestmentAmount } from '~/modules/pool/invest/lib/usePoolGetMaxProportionalInvestmentAmount';
import { usePool } from '~/modules/pool/lib/usePool';
import Scales from '~/assets/icons/scales.svg';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';
import BeetSmart from '~/assets/icons/beetx-smarts.svg';
import Image from 'next/image';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useTranslation } from 'next-i18next';
interface Props {
    onShowProportional(): void;
    onShowCustom(): void;
}

export function ReliquaryInvestTypeChoice({ onShowProportional, onShowCustom }: Props) {
    const { pool } = usePool();
    const { formattedPrice } = useGetTokens();
    const { userPoolTokenBalances, investableAmount } = usePoolUserTokenBalancesInWallet();
    const { canInvestProportionally } = useInvest();
    const { data } = usePoolGetMaxProportionalInvestmentAmount();
    const _canInvestProportionally = (data?.maxAmount || 0) > 0 && canInvestProportionally;
    const { t } = useTranslation('reliquary');

    return (
        <VStack width="full">
            <VStack alignItems="flex-start" px="4" pb="4" width="full">
                <VStack alignItems="flex-start" spacing="0">
                    <Heading size="sm">{t('reliquary.invest.typeChoice.chooseType')}</Heading>
                    <Box fontSize="base">
                        {t('reliquary.invest.typeChoice.maxAmount')}
                        <BeetsTooltip noImage label={t('reliquary.invest.typeChoice.difference.toolTip')}>
                            <HStack spacing="1" alignItems="center">
                                <Text color="beets.highlight" fontSize="sm">
                                    {t('reliquary.invest.typeChoice.difference.what')}
                                </Text>
                                <Box _hover={{ transform: 'scale(1.2)' }}>
                                    <Image src={BeetsThinking} width="24" height="24" alt="beets-balanced" />
                                </Box>
                            </HStack>
                        </BeetsTooltip>
                    </Box>
                </VStack>

                <Stack direction={{ base: 'column', lg: 'row' }} width="full">
                    <BeetsTooltip
                        noImage
                        label={_canInvestProportionally ? '' : t('reliquary.invest.typeChoice.proportional.toolTip')}
                    >
                        <Box width="full">
                            <Button
                                _hover={{ borderColor: 'beets.green' }}
                                borderWidth={1}
                                borderColor="beets.transparent"
                                disabled={!_canInvestProportionally}
                                height="140px"
                                width="full"
                                onClick={onShowProportional}
                            >
                                <VStack spacing="1">
                                    <Image src={Scales} height="48" alt="beets-balanced" />

                                    <Text fontSize="lg">{numberFormatUSDValue(data?.maxAmount || 0)}</Text>
                                    <Text fontSize="sm">{t('reliquary.invest.common.proportionalInvestment')}</Text>
                                    <Text fontSize="xs" color="beets.green">
                                        {t('reliquary.invest.typeChoice.proportional.recommended')}
                                    </Text>
                                </VStack>
                            </Button>
                        </Box>
                    </BeetsTooltip>
                    <Button
                        _hover={{ borderColor: 'beets.green' }}
                        borderWidth={1}
                        borderColor="beets.transparent"
                        height="140px"
                        width="full"
                        onClick={onShowCustom}
                    >
                        <VStack spacing="1">
                            <Image src={BeetSmart} height="48" alt="beets-smart" />
                            <Text fontSize="lg">{numberFormatUSDValue(investableAmount)}</Text>
                            <Text fontSize="sm">{t('reliquary.invest.common.customInvestment')}</Text>
                            <Text fontSize="xs" color="beets.green">
                                &nbsp;
                            </Text>
                        </VStack>
                    </Button>
                </Stack>
            </VStack>
            <VStack width="full" p="4" backgroundColor="blackAlpha.500" alignItems="flex-start">
                <Text fontSize="md" fontWeight="semibold">
                    {t('reliquary.invest.typeChoice.tokensInWallet')}
                </Text>
                <BeetsBox width="full" p="4">
                    <VStack
                        divider={<StackDivider borderColor="whiteAlpha.200" />}
                        spacing="4"
                        width="full"
                        alignItems="flex-start"
                    >
                        {pool.investConfig.options.map((option, index) => {
                            return (
                                <VStack
                                    divider={<StackDivider borderColor="whiteAlpha.200" />}
                                    spacing="4"
                                    width="full"
                                    key={`option-${index}`}
                                    alignItems="flex-start"
                                >
                                    {option.tokenOptions.map((tokenOption, tokenIndex) => {
                                        const userBalance = tokenGetAmountForAddress(
                                            tokenOption.address,
                                            userPoolTokenBalances,
                                        );
                                        const tokenPrecision = Math.min(tokenOption?.decimals || 18, 12);

                                        return (
                                            <HStack
                                                key={`${index}-${tokenIndex}`}
                                                justifyContent="space-between"
                                                width="full"
                                            >
                                                <HStack>
                                                    <TokenAvatar
                                                        width="40px"
                                                        height="40px"
                                                        maxWidth="40px"
                                                        maxHeight="40px"
                                                        address={tokenOption.address}
                                                    />
                                                    <Box>
                                                        {tokenOption.name}
                                                        <HStack spacing="1">
                                                            <Text fontWeight="bold">{tokenOption?.symbol}</Text>
                                                            <Link
                                                                href={etherscanGetTokenUrl(tokenOption.address)}
                                                                target="_blank"
                                                                ml="1.5"
                                                            >
                                                                <ExternalLink size={14} />
                                                            </Link>
                                                        </HStack>
                                                    </Box>
                                                </HStack>
                                                <VStack alignItems="flex-end" spacing="0">
                                                    <Text>{tokenFormatAmountPrecise(userBalance, tokenPrecision)}</Text>
                                                    <Text fontSize="sm" color="beets.base.100">
                                                        ~
                                                        {formattedPrice({
                                                            address: tokenOption.address,
                                                            amount: userBalance,
                                                        })}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        );
                                    })}
                                </VStack>
                            );
                        })}
                    </VStack>
                </BeetsBox>
            </VStack>
        </VStack>
    );
}
