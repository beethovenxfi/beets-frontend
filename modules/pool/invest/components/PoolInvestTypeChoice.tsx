import React, { useMemo } from 'react';
import {
    Box,
    Button,
    HStack,
    Text,
    VStack,
    Heading,
    StackDivider,
    Link,
    useBreakpointValue,
    Divider,
} from '@chakra-ui/react';
import { ExternalLink } from 'react-feather';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmountPrecise, tokenGetAmountForAddress } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserTokenBalancesInWallet } from '~/modules/pool/lib/usePoolUserTokenBalancesInWallet';
import { useInvest } from '~/modules/pool/invest/lib/useInvest';
import { usePool } from '~/modules/pool/lib/usePool';
import Scales from '~/assets/icons/scales.svg';
import BeetsThinking from '~/assets/icons/beetx-thinking.svg';
import BeetSmart from '~/assets/icons/beetx-smarts.svg';
import Image from 'next/image';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { usePoolJoinGetProportionalInvestmentAmount } from '../lib/usePoolJoinGetProportionalInvestmentAmount';
interface Props {
    onShowProportional(): void;
    onShowCustom(): void;
}

export function PoolInvestTypeChoice({ onShowProportional, onShowCustom }: Props) {
    const { protocol } = useNetworkConfig();
    const { pool, poolService } = usePool();
    const { formattedPrice } = useGetTokens();
    const { userPoolTokenBalances, investableAmount } = usePoolUserTokenBalancesInWallet();
    const { canInvestProportionally } = useInvest();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { totalValueProportionalAmounts } = usePoolJoinGetProportionalInvestmentAmount();
    const proportionalSupported =
        poolService.joinGetProportionalSuggestionForFixedAmount && pool.investConfig.proportionalEnabled;

    const _canInvestProportionally =
        (totalValueProportionalAmounts || 0) > 0 && canInvestProportionally && proportionalSupported;

    const disabledProportionalInvestmentTooltip = useMemo(() => {
        if (!proportionalSupported) {
            return 'This pool does not support proportional investment.';
        }
        if ((totalValueProportionalAmounts || 0) <= 0) {
            return "You don't have the appropriate funds for a proportional investment. Refer below to the tokens you need to make a proportional investment.";
        }
        return 'This pool does not support proportional investment.';
    }, [_canInvestProportionally]);

    const ChoiceOrientation = isMobile ? VStack : HStack;

    const differenceTooltipProps =
        protocol === 'balancer' ? { variant: 'highlight', fontWeight: 'bold' } : { color: 'beets.highlight' };

    return (
        <VStack width="full">
            <VStack alignItems="flex-start" px="4" pb="4" width="full">
                <VStack alignItems="flex-start" spacing="0">
                    <Heading size="sm">Choose your investment type</Heading>
                    <Box fontSize="base">
                        The max amount you can invest is shown for each option.
                        {proportionalSupported && (
                            <BeetsTooltip
                                noImage
                                label="When investing proportionally, you enter the Liquidity Pool in the specific ratios set by the pool. This helps to ensure you aren’t subject to the fees associated with price impact. Alternatively, customising your investment allows you to invest with your desired proportions. However, this action may shift the pool out of balance and subject you to price impact."
                            >
                                <HStack spacing="1" alignItems="center">
                                    <Text fontSize="sm" {...differenceTooltipProps}>
                                        What&apos;s the difference?
                                    </Text>
                                    {protocol !== 'balancer' && (
                                        <Box _hover={{ transform: 'scale(1.2)' }}>
                                            <Image src={BeetsThinking} width="24" height="24" alt="beets-balanced" />
                                        </Box>
                                    )}
                                </HStack>
                            </BeetsTooltip>
                        )}
                    </Box>
                </VStack>

                <ChoiceOrientation width="full">
                    <BeetsTooltip noImage label={_canInvestProportionally ? '' : disabledProportionalInvestmentTooltip}>
                        <Box width="full">
                            <Button
                                variant="image"
                                disabled={!_canInvestProportionally || !proportionalSupported}
                                onClick={onShowProportional}
                            >
                                <VStack spacing="1">
                                    <Image src={Scales} height="48" alt="beets-balanced" />

                                    <Text fontSize="lg">
                                        {numberFormatUSDValue(totalValueProportionalAmounts || 0)}
                                    </Text>
                                    <Text fontSize="sm">Proportional investment</Text>
                                    <Text fontSize="xs" color="buttonHighlight">
                                        Recommended
                                    </Text>
                                </VStack>
                            </Button>
                        </Box>
                    </BeetsTooltip>
                    <Button variant="image" onClick={onShowCustom}>
                        <VStack spacing="1">
                            <Image src={BeetSmart} height="48" alt="beets-smart" />
                            <Text fontSize="lg">{numberFormatUSDValue(investableAmount)}</Text>
                            <Text fontSize="sm">Custom investment</Text>
                            <Text fontSize="xs" color="buttonHighlight">
                                &nbsp;
                            </Text>
                        </VStack>
                    </Button>
                </ChoiceOrientation>
            </VStack>
            {protocol === 'balancer' && <Divider bgColor="divider" />}
            <BeetsBox variant="subsection">
                <VStack alignItems="flex-start">
                    <Text fontSize="md" fontWeight="semibold">
                        Pool tokens in your wallet
                    </Text>
                    <BeetsBox width="full" p="4">
                        <VStack
                            divider={<StackDivider borderColor="tokenStackDivider" />}
                            spacing="4"
                            width="full"
                            alignItems="flex-start"
                        >
                            {pool.investConfig.options.map((option, index) => {
                                return (
                                    <VStack
                                        divider={<StackDivider borderColor="tokenStackDivider" />}
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
                                                        <Text>
                                                            {tokenFormatAmountPrecise(userBalance, tokenPrecision)}
                                                        </Text>
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
            </BeetsBox>
        </VStack>
    );
}
