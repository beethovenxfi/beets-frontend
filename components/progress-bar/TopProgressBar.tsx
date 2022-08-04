import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { useEffect, useRef } from 'react';

const MIN_DELAY = 250;

export default function TopProgressBar() {
    const router = useRouter();
    const stateRef = useRef<'loading' | 'stop'>();
    const timerRef = useRef<any>();

    const handleStart = () => {
        if (stateRef.current === 'loading') {
            return;
        }

        stateRef.current = 'loading';
        // only show progress bar if it takes longer than the delay
        timerRef.current = setTimeout(function () {
            NProgress.start();
        }, MIN_DELAY);
    };

    const handleStop = () => {
        document.getElementById('app-content')?.scrollTo(0, 0);
        clearTimeout(timerRef.current);
        NProgress.done();
        stateRef.current = 'stop';
    };

    useEffect(() => {
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleStop);
        router.events.on('routeChangeError', handleStop);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleStop);
            router.events.off('routeChangeError', handleStop);
        };
    }, [router]);

    return null;
}
