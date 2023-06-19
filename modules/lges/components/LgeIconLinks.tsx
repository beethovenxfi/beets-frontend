import { HStack, Link } from '@chakra-ui/react';
import { IconTwitter } from '~/components/icons/IconTwitter';
import { IconDiscord } from '~/components/icons/IconDiscord';
import { IconTelegram } from '~/components/icons/IconTelegram';
import { IconMedium } from '~/components/icons/IconMedium';
import { IconGlobe } from '~/components/icons/IconGlobe';
import { ReactNode } from 'react';
import { GqlLge } from '~/apollo/generated/graphql-codegen-generated';

interface Props {
    lge: GqlLge;
}

function getIconLink(urlType: keyof typeof lge, lge: GqlLge): ReactNode {
    const href = lge[urlType] as string;

    if (!href) {
        return null;
    }

    const props = {
        color: '#c1c1d1',
    };

    const hoverProps = { color: 'beets.highlight' };

    let iconType;
    switch (urlType) {
        case 'discordUrl':
            iconType = <IconDiscord {...props} _hover={hoverProps} />;
            break;
        case 'mediumUrl':
            iconType = <IconMedium {...props} _hover={hoverProps} />;
            break;
        case 'telegramUrl':
            iconType = <IconTelegram {...props} _hover={hoverProps} />;
            break;
        case 'twitterUrl':
            iconType = <IconTwitter {...props} _hover={hoverProps} />;
            break;
        case 'websiteUrl':
            iconType = <IconGlobe {...props} _hover={hoverProps} />;
            break;
    }
    return (
        <Link href={href} target="_blank" color="gray.100">
            {iconType}
        </Link>
    );
}

export function LgeIconLinks({ lge }: Props) {
    // grab all urlTypes except for banner image & token icon
    // reverse for now to to get the website url first
    const urlTypes = Object.keys(lge)
        .filter((key) => key.match('Url') && !key.match('Image') && !key.match('Icon'))
        .reverse();

    return <HStack mt="2">{urlTypes.map((urlType) => getIconLink(urlType as keyof typeof lge, lge))}</HStack>;
}
