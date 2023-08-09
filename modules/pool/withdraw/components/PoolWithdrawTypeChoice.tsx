import {
    Box,
    Button,
    HStack,
    Link,
    Skeleton,
    StackDivider,
    Text,
    useBreakpointValue,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { BeetsBox } from '~/components/box/BeetsBox';
import { numberFormatUSDValue } from '~/lib/util/number-formats';
import { tokenFormatAmountPrecise } from '~/lib/services/token/token-util';
import TokenAvatar from '~/components/token/TokenAvatar';
import { useGetTokens } from '~/lib/global/useToken';
import { usePoolUserDepositBalance } from '~/modules/pool/lib/usePoolUserDepositBalance';
import { usePoolUserBptBalance } from '~/modules/pool/lib/usePoolUserBptBalance';
import { PoolUnstakeModal } from '~/modules/pool/stake/PoolUnstakeModal';
import { useWithdraw } from '~/modules/pool/withdraw/lib/useWithdraw';
import { usePool } from '~/modules/pool/lib/usePool';
import { ExternalLink } from 'react-feather';
import { etherscanGetTokenUrl } from '~/lib/util/etherscan';
import BeetsTooltip from '~/components/tooltip/BeetsTooltip';
import Scales from '~/assets/icons/scales.svg';
import Image from 'next/image';
import BeetSmart from '~/assets/icons/beetx-smarts.svg';

interface Props {
    onShowProportional(): void;
    onShowSingleAsset(): void;
}

export function PoolWithdrawTypeChoice({ onShowProportional, onShowSingleAsset }: Props) {
    const unstakeDisclosure = useDisclosure();
    const { pool, canCustomInvest, isStablePool } = usePool();
    const isMobile = useBreakpointValue({ base: true, md: false });
    const { formattedPrice } = useGetTokens();
    const { userPoolBalanceUSD, data, isLoading: isPoolUserDepositBalanceLoading } = usePoolUserDepositBalance();
    const { userTotalBptBalance, userWalletBptBalance, userStakedBptBalance, hasBptInWallet, hasBptStaked } =
        usePoolUserBptBalance();
    const valueStaked = (parseFloat(userStakedBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const valueInWallet = (parseFloat(userWalletBptBalance) / parseFloat(userTotalBptBalance)) * userPoolBalanceUSD;
    const { selectedWithdrawTokenAddresses } = useWithdraw();

    const ChoiceOrientation = isMobile ? VStack : HStack;

    return (
        <VStack width="full" spacing="4">
            <VStack spacing="0">
                <VStack spacing="0">
                    <Text>Your withdrawable balance</Text>
                    <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                        <Text fontSize="3rem" fontWeight="semibold">
                            {numberFormatUSDValue(userPoolBalanceUSD)}
                        </Text>
                    </Skeleton>
                </VStack>
                {pool.staking && (
                    <HStack>
                        <Box bg="whiteAlpha.200" rounded="md" p="2">
                            <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                <Text>{numberFormatUSDValue(valueInWallet)} Unstaked</Text>
                            </Skeleton>
                        </Box>
                        <Box bg="whiteAlpha.200" rounded="md" p="2">
                            <Skeleton isLoaded={!isPoolUserDepositBalanceLoading}>
                                <Text>{numberFormatUSDValue(valueStaked)} Staked</Text>
                            </Skeleton>
                        </Box>
                    </HStack>
                )}
            </VStack>
            {/* <HStack
                spacing="4"
                alignItems="center"
                justifyContent="center"
                width="full"
                bg="blackAlpha.500"
                p="2"
                px="4"
            >
                <HStack>
                    <Text color="whiteAlpha.800">Withdraw staked balance? ({numberFormatUSDValue(valueStaked)})</Text>
                    <BeetsTooltip
                        label={`You have ~${numberFormatUSDValue(
                            valueStaked,
                        )} worth of BPT staked. Enable the toggle below
                            to withdraw your staked balance as well.`}
                    >
                        <Flex alignItems="center" justifyContent="center" width="24px">
                            <Image src={BeetsThinking} width="24px" height="24px" alt="beets-balanced" />
                        </Flex>
                    </BeetsTooltip>
                </HStack>
                <Switch />
            </HStack> */}

            {valueStaked > 0 && (
                <Box px="4">
                    <BeetsBox p="2">
                        <HStack>
                            <Text width="75%">
                                You have a staked balance in this pool. To withdraw this amount, you will need to
                                unstake it first.
                            </Text>
                            <Button size="sm" variant="primary" onClick={() => unstakeDisclosure.onOpen()}>
                                Unstake
                            </Button>
                        </HStack>
                    </BeetsBox>
                </Box>
            )}

            <ChoiceOrientation width="full" px="4">
                <Box width="full">
                    <Button
                        _hover={{ borderColor: 'beets.green' }}
                        borderWidth={1}
                        borderColor="beets.transparent"
                        height="140px"
                        width="full"
                        onClick={onShowProportional}
                        disabled={parseFloat(userWalletBptBalance) === 0}
                    >
                        <VStack spacing="1">
                            <Image src={Scales} height="48" alt="beets-balanced" />

                            {/* <Text fontSize="lg">{numberFormatUSDValue(data?.maxAmount || 0)}</Text> */}
                            <Text fontSize="sm">Proportional withdraw</Text>
                            <Text
                                fontSize="xs"
                                color={isStablePool || !canCustomInvest ? 'transparent' : 'beets.green'}
                            >
                                Recommended
                            </Text>
                        </VStack>
                    </Button>
                </Box>
                <BeetsTooltip
                    label={
                        isStablePool
                            ? 'As this is a stable pool, you can withdraw either asset without any impact.'
                            : canCustomInvest
                            ? ''
                            : 'This pool does not support a single asset withdraw.'
                    }
                >
                    <Box w="full">
                        <Button
                            variant="image"
                            onClick={onShowSingleAsset}
                            disabled={parseFloat(userWalletBptBalance) === 0 || !canCustomInvest}
                        >
                            <VStack spacing="1">
                                <Image src={BeetSmart} height="48" alt="beets-smart" />
                                {/* <Text fontSize="lg">{numberFormatUSDValue(investableAmount)}</Text> */}
                                <Text fontSize="sm">Single asset withdraw</Text>
                                <Text fontSize="xs" color={isStablePool ? 'beets.green' : 'transparent'}>
                                    Minimal price impact
                                </Text>
                            </VStack>
                        </Button>
                    </Box>
                </BeetsTooltip>
                <PoolUnstakeModal {...unstakeDisclosure} />
            </ChoiceOrientation>
            {/* <Box p="2" px="4">
                {hasBptStaked && !isFbeetsPool && (
                    <Alert status="warning" borderRadius="md">
                        <AlertIcon />
                        <Box flex="1" mr="4">
                            
                        </Box>
                    </Alert>
                )}
            </Box> */}
            {/* <Box>
                <Button variant="primary" width="full" isDisabled={!hasBptInWallet} onClick={onShowProportional}>
                    Withdraw proportionally
                </Button>
                <Button
                    variant="secondary"
                    width="full"
                    mt="2"
                    isDisabled={!hasBptInWallet}
                    onClick={onShowSingleAsset}
                >
                    Single asset withdraw
                </Button>

                
            </Box> */}
            <VStack width="full" p="4" backgroundColor="blackAlpha.500" alignItems="flex-start">
                <Text fontSize="md" fontWeight="semibold">
                    Deposited token breakdown
                </Text>
                <BeetsBox width="full" p="4">
                    <VStack
                        divider={<StackDivider borderColor="whiteAlpha.200" />}
                        spacing="4"
                        width="full"
                        alignItems="flex-start"
                    >
                        {pool.withdrawConfig.options.map((option, index) => {
                            return (
                                <VStack
                                    divider={<StackDivider borderColor="whiteAlpha.200" />}
                                    spacing="4"
                                    width="full"
                                    key={`option-${index}`}
                                    alignItems="flex-start"
                                >
                                    {option.tokenOptions.map((tokenOption, tokenIndex) => {
                                        const hasOptions = option.tokenOptions.length > 1;
                                        const token =
                                            option.tokenOptions.find((tokenOption) =>
                                                selectedWithdrawTokenAddresses.includes(tokenOption.address),
                                            ) || option.tokenOptions[0];
                                        const balance =
                                            data?.find((item) => item.address === token.address)?.amount || '0';
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
                                                    <Text>{tokenFormatAmountPrecise(balance, tokenPrecision)}</Text>
                                                    <Text fontSize="sm" color="beets.base.100">
                                                        ~
                                                        {formattedPrice({
                                                            address: tokenOption.address,
                                                            amount: balance,
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
