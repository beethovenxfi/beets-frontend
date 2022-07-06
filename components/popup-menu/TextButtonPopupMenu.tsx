import { Box, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { Check } from 'react-feather';

interface Props {
    buttonText: string;
    items: {
        label: string;
        selected?: boolean;
        onClick: () => void;
    }[];
}

export function TextButtonPopupMenu({ buttonText, items }: Props) {
    return (
        <Menu>
            <MenuButton
                fontSize="lg"
                userSelect="none"
                color="beets.green"
                fontWeight="bold"
                _hover={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
                <Box>{buttonText}</Box>
            </MenuButton>
            <MenuList bgColor="beets.base.800" borderColor="gray.400" shadow="lg">
                {items.map((item, index) => (
                    <MenuItem display="flex" alignItems="center" onClick={item.onClick} key={index}>
                        <Box flex="1">{item.label}</Box>
                        {item.selected ? <Check /> : null}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
