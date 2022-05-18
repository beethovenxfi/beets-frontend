import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { ChevronsDown } from "react-feather";

export function TokenInputSwapButton() {
    return (
        <Button
            justifyContent="center"
            backgroundColor="beets.gray.600"
            alignItems="center"
            rounded="full"
            border="4px"
            padding="1"
            borderColor="beets.gray.500"
            position="absolute"
            bottom="-20px"
            left="calc(50% - 20px)"
            zIndex="2"
            role="group"
            _hover={{ borderColor: 'beets.green.500', cursor: 'pointer' }}
            _active={{ backgroundColor: 'beets.gray.600' }}
        >
            <Box
                marginTop="1px"
                color="beets.gray.200"
                css={{
                    transform: 'rotate(360deg)',
                    transition: 'transform linear .15s',
                }}
                _groupHover={{
                    color: 'beets.green.500',
                    cursor: 'pointer',
                    transform: 'rotate(180deg)',
                    transition: 'all linear .15s',
                }}
                _groupFocus={{ color: 'beets.green.500', cursor: 'pointer' }}
            >
                <ChevronsDown size={24} color="currentColor" />
            </Box>
        </Button>
    );
}
