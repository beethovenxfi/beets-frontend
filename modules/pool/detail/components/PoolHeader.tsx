import {
    Box,
    Flex,
    HStack,
    Popover,
    PopoverContent,
    PopoverTrigger as OrigPopoverTrigger,
    Text,
    VStack,
    Wrap,
    WrapItem,
    Link,
    StackProps,
} from '@chakra-ui/react';
import numeral from 'numeral';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import PoolOwnerImage from '~/assets/images/pool-owner.png';
import Image from 'next/image';
import { HelpCircle } from 'react-feather';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';
import { AddressZero } from '@ethersproject/constants';
import { usePool } from '~/modules/pool/lib/usePool';
import AuraLogo from '~/assets/logo/aura_iso_colors.png';

interface Props {
    trigger: React.ReactNode;
    content: React.ReactNode;
}

function CustomTooltip({ trigger, content, ...rest }: Props & StackProps) {
    // temp fix: https://github.com/chakra-ui/chakra-ui/issues/5896#issuecomment-1104085557
    const PopoverTrigger: React.FC<{ children: React.ReactNode }> = OrigPopoverTrigger;

    return (
        <Popover trigger="hover" placement="right">
            <PopoverTrigger>
                <HStack
                    paddingX="3"
                    paddingY="2"
                    bg="whiteAlpha.200"
                    spacing="2"
                    fontSize="md"
                    rounded="full"
                    color="beets.base.50"
                    justifyContent="center"
                    fontWeight="semibold"
                    {...rest}
                >
                    {trigger}
                </HStack>
            </PopoverTrigger>
            <PopoverContent w="200px" bgColor="beets.base.800" shadow="2xl">
                <Box p="2" fontSize="sm" bgColor="whiteAlpha.200">
                    {content}
                </Box>
            </PopoverContent>
        </Popover>
    );
}

function PoolHeader() {
    const networkConfig = useNetworkConfig();
    const { pool } = usePool();

    const hasBeetsOwner = pool.owner === networkConfig.beetsPoolOwnerAddress;
    const hasZeroOwner = pool.owner === AddressZero;
    const swapFeeType = hasZeroOwner ? 'Fixed' : 'Dynamic';
    const tooltipText1 = `Liquidity providers earn ${swapFeeType.toLowerCase()} swap fees on every trade utilizing the liquidity in this pool.`;
    const tooltipText2 = `Dynamic swap fees are controlled by the ${
        hasBeetsOwner ? 'Beethoven X Liquidity Committee Multisig' : 'pool owner'
    }.`;

    const hasAuraStaking = Object.keys(networkConfig.auraStaking).includes(pool.id);

    return (
        <VStack width="full" alignItems="flex-start" mb="8">
            <Text textStyle="h3" as="h3" fontWeight="bold" mr="4" display={{ base: 'block', lg: 'none' }}>
                {pool.name}
            </Text>
            <Wrap>
                <WrapItem display={{ base: 'none', lg: 'flex' }}>
                    <Text textStyle="h3" as="h3" fontWeight="bold" mr="4">
                        {pool.name}
                    </Text>
                </WrapItem>
                {pool.displayTokens.map((token, index) => (
                    <WrapItem key={index}>
                        <PoolTokenPill token={token} />
                    </WrapItem>
                ))}
            </Wrap>
            <HStack>
                <CustomTooltip
                    trigger={
                        <>
                            {!hasZeroOwner && (
                                <Flex alignItems="center">
                                    {hasBeetsOwner ? (
                                        <Image src={PoolOwnerImage} width="24" height="24" alt="Pool Owner Image" />
                                    ) : (
                                        <HelpCircle size="24" />
                                    )}
                                </Flex>
                            )}
                            <HStack spacing="1">
                                <Text>{numeral(pool.dynamicData.swapFee).format('0.0[00]%')}</Text>
                                <Text>{swapFeeType} Fee</Text>
                            </HStack>
                        </>
                    }
                    content={`${tooltipText1} ${!hasZeroOwner && tooltipText2}`}
                />
                {hasAuraStaking && (
                    <CustomTooltip
                        trigger={
                            <Link
                                mr="2"
                                href={networkConfig.auraStaking[pool.id]}
                                isExternal
                                style={{ textDecoration: 'none' }}
                            >
                                <HStack>
                                    <Text mr="2" color="beets.base.50">
                                        Boosted rewards are available on Aura
                                    </Text>
                                    <Image src={AuraLogo} alt="Aura Finance" height="24px" width="24px" />
                                </HStack>
                            </Link>
                        }
                        content={
                            'For this pool you can deposit & stake your BPT on Aura Finance for extra boosted rewards'
                        }
                        border="2px"
                        borderColor="aura.pink"
                        _hover={{ borderColor: 'aura.purple' }}
                        bg="whiteAlpha.300"
                    />
                )}
            </HStack>
        </VStack>
    );
}

export default PoolHeader;
