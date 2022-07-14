import { Box, BoxProps, Button, Flex, HStack, Text } from '@chakra-ui/react';
import TokenAvatar from '~/components/token/TokenAvatar';
import { BeetsBox } from '~/components/box/BeetsBox';
import { usePool } from '~/modules/pool/lib/usePool';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';

export function PoolInvestTokenApproval({ stepNumber, ...rest }: BoxProps & { stepNumber: number }) {
    const { pool } = usePool();

    return (
        <Box {...rest}>
            <ModalSectionHeadline
                headline={`${stepNumber}. Approve tokens for investing`}
                description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            />
            <BeetsBox>
                {pool.investConfig.options.map((option, index) => {
                    const tokenOption = option.tokenOptions[0];

                    return (
                        <BeetsBoxLineItem
                            key={index}
                            leftContent={
                                <HStack spacing="none" flex="1">
                                    <TokenAvatar width="20px" height="20px" address={tokenOption.address} />
                                    <Text paddingLeft="1.5">{tokenOption.symbol}</Text>
                                </HStack>
                            }
                            rightContent={
                                <Button variant="outline" size="xs" color="beets.green" borderColor="beets.green">
                                    Approve
                                </Button>
                            }
                            last={index === pool.investConfig.options.length - 1}
                        />
                    );
                })}
            </BeetsBox>
        </Box>
    );
}
