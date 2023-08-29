import React, { useState } from 'react';
import { ManagerOption, OtherManagerOption, useCompose } from './ComposeProvider';
import Card from '~/components/card/Card';
import { Alert, Heading, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';
import { BeetsInput } from '~/components/inputs/BeetsInput';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useDebouncedCallback } from 'use-debounce';
import { isAddress } from 'ethers/lib/utils.js';
import { ToastType, useToast } from '~/components/toast/BeetsToast';
import { networkConfig } from '~/lib/config/network-config';

interface Props {}

export function AdvancedPoolComposeFeeManager(props: Props) {
    const { userAddress } = useUserAccount();
    const { setFeeManager, feeManager, managerOption, setManagerOption, otherManagerOption, setOtherManagerOption, isFeeManagerValid } =
        useCompose();
    const { showToast } = useToast();

    function handleFeeManagerOptionSelected(manager: ManagerOption) {
        if (manager === 'dao-managed') {
            setFeeManager(networkConfig.beetsPoolOwnerAddress);
            setOtherManagerOption(undefined);
        } else {
            setFeeManager(userAddress || '');
            setOtherManagerOption('self-managed');
        }
        setManagerOption(manager);
    }

    function handleOtherFeeManagerOptionSelected(otherManager: OtherManagerOption) {
        if (otherManager === 'custom-eoa') {
            setFeeManager(null);
        } else {
            if (userAddress) {
                setFeeManager(userAddress);
            }
        }
        setOtherManagerOption(otherManager);
    }

    function handleCustomFeeManagerChanged(event: { currentTarget: { value: string } }) {
        debouncedCustomEOACheck();
        setFeeManager(event.currentTarget.value);
    }

    const debouncedCustomEOACheck = useDebouncedCallback(() => {
        if (feeManager && otherManagerOption === 'custom-eoa') {
            if (!isAddress(feeManager)) {
                showToast({
                    id: 'pool-invalid-custom-fee-manager',
                    type: ToastType.Error,
                    content: 'Please enter a valid EOA for your custom fee manager',
                    auto: true,
                });
            }
        }
    }, 300);

    const notDaoManaged = managerOption !== 'dao-managed';
    const isUsingCustomEOA = otherManagerOption === 'custom-eoa';

    function getInputBorderColour() {
        if (!isFeeManagerValid()) {
            return 'red.400';
        }
        if (isUsingCustomEOA) {
            return 'beets.green';
        }
        return 'transparent';
    }

    return (
        <Card py="3" px="3" width="full" height="full">
            <VStack alignItems="flex-start" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">3. Fee Manager</Heading>
                    <Text lineHeight="1.25rem" fontSize="0.95rem">
                        You can choose to elect a fee manager for your pool. The fee manager can be yourself, an address
                        of your choosing or the BeethovenX DAO. By default, the BeethovenX DAO is the fee manager.
                    </Text>
                </VStack>
                <VStack width="full" alignItems="flex-start" spacing="4">
                    <Alert status="warning" color="yellow.100">
                        To be eligible for gauge rewards, the pool must be managed by the BeethovenX DAO
                    </Alert>
                    <VStack width="full" alignItems="flex-start">
                        <RadioGroup value={managerOption} onChange={handleFeeManagerOptionSelected}>
                            <VStack width="full" alignItems="flex-start" spacing="1">
                                <Radio value="dao-managed">I would like the DAO to be the fee manager</Radio>
                                <Radio value="other-manager">I want to choose the fee manager</Radio>
                            </VStack>
                        </RadioGroup>
                    </VStack>
                    {notDaoManaged && (
                        <VStack width="full" alignItems="flex-start">
                            <Heading size="xs">Other fee manager</Heading>
                            <RadioGroup value={otherManagerOption} onChange={handleOtherFeeManagerOptionSelected}>
                                <VStack width="full" alignItems="flex-start" spacing="1">
                                    <Radio value="self-managed">I would like to be the fee manager</Radio>
                                    <Radio value="custom-eoa">
                                        I want to choose another address to be the fee manager
                                    </Radio>
                                </VStack>
                            </RadioGroup>
                        </VStack>
                    )}
                    {isUsingCustomEOA && (
                        <VStack width="full" alignItems="flex-start">
                            <Heading size="xs">Custom address</Heading>
                            <BeetsInput
                                wrapperProps={{ height: '100%', padding: 'none', width: '100%' }}
                                height="100%"
                                width="100%"
                                py="0"
                                minHeight="40px"
                                fontWeight="medium"
                                fontSize="1rem"
                                px="2"
                                placeholder="0x48daF..."
                                onChange={handleCustomFeeManagerChanged}
                                value={feeManager || ''}
                                borderColor={getInputBorderColour()}
                                borderWidth={2}
                            />
                        </VStack>
                    )}
                </VStack>
                {!isFeeManagerValid() && (
                    <Alert status="error">Please make sure the you have filled in the custom fee manager with a correct ethereum address.</Alert>
                )}
            </VStack>
        </Card>
    );
}
