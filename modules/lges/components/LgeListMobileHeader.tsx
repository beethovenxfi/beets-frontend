import { Box, Flex } from '@chakra-ui/react';
import { TextButtonPopupMenu } from '~/components/popup-menu/TextButtonPopupMenu';
import { useLgeList } from '~/modules/lges/lib/useLgeList';

export function LgeListMobileHeader() {
    const { status, setStatus } = useLgeList();

    return (
        <Flex display={{ base: 'flex', lg: 'none' }} alignItems="center" mb="4">
            <Box color="gray.200" mr="1">
                Status:
            </Box>
            <Box flex="1">
                <TextButtonPopupMenu
                    buttonText={status === 'ended' ? 'Ended' : 'Active & Upcoming'}
                    items={[
                        {
                            label: 'Active & upcoming',
                            selected: status === 'active-upcoming',
                            onClick: () => setStatus('active-upcoming'),
                        },
                        {
                            label: 'Ended',
                            selected: status === 'ended',
                            onClick: () => setStatus('ended'),
                        },
                    ]}
                />
            </Box>
        </Flex>
    );
}
