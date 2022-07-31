import {
    Box,
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Link,
    Text,
    useDisclosure,
    useTheme,
} from '@chakra-ui/react';
import { Bell, ExternalLink, Inbox } from 'react-feather';
import { useRef } from 'react';
import { useUserData } from '~/lib/user/useUserData';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { BeetsBox } from '~/components/box/BeetsBox';

export function NavbarAlerts() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);

    const { loading, portfolioValueUSD } = useUserData();
    const theme = useTheme();

    return (
        <>
            <Button
                bgColor="beets.lightAlpha.200"
                width="40px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                ref={btnRef}
                onClick={onOpen}
                _hover={{ transform: 'scale(1.1)' }}
                position="relative"
            >
                <Inbox />
                <Box
                    position="absolute"
                    top="-3px"
                    right="-3px"
                    width="10px"
                    height="10px"
                    bgColor="red.500"
                    borderRadius="xl"
                />
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent bgColor="beets.base.800">
                    <DrawerCloseButton />
                    <DrawerHeader px="4" shadow="xl">
                        Latest updates
                    </DrawerHeader>

                    <DrawerBody
                        px="4"
                        css={{
                            '&::-webkit-scrollbar': {
                                width: '4px',
                            },
                            '&::-webkit-scrollbar-track': {
                                width: '6px',
                            },
                            '&::-webkit-scrollbar-thumb': {
                                background: theme.colors.beets.base['300'],
                                borderRadius: '24px',
                            },
                        }}
                    >
                        <BeetsBox p="4" mb="4">
                            <Flex alignItems="center" mb="3">
                                <IconDiscord width="20px" />
                                <Box ml="2" flex="1" color="gray.200">
                                    12 hours ago
                                </Box>
                                <Link>
                                    <ExternalLink size={18} />
                                </Link>
                            </Flex>
                            <Box>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et
                                    arcu nec... <Link color="beets.highlight">more</Link>
                                </Text>
                            </Box>
                        </BeetsBox>
                        <BeetsBox p="4" mb="4">
                            <Flex alignItems="center" mb="3">
                                <IconDiscord width="20px" />
                                <Box ml="2" flex="1" color="gray.200">
                                    12 hours ago
                                </Box>
                                <Link>
                                    <ExternalLink size={18} />
                                </Link>
                            </Flex>
                            <Box>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et
                                    arcu nec... <Link color="beets.highlight">more</Link>
                                </Text>
                            </Box>
                        </BeetsBox>
                        <BeetsBox p="4" mb="4">
                            <Flex alignItems="center" mb="3">
                                <IconDiscord width="20px" />
                                <Box ml="2" flex="1" color="gray.200">
                                    12 hours ago
                                </Box>
                                <Link>
                                    <ExternalLink size={18} />
                                </Link>
                            </Flex>
                            <Box>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et
                                    arcu nec... <Link color="beets.highlight">more</Link>
                                </Text>
                            </Box>
                        </BeetsBox>
                        <BeetsBox p="4" mb="4">
                            <Flex alignItems="center" mb="3">
                                <IconDiscord width="20px" />
                                <Box ml="2" flex="1" color="gray.200">
                                    12 hours ago
                                </Box>
                                <Link>
                                    <ExternalLink size={18} />
                                </Link>
                            </Flex>
                            <Box>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et
                                    arcu nec... <Link color="beets.highlight">more</Link>
                                </Text>
                            </Box>
                        </BeetsBox>
                        <BeetsBox p="4" mb="4">
                            <Flex alignItems="center" mb="3">
                                <IconDiscord width="20px" />
                                <Box ml="2" flex="1" color="gray.200">
                                    12 hours ago
                                </Box>
                                <Link>
                                    <ExternalLink size={18} />
                                </Link>
                            </Flex>
                            <Box>
                                <Text>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et
                                    arcu nec... <Link color="beets.highlight">more</Link>
                                </Text>
                            </Box>
                        </BeetsBox>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}
