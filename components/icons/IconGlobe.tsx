import React from 'react';
import { Icon, IconProps } from '@chakra-ui/react';

export function IconGlobe(props: IconProps) {
    return (
        <Icon viewBox="0 0 24 24" width="24px" height="24px" {...props}>
            <g stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </g>
        </Icon>
    );
}
