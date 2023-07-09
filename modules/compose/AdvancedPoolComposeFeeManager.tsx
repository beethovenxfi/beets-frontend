import React, { useState } from 'react';
import { useCompose } from './ComposeProvider';
import Card from '~/components/card/Card';
import { Heading, Radio, RadioGroup, Text, VStack } from '@chakra-ui/react';
import { BeetsInput } from '~/components/inputs/BeetsInput';
import { useUserAccount } from '~/lib/user/useUserAccount';
import { useDebouncedCallback } from 'use-debounce';
import { isAddress } from 'ethers/lib/utils.js';
import { ToastType, useToast } from '~/components/toast/BeetsToast';

interface Props {}

type ManagerOption = 'dao-managed' | 'other-manager';
type OtherManagerOption = 'self-managed' | 'custom-eoa';
export function AdvancedPoolComposeFeeManager(props: Props) {
    const { userAddress } = useUserAccount();
    const { setFeeManager, feeManager } = useCompose();
    const { showToast } = useToast();
    // const [isUsingCustomEOA, setIsUsingCustomEOA] = useState(false);
    const [managerOption, setManagerOption] = useState<ManagerOption>('dao-managed');
    const [otherManagerOption, setOtherManagerOption] = useState<OtherManagerOption | undefined>();

    function handleFeeManagerOptionSelected(manager: ManagerOption) {
        if (manager === 'dao-managed') {
            // TODO: set the EOA for dao here
            // setFeeManager()
            setOtherManagerOption(undefined);
        } else {
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
    return (
        <Card py="3" px="3" width="full">
            <VStack alignItems="flex-start" spacing="3">
                <VStack alignItems="flex-start" spacing="1">
                    <Heading size="sm">Fee Manager</Heading>
                    <Text lineHeight="1rem" fontSize="0.85rem">
                        You can choose to elect a fee manager for your pool. The fee manager can be yourself, an address
                        of your choosing or the BeethovenX DAO. By default, the BeethovenX DAO is the fee manager.
                    </Text>
                </VStack>
                <VStack width="full" alignItems="flex-start" spacing="4">
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
                                borderColor={isUsingCustomEOA ? 'beets.green' : 'transparent'}
                                borderWidth={2}
                            />
                        </VStack>
                    )}
                </VStack>
            </VStack>
        </Card>
    );
}
