export type BeetsTransactionType =
    | 'SWAP'
    | 'JOIN'
    | 'EXIT'
    | 'HARVEST'
    | 'STAKE'
    | 'UNSTAKE'
    | 'APPROVE'
    | 'WRAP'
    | 'UNWRAP'
    | 'LEVEL_UP'
    | 'BURN';
export type ToastTransactionStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

export function toastGetTransactionStatusHeadline(type: BeetsTransactionType, status: ToastTransactionStatus) {
    if (type === 'JOIN') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Invest pending', 'Invest pending');
                return 'Invest pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Invest confirmed', 'Invest confirmed');
                return 'Invest confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Invest error', 'Invest error');
                return 'Invest error';
        }
    } else if (type === 'EXIT') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Withdraw pending', 'Withdraw pending');
                return 'Withdraw pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Withdraw confirmed', 'Withdraw confirmed');
                return 'Withdraw confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Withdraw error', 'Withdraw error');
                return 'Withdraw error';
        }
    } else if (type === 'SWAP') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Swap pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Swap confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Swap error';
        }
    } else if (type === 'HARVEST') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Harvest pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Harvest confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Harvest error';
        }
    } else if (type === 'STAKE') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Stake pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Stake confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Stake error';
        }
    } else if (type === 'UNSTAKE') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Unstake pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Unstake confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Unstake error';
        }
    } else if (type === 'APPROVE') {
        switch (status) {
            case 'PENDING':
                //return i18next.t('Toast - Headline - Trade pending', 'Trade pending');
                return 'Approve pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Approve confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Approve error';
        }
    } else if (type === 'WRAP') {
        switch (status) {
            case 'PENDING':
                return 'Wrap pending';
            case 'CONFIRMED':
                return 'Wrap confirmed';
            case 'ERROR':
                return 'Wrap error';
        }
    } else if (type === 'UNWRAP') {
        switch (status) {
            case 'PENDING':
                return 'Unwrap pending';
            case 'CONFIRMED':
                return 'Unwrap confirmed';
            case 'ERROR':
                return 'Unwrap error';
        }
    } else if (type === 'LEVEL_UP') {
        switch (status) {
            case 'PENDING':
                return 'Level up relic pending';
            case 'CONFIRMED':
                return 'Level up relic confirmed';
            case 'ERROR':
                return 'Level up relic error';
        }
    } else if (type === 'BURN') {
        switch (status) {
            case 'PENDING':
                return 'Burn relic pending';
            case 'CONFIRMED':
                return 'Burn relic confirmed';
            case 'ERROR':
                return 'Burn relic error';
        }
    }

    return 'Missing headline';
}
