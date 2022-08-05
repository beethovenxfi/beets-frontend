import { Box, Flex, Link, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useNetworkConfig } from '~/lib/global/useNetworkConfig';

export function NavbarAdditionalLinksMenu() {
    const networkConfig = useNetworkConfig();
    return (
        <Menu>
            <MenuButton
                as={Link}
                fontSize="4xl"
                userSelect="none"
                _hover={{ color: 'beets.highlight', textDecoration: 'none' }}
                fontFamily="Inter-Variable,-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI emoji"
            >
                <Box position="relative" top="-10px">
                    ...
                </Box>
            </MenuButton>
            <MenuList bgColor="beets.base.800" borderColor="gray.400" shadow="lg">
                {networkConfig.additionalLinks.map((link, index) => (
                    <MenuItem
                        as="a"
                        href={link.url}
                        target="_blank"
                        key={index}
                        display="flex"
                        flexDir="column"
                        alignItems="flex-start"
                    >
                        <Flex alignItems="center">
                            <Box mr="1">{link.title}</Box>
                        </Flex>
                        {link.subTitle && <Box color="gray.200">{link.subTitle}</Box>}
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
