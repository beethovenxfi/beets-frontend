import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { GqlSorGetSwapsResponse, GqlSorSwapRoute } from '~/apollo/generated/graphql-codegen-generated';
import { TradeRouteHop } from '~/modules/trade/components/TradeRouteHop';
import numeral from 'numeral';

interface Props extends BoxProps {
    route: GqlSorSwapRoute;
}

export function TradeRoute({ route, ...rest }: Props) {
    return (
        <Box {...rest}>
            <Flex alignItems="center">
                <Box fontSize="sm" mr={2}>
                    {numeral(route.share).format('%')}
                </Box>
                {route.hops.map((hop, index) => (
                    <TradeRouteHop hop={hop} key={index} mr={index < route.hops.length - 1 ? '4' : '0'} />
                ))}
            </Flex>
        </Box>
    );
}
