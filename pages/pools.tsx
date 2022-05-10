import { Box, Container, Grid, GridItem, VStack } from '@chakra-ui/react';
import Navbar from '../components/nav/Navbar';
import PoolList from '../page-components/pools/PoolList';
import { useOnAppLoad } from '~/components/global/useOnAppLoad';

function Pools() {
    useOnAppLoad();

    return (
        <>
            <PoolList />
        </>
    );
}
export default Pools;
