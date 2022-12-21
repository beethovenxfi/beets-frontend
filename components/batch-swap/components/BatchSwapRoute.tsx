import { Box, Flex } from '@chakra-ui/react';
import {
    BatchSwapDashedLine,
    BatchSwapRouteDashedLineArrowSpacer,
    BatchSwapRouteDashedLineLeftSide,
    BatchSwapRouteDashedLineRightSide,
} from '~/components/batch-swap/components/BatchSwapDashedLine';
import { BatchSwapTokenAmount } from '~/components/batch-swap/components/BatchSwapTokenAmount';
import { BatchSwapHop } from '~/components/batch-swap/components/BatchSwapHop';
import { GqlSorSwapRouteFragment } from '~/apollo/generated/graphql-codegen-generated';
import { Fragment } from 'react';

interface Props {
    route: GqlSorSwapRouteFragment;
    minimalWidth?: boolean;
}

export function BatchSwapRoute({ route, minimalWidth }: Props) {
    const hopsWithoutLinear = route.hops.filter((hop) => hop.pool.type !== 'LINEAR');
    const hops = hopsWithoutLinear.filter((hop, index) => {
        if (minimalWidth) {
            return index === hopsWithoutLinear.length - 1;
        }

        return true;
    });

    return (
        <Box height="64px">
            <Flex flex="1" flexDirection="column" justifyContent="space-around">
                <Flex position="relative" columnGap="5px">
                    <BatchSwapRouteDashedLineLeftSide />
                    <BatchSwapRouteDashedLineRightSide />
                    <BatchSwapDashedLine />
                    <BatchSwapTokenAmount address={route.tokenIn} amount={route.tokenInAmount} />
                    <Flex flex="1" height="64px" alignItems="center" position="relative" top="2px">
                        <Box flex="1">
                            <BatchSwapRouteDashedLineArrowSpacer />
                        </Box>
                        {hops.map((hop, index) => (
                            <Fragment key={index}>
                                <BatchSwapHop hop={hop} />
                                <BatchSwapRouteDashedLineArrowSpacer />
                            </Fragment>
                        ))}
                    </Flex>
                    <BatchSwapTokenAmount address={route.tokenOut} amount={route.tokenOutAmount} />
                </Flex>
            </Flex>
        </Box>
    );
}
