import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

function useV1Redirect() {
    const { push } = useRouter();
    const redirectChecked = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.hash && !redirectChecked.current) {
            const hash = window.location.hash;

            redirectChecked.current = true;

            if (hash.indexOf('#/pool/') === 0) {
                const poolId = hash.slice(7, 74);

                push(`/pool/${poolId}`);
            } else if (hash.indexOf('#/pools') === 0) {
                push('/pools');
            } else if (hash.indexOf('#/trade') === 0) {
                push('/swap');
            }
        }
    });
}

function HomePage() {
    useV1Redirect();

    return null;
}

export default HomePage;
