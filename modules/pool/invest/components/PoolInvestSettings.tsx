import { BeetsBoxLineItem } from '~/components/box/BeetsBoxLineItem';
import { InfoButton } from '~/components/info-button/InfoButton';
import { Box, BoxProps, Button, Flex, Link, Switch, Text, useBoolean, useTheme } from '@chakra-ui/react';
import { Collapse } from '@chakra-ui/transition';
import { BeetsBox } from '~/components/box/BeetsBox';
import { ModalSectionHeadline } from '~/components/modal/ModalSectionHeadline';
import { Zap } from 'react-feather';

export function PoolInvestSettings({ stepNumber, ...rest }: BoxProps & { stepNumber: number }) {
    const [zapEnabled, { toggle: toggleZapEnabled }] = useBoolean(true);

    return (
        <Box {...rest}>
            <ModalSectionHeadline headline={`${stepNumber}. Customize settings`} />
            <BeetsBox>
                <BeetsBoxLineItem
                    leftContent={
                        <>
                            <Flex alignItems="center">
                                {/*<Box mr="1">
                                    <Zap size={18} />
                                </Box>*/}
                                <InfoButton
                                    label="Zap into farm"
                                    moreInfoUrl="https://docs.beets.fi"
                                    infoText="With ZAP enabled, your investment BPTs are automatically deposited to the farm, saving time & maximizing yield."
                                />
                            </Flex>
                            <Text color="gray.200" fontSize="sm">
                                Deposit my BPTs directly into the farm with ZAP.
                            </Text>
                        </>
                    }
                    rightContent={
                        <Switch
                            id="zap-into-farm"
                            colorScheme="green"
                            isChecked={zapEnabled}
                            onChange={toggleZapEnabled}
                        />
                    }
                >
                    <Collapse in={zapEnabled} animateOpacity>
                        <Flex mt="2" alignItems="center">
                            <Box flex="1">
                                <InfoButton
                                    label="Batch Relayer"
                                    moreInfoUrl="https://docs.beets.fi"
                                    infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                                />
                            </Box>
                            <Box>
                                <Button variant="outline" size="xs" color="beets.green" borderColor="beets.green">
                                    Approve
                                </Button>
                            </Box>
                        </Flex>
                    </Collapse>
                </BeetsBoxLineItem>

                <Flex px="3" py="2" justifyContent="center" borderBottomWidth={0}>
                    <Box flex="1">
                        <InfoButton
                            label="Max slippage"
                            moreInfoUrl="https://docs.beets.fi"
                            infoText="The maximum amount of slippage that you're willing to accept for the transaction."
                        />
                    </Box>

                    <Link color="beets.cyan">0.1%</Link>
                </Flex>
                {/*<Flex px="3" py="2" alignItems="center">
                            <Box flex="1">
                                <InfoButton
                                    label="Transaction speed"
                                    moreInfoUrl="https://docs.beets.fi"
                                    infoText="Nunc rutrum aliquet ligula ut tincidunt. Nulla ligula justo, laoreet laoreet convallis et, lacinia non turpis. Duis consectetur sem risus, in lobortis est congue id."
                                />
                            </Box>

                            <Link color="beets.cyan">Normal</Link>
                        </Flex>*/}
            </BeetsBox>
        </Box>
    );
}
