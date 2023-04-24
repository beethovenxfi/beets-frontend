import numeral from 'numeral';
import { GqlPoolAprValue } from '~/apollo/generated/graphql-codegen-generated';

const formatApr = (apr: string) => {
    if (parseFloat(apr) < 0.0000001) {
        return '0.00%';
    }

    return numeral(apr).format('0.00%');
};

export function getApr(apr: GqlPoolAprValue): string {
    if (apr.__typename === 'GqlPoolAprRange') {
        return `${formatApr(apr.min)} - ${formatApr(apr.max)}`;
    } else {
        return formatApr(apr.total);
    }
}
