import { Box, Container, Grid, GridItem, VStack } from '@chakra-ui/react';
import Navbar from '../components/nav/Navbar';
import PoolList from '../components/pools/PoolList';

function Pools() {
    return (
        <VStack spacing="16">
            <Navbar />
            <PoolList />
        </VStack>
    );
}
export default Pools;
