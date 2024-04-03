import { GqlSftmxStakingVault } from '~/apollo/generated/graphql-codegen-generated';
import { Flex, Text, Link, Grid, GridItem, Divider } from '@chakra-ui/react';
import { BoxProps } from '@chakra-ui/layout';
import { formatDistanceToNow } from 'date-fns';
import numeral from 'numeral';
import { addressShortDisplayName } from '~/lib/util/address';

interface Props extends BoxProps {
    vault: GqlSftmxStakingVault;
}

export default function SftmxStatsVaultsRow({ vault, ...rest }: Props) {
    const flexAlign = { base: 'flex-start', lg: 'center' };
    const gridItemMb = { base: '4', lg: '0' };
    const justifyContent = { base: 'flex-start', lg: 'flex-end' };

    return (
        <>
            <Grid
                px="4"
                py={{ base: '4', lg: '2' }}
                templateColumns={{
                    base: '1fr 1fr',
                    lg: '60px 150px 100px 1fr',
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
                <GridItem area="validator" mb={gridItemMb}>
                    <MobileLabel text="Validator Id" />
                    <Link href={`https://explorer.fantom.network/validator/${vault.validatorAddress}`} isExternal>
                        {vault.validatorId}
                    </Link>
                </GridItem>
                <Flex align={flexAlign}>
                    <GridItem area="vault" mb={gridItemMb}>
                        <MobileLabel text="Vault Address" />
                        <Link href={`https://ftmscan.com/address/${vault.vaultAddress}`} isExternal>
                            {addressShortDisplayName(vault.vaultAddress)}
                        </Link>
                    </GridItem>
                </Flex>
                <Flex align={flexAlign}>
                    <GridItem area="staked">
                        <MobileLabel text="Staked FTM" />
                        {numeral(vault.ftmAmountStaked).format('0.00[00]a')}
                    </GridItem>
                </Flex>
                <Flex align={flexAlign} justify={justifyContent}>
                    <GridItem area="unlock" mb={gridItemMb}>
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
