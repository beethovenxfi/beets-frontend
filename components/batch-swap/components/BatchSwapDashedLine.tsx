import { Box, Circle, Flex, Icon, IconProps } from '@chakra-ui/react';
import { ChevronsRight } from 'react-feather';

export function BatchSwapRouteDashedLineLeftSide(props: IconProps) {
    return (
        <Icon
            width="42px"
            height="74px"
            viewBox="0 0 42 74"
            left="-11px"
            bottom="50%"
            position="absolute"
            marginBottom="-2px"
            pointerEvents="none"
            fill="none"
            {...props}
        >
            <path d="M1 0V61C1 67.6274 6.37258 73 13 73H42" stroke="currentColor" strokeDasharray="4 4" />
        </Icon>
    );
}

export function BatchSwapRouteDashedLineRightSide(props: IconProps) {
    return (
        <Icon
            width="42px"
            height="74px"
            viewBox="0 0 42 74"
            right="-11px"
            bottom="50%"
            position="absolute"
            transform="scaleX(-1)"
            marginBottom="-2px"
            pointerEvents="none"
            fill="none"
            {...props}
        >
            <path d="M1 0V61C1 67.6274 6.37258 73 13 73H42" stroke="currentColor" strokeDasharray="4 4" />
        </Icon>
    );
}

export function BatchSwapDashedLine(props: IconProps) {
    return (
        <Flex top="50%" left="42px" right="42px" bottom="50%" position="absolute">
            <Icon
                padding="0"
                width="100%"
                height="2px"
                viewBox="0 0 100 2"
                preserveAspectRatio="xMinYMid meet"
                stroke="currentColor"
                {...props}
            >
                <path d="M0 1C240.5 1 9999 1 9999 1" strokeDasharray="4 4" />
            </Icon>
        </Flex>
    );
}

export function BatchSwapRouteDashedLineArrowSpacer() {
    return (
        <Flex flex="1" justifyContent="center" position="relative">
            <Circle
                size="22px"
                zIndex="1"
                backgroundColor="beets.base.700"
                alignItems="center"
                justifyContent="center"
                display="flex"
            >
                <Icon width="6px" height="10px" viewBox="0 0 6 10" fill="none">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.741661 9.16312C0.546399 8.96786 0.546399 8.65128 0.741661 8.45602L4.19763 5.00005L0.741661 1.54408C0.546399 1.34881 0.546399 1.03223 0.741661 0.83697C0.936923 0.641708 1.25351 0.641708 1.44877 0.83697L5.25829 4.64649C5.35206 4.74026 5.40474 4.86744 5.40474 5.00005C5.40474 5.13265 5.35206 5.25983 5.25829 5.3536L1.44877 9.16312C1.25351 9.35839 0.936924 9.35839 0.741661 9.16312Z"
                        fill="currentColor"
                    />
                </Icon>
            </Circle>
        </Flex>
    );
}
