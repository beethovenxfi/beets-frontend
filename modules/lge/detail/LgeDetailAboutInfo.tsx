import { Text, Box, HStack, Link } from '@chakra-ui/react';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { ExternalLink } from 'react-feather';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';
import Card from '~/components/card/Card';
import { CardRow } from '~/components/card/CardRow';
import { PoolTokenPill } from '~/components/token/PoolTokenPill';
import { TokenAmountPill } from '~/components/token/TokenAmountPill';
import { useGetTokens } from '~/lib/global/useToken';
import { addressShortDisplayName } from '~/lib/util/address';
import { etherscanGetAddressUrl } from '~/lib/util/etherscan';
import { useGetLgeToken } from '~/modules/lges/components/lib/useGetLgeToken';

interface Props {
    lge: GqlLge;
    status: 'active' | 'upcoming' | 'ended';
}

function formatWeight(weight: number): string {
    return (weight / 100).toString();
}

function AddressLink({ title, address }: { title: string; address: string }) {
    return (
        <CardRow>
            <Box flex="1">{title} address</Box>
            <Link href={etherscanGetAddressUrl(address)} target="_blank">
                <HStack spacing="1">
                    <Box>{addressShortDisplayName(address)}</Box>
                    <ExternalLink size={16} />
                </HStack>
            </Link>
        </CardRow>
    );
}

export function LgeDetailAboutInfo({ lge, status }: Props) {
    const { token } = useGetLgeToken(lge.tokenAddress);
    const { getToken } = useGetTokens();

    const tokenStartWeight = formatWeight(lge.tokenStartWeight);
    const collateralStartWeight = formatWeight(lge.collateralStartWeight);
    const tokenEndWeight = formatWeight(lge.tokenEndWeight);
    const collateralEndWeight = formatWeight(lge.collateralEndWeight);

    const addressLinks = useMemo(
        () => [
            {
                title: 'Token',
                address: lge.tokenAddress,
            },
            {
                title: 'Owner',
                address: lge.adminAddress,
            },
            {
                title: 'LBP',
                address: lge.address,
            },
        ],
        [lge],
    );

    return (
        <>
            <Text fontWeight="semibold" fontSize="xl" color="white" mb="4">
                Info
            </Text>
            <Card padding="2">
                <CardRow>
                    <Box flex="1">{status === 'upcoming' ? 'Starts' : 'Started'}</Box>
                    <Box>{format(new Date(lge.startTimestamp * 1000), "yyyy-MM-dd' 'HH:mm' 'O")}</Box>
                </CardRow>
                <CardRow>
                    <Box flex="1">{status === 'ended' ? 'Ended' : 'Ends'}</Box>
                    <Box>{format(new Date(lge.endTimestamp * 1000), "yyyy-MM-dd' 'HH:mm' 'O")}</Box>
                </CardRow>
                <CardRow>
                    <Box flex="1">Launch token symbol</Box>
                    <Box>{token?.symbol}</Box>
                </CardRow>
                <CardRow alignItems="center">
                    <Box flex="1">Initial launch token supply</Box>
                    <TokenAmountPill
                        fontSize="md"
                        amount={lge.tokenAmount}
                        address={lge.tokenAddress}
                        logoUri={lge.tokenIconUrl}
                    />
                </CardRow>
                <CardRow>
                    <Box flex="1">Collateral token symbol</Box>
                    <Box>{getToken(lge.collateralAddress)?.symbol}</Box>
                </CardRow>
                <CardRow alignItems="center">
                    <Box flex="1">Initial collateral token supply</Box>
                    <TokenAmountPill fontSize="md" amount={lge.collateralAmount} address={lge.collateralAddress} />
                </CardRow>
                <CardRow alignItems="center">
                    <Box flex="1">Start weights</Box>
                    <HStack>
                        <PoolTokenPill
                            token={{
                                address: lge.tokenAddress,
                                weight: tokenStartWeight,
                                logoUri: lge.tokenIconUrl,
                            }}
                        />
                        <PoolTokenPill
                            token={{
                                address: lge.collateralAddress,
                                weight: collateralStartWeight,
                            }}
                        />
                    </HStack>
                </CardRow>
                <CardRow alignItems="center">
                    <Box flex="1">End weights</Box>
                    <HStack>
                        <PoolTokenPill
                            token={{
                                address: lge.tokenAddress,
                                weight: tokenEndWeight,
                                logoUri: lge.tokenIconUrl,
                            }}
                        />
                        <PoolTokenPill
                            token={{
                                address: lge.collateralAddress,
                                weight: collateralEndWeight,
                            }}
                        />
                    </HStack>
                </CardRow>
                <CardRow>
                    <Box flex="1">Swap fee</Box>
                    <Box>{lge.swapFee}%</Box>
                </CardRow>
                <CardRow>
                    <Box flex="1">Protocol fee</Box>
                    <Box>2%</Box>
                </CardRow>
                {addressLinks.map((link, index) => (
                    <AddressLink key={index} {...link} />
                ))}
            </Card>
        </>
    );
}
