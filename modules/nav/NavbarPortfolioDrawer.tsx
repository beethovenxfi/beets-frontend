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
    Skeleton,
} from '@chakra-ui/react';
import { BarChart2 } from 'react-feather';
import { useRef } from 'react';
import { useGetUserBalancesQuery } from '~/apollo/generated/graphql-codegen-generated';
import { useGetTokens } from '~/lib/global/useToken';
import { useUserPoolBalances } from '~/lib/user/useUserPoolBalances';
import { numberFormatUSDValue } from '~/lib/util/number-formats';

export function NavbarPortfolioDrawer() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const btnRef = useRef(null);

    const { loading, portfolioValueUSD } = useUserPoolBalances();

    return (
        <>
            <Button
                variant="unstyled"
                bgColor="beets.lightAlpha.200"
                width="54px"
                height="40px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                ref={btnRef}
                onClick={onOpen}
                flexDirection="column"
            >
                <BarChart2 size={18} />
                {loading ? (
                    <Skeleton height="10px" width="36px" startColor="gray.400" endColor="gray.500" mt="3px" mb="2px" />
                ) : (
                    <Box fontSize="11px">{numberFormatUSDValue(portfolioValueUSD)}</Box>
                )}
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
