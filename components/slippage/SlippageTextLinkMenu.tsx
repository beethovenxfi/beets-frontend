import {
    BoxProps,
    Flex,
    IconButton,
    Input,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuItemProps,
    useDisclosure,
    useStyleConfig,
} from '@chakra-ui/react';
import { Check } from 'react-feather';
import { useSlippage } from '~/lib/global/useSlippage';
import numeral from 'numeral';
import { useState } from 'react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function SlippageTextLinkMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { protocol } = useNetworkConfig();
    const { slippage, setSlippage } = useSlippage();
    const [custom, setCustom] = useState('');
    const customIsValid = custom !== '' && parseFloat(custom) < 50 && parseFloat(custom) >= 0.01;

    const menuListStyles = useStyleConfig('MenuList', { variant: protocol }) as BoxProps;
    const menuItemStyles = useStyleConfig('MenuListItem', { variant: protocol }) as MenuItemProps;

    console.log('menu', menuListStyles);
    return (
        <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <MenuButton as={Link} color="beets.green" userSelect="none">
                {numeral(slippage).format('0.0[000]%')}
            </MenuButton>
            <MenuList {...menuListStyles}>
                <MenuItem {...menuItemStyles} onClick={() => setSlippage('0.001')}>
                    0.1%
                </MenuItem>
                <MenuItem {...menuItemStyles} onClick={() => setSlippage('0.005')}>
                    0.5%
                </MenuItem>
                <MenuItem {...menuItemStyles} onClick={() => setSlippage('0.01')}>
                    1.0%
                </MenuItem>
                <Flex px="2" pt="2">
                    <Input
                        variant="filled"
                        placeholder="Custom"
                        flex="1"
                        width="100px"
                        mr="1"
                        type="number"
                        value={custom}
                        onChange={(e) => setCustom(e.currentTarget.value)}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter' && customIsValid) {
                                setSlippage(`${parseFloat(custom) / 100}`);
                                onClose();
                            }
                        }}
                    />
                    <IconButton
                        aria-label="save-custom"
                        icon={<Check />}
                        isDisabled={!customIsValid}
                        color="beets.green"
                        onClick={() => {
                            setSlippage(`${parseFloat(custom) / 100}`);
                            onClose();
                        }}
                        bg="gray.100"
                        _hover={{ bg: 'gray.200' }}
                    />
                </Flex>
            </MenuList>
        </Menu>
    );
}
