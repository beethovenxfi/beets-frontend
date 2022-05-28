export type ToastTransactionType = 'SWAP' | 'JOIN' | 'EXIT' | 'HARVEST' | 'STAKE' | 'APPROVE';
export type ToastTransactionStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

export function toastGetTransactionStatusHeadline(type: ToastTransactionType, status: ToastTransactionStatus) {
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
                return 'Trade pending';
            case 'CONFIRMED':
                //return i18next.t('Toast - Headline - Trade confirmed', 'Trade confirmed');
                return 'Trade confirmed';
            case 'ERROR':
                //return i18next.t('Toast - Headline - Trade error', 'Trade error');
                return 'Trade error';
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
    }

    return 'Missing headline';
}
