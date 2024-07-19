import { GqlSftmxStakingVault } from '~/apollo/generated/graphql-codegen-generated';
import { Flex, Text, Link, Grid, GridItem, Divider, useBreakpointValue } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import { formatDistanceToNow } from 'date-fns';
import numeral from 'numeral';
import { addressShortDisplayName } from '~/lib/util/address';

interface Props extends BoxProps {
    vault: GqlSftmxStakingVault;
}

const FLEX_ALIGN = { base: 'flex-start', lg: 'center' };
const GRID_ITEM_MB = { base: '4', lg: '0' };
const JUSTIFY_CONTENT = { base: 'flex-start', lg: 'flex-end' };

export default function SftmxTableVaultsRow({ vault }: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });

    return (
        <>
            <Grid
                px="4"
                py={{ base: '4', lg: '2' }}
                templateColumns={{
                    base: '1fr 1fr',
                    lg: 'minmax(30px,50px) 4fr minmax(50px,110px) 110px',
                }}
                gap="4"
                templateAreas={{
                    base: `"validator vault"
                             "staked unlock"`,
                    lg: `"validator vault staked unlock"`,
                }}
                bgColor="rgba(255,255,255,0.05)"
                _hover={{ bg: 'beets.base.800' }}
            >
                <GridItem area="validator" mb={GRID_ITEM_MB}>
                    <MobileLabel text="Validator Id" />
                    <Link
                        href={`https://fantom.foundation/validatorStats?address=${vault.validatorAddress.toLowerCase()}`}
                        isExternal
                    >
                        {vault.validatorId}
                    </Link>
                </GridItem>
                <Flex align={FLEX_ALIGN}>
                    <GridItem area="vault" mb={GRID_ITEM_MB}>
                        <MobileLabel text="Vault Address" />
                        <Link href={`https://ftmscan.com/address/${vault.vaultAddress}`} isExternal>
                            {isMobile ? addressShortDisplayName(vault.vaultAddress) : vault.vaultAddress}
                        </Link>
                    </GridItem>
                </Flex>
                <Flex align={FLEX_ALIGN}>
                    <GridItem area="staked">
                        <MobileLabel text="Staked FTM" />
                        {numeral(vault.ftmAmountStaked).format('0.[00]a')}
                    </GridItem>
                </Flex>
                <Flex align={FLEX_ALIGN} justify={JUSTIFY_CONTENT}>
                    <GridItem area="unlock" mb={GRID_ITEM_MB}>
                        <MobileLabel text="Unlock Time" />
                        {formatDistanceToNow(new Date(vault.unlockTimestamp * 1000), {
                            addSuffix: true,
                        })}
                    </GridItem>
                </Flex>
            </Grid>
            <Divider display={{ base: 'block', lg: 'none' }} />
        </>
    );

    function MobileLabel({ text }: { text: string }) {
        return (
            <Text fontSize="xs" color="gray.200" display={{ base: 'block', lg: 'none' }}>
                {text}
            </Text>
        );
    }
}
