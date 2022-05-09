import { Container, Grid, GridItem, VStack } from '@chakra-ui/react';
import Navbar from '../components/nav/Navbar';
import PoolList from '../components/pools/PoolList';

function Pools() {
    return (
        <VStack spacing="16" marginX="32">
            <Navbar />
            <Container width={'100%'}>
                <PoolList />
            </Container>
        </VStack>
    );
}
export default Pools;
