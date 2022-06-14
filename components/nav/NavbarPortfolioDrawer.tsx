import {
    Box,
    Button,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Input,
    Drawer,
    useDisclosure,
} from '@chakra-ui/react';
import { BarChart2 } from 'react-feather';
import { useRef } from 'react';

export function NavbarPortfolioDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);

    return (
        <>
            <Button
                variant="unstyled"
                bgColor="beets.lightAlpha.200"
                width="42px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                ref={btnRef}
                onClick={onOpen}
            >
                <BarChart2 size={28} />
            </Button>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={btnRef}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>My portfolio</DrawerHeader>

                    <DrawerBody>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur et arcu nec
                        ullamcorper. Donec rutrum auctor rutrum. Suspendisse ut velit eleifend, ultrices leo non,
                        pulvinar metus. Sed nec odio enim. Integer nec condimentum felis, nec hendrerit nulla. Duis
                        rhoncus tincidunt magna, id vulputate neque rutrum vel. Quisque lacinia lectus ut facilisis
                        accumsan. Praesent a felis porta, volutpat ligula elementum, hendrerit odio.
                    </DrawerBody>

                    {/* <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                    </DrawerFooter>*/}
                </DrawerContent>
            </Drawer>
        </>
    );
}
